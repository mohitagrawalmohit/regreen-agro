"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/orders/${orderId}`,
      { credentials: "include" }
    )
      .then(res => res.json())
      .then(data => setOrder(data));
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Invalid Access
        </h1>
        <Link href="/" className="text-green-600 underline">
          Go Home
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <p>Loading order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-10">

      <div className="border rounded-lg shadow-md p-8 text-center">

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-3xl">✓</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order Info */}
        <div className="text-left border-t pt-4 space-y-2">
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Total Paid:</strong> ₹ {order.totalAmount}
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}
            <span className="text-green-600 font-semibold">
              {order.paymentStatus}
            </span>
          </p>
        </div>

        {/* Items */}
        <div className="mt-6 text-left border-t pt-4">
          <h3 className="font-semibold mb-3">
            Ordered Items
          </h3>

          {order.orderItems.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between mb-2"
            >
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>
                ₹ {item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/my-orders"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            View My Orders
          </Link>

          <Link
            href="/"
            className="border border-green-600 text-green-600 px-6 py-2 rounded hover:bg-green-50 transition"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
