import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="w-full sticky top-0 z-50 bg-white/40 backdrop-blur-md shadow-sm border-b border-gray-200 px-8 py-4 font-sans text-[#171717]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#d8e8d8] rounded-full shadow-sm" />
          <h1 className="text-2xl font-bold tracking-tight text-[#0f4c81] hover:brightness-110 transition duration-200">
            <Link href="/">Fuel Finder</Link>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="#start" className="hover:brightness-110 hover:scale-105 transition">Start Here</Link>
          <Link href="#stats" className="hover:brightness-110 hover:scale-105 transition">Stats</Link>
          <Link href="#tools" className="hover:brightness-110 hover:scale-105 transition">Tools</Link>
          <Link href="#mission" className="hover:brightness-110 hover:scale-105 transition">Our Mission</Link>
          <Link href="#footer" className="hover:brightness-110 hover:scale-105 transition">Contact Us</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[#0f4c81] hover:underline text-sm font-medium">
            Log In
          </Link>
          <Link
            href="/createaccount"
            className="bg-[#0f4c81] text-white px-4 py-2 rounded-full shadow-md hover:brightness-110 hover:scale-105 active:scale-95 transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
