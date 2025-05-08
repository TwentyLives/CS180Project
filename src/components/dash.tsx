'use client';
import React, { useEffect, useState } from 'react';

interface LoginData {
  username: string;
}

const Dash: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("loginData");
    if (stored) {
      setLoginData(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5fdf7] via-[#edf7ef] to-[#e6f0e6] px-8 py-6">
      <div className="text-left">
        <p className="text-md text-gray-600 italic">Welcome back,</p>
        <h1 className="text-3xl font-bold text-[#171717]">
          {loginData ? loginData.username : "User"}
        </h1>
      </div>
    </div>
  );
};

export default Dash;
