'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Fuel, PaintBucket, ArrowRightLeft, CarFront } from 'lucide-react';
import Image from 'next/image';
import Card from './Card';
import VehicleImage from './VehicleImage';
import VehicleInfo from './VehicleInfo';
import ImageCard from './ImageCard';
import UserTitle from './UserTitle';
import LogRefuelModal from './LogRefuel';
import Toast from './Toast'


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
  fuelSide: string;
}

const vehicles: GarageVehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    type: 'Sedan',
    year: '2018',
    trim: 'XLE',
    fuelType: 'Premium',
    tankCapacity: '15.9 gal',
    mpg: '28',
    fuelSide: 'Left',
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    type: 'SUV',
    year: '2020',
    trim: 'EX-L',
    fuelType: 'Regular',
    tankCapacity: '14.0 gal',
    mpg: '30',
    fuelSide: 'Right',
  },
  {
    id: '3',
    make: 'Ford',
    model: 'Transit',
    type: 'Van',
    year: '2021',
    trim: 'XLT',
    fuelType: 'Diesel',
    tankCapacity: '25.0 gal',
    mpg: '20',
    fuelSide: 'Left',
  },
];

export default function GaragePage() {
  const [selectedVehicle, setSelectedVehicle] = useState<GarageVehicle>(vehicles[0]);
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
    if (v.id === selectedVehicle.id) return;
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

  return (
    <main className="relative font-['IBM_Plex_Sans'] bg-gradient-to-br from-[#f2f5f2] via-[#e0e8e0] to-[#d8e8d8] text-black min-h-screen p-6 space-y-6 overflow-hidden">
      
      {/* Loading Mask + Spinner */}
      {isChanging && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm z-30 transition-all duration-300">
          <div className="w-14 h-14 rounded-full border-4 border-gray-400 border-t-white animate-spin bg-gradient-to-br from-white/80 via-white/40 to-white/10" />
          <p className="mt-4 text-gray-300 text-sm">Switching Vehicle...</p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center z-10 relative">
      <UserTitle username="User"/>
      {/* <UserTitle username={user?.name || "Guest"} /> FOR FUTURE DATABASE*/}
      <div className="flex items-center space-x-4">
          {/* Garage Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              ref={buttonRef}
              onClick={toggleDropdown}
              className="flex items-center font-regular px-4 py-1.5 bg-gradient-to-br from-[#e4ebe4] via-[#dbe3db] to-[#cfd8cf] text-gray-700 rounded-full shadow-inner hover:brightness-105 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Garage</span>
              <ChevronDown className={`ml-2 w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}/>
            </button>
              <div className={`absolute right-0 ${openUpward ? 'bottom-full mb-2' : 'mt-2'} w-52 bg-white/40 backdrop-blur-md rounded-2xl shadow-lg z-20 transition-all duration-300 ease-in-out ${
              isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
            }`}>
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  onClick={() => selectVehicle(v)}
                  className="px-4 py-3 text-base flex justify-between items-center rounded-lg cursor-pointer hover:backdrop-brightness-110 hover:text-gray-800 hover:shadow-md active:scale-95 active:brightness-110 transition"
                >
                  <span>{v.make} {v.model}</span>
                  {selectedVehicle.id === v.id && <span>🚗</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <div
              onClick={toggleProfileMenu}
              className="w-11 h-11 bg-gradient-to-br from-[#e4ebe4] via-[#dbe3db] to-[#cfd8cf] rounded-full flex items-center justify-center shadow-inner hover:brightness-105 hover:scale-105 active:scale-95 transition-all"
            >
              <Image src="/images/user_profile.png" alt="Profile" width={44} height={44} className="object-cover" />
            </div>
            <div className={`absolute right-0 mt-2 w-44 bg-white/40 backdrop-blur-md rounded-2xl p-2 shadow-lg z-20 transition-all duration-300 ${
              profileMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
            }`}>
              <div className="px-4 py-3 text-base font-medium rounded-lg cursor-pointer hover:backdrop-brightness-110 hover:text-gray-800 hover:shadow-md active:scale-95 active:brightness-110 transition">
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

      {/* Main Content with Fade */}
      <div className={`transition-opacity duration-700 ${isChanging ? 'opacity-0' : 'opacity-100'}`}>
        <div className="mt-12 animate-fade-in-float">
          <div className="animate-gentle-floating">
            <VehicleImage type={selectedVehicle.type} />
          </div>
        </div>
        <VehicleInfo
          make={selectedVehicle.make}
          model={selectedVehicle.model}
          year={selectedVehicle.year}
          trim={selectedVehicle.trim}
        />
        <div className="flex justify-center mt-4">
          <button
            className="bg-[#0f4c81] text-white px-6 py-3 rounded-full text-base font-medium shadow-md hover:brightness-110 hover:scale-105 active:scale-95 transition-all"
            onClick={() => setShowRefuelModal(true)}
          >
            Log Refuel +
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8 fade-in">
          <Card title="Fuel Type" status={selectedVehicle.fuelType} icon={<Fuel />} />
          <Card title="Fuel Side" status={selectedVehicle.fuelSide} icon={<ArrowRightLeft />} />
          <Card title="Tank Size" status={selectedVehicle.tankCapacity} icon={<PaintBucket />} />
          <Card title="MPG" status={`${selectedVehicle.mpg} mpg`} icon={<CarFront />} />
        </div>
        <div className="mt-6">
          <ImageCard />
        </div>

        <LogRefuelModal
          isOpen={showRefuelModal}
          onClose={() => setShowRefuelModal(false)}
          onSubmit={(data) => {
            console.log("Refuel data submitted for car:", selectedVehicle.id);
            console.log(data);
            setToastMessage("Refuel logged successfully ✅");


            // TODO for backend send:
            // fetch('/api/log-refuel', {
            //   method: 'POST',
            //   body: JSON.stringify({ carId: selectedVehicle.id, ...data }),
            // });
          }}
        />
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
      </div>

    </main>
  );
}