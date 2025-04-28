import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // If no token is present, redirect to the login page
  if (!token) {
    return <Navigate to="/signin" />;
  }

  // If token exists, render the children routes
  return <Outlet />;
};

export default ProtectedRoute;
