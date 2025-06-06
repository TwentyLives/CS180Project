"use client";
import React, { useEffect, useState, useRef } from "react";

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
  const [showOnlyWithData, setShowOnlyWithData] = useState(false);
  const [sortByClosest, setSortByClosest] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [fetchRadiusKm, setFetchRadiusKm] = useState(5);
  const fetchedRadiusRef = useRef(5);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const fetchNearbyStations = async (radiusKm: number) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }

    try {
      const priceRes = await fetch("http://127.0.0.1:8000/api/station-prices/");
      const priceData = (await priceRes.json()) || [];

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const userLat = pos.coords.latitude;
          const userLon = pos.coords.longitude;

          const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
            const R = 6371;
            const dLat = ((lat2 - lat1) * Math.PI) / 180;
            const dLon = ((lon2 - lon1) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c * 1000;
          };

          const overpassURL = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:${radiusKm * 1000},${userLat},${userLon})[amenity=fuel];out;`;
          const overpassRes = await fetch(overpassURL);
          const overpassData = await overpassRes.json();

          const rawNearbyStations = overpassData.elements.map((el: any) => ({
            id: el.id,
            name: el.tags?.name || "Unnamed Station",
            brand: el.tags?.brand || "Unknown",
            lat: el.lat,
            lon: el.lon,
            distance: haversineDistance(userLat, userLon, el.lat, el.lon),
          }));

          const mergedStations: GasStation[] = rawNearbyStations.map((raw: {
            id: number;
            name: string;
            brand: string;
            lat: number;
            lon: number;
            distance: number;
          }) => {
            const match = priceData.find((s: any) => {
              const dist = haversineDistance(raw.lat, raw.lon, s.lat, s.lon);
              return dist < 50;
            });

            return {
              id: raw.id,
              name: raw.name,
              brand: raw.brand,
              lat: raw.lat,
              lon: raw.lon,
              distance: raw.distance,
              regular: match?.regular ?? NaN,
              premium: match?.premium ?? NaN,
              diesel: match?.diesel ?? NaN,
              rating: match?.rating,
            };
          });

          setStations(mergedStations);
          fetchedRadiusRef.current = radiusKm;
          setLoading(false);
        },
        () => {
          setError("Could not access your location.");
          setLoading(false);
        }
      );
    } catch (err) {
      console.error(err);
      setError("Could not fetch station data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("favoriteStations");
    if (saved) setFavorites(JSON.parse(saved));
    fetchNearbyStations(fetchRadiusKm);
  }, []);

  useEffect(() => {
    const neededKm = maxDistanceMiles ? Math.ceil(maxDistanceMiles * 1.60934) : 5;
    if (neededKm > fetchedRadiusRef.current) {
      setLoading(true);
      fetchNearbyStations(neededKm);
    }
  }, [maxDistanceMiles]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id];
      sessionStorage.setItem("favoriteStations", JSON.stringify(updated));
      return updated;
    });
  };

  if (!hasMounted) return null;

  let filtered = stations.filter((s) => {
    const distanceInMiles = s.distance * 0.000621371;
    const hasData = !isNaN(s.regular) || !isNaN(s.premium) || !isNaN(s.diesel);
    return (
      (!showFavoritesOnly || favorites.includes(s.id)) &&
      (!showOnlyWithData || hasData) &&
      (maxDistanceMiles ? distanceInMiles <= maxDistanceMiles : true) &&
      (minRating !== undefined ? (s.rating || 0) >= minRating : true) &&
      (brandFilter === "All" || s.brand.toLowerCase() === brandFilter.toLowerCase())
    );
  });

  if (sortByClosest) {
    filtered.sort((a, b) => a.distance - b.distance);
  } else {
    filtered.sort((a, b) => a[sortByFuel] - b[sortByFuel]);
  }

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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="dataOnly"
            onChange={(e) => setShowOnlyWithData(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="dataOnly" className="text-sm">Show only stations with price data</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="sortByClosest"
            onChange={(e) => setSortByClosest(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="sortByClosest" className="text-sm">Sort by closest station</label>
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
                  <p>Regular: {isNaN(station.regular) ? "N/A" : `$${station.regular.toFixed(2)}`}</p>
                  <p>Premium: {isNaN(station.premium) ? "N/A" : `$${station.premium.toFixed(2)}`}</p>
                  <p>Diesel: {isNaN(station.diesel) ? "N/A" : `$${station.diesel.toFixed(2)}`}</p>
                </div>
                {station.rating !== undefined ? (
                  <p className="text-sm text-yellow-500">⭐ {station.rating}/5</p>
                ) : (
                  <p className="text-sm text-gray-400 italic">No rating</p>
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
