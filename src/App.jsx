
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
import LrDetails from "./componets/pages/LrDetails";
import BillGenerateUsingExlUpload from "./componets/pages/BillGenerateUsingExlUpload";
import Reports from "./componets/pages/Reports";
import BillNoc from "./componets/pages/BillNoc";
import AssignedVendor from "./componets/pages/AssignedVendor";
// import PostingBill from "./componets/pages/postingBill";
import VerifyExpansesofCN from "./componets/pages/VerifyExpansesofCN";
// import PostedBill from "./componets/pages/PostedBill";

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
          <Route path="/lr-details" element={<ProtectedRoute element={<LrDetails />} />} />
          <Route path="/bill-generate-using-exel-upload" element={<ProtectedRoute element={<BillGenerateUsingExlUpload />} />} />
          <Route path="/reports" element={<ProtectedRoute element={<Reports />} />} />
          <Route path="/bill-noc" element={<ProtectedRoute element={<BillNoc />} />} />
          <Route path="/assigned-vendor" element={<ProtectedRoute element={< AssignedVendor/>} />} />
          {/* <Route path="/posted-bill" element={<ProtectedRoute element={<PostedBill/>} />} />
          <Route path="/posting-bill" element={<ProtectedRoute element={<PostingBill />} />} /> */}
          <Route path="/verify-expance-of-cn" element={<ProtectedRoute element={<VerifyExpansesofCN />} />} />
          

          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
