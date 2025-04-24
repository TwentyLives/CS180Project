"use client";
import { useState } from "react";

const LocationComponent = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'fuel-finder (jlee1392@ucr.edu)', // required by Nominatim
              },
            }
          );

          const data = await response.json();
          setAddress(data.display_name || "Address not found");
        } catch (err) {
          console.error("Error during reverse geocoding", err);
          setAddress("Failed to retrieve address");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location: ", error);
        setLocation("Failed to get location.");
        setLoading(false);
      }
    );
  };

  return (
    <div>
      <button onClick={getLocation} disabled={loading}>
        {loading ? "Locating..." : "Get Location"}
      </button>
      {location && <p>Your coordinates: {location}</p>}
      {address && <p>Approximate address: {address}</p>}
    </div>
  );
};

export default LocationComponent;
