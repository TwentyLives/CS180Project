'use client';

import Image from 'next/image';

export default function ImageCard() {
  return (
    <div className="relative w-full h-48 bg-gradient-to-br from-white/60 via-white/30 to-white/20 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden flex items-center justify-center 
      transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] active:scale-95 active:brightness-110 fade-in">
      
      {/* Photo */}
      <Image
        src="/images/go.png"
        alt="Go Image"
        width={600}
        height={192}
        className="object-cover w-full h-full"
      />
      
      {/* Word */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-2xl font-semibold text-white drop-shadow-md">Ready to Save?</h2>
      </div>
    </div>
  );
}