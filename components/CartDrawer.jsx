"use client";

import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function CartDrawer({ isOpen, onClose }) {
  const router = useRouter();
  const [cart, setCart] = useState(null);

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/";

  const fetchCart = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/cart`, {
        credentials: "include",
      });

      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmount =
    cart?.items?.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    ) || 0;

  return (
    <div className="fixed inset-0 z-50 flex">

      {/* Overlay */}
      <div
        className="flex-1 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-[400px] bg-white shadow-xl p-6 overflow-y-auto animate-slideIn">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Your Cart</h2>

          <XMarkIcon
            className="w-6 h-6 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {cart?.items?.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {/* Cart Items */}
            {cart?.items?.map((item) => {

              const productImage =
                item.product.media1 ||
                item.product.media2 ||
                item.product.media3 ||
                item.product.media4 ||
                item.product.media5;

              return (
                <div
                  key={item.id}
                  className="flex gap-3 border-b py-4"
                >

                  {/* Product Image */}
                  <img
                    src={productImage || "/placeholder.png"}
                    alt={item.product.title}
                    className="w-16 h-16 object-contain border rounded"
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {item.product.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      ₹ {item.product.price} × {item.quantity}
                    </p>

                    <p className="text-sm font-semibold mt-1">
                      ₹ {item.product.price * item.quantity}
                    </p>
                  </div>

                </div>
              );
            })}

            {/* Total */}
            <div className="mt-6 font-bold text-lg flex justify-between">
              <span>Total</span>
              <span>₹ {totalAmount}</span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 mt-6">

              {/* View Cart */}
              <button
                onClick={() => {
                  onClose();
                  router.push("/cart");
                }}
                className="w-full border border-green-600 text-green-600 py-3 rounded hover:bg-green-50"
              >
                View Cart
              </button>

              {/* Checkout */}
              <button
                onClick={() => {
                  onClose();
                  router.push("/checkout");
                }}
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
              >
                Proceed to Checkout
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}