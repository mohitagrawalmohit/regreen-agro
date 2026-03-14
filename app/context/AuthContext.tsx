"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);

  // Check session on load
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/me`, {
      credentials: "include",
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
