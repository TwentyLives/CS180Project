'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Fuel, PaintBucket, ArrowRightLeft, CarFront } from 'lucide-react';
import Image from 'next/image';
import Card from './Card';
import VehicleImage from './VehicleImage';
import VehicleInfo from './VehicleInfo';
import ImageCard from './ImageCard';
import UserTitle from './UserTitle';
import LogRefuelModal from './LogRefuel';
import Toast from './Toast';

interface GarageVehicle {
  id: string;
  make: string;
  model: string;
  type: 'Sedan' | 'SUV' | 'Van';
  year: string;
  trim: string;
  fuelType: string;
  tankCapacity: string;
  mpg: string;
  currentMiles: string;
  fuelSide: string;
}

interface RefuelLog {
  id: string;
  vehicle: string;
  date: string;
  gas_type: string;
  gallons: number;
  cost: number;
  odometer: number;
  created_at: string;
}

export default function GaragePage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<GarageVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<GarageVehicle | null>(null);
  const [refuelLogs, setRefuelLogs] = useState<RefuelLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [showRefuelModal, setShowRefuelModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  const selectVehicle = (v: GarageVehicle) => {
    if (v.id === selectedVehicle?.id) return;
    setIsChanging(true);
    setTimeout(() => {
      setSelectedVehicle(v);
      setIsChanging(false);
      setIsOpen(false);
    }, 800);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      setOpenUpward(windowHeight - rect.bottom < 200);
    }
  }, [isOpen]);

  useEffect(() => {
    // Helper to get token from cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const token = getCookie("token");
    fetch("http://127.0.0.1:8000/api/vehicles/", {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Token ${token}` } : {}),
      },
    })
      .then(res => res.json())
      .then(data => {
        // Map backend fields to frontend camelCase
        const mapped = data.map((v: any) => ({
          id: v.id,
          make: v.make,
          model: v.model,
          type: v.type,
          year: String(v.year),
          trim: v.trim,
          fuelType: v.fuel_type,
          tankCapacity: String(v.tank_capacity),
          mpg: String(v.mpg),
          currentMiles: String(v.current_miles),
          fuelSide: v.fuel_side,
        }));
        setVehicles(mapped);
        if (mapped.length > 0) setSelectedVehicle(mapped[0]);
      });
  }, []);

  useEffect(() => {
    if (!selectedVehicle) return;
    fetch(`http://127.0.0.1:8000/api/refuel/${selectedVehicle.id}/`, {
      headers: { "Content-Type": "application/json" },
      // remove credentials: "include" if using token auth!
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRefuelLogs(data);
        } else {
          setRefuelLogs([]); // fallback if API returns error object
        }
      });
  }, [selectedVehicle]);

  const mpg = calculateAverageMPG(selectedVehicle?.id);
  const cost = calculateMonthlyCost(selectedVehicle?.id);
  const previousMPG = 27.2;
  const trendArrow = mpg ? getTrendArrow(mpg, previousMPG) : '–';
  const consumption = getConsumptionLabel(mpg || parseFloat(selectedVehicle?.mpg ?? "0"));
  const mpgHistory = generateMPGHistory(selectedVehicle?.id);
  const totalMiles = calculateTotalMiles(selectedVehicle?.id);
  const mostDrivenCarId = findMostDrivenCarId();

  const handleLogRefuel = async (data: { gasType: string; gallons: number; cost: number }) => {
    if (!selectedVehicle) return;
    const payload = {
      gas_type: data.gasType,
      gallons: data.gallons,
      cost: data.cost,
      date: new Date().toISOString().slice(0, 10),
      odometer: Number(selectedVehicle.currentMiles),
    };
    const res = await fetch(
      `http://127.0.0.1:8000/api/refuel/${selectedVehicle.id}/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      }
    );
    if (res.ok) {
      setToastMessage("Refuel logged successfully ✅");
      const logs = await fetch(
        `http://127.0.0.1:8000/api/refuel/${selectedVehicle.id}/`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      ).then(r => r.json());
      setRefuelLogs(logs);
    } else {
      setToastMessage("Failed to log refuel.");
    }
  };

  function calculateAverageMPG(carId: string | undefined): number | null {
    if (!carId) return null;
    const logs = refuelLogs.filter((log) => log.vehicle === carId);
    if (logs.length < 2) return null;

    const sorted = logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let totalMiles = 0;
    let totalGallons = 0;

    for (let i = 1; i < sorted.length; i++) {
      const miles = sorted[i].odometer - sorted[i - 1].odometer;
      totalMiles += miles;
      totalGallons += sorted[i].gallons;
    }
    return parseFloat((totalMiles / totalGallons).toFixed(1));
  }

  function calculateTotalMiles(carId: string | undefined): number {
    if (!carId) return 0;
    const logs = refuelLogs.filter((log) => log.vehicle === carId);
    if (logs.length < 2) return 0;
    const sorted = logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted[sorted.length - 1].odometer - sorted[0].odometer;
  }

  function findMostDrivenCarId(): string {
    if (!Array.isArray(vehicles) || vehicles.length === 0) return '';
    if (vehicles.length === 1) return vehicles[0].id;

    let maxMiles = -1;
    let mostDrivenId = '';
    for (const v of vehicles) {
      const miles = calculateTotalMiles(v.id);
      if (miles > maxMiles) {
        maxMiles = miles;
        mostDrivenId = v.id;
      }
    }
    return mostDrivenId;
  }

  function generateMPGHistory(carId: string | undefined) {
    if (!carId) return [];
    const logs = refuelLogs.filter((log) => log.vehicle === carId);
    const sorted = logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const history: { date: string; mpg: number }[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const mpg = (sorted[i].odometer - sorted[i - 1].odometer) / sorted[i].gallons;
      history.push({ date: sorted[i].date.slice(5), mpg: parseFloat(mpg.toFixed(1)) });
    }
    return history;
  }

  function calculateMonthlyCost(carId: string | undefined): number {
    if (!carId) return 0;
    const logs = refuelLogs.filter((log) => log.vehicle === carId);
    const currentMonth = new Date().getMonth();
    const thisMonthLogs = logs.filter((log) => new Date(log.date).getMonth() === currentMonth);
    return thisMonthLogs.reduce((sum, log) => sum + log.cost, 0);
  }

  function getTrendArrow(current: number, previous: number) {
    if (current > previous) return '📉';
    if (current < previous) return '📈';
    return '➖';
  }

  function getConsumptionLabel(mpg: number) {
    if (mpg < 19) return { color: 'bg-red-500', text: 'Gas guzzler zone 🔥' };
    if (mpg <= 30) return { color: 'bg-yellow-400', text: 'Normal driving pattern 🚗' };
    return { color: 'bg-green-500', text: 'Fuel efficient warrior 🍃' };
  }

  if (!vehicles.length) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-lg font-medium text-gray-700">
          You have no vehicles yet.
        </div>
        <button
          onClick={() => router.push('/garage/add')}
          className="px-6 py-3 bg-[#0f4c81] text-white rounded-full shadow-md hover:brightness-110 hover:scale-105 active:scale-95 transition"
        >
          Let's add your first vehicle
        </button>
      </main>
    );
  }

  if (!selectedVehicle) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="relative font-['IBM_Plex_Sans'] bg-gradient-to-br from-[#f2f5f2] via-[#e0e8e0] to-[#d8e8d8] text-black min-h-screen p-6 space-y-6 overflow-hidden">
      <div className="flex justify-between items-center z-10 relative">
        <UserTitle />
        <div className="flex items-center space-x-4">
          <div ref={dropdownRef} className="relative">
            <button
              ref={buttonRef}
              onClick={toggleDropdown}
              className="flex items-center font-regular px-4 py-1.5 bg-gradient-to-br from-[#e4ebe4] via-[#dbe3db] to-[#cfd8cf] text-gray-700 rounded-full shadow-inner hover:brightness-105 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Garage</span>
              <ChevronDown
                className={`ml-2 w-5 h-5 transform transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`absolute right-0 ${
                openUpward ? 'bottom-full mb-2' : 'mt-2'
              } w-52 bg-white/40 backdrop-blur-md rounded-2xl shadow-lg z-20 transition-all duration-300 ease-in-out ${
                isOpen
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
              }`}
            >
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  onClick={() => selectVehicle(v)}
                  className={`px-4 py-3 text-base flex justify-between items-center rounded-lg cursor-pointer hover:backdrop-brightness-110 hover:text-gray-800 hover:shadow-md active:scale-95 active:brightness-110 transition ${
                    selectedVehicle.id === v.id
                      ? 'font-bold text-black'
                      : 'text-gray-700'
                  }`}
                >
                  <span>
                    {v.make} {v.model}
                    {vehicles.length === 1 || v.id === mostDrivenCarId
                      ? ' ⭐'
                      : ''}
                  </span>
                  {selectedVehicle.id === v.id && <span>🚗</span>}
                </div>
              ))}
            </div>
          </div>

          <div ref={profileRef} className="relative">
            <div
              onClick={toggleProfileMenu}
              className="w-11 h-11 bg-gradient-to-br from-[#e4ebe4] via-[#dbe3db] to-[#cfd8cf] rounded-full flex items-center justify-center shadow-inner hover:brightness-105 hover:scale-105 active:scale-95 transition-all"
            >
              <Image
                src="/images/user_profile.png"
                alt="Profile"
                width={44}
                height={44}
                className="object-cover"
              />
            </div>
            <div
              className={`absolute right-0 mt-2 w-44 bg-white/40 backdrop-blur-md rounded-2xl p-2 shadow-lg z-20 transition-all duration-300 ${
                profileMenuOpen
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
              }`}
            >
              <div
                onClick={() => router.push('/garage/add')}
                className="px-4 py-3 text-base font-medium rounded-lg cursor-pointer hover:backdrop-brightness-110 hover:text-gray-800 hover:shadow-md active:scale-95 active:brightness-110 transition"
              >
                Add Vehicle
              </div>
              <div className="px-4 py-3 text-base font-medium rounded-lg cursor-pointer hover:backdrop-brightness-110 hover:text-gray-800 hover:shadow-md active:scale-95 active:brightness-110 transition">
                Settings
              </div>
              <div className="px-4 py-3 text-base font-medium rounded-lg cursor-pointer hover:backdrop-brightness-110 hover:text-gray-800 hover:shadow-md active:scale-95 active:brightness-110 transition">
                Help
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`grid grid-cols-2 gap-6 items-center mt-12 transform-gpu transition-all duration-700 ease-in-out ${
          isChanging ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="animate-gentle-floating">
            <VehicleImage type={selectedVehicle.type} />
          </div>
          <VehicleInfo
            make={selectedVehicle.make}
            model={selectedVehicle.model}
            year={selectedVehicle.year}
            trim={selectedVehicle.trim}
          />
          <button
            className="bg-[#0f4c81] text-white px-6 py-3 rounded-full text-base font-medium shadow-md hover:brightness-110 hover:scale-105 active:scale-95 transition-all"
            onClick={() => setShowRefuelModal(true)}
          >
            Log Refuel +
          </button>
        </div>
        <div className="flex flex-col items-start gap-2 animate-fade-in-float">
          <div className="text-md text-gray-600">TOTAL MILES</div>
          <div className="text-2xl font-bold text-black">{totalMiles} mi</div>
          <div className="text-md text-gray-600">DRIVING STYLE</div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${consumption.color}`} />
            <span className="text-2xl font-bold text-black">{consumption.text}</span>
          </div>
          <div className="text-md text-gray-600">AVG MPG (7d)</div>
          <div className="text-2xl font-bold text-black">
            {mpg ?? 'N/A'} <span>{trendArrow}</span>
          </div>
          <div className="text-md text-gray-600">MONTHLY COST</div>
          <div className="text-2xl font-bold text-black">${cost.toFixed(2)}</div>
        </div>
      </div>

      <div
        className={`grid grid-cols-2 gap-4 mt-8 transform-gpu transition-all duration-700 ease-in-out ${
          isChanging ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
        } animate-fade-in-float`}
      >
        <Card title="Fuel Type" status={selectedVehicle.fuelType} icon={<Fuel />} />
        <Card title="Fuel Side" status={selectedVehicle.fuelSide} icon={<ArrowRightLeft />} />
        <Card title="Tank Size" status={selectedVehicle.tankCapacity} icon={<PaintBucket />} />
        <Card title="MPG" status={`${selectedVehicle.mpg} mpg`} icon={<CarFront />} />
      </div>

      <div
        className={`mt-6 transform-gpu transition-all duration-700 ease-in-out ${
          isChanging ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
        }`}
      >
        <ImageCard />
      </div>

      <LogRefuelModal
        isOpen={showRefuelModal}
        onClose={() => setShowRefuelModal(false)}
        onSubmit={handleLogRefuel}
      />
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </main>
  );
}