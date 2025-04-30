


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearUser, getUser } from "../Auth/auth"; // Import clearUser and getUser
import { AlignCenter, AlignJustify, AlignLeft, LogOut } from 'lucide-react';

const Header = ({ onToggleNavbar, isNavbarCollapsed, menuItems = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

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
    <header className="bg-[#01588E] p-3 z-50 shadow-sm w-full">
      <div className="w-full mx-auto flex items-center justify-between">
        {/* Left Side: Logo + Sidebar Toggle Button */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => setIsNavbarOpen(!isNavbarOpen)}
            className="p-2 rounded-lg transition-colors"
          >
            <div
              data-svg-wrapper
              onClick={onToggleNavbar}
              className={` relative transform transition-transform duration-300 ease-in-out  ${isNavbarCollapsed ? "rotate-180" : "rotate-0"
                }`}
            >
              {/* <svg
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
              </svg> */}
              {
                isNavbarOpen ? <AlignLeft className="w-6 h-6 text-white" /> : <AlignJustify className="w-6 h-6 text-white" />
              }

            </div>
          </button>

          <div className="hidden sm:block">
            <img
              src="/image/logo.png"
              alt="logo"
              className=" h-8 w-16 sm:h-10 sm:w-24 rounded-lg"
            />
          </div>

          {/* Sidebar Toggle Button */}

        </div>

        {/* Center: Page Title */}
        <h1 className=" lg:text-2xl md:text-xl sm:text-base xs:text-xs text-white">{currentPage}</h1>

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
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
