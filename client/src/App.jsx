import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgetPassword";
import Dashboard from "./components/Dashboard";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleSignIn = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <Router>
      <div className="min-h-screen">
        {/* Header */}
        <header className="shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-center md:text-left">
              📊 Stock Portfolio Tracker
            </h1>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button
                onClick={handleModeToggle}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
              >
                {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
              </button>
              {!user ? (
                <>
                  <Link to="/login">
                    <button className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-300 cursor-pointer">
                      Sign Up
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <span>
                    Welcome,{" "}
                    <span className="font-semibold">{user.userName}</span>
                  </span>
                  {/*
                  <button
                    onClick={() => console.log("Token: sample-token")}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                  >
                    Show My Token
                  </button>
                  */}
                  <button
                    onClick={handleSignOut}
                    className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-300 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-xl shadow-lg">
            {user ? (
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                  📈 Portfolio Overview
                </h2>
                <p>Your tracked stocks will appear here.</p>
              </div>
            ) : (
              <p className="text-center text-lg">
                Please sign in to view your portfolio.
              </p>
            )}
          </div>
        </main>

        {/* Routes */}
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Dashboard user={user} darkMode={darkMode} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={<SignIn setUser={handleSignIn} darkMode={darkMode} />}
          />
          <Route
            path="/register"
            element={<Register setUser={handleSignIn} darkMode={darkMode} />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword darkMode={darkMode} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
