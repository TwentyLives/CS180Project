"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "./toast";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastColor, setToastColor] = useState<"red" | "green">("red");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setToastMessage("Username or password is missing.");
      setToastColor("red");
      return;
    }

    try {
      // Register the user
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // After successful registration, log the user in
        const loginResponse = await fetch("http://127.0.0.1:8000/api/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          // Store credentials (e.g., token) in a cookie
          document.cookie = `token=${loginData.token}; path=/;`;

          setToastMessage("Account created and logged in successfully");
          setToastColor("green");

          setTimeout(() => {
            setToastMessage(null);
            router.push("/dashboard");
          }, 1500);
        } else {
          setToastMessage("Account created, but failed to log in.");
          setToastColor("red");
        }
      } else {
        console.error("Error:", data);
        setToastMessage("Failed to create account. Check details.");
        setToastColor("red");
      }
    } catch (error) {
      console.error("Error:", error);
      setToastMessage("Network error. Please try again.");
      setToastColor("red");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-xl bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Create
          </button>
        </form>
        <h3 className="mt-6 text-gray-800">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log In
          </a>
        </h3>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          color={toastColor}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default CreateAccount;
