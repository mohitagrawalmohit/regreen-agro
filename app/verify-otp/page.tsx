"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const phone = searchParams.get("phone") || "";
  const name = searchParams.get("name") || "";
  const redirect = searchParams.get("redirect") || "/";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [resending, setResending] = useState(false);

  // ⏱️ OTP resend timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 🔐 Verify OTP
  const handleVerifyOtp = async () => {
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        return;
      }

      // ✅ OTP verified → redirect user
      router.replace(redirect);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resend OTP
  const handleResendOtp = async () => {
    setError("");
    setResending(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to resend OTP");
        return;
      }

      setTimer(30);
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  // 🛑 If phone missing, force back to login
  useEffect(() => {
    if (!phone) {
      router.replace("/login");
    }
  }, [phone, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* Brand */}
        <h1 className="text-2xl font-bold text-center text-green-700">
          Regreen Agro
        </h1>

        <p className="text-center text-gray-600 text-sm mt-2">
          Verify OTP to continue
        </p>

        {/* Info */}
        <p className="text-center text-sm text-gray-500 mt-4">
          We’ve sent a 6-digit OTP to
          <br />
          <span className="font-semibold text-gray-800">
            +91 {phone}
          </span>
        </p>

        {/* OTP Input */}
        <div className="mt-6">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Enter OTP"
            className="w-full text-center tracking-widest text-2xl border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded mt-4">
            {error}
          </p>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerifyOtp}
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

        {/* Resend OTP */}
        <div className="text-center mt-4 text-sm text-gray-600">
          {timer > 0 ? (
            <span>Resend OTP in {timer}s</span>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={resending}
              className="text-green-600 font-semibold hover:underline"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
