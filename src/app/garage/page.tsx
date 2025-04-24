'use client';

import VehicleList from './VehicleList';
import { useEffect, useState } from 'react';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  fuelLevel: number;
  tankCapacity: number;
  mpg: number;
  fuelSide: 'Left' | 'Right';
}

export default function GaragePage() {
  // Example vehicle data
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', make: 'Toyota', model: 'Camry', fuelLevel: 75, tankCapacity: 50, mpg: 30, fuelSide: 'Left' },
    { id: '2', make: 'Honda', model: 'Civic', fuelLevel: 40, tankCapacity: 45, mpg: 32, fuelSide: 'Right' },
    { id: '3', make: 'Mazda', model: '3', fuelLevel: 90, tankCapacity: 48, mpg: 28, fuelSide: 'Left' },
  ]);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome User, ready to drive?
      </h1>
      {/* VehicleList */}
      <VehicleList vehicles={vehicles} />
    </main>
  );
}