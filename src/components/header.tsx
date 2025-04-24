import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 shadow-sm border-b bg-white z-50 sticky top-0">
      <div className="flex items-center gap-2 text-gray-600">
        <div className="w-8 h-8 bg-gray-300 rounded-full" /> 
        <h1 className="text-2xl font-bold">
          <Link href="/" className="hover:text-black transition">Fuel Finder</Link>
        </h1>
      </div>

      <div className="flex items-center gap-8 text-gray-600">
        <a href="#" className="hover:text-black transition">My Garage</a>
        <a href="#" className="hover:text-black transition">Placeholder</a>
        <a href="#" className="hover:text-black transition">Placeholder</a>
        <a href="#" className="hover:text-black transition">Placeholder</a>
        <a href="#" className="hover:text-black transition">Placeholder</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-black transition">
          <a href="/login">Log In</a>
        </button>
        <button className="border border-red-500 text-red-500 px-4 py-1 rounded hover:bg-red-50 transition">
          <a href="/createaccount">Create Account</a>
        </button>
      </div>
    </nav>
  );
};

export default Header;