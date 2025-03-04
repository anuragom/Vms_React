import React from "react";

const Dashboard = ({ isNavbarCollapsed }) => {
  // Adjust margin based on Navbar collapse state
  const marginClass = isNavbarCollapsed ? "" : "";

  return (
    <div
      className={`h-[29rem] bg-gradient-to-br from-[#01588E] to-[#E6F0FA] p-6 ${marginClass} transition-all duration-300 flex flex-col items-center justify-center`}
    >
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
        VMS Dashboard
      </h1>
      <h1 className="text-3xl md:text-4xl font-semibold text-white/90 drop-shadow-md animate-pulse">
        Coming Soon
      </h1>
    </div>
  );
};

export default Dashboard;