'use client';

import { Fuel } from 'lucide-react';

interface CardProps {
  icon?: React.ReactNode;
  title: string;
  status: string;
}

export default function Card({ icon = <Fuel />, title, status }: CardProps) {
  return (
    <div className="group bg-gradient-to-br from-white/60 via-white/30 to-white/20 backdrop-blur-md rounded-2xl shadow-lg p-4 flex flex-col justify-between w-full h-36
      transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] active:scale-95 active:brightness-110">
      
      <div className="flex justify-between items-center">
        <div className="text-gray-600 transition-colors duration-300 group-hover:text-gray-400">
          {icon}
        </div>
        <div className="text-sm font-medium text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
          {title}
        </div>
      </div>

      <div className="text-2xl font-bold text-black mt-2">
        {status}
      </div>
    </div>
  );
}
