import React from "react";

const Mission = () => {
  return (
    <section className="w-full bg-white py-20 px-6 md:px-20 flex flex-col md:flex-row items-center justify-center gap-12 font-sans">

      <div className="w-full md:w-1/2 h-80 md:h-[400px] rounded-2xl overflow-hidden shadow-md">
        <img
          src="/StockRefuel.jpg"
          alt="Refueling"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 text-left space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-[#0f4c81] drop-shadow-sm">
          Our Mission
        </h2>

        <p className="text-lg md:text-xl text-[#171717] leading-relaxed">
          As of 2025, the United States has approximately 242.1 million licensed drivers,
          with 92.1% of vehicles powered by gas. Driving plays a major role in Americans’ daily lives,
          and in today’s economy, fluctuating fuel prices impact everyone.
          Without an easy and distraction-free way to find gas prices,
          drivers are left with unnecessary expenses and inconvenience.
        </p>

        <p className="text-lg md:text-xl text-[#171717] leading-relaxed">
          Fuel Finder aims to simplify and optimize this process through a centralized, real-time platform
          where users can find the most cost-effective gas stations nearby, track fuel expenses, and build better refueling habits.
          By integrating geolocation, user favorites, and crowd-sourced updates,
          we empower smarter, money-saving decisions — both on the road and at the pump.
        </p>
      </div>
    </section>
  );
};

export default Mission;
