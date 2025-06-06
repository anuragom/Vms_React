import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MoreVertical,
  ChevronDown,
  ChevronRight,
  FileText,
  Settings,
  ClipboardCheck,

} from "lucide-react";

const roleBasedMenuItems = {
  ADMIN: [
    "dashboard", "vendor-details", "cn-without-challan", "cn-details", "bill-status",
    "Generate-Annexure", "bill-delete", "pod-report", "cn-reports", "user-management", "user-log",
  ],
  VENDOR: [
    "dashboard", "lr-details", "bill-generate-using-exel-upload", "bill-status", "bill-noc",
     "reports", "process-billing", "posted-bill", "all-Lr", "bill-status"
  ],
  BRANCH: [
    "dashboard", "lr-details", "upload-lr-detail", "bill-status", "process-billing", "posted-bill", "annexure-details"
  ],
  CORDINATOR: [
    "dashboard", "assigned-vendor", "verify-expaness-of-cn", "bill-status", "cn-reports",
  ],
  "BILL VERIFY": [
    "dashboard", "assigned-vendor", "verify-bill-for-posting", "bill-status", "cn-reports",
  ],
  ACCOUNTS: [
    "dashboard", "posting-bill", "bill-status",
  ],
  AUDIT: [
    "dashboard", "posted-bill", "bill-status", "pending-bill-generation",
  ],
};

const lrBillingSubItems = [
  {
    id: "all-Lr", 
    label: "All LR",
    path: "/all-Lr",
    icon: ClipboardCheck
  },
  {
    id: "lr-details",
    label: "Complete LR",
    path: "/lr-details",
    icon: FileText,
  },
  {
    id: "process-billing",
    label: "Generate Annexure",
    path: "/Generate-Annexure",
    icon: Settings,
  },
  {
    id: "posted-bill",
    label: "Process Billing",
    path: "/posted-bill",
    icon: ClipboardCheck,
  },

  {
    id: "bill-status",
    label: "Bill Status",
    path: "/bill-status",
    icon: FileText,
  },
  {
    id: "annexure-details",
    label: "Processed Bills",
    path: "/annexure-details",
    icon: FileText,
  },
];

const Navbar = ({ items, isCollapsed }) => {
  const userRole = sessionStorage.getItem("userRole") || "VENDOR";
  const allowedMenuIds = roleBasedMenuItems[userRole] || [];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredItems = items.filter(
    (item) => allowedMenuIds.includes(item.id) && !lrBillingSubItems.find((sub) => sub.id === item.id)
  );

  const showLrBilling = lrBillingSubItems.some((item) => allowedMenuIds.includes(item.id));

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <nav
      className={`bg-[#014A73] transition-all duration-300 ease-in-out
      ${isCollapsed ? "w-16" : "w-72"} h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar`}
    >
      <div className="flex flex-col gap-1 p-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${isActive ? "bg-blue-100 text-blue-900" : "text-white hover:bg-gray-100 hover:text-blue-900"}
                ${isCollapsed ? "justify-center" : ""}`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-lato whitespace-nowrap text-sm">{item.label}</span>
              )}
            </NavLink>
          );
        })}

        {showLrBilling && (
          <div>
            <button
              onClick={toggleDropdown}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg
                ${isCollapsed ? "justify-center text-white" : "text-white hover:bg-gray-100 hover:text-blue-900"}`}
            >
              <MoreVertical className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="font-lato text-sm flex-grow">LR Billing</span>
                  {isDropdownOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </>
              )}
            </button>

            {isDropdownOpen && !isCollapsed && (
              <div className="pl-8 mt-1 flex flex-col gap-1">
                {lrBillingSubItems
                  .filter((item) => allowedMenuIds.includes(item.id))
                  .map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors duration-200
                        ${isActive ? "bg-blue-100 text-blue-900" : "text-white hover:bg-gray-100 hover:text-blue-900"}`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
