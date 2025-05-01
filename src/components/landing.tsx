'use client';
import React from 'react';
import Link from 'next/link';

const Landing = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden text-[#171717] font-sans">
      {/* Ill keep this video fro now ig */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/placeholderVid.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/30 to-transparent backdrop-blur-sm z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold drop-shadow-md">
          This is <span className="text-[#0f4c81]">Fuel Finder</span>
        </h1>
        <p className="text-lg md:text-xl mt-4 text-gray-700">
          Find cheap gas prices nearby
        </p>
        <Link
          href="/login"
          className="mt-6 px-6 py-3 bg-[#0f4c81] text-white rounded-full shadow-md hover:brightness-110 hover:scale-105 active:scale-95 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Landing;
