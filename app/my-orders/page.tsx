"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/orders`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="max-w-4xl mx-auto p-10">
        <h1 className="text-3xl font-bold mb-6 text-green-800">
          My Orders
        </h1>
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <p className="text-gray-600 text-lg">
            You have not placed any orders yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#e8f1e6] py-12">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-3xl font-bold mb-10 text-green-800">
          My Orders
        </h1>

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-md p-6 mb-8"
          >
            {/* Order Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div>
                <p className="font-semibold text-green-900">
                  Order ID: {order.id}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mt-3 md:mt-0 text-right">
                <p className="text-xl font-bold text-green-900">
                  ₹ {order.totalAmount}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                    order.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "FAILED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-6 space-y-4">
              {order.orderItems.map((item: any) => {
                const productImage =
                  item.product?.media1 ||
                  item.product?.media2 ||
                  item.product?.media3;

                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center gap-4"
                  >
                    {/* Left */}
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={item.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">
                            No Image
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-green-900">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹ {item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <p className="font-semibold text-green-900">
                      ₹ {item.price * item.quantity}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t mt-6 pt-6 flex justify-between items-center">
              <button
                onClick={() =>
                  router.push(`/my-orders/${order.id}`)
                }
                className="text-green-700 font-semibold hover:underline"
              >
                View Details →
              </button>

              
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
