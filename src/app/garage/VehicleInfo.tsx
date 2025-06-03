'use client';

interface VehicleInfoProps {
  make: string;
  model: string;
  year: string;
  trim: string;
}

export default function VehicleInfo({ make, model, year, trim }: VehicleInfoProps) {
  return (
    <div className="text-center space-y-2 mt-4 fade-in">
      <h2 className="text-2xl font-bold">{make} {model}</h2>
      <p className="text-gray-600 text-lg">{year} {trim}</p>
    </div>
  );
}
