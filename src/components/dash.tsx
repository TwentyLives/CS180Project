'use client';
import React, { useEffect, useState } from 'react';

interface LoginData {
  username: string;
}

const Dash: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData | null>(null);

  useEffect(() => {
    // Try to get login info from cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    // Example: If you store a token, you might want to fetch user info from backend
    const token = getCookie("token");
    if (token) {
      // Fetch user info using the token
      fetch("http://127.0.0.1:8000/api/userinfo/", {
        method: "GET",
        headers: {
          "Authorization": `Token ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.username) {
            setLoginData({ username: data.username });
          }
        })
        .catch(() => setLoginData(null));
    } else {
      setLoginData(null);
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
