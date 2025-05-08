"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoggedHeader = () => {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear(); // we can change this to sessionStorage.removeItem(data) if we want to keep some data
    setShowConfirm(false);
    router.push("/");
  };

  return (
    <>
      <nav className="w-full sticky top-0 z-50 bg-white/40 backdrop-blur-md shadow-sm border-b border-gray-200 px-8 py-4 font-sans text-[#171717]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#d8e8d8] rounded-full shadow-sm" />
            <h1 className="text-2xl font-bold tracking-tight text-[#0f4c81] hover:brightness-110 transition duration-200">
              <Link href="/dashboard">Fuel Finder</Link>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <Link href="#" className="hover:brightness-110 hover:scale-105 transition">My Garage</Link>
            <Link href="#" className="hover:brightness-110 hover:scale-105 transition">Fuel Prices</Link>
            <Link href="#" className="hover:brightness-110 hover:scale-105 transition">Stations</Link>
            <Link href="#" className="hover:brightness-110 hover:scale-105 transition">About</Link>
            <Link href="#" className="hover:brightness-110 hover:scale-105 transition">Help</Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-[#0f4c81] text-white px-4 py-2 rounded-full shadow-md hover:brightness-110 hover:scale-105 active:scale-95 transition text-sm font-medium"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Logout?</h2>
            <p className="text-sm text-gray-600">Your current session will end</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoggedHeader;
