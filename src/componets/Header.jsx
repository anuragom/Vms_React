


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearUser, getUser } from "../Auth/auth"; // Import clearUser and getUser

const Header = ({ onToggleNavbar, isNavbarCollapsed, menuItems = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  // Get current page name
  const currentPage =
    menuItems.find((item) => item.path === location.pathname)?.label ||
    "Dashboard";

  // Fetch user data when component loads
  useEffect(() => {
    const user = getUser();
    if (user) {
      setUsername(user.USER_USER_ID || "Admin"); // Default to "Admin" if no name found
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    clearUser(); // Clear session and memory
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#01588E] px-4 py-3 z-50 shadow-lg">
      <div className="max-w-[2000px] mx-auto flex items-center justify-between">
        {/* Left Side: Logo + Sidebar Toggle Button */}
        <div className="flex items-center gap-3">
          <img
            src="/image/logo.png"
            alt="logo"
            className="h-14 w-32 rounded-lg"
          />

          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleNavbar}
            className="p-2 rounded-lg transition-colors"
          >
            <div
              data-svg-wrapper
              className={`relative transform transition-transform duration-300 ease-in-out translate-y-5 ${
                isNavbarCollapsed ? "rotate-180" : "rotate-0"
              }`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6H13"
                  stroke="white"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 12H11"
                  stroke="white"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 18H13"
                  stroke="white"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 8L4 12L8 16"
                  stroke="white"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Center: Page Title */}
        <h1 className="text-xl md:text-xl font-bold text-white">{currentPage}</h1>

        {/* Right Side: Username and Logout Button */}
        <div className="flex items-center gap-4">
          {/* Display Username */}
          <span className="text-white text-sm sm:text-base font-semibold">
            {username}
          </span>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-white hover:bg-black hover:text-white font-semibold text-black px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
