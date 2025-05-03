'use client';
import React, { useEffect, useState } from 'react';

interface LoginData {
  username: string;
  password: string;
}

const Dash: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("loginData");
    if (stored) {
      setLoginData(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-xl bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Dashboard
        </h2>

        {loginData ? (
          <div className="space-y-4 text-center text-gray-700">
            <p>
              <span className="font-semibold">Username:</span> {loginData.username}
            </p>
            <p>
              <span className="font-semibold">Password:</span> {loginData.password}
            </p>
          </div>
        ) : (
          <p className="text-red-500 text-center font-medium">No login data found.</p>
        )}
      </div>
    </div>
  );
};

export default Dash;
