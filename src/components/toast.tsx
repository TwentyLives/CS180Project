import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  color?: "red" | "green";
  duration?: number; //3000ms
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, color = "red", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-3 rounded-md shadow-md text-white font-semibold z-50 ${
        color === "green" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
