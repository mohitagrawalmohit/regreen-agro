'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ simple check (replace with backend validation later)
    if (form.username === 'admin' && form.password === 'admin') {
      // save login flag in localStorage
      localStorage.setItem("isAdminLoggedIn", "true");
      router.push('/admin/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-green-700">Admin Login</h1>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-600">
            Username
          </label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            type="text"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
