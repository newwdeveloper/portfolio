// src/auth.js
import { useState, useEffect } from "react";

const API_URL = "https://localhost:5000/api/auth"; // Your backend URL

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check if there's an existing user session in localStorage or from your backend
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
      setIsSignedIn(true);
    }
  }, []);

  const signIn = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setIsSignedIn(true);
      } else {
        throw new Error("Authentication failed");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const signUp = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setIsSignedIn(true);
      } else {
        throw new Error("Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsSignedIn(false);
  };

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (token) return token;
    return null;
  };

  return {
    user,
    isSignedIn,
    signIn,
    signUp,
    signOut,
    getToken,
  };
}
