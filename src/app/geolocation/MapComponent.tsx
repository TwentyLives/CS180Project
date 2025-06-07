"use client";
import { useState, useEffect } from "react";
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

  // Function to get current location
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

        // Overpass API to fetch nearby gas stations
        try {
          const overpassQuery = `
            [out:json];
            node["amenity"="fuel"](around:25000, ${latitude}, ${longitude});
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
          const stations = overpassData.elements || [];

          setGasStations(stations);
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
    // Only fetch if not already fetched
    if (!stationPrices[station.id]) {
      const prices = await fetchStationPrices(station.id);
      setStationPrices(prev => ({
        ...prev,
        [station.id]: prices,
      }));
    }
  };

  return (
    <div>
      <button
        onClick={getLocation}
        disabled={loading}
        className="px-4 py-2 bg-blue-200 text-black rounded-lg"
        style={{ marginBottom: "0.5rem" }}
      >
        {loading ? "Locating..." : "Get Location"}
      </button>

      {location && <p>Your coordinates: {location}</p>}
      {address && (
        <>
          <p>Approximate address: {address}</p>
          <div style={{ marginBottom: "2rem" }} />
        </>
      )}

      {coords && (
        <MapContainer
          center={coords}
          zoom={13}
          style={{ width: "100%", height: "400px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={coords} icon={redIcon}>
            <Popup>Your location</Popup>
          </Marker>

          {/* Render markers for gas stations */}
          {gasStations.map((station, index) => {
            const stationName = station.tags.name || "Unnamed Gas Station";
            const prices = stationPrices[station.id];

            return (
              <Marker
                key={index}
                position={[station.lat, station.lon]}
                eventHandlers={{
                  click: () => handleMarkerClick(station),
                }}
              >
                <Popup>
                  <strong>{stationName}</strong><br />
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
      )}
    </div>
  );
};

export default LocationComponent;
