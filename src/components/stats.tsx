"use client";
import React, { useEffect, useState } from "react";

const Stats = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/total-users");
        const data = await response.json();
        setTotalUsers(data.total_users);
      } catch (error) {
        console.error("Failed to fetch user count:", error);
        setTotalUsers(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <section className="w-full min-h-screen bg-white py-20 px-6 md:px-20 font-sans">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#0f4c81] drop-shadow-sm">
          Fuel Finder Stats
        </h2>
        <p className="mt-4 text-lg text-[#171717]">
          How many users are using our service?
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-[#f9f5e9] p-10 rounded-2xl shadow-md border border-gray-200 text-center">
        <h3 className="text-2xl font-semibold text-[#0f4c81] mb-4">
          Registered Users
        </h3>
        <p className="text-6xl font-bold text-[#171717]">
          {loading
            ? "Loading..."
            : totalUsers !== null
            ? totalUsers
            : "Error"}
        </p>
      </div>
    </section>
  );
};

export default Stats;
