

// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

// import { menuItems } from "./data/menuItems";
// import Dashboard from "./componets/pages/Dashboard";
// import Login from "./Auth/Login";
// import Header from "./componets/Header";
// import Navbar from "./componets/Navbar";
// import VendorDetails from "./componets/pages/VendorDetails";
// import CnWithoutChallan from "./componets/pages/CnWithoutChallan";
// import CnDetails from "./componets/pages/CnDetails";
// import BillStatus from "./componets/pages/BillStatus";
// import PendingBillGeneration from "./componets/pages/PendingBillGeneration";
// import BillDelete from "./componets/pages/BillDelete";
// import PodReport from "./componets/pages/PodReport";
// import CnReports from "./componets/pages/CnReports";
// import UserManageement from "./componets/pages/UserManageement";
// import UserLog from "./componets/pages/UserLog";

// // Layout Component
// const Layout = ({ children, isNavbarCollapsed, toggleNavbar }) => {
//   const location = useLocation();
//   const isLoginPage = location.pathname === "/login"; // Check if login page

//   return (
//     <div className={`min-h-screen bg-gray-50 ${isLoginPage ? "" : "mt-20"}`}> 
//       {!isLoginPage && <Header onToggleNavbar={toggleNavbar} menuItems={menuItems} />}  
//       <div className="flex">
//         {!isLoginPage && <Navbar items={menuItems} isCollapsed={isNavbarCollapsed} />}  
//         <main className="flex-1">{children}</main>
//       </div>
//     </div>
//   );
// };

// function App() {
//   const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

//   return (
//     <Router>
//       <Layout 
//         isNavbarCollapsed={isNavbarCollapsed} 
//         toggleNavbar={() => setIsNavbarCollapsed(!isNavbarCollapsed)}
//       >
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/vendor-details" element={<VendorDetails />} />
//           <Route path="/cn-without-challan" element={<CnWithoutChallan />} />
//           <Route path="/cn-details" element={<CnDetails />} />
//           <Route path="/bill-status" element={<BillStatus />} />
//           <Route path="/pending-bill-generation" element={<PendingBillGeneration />} />
//           <Route path="/bill-delete" element={<BillDelete />} />
//           <Route path="/pod-report" element={<PodReport />} />
//           <Route path="/cn-reports" element={<CnReports />} />
//           <Route path="/user-management" element={<UserManageement />} />
//           <Route path="/user-log" element={<UserLog />} />
//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;


// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import { menuItems } from "./data/menuItems";
import Dashboard from "./componets/pages/Dashboard";
import Login from "./Auth/Login";
import Header from "./componets/Header";
import Navbar from "./componets/Navbar";
import VendorDetails from "./componets/pages/VendorDetails";
import CnWithoutChallan from "./componets/pages/CnWithoutChallan";
import CnDetails from "./componets/pages/CnDetails";
import BillStatus from "./componets/pages/BillStatus";
import PendingBillGeneration from "./componets/pages/PendingBillGeneration";
import BillDelete from "./componets/pages/BillDelete";
import PodReport from "./componets/pages/PodReport";
import CnReports from "./componets/pages/CnReports";
import UserManageement from "./componets/pages/UserManageement";
import UserLog from "./componets/pages/UserLog";

import ProtectedRoute from "./Routes/ProtectedRoute"; // Import ProtectedRoute

// Layout Component
const Layout = ({ children, isNavbarCollapsed, toggleNavbar }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; // Check if login page

  return (
    <div className={`min-h-screen bg-gray-50 ${isLoginPage ? "" : "mt-20"}`}> 
      {!isLoginPage && <Header onToggleNavbar={toggleNavbar} menuItems={menuItems} />}  
      <div className="flex">
        {!isLoginPage && <Navbar items={menuItems} isCollapsed={isNavbarCollapsed} />}  
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

function App() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  return (
    <Router>
      <Layout 
        isNavbarCollapsed={isNavbarCollapsed} 
        toggleNavbar={() => setIsNavbarCollapsed(!isNavbarCollapsed)}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/vendor-details" element={<ProtectedRoute element={<VendorDetails />} />} />
          <Route path="/cn-without-challan" element={<ProtectedRoute element={<CnWithoutChallan />} />} />
          <Route path="/cn-details" element={<ProtectedRoute element={<CnDetails />} />} />
          <Route path="/bill-status" element={<ProtectedRoute element={<BillStatus />} />} />
          <Route path="/pending-bill-generation" element={<ProtectedRoute element={<PendingBillGeneration />} />} />
          <Route path="/bill-delete" element={<ProtectedRoute element={<BillDelete />} />} />
          <Route path="/pod-report" element={<ProtectedRoute element={<PodReport />} />} />
          <Route path="/cn-reports" element={<ProtectedRoute element={<CnReports />} />} />
          <Route path="/user-management" element={<ProtectedRoute element={<UserManageement />} />} />
          <Route path="/user-log" element={<ProtectedRoute element={<UserLog />} />} />

          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
