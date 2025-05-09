'use client';

import { useEffect } from 'react';

export default function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 px-6 py-4 rounded-2xl bg-white/80 backdrop-blur-md text-gray-900 text-base shadow-2xl animate-fade-in-out font-medium">
      {message}
    </div>
  );
}
