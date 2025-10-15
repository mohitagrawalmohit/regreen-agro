"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");

      // 🚫 No token? redirect immediately
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        // ✅ Verify token with backend
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Invalid token");
        }

        // ✅ Token is valid — allow access
        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth verification failed:", error);
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  // 🕒 Show loading UI while verifying
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking authorization...
      </div>
    );
  }

  // ✅ Render protected content
  return <>{children}</>;
}
