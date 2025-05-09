"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface GasStation {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    [key: string]: unknown;
  };
}

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationComponent = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasLocated, setHasLocated] = useState(false);

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
        setCoords({ lat: latitude, lng: longitude });
        setHasLocated(true);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "User-Agent": "fuel-finder (jlee1392@ucr.edu)",
              },
            }
          );

          const data = await response.json();
          setAddress(data.display_name || "Address not found");
        } catch (err) {
          console.error("Error during reverse geocoding", err);
          setAddress("Failed to retrieve address");
        }

        try {
          const overpassQuery = `
            [out:json];
            node["amenity"="fuel"](around:5000, ${latitude}, ${longitude});
            out body;
          `;
          const overpassResponse = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `data=${encodeURIComponent(overpassQuery)}`,
          });
          const overpassData = await overpassResponse.json();
          setGasStations(overpassData.elements || []);
        } catch (err) {
          console.error("Error during Overpass API request", err);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Failed to get location.");
        setLoading(false);
      }
    );
  };

  const gasPrices: Record<string, string> = {
    Chevron: "$5.00/Regular*",
    Shell: "$5.10/Regular*",
    Mobil: "$4.75/Regular*",
    ARCO: "$4.46/Regular*",
    "76": "$4.90/Regular*",
    Arco: "$4.40/Regular*",
  };

  return (
    <div className="w-full min-h-screen bg-[var(--background)] text-black flex flex-col items-center justify-center px-4 py-10">
      {!hasLocated ? (
        <div className="flex flex-col items-center justify-center text-center space-y-6 mt-20">
          <h1 className="text-4xl font-bold text-[#0f4c81]">Fuel Finder Map</h1>
          <button
            onClick={getLocation}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white text-lg rounded-full hover:bg-blue-600 transition"
          >
            {loading ? "Locating..." : "Get Location"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      ) : (
        <>
          {location && <p className="text-sm mb-1">Your coordinates: {location}</p>}
          {address && <p className="text-sm mb-4">Approximate address: {address}</p>}

          {coords && (
            <MapContainer center={coords} zoom={13} style={{ width: "75%", height: "400px" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={coords} icon={redIcon}>
                <Popup>Your location</Popup>
              </Marker>

              {gasStations.map((station, index) => (
                <Marker key={index} position={[station.lat, station.lon]}>
                  <Popup>
                    {station.tags.name || "Unnamed Gas Station"}
                    <br />
                    {gasPrices[station.tags.name || "Unnamed Gas Station"] || "N/A"}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </>
      )}
    </div>
  );
};

export default LocationComponent;
