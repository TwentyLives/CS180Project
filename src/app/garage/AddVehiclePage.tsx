'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const keys = [
  'make',
  'model',
  'year',
  'trim',
  'tankCapacity',
  'mpg',
  'currentMiles',
] as const;

type Key = typeof keys[number];

type FormDataType = {
  [K in Key]: string;
} & {
  type: 'Sedan' | 'SUV' | 'Van';
  fuelType: 'Regular' | 'Premium' | 'Diesel';
  fuelSide: 'Left' | 'Right';
};

export default function AddVehiclePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormDataType>({
    make: '',
    model: '',
    type: 'Sedan',
    year: '',
    trim: '',
    fuelType: 'Regular',
    tankCapacity: '',
    mpg: '',
    fuelSide: 'Left',
    currentMiles: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'year': {
        const year = Number(value);
        if (!/^[0-9]{4}$/.test(value) || year < 1800 || year > 2025) {
          return 'Year must be 4 digits and between 1800 and 2025';
        }
        break;
      }
      case 'tankCapacity': {
        const val = Number(value);
        if (isNaN(val) || val < 0.1 || val > 99.9) {
          return 'Tank Capacity must be 0.1–99.9';
        }
        break;
      }
      case 'mpg': {
        const val = Number(value);
        if (isNaN(val) || val <= 1) {
          return 'MPG must be greater than 1';
        }
        break;
      }
      case 'currentMiles': {
        const val = Number(value);
        if (isNaN(val) || val <= 1) {
          return 'Miles must be greater than 1';
        }
        break;
      }
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof FormDataType, string>> = {};

    (Object.keys(formData) as (keyof FormDataType)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare payload (convert numeric fields)
    const payload = {
      ...formData,
      year: Number(formData.year),
      tank_capacity: Number(formData.tankCapacity),
      mpg: Number(formData.mpg),
      current_miles: Number(formData.currentMiles),
      fuel_type: formData.fuelType,
      fuel_side: formData.fuelSide,
      type: formData.type,
      trim: formData.trim,
      make: formData.make,
      model: formData.model,
    };

    try {
      // Helper to get token from cookie
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const token = getCookie("token");
      const res = await fetch("http://127.0.0.1:8000/api/vehicles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Token ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMessage('✅ Add Vehicle Successfully!');
        setShowSuccess(true);
        setFormData({
          make: '',
          model: '',
          type: 'Sedan',
          year: '',
          trim: '',
          fuelType: 'Regular',
          tankCapacity: '',
          mpg: '',
          fuelSide: 'Left',
          currentMiles: '',
        });

        setTimeout(() => {
          setShowSuccess(false);
          router.push('/garage');
          router.refresh(); // Ensures the garage page fetches the latest vehicles
        }, 1200);
      } else {
        const errorData = await res.json();
        setErrors({ make: errorData.detail || "Failed to add vehicle." });
      }
    } catch (err) {
      setErrors({ make: "Network error. Please try again." });
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f2f5f2] via-[#e0e8e0] to-[#d8e8d8] p-6 font-['IBM_Plex_Sans'] animate-fade-in-float">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Vehicle</h1>
      {successMessage && (
        <p
          className={`mb-4 text-green-600 font-medium text-lg transition-opacity duration-700 ${showSuccess ? 'opacity-100' : 'opacity-0'}`}
        >
          {successMessage}
        </p>
      )}
      <div className="w-full max-w-4xl rounded-3xl bg-white/50 shadow-2xl backdrop-blur-md p-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {keys.map((key) => (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="mb-1 text-sm font-medium text-gray-700">
                {key.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}
              </label>
              <input
                type="text"
                id={key}
                name={key}
                placeholder={`e.g. ${
                  key === 'year' ? '2018' :
                  key === 'tankCapacity' ? '15.9' :
                  key === 'mpg' ? '30' :
                  key === 'currentMiles' ? '12000' :
                  key === 'make' ? 'Toyota' :
                  key === 'model' ? 'Camry' :
                  key === 'trim' ? 'XLE' :
                  ''}`}
                value={formData[key]}
                onChange={handleChange}
                className={`p-3 rounded-xl shadow-inner bg-white border focus:outline-none focus:ring-2 focus:ring-[#0f4c81] backdrop-blur-md ${errors[key] ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors[key] && <span className="text-red-500 text-sm mt-1">{errors[key]}</span>}
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="type" className="mb-1 text-sm font-medium text-gray-700">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="p-3 rounded-xl shadow-inner bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f4c81] backdrop-blur-md"
            >
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="fuelType" className="mb-1 text-sm font-medium text-gray-700">Fuel Type</label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="p-3 rounded-xl shadow-inner bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f4c81] backdrop-blur-md"
            >
              <option value="Regular">Regular</option>
              <option value="Premium">Premium</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700">Fuel Side</span>
            <div className="flex items-center gap-4 pl-1">
              {['Left', 'Right'].map((side) => (
                <label
                  key={side}
                  className={`flex items-center px-4 py-2 border rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 ${formData.fuelSide === side ? 'bg-[#0f4c81] text-white border-[#0f4c81]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  <input
                    type="radio"
                    name="fuelSide"
                    value={side}
                    checked={formData.fuelSide === side}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {side}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="col-span-1 md:col-span-2 mt-4 bg-[#0f4c81] text-white py-3 rounded-xl font-semibold hover:brightness-110 hover:scale-105 active:scale-95 transition-all"
          >
            Save Vehicle
          </button>
        </form>
      </div>
    </main>
  );
}