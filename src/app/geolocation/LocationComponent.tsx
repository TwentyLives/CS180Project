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

          if (!response.ok) {
            throw new Error("Failed to fetch address");
          }

          const data = await response.json();
          setAddress(data.display_name || "Address not found");
        } catch (err) {
          console.error("Error during reverse geocoding", err);
          setAddress("Failed to retrieve address");
        }

        // Query for nearby gas stations using Overpass API
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
      (error) => {
        console.error("Error getting location: ", error);
        setError("Failed to get location.");
        setLoading(false);
      }
    );
  };
  const gasPrices: Record<string, string> = {
    "Chevron": "$5.00/Regular*",
    "Shell": "$5.10/Regular*",
    "Mobil": "$4.75/Regular*",
    "ARCO": "$4.46/Regular*",
    "76": "$4.90/Regular*",
    "Arco": "$4.40/Regular*",
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

          {/* Markers for nearby gas stations */}
          {gasStations.map((station: any, index) => (
            // <Marker key={index} position={[station.lat, station.lon]}>
            //   <Popup>{station.tags.name || "Unnamed Gas Station"}</Popup>
            // </Marker>
            <Marker key={index} position={[station.lat, station.lon]}>
              <Popup>
                {station.tags.name || "Unnamed Gas Station"}<br />
                {gasPrices[station.tags.name || "Unnamed Gas Station"] || "N/A"}
              </Popup>
            </Marker>
            
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default LocationComponent;
