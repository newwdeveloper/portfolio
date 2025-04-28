import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = ({ setUser }) => {
  const navigate = useNavigate(); // to programmatically navigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Fetch token from localStorage (if it exists)
  const token = localStorage.getItem("token");

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (success) {
      const successTimer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(successTimer);
    }
  }, [success]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token here for middleware protection
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setStep(2);
        setResendCooldown(30);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Something went wrong");
      console.log(error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token here for middleware protection
          },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);

        // Optionally store user info too if you have it
        const userData = { userName: data.userName || "User" }; // adjust based on your backend response
        console.log("userData", userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        navigate("/"); // redirect to dashboard
      } else {
        setError(data.error || "OTP verification failed");
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token here for middleware protection
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setError("");
        setSuccess("OTP resent successfully!");
        setResendCooldown(30);
      } else {
        setSuccess("");
        setError(data.error || "Failed to resend OTP");
      }
    } catch (error) {
      setSuccess("");
      setError("Something went wrong");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center bg-gray-100 pt-6"
      style={{ backgroundColor: `var(--bg-dashboard)` }}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
        style={{ backgroundColor: `var(--bg-dashboard)` }}
      >
        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div className="flex justify-between items-center w-full">
                <button type="submit" className="bg-green-600">
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Enter OTP
            </h2>

            {success && (
              <p className="text-green-500 text-center mb-2">{success}</p>
            )}
            {error && <p className="text-red-500 text-center mb-2">{error}</p>}

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="input"
                />
              </div>

              <button
                type="submit"
                className="btn w-full bg-green-600 cursor-pointer"
              >
                Verify OTP
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isResending}
                className={`mt-2 text-sm ${
                  resendCooldown > 0 || isResending
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:underline"
                }`}
              >
                {isResending ? (
                  <span className="animate-spin mr-2">⏳</span>
                ) : resendCooldown > 0 ? (
                  `Resend OTP in ${resendCooldown}s`
                ) : (
                  "Resend OTP"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignIn;
