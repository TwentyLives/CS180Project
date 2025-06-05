"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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
  const [gasStations, setGasStations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stationPrices, setStationPrices] = useState<{ [id: number]: any }>({});

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

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "User-Agent": "fuel-finder (jlee1392@ucr.edu)",
              },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch address");

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
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
      (error) => {
        console.error("Error getting location: ", error);
        setError("Failed to get location.");
        setLoading(false);
      }
    );
  };

  const fetchStationPrices = async (stationId: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/station-prices/${stationId}/`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const handleMarkerClick = async (station: any) => {
    const selectedStation = {
      name: station.tags.name || "Unnamed Gas Station",
      address: station.tags["addr:full"] || station.tags["addr:street"] || undefined,
      lat: station.lat,
      lon: station.lon,
    };
    sessionStorage.setItem("selectedStation", JSON.stringify(selectedStation));

    if (!stationPrices[station.id]) {
      const prices = await fetchStationPrices(station.id);
      setStationPrices(prev => ({
        ...prev,
        [station.id]: prices,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-start px-4 py-10">
      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-md space-y-6 text-center">
        <h2 className="text-2xl font-bold text-[#0f4c81]">Stations Near Me</h2>

        <button
          onClick={getLocation}
          disabled={loading}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
        >
          {loading ? "Locating..." : "Get Location"}
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {location && <p className="text-gray-700">📍 {location}</p>}
        {address && <p className="text-gray-500 italic">🗺️ {address}</p>}

        {!coords && (
          <p className="text-sm text-gray-400">
            Click the button above to find gas stations around your current location.
          </p>
        )}
      </div>

      {coords && (
        <div className="w-full max-w-5xl mt-10 rounded-xl overflow-hidden shadow-md">
          <MapContainer center={coords} zoom={13} style={{ width: "100%", height: "500px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={coords} icon={redIcon}>
              <Popup>Your location</Popup>
            </Marker>

            {gasStations.map((station, index) => {
              const stationName = station.tags.name || "Unnamed Gas Station";
              const prices = stationPrices[station.id];

              return (
                <Marker
                  key={index}
                  position={[station.lat, station.lon]}
                  eventHandlers={{ click: () => handleMarkerClick(station) }}
                >
                  <Popup>
                    <strong>{stationName}</strong>
                    <div>
                      {prices ? (
                        <>
                          {prices.regular !== undefined && <div>Regular: {prices.regular}</div>}
                          {prices.premium !== undefined && <div>Premium: {prices.premium}</div>}
                          {prices.diesel !== undefined && <div>Diesel: {prices.diesel}</div>}
                          {prices.rating !== undefined && <div>Rating: {prices.rating}</div>}
                          {(!prices.regular && !prices.premium && !prices.diesel) && <div>No price data</div>}
                        </>
                      ) : (
                        <div>Click marker to load prices</div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default LocationComponent;
