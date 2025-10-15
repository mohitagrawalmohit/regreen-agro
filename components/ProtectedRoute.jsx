"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");

      // 🚫 No token? redirect to login
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        // ✅ OPTIONAL BACKEND VERIFICATION:
        // Uncomment if you want to verify token via backend
        /*
        const res = await fetch("/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Invalid token");
        */

        // ✅ If token exists (and optionally valid)
        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  // While checking authentication, avoid flashing protected content
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking authorization...
      </div>
    );
  }

  return <>{children}</>;
}
