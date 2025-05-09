"use client";
import React from "react";

const features = [
  {
    title: "User Profiles",
    description:
      "Register an account and store all your vehicles. Customize preferences and track driving history across time.",
  },
  {
    title: "Your Garage",
    description:
      "Add one or more vehicles to view fuel type, tank capacity, MPG, and which side to refuel. Log fuel-ups to monitor usage.",
  },
  {
    title: "Nearby Gas Search",
    description:
      "Find the cheapest gas within your preferred distance. Filter by distance, price, or brand.",
  },
  {
    title: "Favorites & Bookmarking",
    description:
      "Save gas stations you like to revisit or track daily price changes. Make your routine refuels easier.",
  },
  {
    title: "Driving Pattern Analyzer",
    description:
      "We analyze your car and driving habits to recommend the best times and places to refuel.",
  },
  {
    title: "Engaging Community",
    description:
      "Get real-time gas prices from others. Compete with friends and drivers with the same model to see who saves more!",
  },
];

const Tools = () => {
  return (
    <section className="min-h-screen w-full bg-[#e6f0f7] py-20 px-6 md:px-20 font-sans">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#0f4c81] drop-shadow-sm">
          Our Tools
        </h2>
        <p className="mt-4 text-lg text-[#171717]">
          Take charge in finding the best gas prices and managing your fuel expenses.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
          >
            <h3 className="text-2xl font-semibold text-[#0f4c81] mb-4">
              {feature.title}
            </h3>
            <p className="text-[#171717] text-base leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tools;
