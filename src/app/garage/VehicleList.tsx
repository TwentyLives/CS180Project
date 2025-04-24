import VehicleCard from './VehicleCard';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  fuelLevel: number;
}

export default function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map(vehicle => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}