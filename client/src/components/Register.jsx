import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ setUser, darkMode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    // Check if password is at least 6 characters long
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }

    // Check if email is valid
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    return ""; // No errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run front-end validation first
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: name, email, password }),
      });

      const data = await response.json();
      console.log("data", data);

      // Check for backend errors
      if (!response.ok) {
        setError(data.error || "Something went wrong");
      } else {
        // After successful registration, save user data to localStorage
        localStorage.setItem("user", JSON.stringify(data.user)); // Assuming the backend response includes the user data
        setUser(data.user); // Update the state in App.js to reflect the new user
        navigate("/"); // Redirect to the main page (or dashboard)
      }
    } catch (error) {
      setError("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex items-start justify-center"
      style={{ backgroundColor: `var(--bg-dashboard)` }}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
        style={{ backgroundColor: `var(--bg-dashboard)` }}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name.toUpperCase()}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:text-indigo-700">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
