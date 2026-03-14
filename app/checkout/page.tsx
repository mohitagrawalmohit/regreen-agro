"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async () => {
    try {
      if (loading) return;

      setLoading(true);

      // ✅ Basic validation
      if (
        !form.fullName ||
        !form.phone ||
        !form.addressLine ||
        !form.city ||
        !form.state ||
        !form.pincode
      ) {
        alert("Please fill all fields");
        setLoading(false);
        return;
      }

      // ✅ Step 1: Ask backend to create Order + Razorpay Order
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/orders/create-razorpay-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            shipping: form,
          }),
        }
      );

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert(orderData.message || "Failed to initiate payment");
        setLoading(false);
        return;
      }

      // orderData should contain:
      // { id: razorpayOrderId, amount, orderId }

      // ✅ Step 2: Load Razorpay
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert("Failed to load payment gateway");
        setLoading(false);
        return;
      }

      // ✅ Step 3: Configure Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Regreen Agro",
        description: "Order Payment",
        order_id: orderData.id,

        handler: async function (response: any) {
          // ✅ Step 4: Verify payment
          const verifyRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}api/orders/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                ...response,
                orderId: orderData.orderId,
              }),
            }
          );

          if (verifyRes.ok) {
            alert("Payment successful 🎉");
             router.push(`/order-success?orderId=${orderData.orderId}`);
          } else {
            alert("Payment verification failed");
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },

        prefill: {
          name: form.fullName,
          contact: form.phone,
        },

        theme: {
          color: "#30BB7E",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Shipping Address</h1>

      <div className="grid gap-4">
        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="addressLine"
          placeholder="Address Line"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="state"
          placeholder="State"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          onClick={placeOrder}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded mt-4 transition"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
