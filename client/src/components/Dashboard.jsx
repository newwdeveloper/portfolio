import { useUser } from "@clerk/clerk-react";

function Dashboard({ darkMode }) {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <div
        className={`p-4 ${darkMode ? "text-gray-300" : "text-gray-700"} ${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow`}
      >
        Please log in
      </div>
    );
  }

  return (
    <div
      className={`p-4 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`} // Match App's screen background
    >
      <div className="flex justify-between items-center mb-4">
        <h2
          className={`text-2xl font-bold ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Dashboard - {user.firstName}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-lg shadow ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
          }`}
        >
          <h3 className="text-lg font-semibold">Portfolio Value</h3>
          <p>₹0</p>
        </div>
        <div
          className={`p-4 rounded-lg shadow ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
          }`}
        >
          <h3 className="text-lg font-semibold">Total Investment</h3>
          <p>₹0</p>
        </div>
        <div
          className={`p-4 rounded-lg shadow ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
          }`}
        >
          <h3 className="text-lg font-semibold">Total Profit</h3>
          <p>0%</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
