"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/cart`,
        { credentials: "include" }
      );

      if (!res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setLoading(true);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/cart/update`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemId, quantity }),
      }
    );

    await fetchCart();
    setLoading(false);
  };

  const removeItem = async (itemId: string) => {
    setLoading(true);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/cart/remove`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemId }),
      }
    );

    await fetchCart();
    setLoading(false);
  };

  if (!cart) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading cart...</p>
      </div>
    );
  }

  const totalAmount = cart.items.reduce(
    (sum: number, item: any) =>
      sum + item.product.price * item.quantity,
    0
  );

  return (
    <section className="min-h-screen bg-[#e8f1e6] py-12">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-3xl font-bold text-green-800 mb-8">
          Your Cart
        </h1>

        {cart.items.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <p className="text-gray-600 text-lg">
              Your cart is empty
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 space-y-8">

              {cart.items.map((item: any) => {
                const productImage =
                  item.product.media1 ||
                  item.product.media2 ||
                  item.product.media3 ||
                  item.product.media4 ||
                  item.product.media5;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row items-center md:items-start justify-between border-b pb-6 gap-6"
                  >
                    {/* LEFT SIDE */}
                    <div className="flex gap-5 flex-1 items-center">

                      {/* Product Image */}
                      <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={item.product.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No Image
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div>
                        <h2 className="text-lg font-semibold text-green-900">
                          {item.product.title}
                        </h2>
                        <p className="text-green-700 font-medium mt-1">
                          ₹ {item.product.price}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.id,
                            Number(e.target.value)
                          )
                        }
                        className="w-14 text-center border rounded-md"
                      />

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="text-right w-36">
                      <p className="font-semibold text-green-900 text-lg">
                        ₹ {item.product.price * item.quantity}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 text-sm mt-2 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* TOTAL */}
              <div className="flex justify-between items-center pt-6 text-2xl font-bold text-green-900">
                <span>Total:</span>
                <span>₹ {totalAmount}</span>
              </div>

            </div>

            {/* Checkout Button */}
            <button
              onClick={() => router.push("/checkout")}
              disabled={loading}
              className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-lg font-semibold transition"
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </section>
  );
}
