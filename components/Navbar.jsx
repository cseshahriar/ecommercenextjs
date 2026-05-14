"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/product", label: "Products" },
    { href: "/cart", label: "Cart" },
  ];
  
  // reusable nav link style
  const navLinkClass = (path, extraClass = "") =>
    `relative pb-1 transition-all duration-300
    ${
      pathname === path
        ? "font-semibold text-black after:w-full"
        : "text-gray-700 hover:text-black after:w-0 hover:after:w-full"
    }

    after:content-['']
    after:absolute
    after:left-0
    after:-bottom-1
    after:h-[2px]
    after:bg-black
    after:transition-all
    after:duration-300

    ${extraClass}
  `;

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          🛒 MyShop
        </Link>

        <div className="space-x-4 flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navLinkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
          
          {loading ? (
            <span className="text-gray-400 animate-pulse">Loading...</span>
          ) : user ? (
            <>
              <Link href="/user/order" 
                className={navLinkClass("/user/order")}
              >
                My Orders
              </Link>
              <button
                onClick={logout}
                className={navLinkClass("/logout", "text-red-600")}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={navLinkClass("/login")}>
                Login
              </Link>
              <Link href="/register" 
                className={navLinkClass("/login")}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
