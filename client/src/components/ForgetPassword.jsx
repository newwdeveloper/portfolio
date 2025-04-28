import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(30); // Track timer for OTP resend
  const [isResendEnabled, setIsResendEnabled] = useState(false); // Track resend button state
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  // Get token from localStorage (or wherever it is stored)
  const token = localStorage.getItem("token");

  // Handle OTP resend logic
  useEffect(() => {
    let interval;

    if (timer > 0 && step === 1) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setIsResendEnabled(true); // Enable resend button
      setTimer(30); // Reset timer for next OTP request
    }

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [timer, step]);

  // Step 1: Handle sending OTP
  const handleSubmitEmail = async (e) => {
    e.preventDefault();

    setLoading(true); // Start loading when the email submission begins

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in headers
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      setLoading(false); // Stop loading when the response is received

      if (response.ok) {
        setMessage("OTP sent to your email. Please check your inbox.");
        setStep(2);
        setIsResendEnabled(false); // Disable resend button after OTP is sent
        setTimer(30); // Reset timer for 30 seconds
      } else {
        setError(
          data.error || "Failed to send OTP. Please check your email address."
        );
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setLoading(false); // Stop loading on error
      setError("Network error: Unable to send OTP. Please try again later.");
    }
  };

  // Step 2: Handle OTP verification and password update
  const handleSubmitOtpAndPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in headers
          },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Password updated successfully!");
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        navigate("/login");
      } else {
        setError(data.error || "Failed to reset password. Please try again.");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError(
        "Network error: Unable to reset password. Please try again later."
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {step === 1 ? "Forgot Password" : "Reset Your Password"}
      </h2>

      {/* Step 1: Request email for OTP */}
      {step === 1 && (
        <form onSubmit={handleSubmitEmail} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-4 h-4 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
              <span className="text-sm">Sending OTP...</span>
            </div>
          )}

          <button
            type="submit"
            className={`w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            Get OTP
          </button>

          {/* Resend OTP button */}
          {isResendEnabled && !loading && (
            <button
              type="button"
              onClick={handleSubmitEmail}
              className="w-full p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none mt-4"
            >
              Resend OTP
            </button>
          )}

          {!isResendEnabled && !loading && (
            <p className="text-sm text-gray-600 mt-2">
              Please wait {timer} seconds to resend OTP.
            </p>
          )}
        </form>
      )}

      {/* Step 2: Enter OTP and new password */}
      {step === 2 && (
        <form onSubmit={handleSubmitOtpAndPassword} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
