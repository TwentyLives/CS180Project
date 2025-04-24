import React from 'react';

const Landing = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center text-white overflow-hidden z-10">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        //we can chane it to an img or keep the video but just change src
        src="/placeholderVid.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white/0 z-5"></div>
      <div className="absolute z-10 text-center text-gray-600">
        <h1 className="text-6xl font-bold">This is Fuel Finder</h1>
        <p className="text-xl mt-4">Find cheap gas prices nearby</p>
      </div>
    </div>

  );
};

export default Landing;