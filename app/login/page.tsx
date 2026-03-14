"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  const redirect = searchParams.get("redirect") || "/";
  const addToCart = searchParams.get("addToCart");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- SEND OTP ---------------- */

  const handleSendOtp = async (e:any) => {

    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/auth/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
      } else {
        setStep(2);
      }

    } catch {
      setError("Something went wrong");
    }

    setLoading(false);

  };

  /* ---------------- VERIFY OTP ---------------- */

  const handleVerifyOtp = async (e:any) => {

    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ phone, otp }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      /* fetch user */

      const meRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/auth/me`,
        { credentials: "include" }
      );

      if (meRes.ok) {

        const userData = await meRes.json();

        setUser(userData);

        /* if name missing → ask name */

        if (!userData.name) {
          setStep(3);
          setLoading(false);
          return;
        }

      }

      /* auto add cart */

      if (addToCart) {

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/cart/add`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ productId: Number(addToCart) }),
          }
        );

      }

      router.push(`${redirect}?added=true`);

    } catch {

      setError("Something went wrong");

    }

    setLoading(false);

  };

  /* ---------------- SAVE NAME ---------------- */

  const handleSaveName = async (e:any) => {

    e.preventDefault();
    setLoading(true);

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/auth/update-name`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name }),
        }
      );

      if (!res.ok) {
        setError("Failed to save name");
        setLoading(false);
        return;
      }

      const meRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/auth/me`,
        { credentials: "include" }
      );

      const userData = await meRes.json();
      setUser(userData);

      router.push(redirect);

    } catch {

      setError("Something went wrong");

    }

    setLoading(false);

  };

  return (

    <div className="flex justify-center items-center min-h-screen bg-[#f9fff2]">

      <form className="bg-white p-6 rounded shadow-md w-80">

        <h2 className="text-xl font-bold mb-4 text-center">

          {step === 1 && "Login with Mobile"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Complete Profile"}

        </h2>

        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

        {/* PHONE STEP */}

        {step === 1 && (

          <>
            <input
              type="tel"
              placeholder="Enter mobile number"
              className="w-full border p-2 mb-3 rounded"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              required
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>

        )}

        {/* OTP STEP */}

        {step === 2 && (

          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border p-2 mb-3 rounded"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              required
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>

        )}

        {/* NAME STEP */}

        {step === 3 && (

          <>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border p-2 mb-3 rounded"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              required
            />

            <button
              onClick={handleSaveName}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </>

        )}

      </form>

    </div>

  );

}