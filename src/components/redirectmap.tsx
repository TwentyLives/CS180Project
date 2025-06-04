"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

interface StationData {
  name: string;
  address?: string;
  lat: number;
  lon: number;
}

const StationNavigate = () => {
  const [station, setStation] = useState<StationData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("selectedStation");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setStation(parsed);
        } catch (err) {
          console.error("Failed to parse station data:", err);
          setStation(null);
        }
      }

      import("leaflet").then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      });
    }
  }, []);

  const handleGoogleMapsRedirect = () => {
    if (!station || typeof window === "undefined") return;

    const query = station.address
      ? encodeURIComponent(station.address)
      : `${station.lat},${station.lon}`;

    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-10">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-[#0f4c81]">Navigate to Gas Station</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              To get directions, please first click on a gas station from either the{" "}
              <Link href="/recommendations" className="text-blue-600 font-semibold underline hover:text-blue-800">
                Recommendations
              </Link>{" "}
              page or the{" "}
              <Link href="/stations" className="text-blue-600 font-semibold underline hover:text-blue-800">
                Stations
              </Link>{" "}
              page. Once you've selected a station, the map below will update and you can open Google Maps to navigate to it.
            </p>
          </div>

          <button
            onClick={handleGoogleMapsRedirect}
            disabled={!station}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              station ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {station ? `Navigate to ${station.name}` : "No Station Selected"}
          </button>
        </div>

        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-6 relative">
          {station ? (
            <MapContainer
              center={[station.lat, station.lon]}
              zoom={15}
              scrollWheelZoom={false}
              style={{ width: "100%", height: "300px", borderRadius: "0.5rem" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Marker position={[station.lat, station.lon]}>
                <Popup>{station.name}</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden">
              <MapContainer
                center={[34.0689, -117.3281]}
                zoom={13}
                scrollWheelZoom={false}
                className="filter blur-sm"
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
              </MapContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl text-gray-600 font-bold bg-white/80 rounded-full px-5 py-2 shadow-md">
                  ?
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationNavigate;
