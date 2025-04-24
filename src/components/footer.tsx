import React from "react";

const Footer = () => {
  return (
    <footer className="text-gray-600 py-4 mt-10 border-t">
      <div className="container mx-auto px-4 flex flex-col items-center text-sm">
        <div className="flex flex-wrap justify-center gap-6">
          <p>Email: FuelFinder@gmail.com</p>
          <p>Phone: (951) 827-1012</p>
          <p>Address: 900 University Ave, Riverside, CA 92521</p>
        </div>
        <div className="mt-3 text-center">
          <p>&copy; {new Date().getFullYear()} Fuel Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
