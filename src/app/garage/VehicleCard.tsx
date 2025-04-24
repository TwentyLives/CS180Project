interface Vehicle {
    id: string;
    make: string;
    model: string;
    fuelLevel: number; // 0-100
  }
  
  export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
    return (
      <div className="border rounded-lg shadow p-4 flex flex-col gap-3 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">{vehicle.make} {vehicle.model}</h2>
          <span className="text-sm text-gray-500">{vehicle.fuelLevel}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${vehicle.fuelLevel}%` }}
          ></div>
        </div>
        <button className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded">
          View Details
        </button>
      </div>
    );
  }