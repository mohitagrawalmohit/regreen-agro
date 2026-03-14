"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/admin/orders/${id}`,
      { credentials: "include" }
    )
      .then(res => res.json())
      .then(data => setOrder(data));
  }, [id]);

  const updateStatus = async (status: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/admin/orders/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      }
    );

    window.location.reload();
  };

  if (!order) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-2xl font-bold mb-6">
        Order Details
      </h1>

      <div className="border rounded-lg p-6 shadow-sm">

        <p><strong>User:</strong> {order.user?.phone}</p>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Total:</strong> ₹ {order.totalAmount}</p>
        <p><strong>Status:</strong> {order.status}</p>

        <div className="mt-4 space-y-2">
          {order.orderItems.map((item: any) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>
                ₹ {item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => updateStatus("SHIPPED")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Mark Shipped
          </button>

          <button
            onClick={() => updateStatus("CANCELLED")}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Cancel Order
          </button>
        </div>

      </div>
    </div>
  );
}
