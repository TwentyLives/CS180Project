"use client";

import Header from "../../components/loggedHeader";
import Footer from "../../components/footer";
import dynamic from "next/dynamic";

// Dynamically import LocationComponent with SSR disabled
const Location = dynamic(() => import("../../components/geolocation/LocationComponent"), {
  ssr: false,
});

const Stations = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-0">
      <Header />
      <Location />
      <Footer />
    </div>
  );
};

export default Stations;
