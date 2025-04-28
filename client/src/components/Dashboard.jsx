function Dashboard({ darkMode, user }) {
  if (!user) {
    return (
      <div
        className="p-4 rounded-lg shadow"
        style={{ backgroundColor: `var(--bg-dashboard-card)` }}
      >
        <p>Please log in</p>
      </div>
    );
  }

  return (
    <div className="p-4" style={{ backgroundColor: `var(--bg-dashboard)` }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dashboard - {user.firstName}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="p-4 rounded-lg shadow"
          style={{ backgroundColor: `var(--bg-dashboard-card)` }}
        >
          <h3 className="text-lg font-semibold">Portfolio Value</h3>
          <p>₹0</p>
        </div>
        <div
          className="p-4 rounded-lg shadow"
          style={{ backgroundColor: `var(--bg-dashboard-card)` }}
        >
          <h3 className="text-lg font-semibold">Total Investment</h3>
          <p>₹0</p>
        </div>
        <div
          className="p-4 rounded-lg shadow"
          style={{ backgroundColor: `var(--bg-dashboard-card)` }}
        >
          <h3 className="text-lg font-semibold">Total Profit</h3>
          <p>0%</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
