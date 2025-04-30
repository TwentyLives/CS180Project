import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white/40 backdrop-blur-md border-t border-gray-200 text-[#171717] font-sans">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center text-sm">
        <div className="flex flex-wrap justify-center gap-6 text-center text-gray-700 font-medium">
          <p>Email: <a href="mailto:fuelfinder@gmail.com" className="hover:underline">FuelFinder@gmail.com</a></p>
          <p>Phone: <a href="tel:+19518271012" className="hover:underline">(951) 827-1012</a></p>
          <p>Address: 900 University Ave, Riverside, CA 92521</p>
        </div>
        <div className="mt-4 text-gray-500 text-xs text-center">
          <p>&copy; {new Date().getFullYear()} Fuel Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
