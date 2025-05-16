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

  const gasPrices: Record<string, Record<string, string>> = {
    "Chevron": {
      Regular: "$4.90",
      Midgrade: "$5.10",
      Premium: "$5.40",
      Diesel: "$4.70"
    },
    "Shell": {
      Regular: "$5.20",
      Midgrade: "$5.40*",
      Premium: "$5.60*"
    },
    "Mobil": {
      Regular: "$5.00",
      Midgrade: "$5.20",
      Premium: "$5.40",
      Diesel: "$4.66"
    },
    "ARCO": {
      Regular: "$4.80",
      Midgrade: "$5.00*",
      Premium: "$5.10*"
    },
    "76": {
      Regular: "$4.80",
      Midgrade: "$4.90*",
      Premium: "$5.00*"
    },
    "Arco": {
      Regular: "$4.64",
      Midgrade: "$4.66",
      Premium: "$4.86",
      Diesel: "$5.00"
    },
    "Speedway Gas": {
      Regular: "$4.90",
      Midgrade: "$5.10",
      Premium: "$5.30",
    },
    "Flyers": {
      Regular: "$4.70",
      Diesel: "$4.80*"
    },
    "Downs Energy": {
      Regular: "$4.70",
      Diesel: "$4.69"
    },
    "Kwik Serv": {
      Regular: "$4.45",
    },
    "7-Eleven": {
      Regular: "$5.09",
      Midgrade: "$5.29",
      Premium: "$5.49",
    },
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

          {/* Gas station markers */}
          {gasStations.map((station, index) => (
          <Marker key={index} position={[station.lat, station.lon]}>
            <Popup>
              <strong>{station.tags.name || "Unnamed Gas Station"}</strong><br />
              {Object.entries(gasPrices[station.tags.name || "Unnamed Gas Station"] || {}).map(
                ([type, price]) => (
                  <div key={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}: {price}
                  </div>
                )
              )}
            </Popup>
          </Marker>
        ))}
        </MapContainer>
      )}
    </div>
  );
};

export default LocationComponent;
