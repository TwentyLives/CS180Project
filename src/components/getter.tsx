"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet";
import Toast from "@/components/toast";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

interface GasStation {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
  };
}

const RecenterMap = ({ lat, lon }: { lat: number; lon: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom(), { animate: true });
  }, [lat, lon, map]);
  return null;
};

const Getter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState({ lat: 34.0689, lon: -117.3281 });
  const [stations, setStations] = useState<GasStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<GasStation | null>(null);
  const [formData, setFormData] = useState({
    regular: "",
    premium: "",
    diesel: "",
    rating: 0,
  });

  const [brandFilter, setBrandFilter] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastColor, setToastColor] = useState<"green" | "red">("green");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (val: number) => {
    setFormData(prev => ({ ...prev, rating: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStation) return;

    // Map frontend station to backend format
    const stationPayload = {
      overpass_id: selectedStation.id,
      name: selectedStation.tags.name || "",
      lat: selectedStation.lat,
      lon: selectedStation.lon,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/submit-gas-price/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          station: stationPayload,
          prices: formData,
        }),
      });

      if (res.ok) {
        setToastMessage("Gas price submitted!");
        setToastColor("green");
        setFormData({ regular: "", premium: "", diesel: "", rating: 0 });
      } else {
        setToastMessage("Failed to submit. Try again.");
        setToastColor("red");
      }
    } catch {
      setToastMessage("Submission error.");
      setToastColor("red");
    }
  };

  const fetchGasStations = async (lat: number, lon: number) => {
    const query = `
      [out:json];
      node["amenity"="fuel"](around:5000,${lat},${lon});
      out body;
    `;
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    });
    const data = await response.json();
    setStations(data.elements || []);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setToastMessage("Please enter a location to search.");
      setToastColor("red");
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setLocation({ lat, lon });
        setToastMessage("Location found!");
        setToastColor("green");
      } else {
        setToastMessage("No results found for that location.");
        setToastColor("red");
      }
    } catch {
      setToastMessage("Search failed. Try again.");
      setToastColor("red");
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setToastMessage("Geolocation not supported.");
      setToastColor("red");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lon: longitude });
        setToastMessage("Location updated.");
        setToastColor("green");
      },
      () => {
        setToastMessage("Failed to get your location.");
        setToastColor("red");
      }
    );
  };

  useEffect(() => {
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  useEffect(() => {
    fetchGasStations(location.lat, location.lon);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-start justify-center bg-[var(--background)] px-4 py-10 gap-8">
      <div className="w-full lg:w-1/2 space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#0f4c81]">Submit Gas Prices</h2>

        <p className="text-sm text-gray-600">
          Use the map and form below to submit gas prices. Start by searching a city, street address, or landmark (e.g., "Riverside, CA", "900 University Ave", or "Chevron").
          You can also <span className="font-semibold text-blue-600">use your current location</span> to find nearby stations. Click a station marker to select it.
          Then fill in the prices and optionally leave a 0–5 star rating.
          <br /><br />
          Use the <span className="font-semibold">Brand Filter</span> dropdown to show only certain gas station chains.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Search for a location (e.g. Riverside, CA)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        <button
          onClick={handleUseMyLocation}
          className="w-full text-sm text-blue-600 underline hover:text-blue-800 transition"
        >
          Use My Location
        </button>

        <div>
          <label className="block font-medium mb-1">Filter by Brand</label>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="All">All</option>
            <option value="ARCO">ARCO</option>
            <option value="Shell">Shell</option>
            <option value="Chevron">Chevron</option>
            <option value="76">76</option>
            <option value="Mobil">Mobil</option>
            <option value="Unnamed">Unnamed Stations</option>
          </select>
        </div>

        {selectedStation && (
          <div className="bg-gray-100 rounded p-3 text-sm text-gray-700 space-y-1">
            <div><strong>ID:</strong> {selectedStation.id}</div>
            <div><strong>Name:</strong> {selectedStation.tags.name || "Unnamed Station"}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="regular"
            placeholder="Regular ($)"
            value={formData.regular}
            onChange={handleFormChange}
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            name="premium"
            placeholder="Premium ($)"
            value={formData.premium}
            onChange={handleFormChange}
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            name="diesel"
            placeholder="Diesel ($)"
            value={formData.diesel}
            onChange={handleFormChange}
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <div>
            <label className="block font-medium mb-1">Rating:</label>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map(num => (
                <button
                  type="button"
                  key={num}
                  onClick={() => handleRatingChange(num)}
                  className={`w-10 h-10 rounded-full text-lg font-bold ${
                    formData.rating === num
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedStation}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              selectedStation
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </form>
      </div>

      <div className="w-full lg:w-1/2 h-[500px] rounded-lg overflow-hidden">
        <MapContainer
          center={[location.lat, location.lon]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <RecenterMap lat={location.lat} lon={location.lon} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {stations
            .filter(station => {
              const name = (station.tags.name || "").toLowerCase();
              if (brandFilter === "All") return true;
              if (brandFilter === "Unnamed") return !station.tags.name;
              return name.includes(brandFilter.toLowerCase());
            })
            .map((station) => {
              const offsetLat = station.lat + Math.random() * 0.00005 - 0.000025;
              const offsetLon = station.lon + Math.random() * 0.00005 - 0.000025;
              return (
                <Marker
                  key={station.id}
                  position={[offsetLat, offsetLon]}
                  eventHandlers={{
                    click: () => setSelectedStation(station),
                  }}
                >
                  <Popup>
                    {station.tags.name || "Unnamed Station"}<br />
                    ID: {station.id}
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          color={toastColor}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default Getter;
