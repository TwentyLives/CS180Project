'use client';

import Image from 'next/image';

interface VehicleImageProps {
  type: 'Sedan' | 'SUV' | 'Van';
}

export default function VehicleImage({ type }: VehicleImageProps) {
  function getVehicleImage(type: VehicleImageProps['type']) {
    switch (type) {
      case 'Sedan': return '/images/vehicles/sedan.png';
      case 'SUV': return '/images/vehicles/suv.png';
      case 'Van': return '/images/vehicles/van.png';
      default: return '/images/vehicles/default.png';
    }
  }

  return (
    <div className="flex justify-center">
      <Image
        src={getVehicleImage(type)}
        alt="Vehicle"
        width={300}
        height={300}
        className="object-contain"
      />
    </div>
  );
}
