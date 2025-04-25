import { useEffect, useState } from "react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import Dashboard from "./components/Dashboard";

function App() {
  const { user, isSignedIn } = useUser();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleModeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
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
            <SignedOut>
              <SignInButton>
                <button className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-300 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <span>
                Welcome,{" "}
                <span className="font-semibold">{user?.firstName}</span>
              </span>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-xl shadow-lg">
          <SignedIn>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              📈 Portfolio Overview
            </h2>
            <p>Your tracked stocks will appear here.</p>
          </SignedIn>
          <SignedOut>
            <p className="text-center text-lg">
              Please sign in to view your portfolio.
            </p>
          </SignedOut>
        </div>
      </main>

      {isSignedIn && <Dashboard darkMode={darkMode} />}
    </div>
  );
}

export default App;
