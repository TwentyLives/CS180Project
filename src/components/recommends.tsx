'use client';
import React, { useEffect, useState } from 'react';

interface GasStation {
  id: number;
  name: string;
  brand: string;
  distance: number;
  regular: number;
  premium: number;
  diesel: number;
  rating?: number;
  lat: number;
  lon: number;
}

const Recommends: React.FC = () => {
  const [stations, setStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [brandFilter, setBrandFilter] = useState("All");
  const [maxDistanceMiles, setMaxDistanceMiles] = useState<number | undefined>(undefined);
  const [sortByFuel, setSortByFuel] = useState<"regular" | "premium" | "diesel">("regular");
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const fetchNearbyStations = async (lat: number, lon: number) => {
    const query = `
      [out:json];
      node["amenity"="fuel"](around:8000,${lat},${lon});
      out body;
    `;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
      });

      const data = await response.json();

      const parsedStations = data.elements.map((el: any): GasStation => ({
        id: el.id,
        name: el.tags.name || "Unnamed Station",
        brand: el.tags.brand || "Unknown",
        distance: Math.floor(Math.random() * 8000),
        regular: Number((Math.random() * (5.5 - 4.2) + 4.2).toFixed(2)),
        premium: Number((Math.random() * (5.8 - 4.5) + 4.5).toFixed(2)),
        diesel: Number((Math.random() * (5.6 - 4.3) + 4.3).toFixed(2)),
        rating: Math.random() > 0.5 ? Number((Math.random() * 2 + 3).toFixed(1)) : undefined,
        lat: el.lat,
        lon: el.lon,
      }));

      setStations(parsedStations);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch stations.");
      setLoading(false);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id];
      sessionStorage.setItem("favoriteStations", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("favoriteStations");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }

    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchNearbyStations(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setError("Could not access your location.");
        setLoading(false);
      }
    );
  }, []);

  let filtered = stations.filter((s) => {
    const distanceInMiles = s.distance * 0.000621371;
    return (
      (!showFavoritesOnly || favorites.includes(s.id)) &&
      (maxDistanceMiles ? distanceInMiles <= maxDistanceMiles : true) &&
      (minRating !== undefined ? (s.rating || 0) >= minRating : true) &&
      (brandFilter === "All" || s.brand.toLowerCase() === brandFilter.toLowerCase())
    );
  });

  filtered.sort((a, b) => a[sortByFuel] - b[sortByFuel]);

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col lg:flex-row gap-8 items-start justify-center bg-[var(--background)]">
      <div className="w-full lg:w-1/3 space-y-6 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-[#0f4c81]">Find Recommendations</h2>

        <div>
          <label className="block font-medium mb-1">Filter by Brand</label>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm"
          >
            <option value="All">All</option>
            <option value="ARCO">ARCO</option>
            <option value="Shell">Shell</option>
            <option value="Chevron">Chevron</option>
            <option value="76">76</option>
            <option value="Mobil">Mobil</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Max Distance (miles)</label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm"
            placeholder="e.g., 5"
            value={maxDistanceMiles ?? ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              setMaxDistanceMiles(isNaN(val) ? undefined : val);
            }}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Minimum Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            placeholder="e.g., 4.0"
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm"
            value={minRating ?? ""}
            onChange={(e) => setMinRating(Number(e.target.value) || undefined)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Sort by Fuel Type</label>
          <select
            value={sortByFuel}
            onChange={(e) => setSortByFuel(e.target.value as any)}
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm"
          >
            <option value="regular">Regular</option>
            <option value="premium">Premium</option>
            <option value="diesel">Diesel</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="favoritesOnly"
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="favoritesOnly" className="text-sm">Show only favorites</label>
        </div>
      </div>

      <div className="w-full lg:w-2/3 space-y-6 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold text-[#0f4c81]">Recommended Stations</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading nearby stations...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No stations match your preferences.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((station) => (
              <div
                key={station.id}
                className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition relative cursor-pointer"
                onClick={() =>
                  sessionStorage.setItem(
                    "selectedStation",
                    JSON.stringify({
                      name: station.name,
                      lat: station.lat,
                      lon: station.lon,
                    })
                  )
                }
              >
                <button
                  className={`absolute top-3 right-3 text-xl transition ${
                    favorites.includes(station.id) ? "text-pink-500" : "text-gray-300"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(station.id);
                  }}
                >
                  {favorites.includes(station.id) ? "♥" : "♡"}
                </button>

                <h3 className="text-lg font-bold text-[#171717]">{station.name}</h3>
                {station.brand !== "Unknown" && (
                  <p className="text-sm text-gray-600">{station.brand}</p>
                )}
                <p className="text-sm text-gray-600">
                  {(station.distance * 0.000621371).toFixed(2)} miles away
                </p>
                <div className="flex gap-3 text-sm text-gray-700">
                  <p>Regular: ${station.regular.toFixed(2)}</p>
                  <p>Premium: ${station.premium.toFixed(2)}</p>
                  <p>Diesel: ${station.diesel.toFixed(2)}</p>
                </div>
                {station.rating !== undefined && (
                  <p className="text-sm text-yellow-500">⭐ {station.rating}/5</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommends;
