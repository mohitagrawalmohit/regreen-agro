"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/orders/${id}`,
      { credentials: "include" }
    )
      .then(res => res.json())
      .then(data => setOrder(data));
  }, [id]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <p>Loading order details...</p>
      </div>
    );
  }

  const subtotal = order.orderItems.reduce(
    (sum: number, item: any) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-8">

      <h1 className="text-2xl font-bold mb-6">
        Order Details
      </h1>

      <div className="border rounded-lg p-6 shadow-sm">

        {/* Header */}
        <div className="flex justify-between mb-4">
          <div>
            <p className="font-semibold">
              Order ID: {order.id}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-lg">
              ₹ {order.totalAmount}
            </p>
            <p className="text-green-600 font-semibold">
              {order.paymentStatus}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="border-t pt-4 space-y-3">
          {order.orderItems.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between"
            >
              <div>
                <p className="font-medium">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500">
                  ₹ {item.price} × {item.quantity}
                </p>
              </div>

              <p className="font-semibold">
                ₹ {item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t mt-4 pt-4 space-y-2 text-right">
          <p>Subtotal: ₹ {subtotal}</p>
          <p className="font-bold text-lg">
            Total: ₹ {order.totalAmount}
          </p>
        </div>

        {/* Shipping */}
        <div className="border-t mt-6 pt-4">
          <h3 className="font-semibold mb-2">
            Shipping Address
          </h3>
          <p>{order.fullName}</p>
          <p>{order.phone}</p>
          <p>{order.addressLine}</p>
          <p>
            {order.city}, {order.state} - {order.pincode}
          </p>
        </div>

        

      </div>
    </div>
  );
}
