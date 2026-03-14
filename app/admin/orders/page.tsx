"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminOrders() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");

    if (!isAdminLoggedIn) {
      router.push("/admin/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/admin/orders`
        );

        const data = await res.json();

        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchOrders();
  }, [router]);

  /* ---------------- FILTER LOGIC ---------------- */

  useEffect(() => {
    let data = [...orders];

    if (search) {
      data = data.filter(
        (o) =>
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.user?.phone?.includes(search)
      );
    }

    if (paymentFilter !== "ALL") {
      data = data.filter((o) => o.paymentStatus === paymentFilter);
    }

    if (statusFilter !== "ALL") {
      data = data.filter((o) => o.status === statusFilter);
    }

    if (fromDate) {
      const start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);

      data = data.filter(
        (o) => new Date(o.createdAt) >= start
      );
    }

    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);

      data = data.filter(
        (o) => new Date(o.createdAt) <= end
      );
    }

    setFilteredOrders(data);
    setCurrentPage(1);
  }, [search, paymentFilter, statusFilter, fromDate, toDate, orders]);

  /* ---------------- PAGINATION ---------------- */

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;

  const currentOrders = filteredOrders.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredOrders.length / ordersPerPage
  );

  /* ---------------- EXPORT CSV ---------------- */

  const exportCSV = () => {
    const rows = [
      ["Order ID", "Phone", "Amount", "Payment", "Status", "Date"],
      ...filteredOrders.map((o) => [
        o.id,
        o.user?.phone || "",
        o.totalAmount,
        o.paymentStatus,
        o.status,
        new Date(o.createdAt).toLocaleDateString(),
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
  };

  /* ---------------- UPDATE STATUS ---------------- */

  const updateStatus = async (id: string, status: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/admin/orders/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="p-10 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-14 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="p-10">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>

        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}

      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4">

        <input
          type="text"
          placeholder="Search Order ID or Phone..."
          className="border px-4 py-2 rounded-lg w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-lg"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="ALL">All Payments</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="PENDING">Pending</option>
        </select>

        <select
          className="border px-4 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <input
          type="date"
          className="border px-4 py-2 rounded-lg"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          className="border px-4 py-2 rounded-lg"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

      </div>

      {/* Orders Table */}

      <div className="bg-white shadow-md rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-left">

            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>

          </thead>

          <tbody>

            {currentOrders.map((order) => (

              <tr
                key={order.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4 font-medium">
                  #{order.id.slice(0, 8)}
                </td>

                <td className="p-4">
                  {order.user?.phone || "N/A"}
                </td>

                <td className="p-4 font-semibold">
                  ₹ {order.totalAmount}
                </td>

                <td className="p-4">
                  {order.paymentStatus}
                </td>

                <td className="p-4">

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                </td>

                <td className="p-4 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">

                  <button
                    onClick={() =>
                      router.push(`/admin/orders/${order.id}`)
                    }
                    className="text-green-600 hover:underline"
                  >
                    View
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center mt-6">

        <p className="text-sm text-gray-500">
          Showing {indexOfFirst + 1} -{" "}
          {Math.min(indexOfLast, filteredOrders.length)} of{" "}
          {filteredOrders.length}
        </p>

        <div className="flex gap-2">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="border px-3 py-1 rounded"
          >
            Prev
          </button>

          <span className="px-3 py-1">
            Page {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="border px-3 py-1 rounded"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}