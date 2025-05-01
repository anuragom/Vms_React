

// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { MoreVertical } from 'lucide-react';
// const roleBasedMenuItems = {
//   "ADMIN": [
//     "dashboard", 
//     "vendor-details", 
//     "cn-without-challan",  
//     "cn-details",
//     "bill-status", 
//     "pending-bill-generation", 
//     "bill-delete", 
//     "pod-report", 
//     "cn-reports", 
//     "user-management", 
//     "user-log",
  
//   ],
//   "VENDOR": [
//     "dashboard", 
//     "lr-details",
//     "bill-generate-using-exel-upload", 
//     "bill-status",  
//     "bill-noc", 
//     "pending-bill-generation",
//     "reports",
    
//   ],
//   "BRANCH": [
//     "dashboard", 
//     "lr-details",
//     "upload-lr-detail" ,
//     "bill-status"
//   ],
//   "CORDINATOR": [
//     "dashboard", 
//     "assigned-vendor", 
//     "verify-expaness-of-cn",
//     "bill-status", 
//     "cn-reports",
   
//   ],
//   "BILL VERIFY": [
//     "dashboard", 
//     "assigned-vendor",
//     "verify-bill-for-posting", 
//     "bill-status", 
//     "cn-reports"
//   ],
//   "ACCOUNTS": [
//     "dashboard", 
//     "posting-bill", 
//     "bill-status", 
   
//   ],
//   "AUDIT": [
//     "dashboard", 
//     "posted-bill", 
//     "bill-status",
//     "pending-bill-generation"
//   ]
// };
// const Navbar = ({ items, isCollapsed }) => {
//   const userRole = sessionStorage.getItem("userRole") || "VENDOR"; // Default role if none found
//   const allowedMenuIds = roleBasedMenuItems[userRole] || [];

//   return (
//     <nav className={`
//       bg-[#01588E] border-r border-gray-200  
//       h-[calc(100vh-4rem)] sticky top-16
//       transition-all duration-300 ease-in-out   
//       ${isCollapsed ? 'w-16' : 'w-58'}
//     `}>
//       <div className="flex flex-col gap-1 p-2 overflow-y-auto h-full custom-scrollbar">
//         {items.filter(item => allowedMenuIds.includes(item.id)).map((item) => {
//           const Icon = item.icon;
//           return (
//             <NavLink
//               key={item.id}
//               to={item.path}
//               className={({ isActive }) => `
//                 flex items-center gap-3 px-4 py-3 rounded-lg
//                 transition-colors duration-200
//                 ${isActive 
//                   ? 'bg-blue-100 text-blue-900' 
//                   : 'text-white hover:bg-gray-100 hover:text-blue-900'
//                 }
//                 ${isCollapsed ? 'justify-center' : ''}
//               `}
//             >
//               <Icon className="w-5 h-5 flex-shrink-0" />
//               {!isCollapsed && (
//                 <span className="font-lato whitespace-nowrap text-sm">{item.label}</span>
//               )}
//             </NavLink>
//           );
//         })}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import React from "react";
// import { NavLink } from "react-router-dom";
// import { MoreVertical } from "lucide-react";

// const roleBasedMenuItems = {
//   ADMIN: [
//     "dashboard", "vendor-details", "cn-without-challan", "cn-details", "bill-status",
//     "pending-bill-generation", "bill-delete", "pod-report", "cn-reports", "user-management", "user-log",
//   ],
//   VENDOR: [
//     "dashboard", "lr-details", "bill-generate-using-exel-upload", "bill-status", "bill-noc",
//     "pending-bill-generation", "reports",
//   ],
//   BRANCH: ["dashboard", "lr-details", "upload-lr-detail", "bill-status"],
//   CORDINATOR: ["dashboard", "assigned-vendor", "verify-expaness-of-cn", "bill-status", "cn-reports"],
//   "BILL VERIFY": ["dashboard", "assigned-vendor", "verify-bill-for-posting", "bill-status", "cn-reports"],
//   ACCOUNTS: ["dashboard", "posting-bill", "bill-status"],
//   AUDIT: ["dashboard", "posted-bill", "bill-status", "pending-bill-generation"],
// };

// const Navbar = ({ items, isCollapsed }) => {
//   const userRole = sessionStorage.getItem("userRole") || "VENDOR";
//   const allowedMenuIds = roleBasedMenuItems[userRole] || [];

//   return (
//     <nav
//       className={`bg-[#01588E] border-r border-gray-200 h-full transition-all duration-300 ease-in-out
//         ${isCollapsed ? "w-16" : "w-64"}`}
//     >
//       <div className="flex flex-col gap-1 p-2 overflow-y-auto h-full scrollbar-visible">
//         {items.filter((item) => allowedMenuIds.includes(item.id)).map((item) => {
//           const Icon = item.icon;
//           return (
//             <NavLink
//               key={item.id}
//               to={item.path}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
//                 ${isActive ? "bg-blue-100 text-blue-900" : "text-white hover:bg-gray-100 hover:text-blue-900"}
//                 ${isCollapsed ? "justify-center" : ""}`
//               }
//             >
//               <Icon className="w-5 h-5 flex-shrink-0" />
//               {!isCollapsed && (
//                 <span className="font-lato whitespace-nowrap text-sm">{item.label}</span>
//               )}
//             </NavLink>
//           );
//         })}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { NavLink } from "react-router-dom";
import { MoreVertical } from "lucide-react";

const roleBasedMenuItems = {
  ADMIN: [
    "dashboard", "vendor-details", "cn-without-challan", "cn-details", "bill-status",
    "pending-bill-generation", "bill-delete", "pod-report", "cn-reports", "user-management", "user-log",
  ],
  VENDOR: [
    "dashboard", "lr-details", "bill-generate-using-exel-upload", "bill-status", "bill-noc",
    "pending-bill-generation", "reports",
  ],
  BRANCH: ["dashboard", "lr-details", "upload-lr-detail", "bill-status"],
  CORDINATOR: ["dashboard", "assigned-vendor", "verify-expaness-of-cn", "bill-status", "cn-reports"],
  "BILL VERIFY": ["dashboard", "assigned-vendor", "verify-bill-for-posting", "bill-status", "cn-reports"],
  ACCOUNTS: ["dashboard", "posting-bill", "bill-status"],
  AUDIT: ["dashboard", "posted-bill", "bill-status", "pending-bill-generation"],
};

const Navbar = ({ items, isCollapsed }) => {
  const userRole = sessionStorage.getItem("userRole") || "VENDOR";
  const allowedMenuIds = roleBasedMenuItems[userRole] || [];

  return (
    <nav
      className={`bg-[#01588E] transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-16" : "w-72"} h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar`}
    >
      <div className="flex flex-col gap-1 p-2">
        {items.filter((item) => allowedMenuIds.includes(item.id)).map((item) => {
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
      </div>
    </nav>
  );
};

export default Navbar;