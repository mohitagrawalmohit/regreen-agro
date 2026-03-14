"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import CategorySection from "./CategoryMenu";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<"menu" | "profile" | null>(null);

  const [showCategories, setShowCategories] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  const navLinks = [
    { href: "/", label: "Home", dash: "0 2 8 73.3 8 10.7" },
    { href: "/category/All", label: "Categories", dash: "0 12.6 9.5 49.3 9.5 31.6" },
    { href: "/aboutus", label: "About Us", dash: "0 24.5 8.5 27.5 8.5 55.5" },
    { href: "/terms", label: "T&C", dash: "0 34.7 6.9 10.2 6.9 76" },
  ];

  const [dashArray, setDashArray] = useState("0 0 10 40 10 40");

  /* CART COUNT */

  useEffect(() => {
    if (!user) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}api/cart`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCartCount(data.items?.length || 0));
  }, [user]);

  /* LOGOUT */

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    router.push("/");
    router.refresh();
  };

  /* CART CLICK */

  const handleCartClick = () => {
    if (!user) router.push("/login?redirect=/cart");
    else router.push("/cart");
  };

  /* CLOSE DRAWER */

  useEffect(() => {
    setMenuOpen(false);
    setShowMobileCategories(false);
  }, [pathname]);

  return (
    <header className="relative z-50 bg-white shadow-md sticky top-[25px]">

      {/* MOBILE NAVBAR */}

      <div className="md:hidden flex items-center justify-between px-4 py-3">

        {/* Cart */}
        <button onClick={handleCartClick}>
          <ShoppingCartIcon className="h-7 w-7" />
        </button>

        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={140} height={60} />
        </Link>

        {/* Profile + Hamburger */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => {
              setDrawerType("profile");
              setMenuOpen(true);
            }}
          >
            <UserCircleIcon className="h-7 w-7" />
          </button>

          <button
            onClick={() => {
              setDrawerType("menu");
              setMenuOpen(true);
            }}
          >
            <Bars3Icon className="h-7 w-7" />
          </button>
        </div>
      </div>

      {/* DESKTOP NAVBAR */}

      <div className="hidden md:flex max-w-7xl mx-auto items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={160} height={60} />
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-8">

          <div className="relative w-[420px] h-[60px]">

            <div className="absolute inset-0 flex justify-around items-center px-4">

              {navLinks.map((link) => (

                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => {
                    setDashArray(link.dash);
                    if (link.label === "Categories") setShowCategories(true);
                  }}
                  onMouseLeave={() => {
                    setDashArray("0 0 10 40 10 40");
                    if (link.label === "Categories") setShowCategories(false);
                  }}
                >

                  <Link
                    href={link.href}
                    className={`px-4 py-2 ${
                      pathname === link.href ? "text-[#2cd882]" : ""
                    }`}
                  >
                    {link.label}
                  </Link>

                  {/* CATEGORY DROPDOWN */}

                  {link.label === "Categories" && showCategories && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full w-screen bg-none shadow-lg z-50"
                      onMouseEnter={() => setShowCategories(true)}
                      onMouseLeave={() => setShowCategories(false)}
                    >
                      <div className="max-w-7xl mx-auto px-10 py-6">
                        <CategorySection />
                      </div>
                    </div>
                  )}

                </div>

              ))}

            </div>

            {/* SVG Animation */}

            <svg
              viewBox="0 0 420 60"
              height={60}
              width={420}
              className="absolute inset-0 pointer-events-none"
            >
              <rect
                strokeWidth={5}
                fill="transparent"
                height={60}
                width={420}
                pathLength={100}
                className="stroke-[#2cd882] transition-all duration-500"
                style={{ strokeDasharray: dashArray }}
              />
            </svg>

          </div>

        </div>

        {/* ICONS RIGHT */}

        <div className="flex items-center gap-6">

         <div className="relative group">

  {/* Profile Icon */}
  <UserCircleIcon className="h-8 w-8 cursor-pointer" />

  {/* Dropdown */}
  <div className="absolute right--10 top-full hidden group-hover:block bg-white shadow-lg rounded-md p-4 w-44 z-50">

    {!user ? (
      <Link
      href="/login"
      className="block w-full text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
    >
      Login
    </Link>
    ) : (
      <>
        <p className="font-semibold mb-2">
          {user.name || user.phone}
        </p>

        <Link
          href="/my-orders"
          className="block mb-2 hover:text-green-600"
        >
          My Orders
        </Link>

        <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
      </>
    )}

  </div>

</div>
          {/* CART */}

          <button onClick={handleCartClick} className="relative">
            <ShoppingCartIcon className="h-8 w-8" />

            {user && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* MOBILE DRAWER */}

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">

          <div
            className="w-1/2 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          <div className="w-1/2 bg-white shadow-md p-4">

            <nav className="flex flex-col space-y-4">

              {drawerType === "menu" && (
                <>
                  <Link href="/">Home</Link>

                  <button
                    onClick={() =>
                      setShowMobileCategories(!showMobileCategories)
                    }
                    className="text-left"
                  >
                    Categories
                  </button>

                  {showMobileCategories && (
                    <div className="ml-4">
                      <CategorySection mobile />
                    </div>
                  )}

                  <Link href="/aboutus">About Us</Link>
                  <Link href="/terms">T&C</Link>
                </>
              )}

              {drawerType === "profile" && (
                <>
                 {!user ? (

  <div className="flex flex-col gap-2">

    <p className="font-semibold text-gray-800 border-b pb-1">
      My Profile
    </p>

    <Link
      href="/login"
      className="block w-full text-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
    >
      Login
    </Link>


  </div>

) : (

  <div className="flex flex-col gap-2">

    {/* Heading */}
    <p className="font-semibold text-gray-800 border-b pb-1">
      My Profile
    </p>

    {/* Name → Redirect to Home */}
    <Link
      href="/"
      className="font-medium hover:text-green-600"
    >
      {user.name || user.phone}
    </Link>

    {/* Orders */}
    <Link
      href="/my-orders"
      className="hover:text-green-600"
    >
      My Orders
    </Link>

    {/* Logout */}
    <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>

  </div>

)}
                </>
              )}

            </nav>

          </div>
        </div>
      )}
    </header>
  );
}