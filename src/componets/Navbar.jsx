

// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { MoreVertical } from 'lucide-react';

// const Navbar = ({ items, isCollapsed }) => {
//   return (
//     <nav className={`
//       bg-[#01588E] border-r border-gray-200  
//       h-[calc(100vh-4rem)] sticky top-16
//       transition-all duration-300 ease-in-out   
//       ${isCollapsed ? 'w-16' : 'w-56'}
//     `}>
//       <div className="flex flex-col gap-1 p-2 overflow-y-auto h-full custom-scrollbar">
//         {items.map((item) => {
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

import React from 'react';
import { NavLink } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';

// const roleBasedMenuItems = {
//   "ADMIN": [
//     "dashboard", 
//     "vendor-details", 
//     "cn-without-challan", 
//     "cn-details", 
//     "bill-status", 
//     "lr-details", // Added
//     "pending-bill-generation", 
//     "bill-delete", 
//     "pod-report", 
//     "cn-reports", 
//     "user-management", 
//     "user-log", 
//     "bill-generate-using-exel-upload", // Added
//     "reports", // Added
//     "bill-noc", // Added
//     "assigned-vendor", // Added
//     "posted-bill", // Added
//     "posting-bill"  // Added
//   ],
//   "BRANCH": ["dashboard", "vendor-details"],
//   "BILL VERIFY": ["dashboard", "cn-details", "pod-report", "cn-reports"],
//   "ACCOUNTS": ["dashboard", "bill-status", "pod-report", "cn-reports", "bill-generate-using-exel-upload", "posted-bill", "posting-bill"],
//   "AUDIT": ["dashboard", "lr-details", "pending-bill-generation", "bill-delete", "user-log", "reports"],
//   "VENDOR": ["dashboard", "assigned-vendor"],
//   "CORDINATOR": ["dashboard", "cn-reports"]
// };
const roleBasedMenuItems = {
  "ADMIN": [
    "dashboard", 
    "vendor-details", 
    "cn-without-challan", 
    "lr-details", 
    "cn-details", 
    "bill-status", 
    "bill-generate-using-exel-upload", 
    "bill-noc", 
    "pending-bill-generation", 
    "bill-delete", 
    "pod-report", 
    "cn-reports", 
    "user-management", 
    "user-log",
    "verify-expaness-of-cn"
  ],
  "VENDOR": [
    "dashboard", 
    "lr-details", 
    "bill-status", 
    "bill-generate-using-exel-upload", 
    "bill-noc", 
    "pending-bill-generation"
  ],
  "BRANCH": [
    "dashboard", 
    "lr-details", 
    "bill-status"
  ],
  "CORDINATOR": [
    "dashboard", 
    "assigned-vendor", 
    "bill-status", 
    "cn-reports",
    "verify-expaness-of-cn"
  ],
  "BILL VERIFY": [
    "dashboard", 
    "assigned-vendor", 
    "bill-status", 
    "cn-reports"
  ],
  "ACCOUNTS": [
    "dashboard", 
    "posting-bill", 
    "bill-status", 
    "pending-bill-generation"
  ],
  "AUDIT": [
    "dashboard", 
    "posted-bill", 
    "bill-status",
    "pending-bill-generation"
  ]
};


const Navbar = ({ items, isCollapsed }) => {
  const userRole = sessionStorage.getItem("userRole") || "VENDOR"; // Default role if none found
  const allowedMenuIds = roleBasedMenuItems[userRole] || [];

  return (
    <nav className={`
      bg-[#01588E] border-r border-gray-200  
      h-[calc(100vh-4rem)] sticky top-16
      transition-all duration-300 ease-in-out   
      ${isCollapsed ? 'w-16' : 'w-56'}
    `}>
      <div className="flex flex-col gap-1 p-2 overflow-y-auto h-full custom-scrollbar">
        {items.filter(item => allowedMenuIds.includes(item.id)).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-white hover:bg-gray-100 hover:text-blue-900'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
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
