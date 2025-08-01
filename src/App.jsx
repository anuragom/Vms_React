

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { menuItems } from "./data/menuItems";
import Dashboard from "./componets/pages/Dashboard";
import Login from "./Auth/Login";
import Header from "./componets/Header";
import Navbar from "./componets/Navbar";
import VendorDetails from "./componets/pages/VendorDetails";
import CnWithoutChallan from "./componets/pages/CnWithoutChallan";
import CnDetails from "./componets/pages/CnDetails";
import BillStatus from "./componets/pages/BillStatus";
import GenerateAnnexure from "./componets/pages/GenerateAnnexure";
import BillDelete from "./componets/pages/BillDelete";
import PodReport from "./componets/pages/PodReport";
import CnReports from "./componets/pages/CnReports";
import UserManageement from "./componets/pages/UserManageement";
import UserLog from "./componets/pages/UserLog";
import ProtectedRoute from "./Routes/ProtectedRoute";
import LrDetails from "./componets/pages/LrDetails";
import BillGenerateUsingExlUpload from "./componets/pages/BillGenerateUsingExlUpload";
import Reports from "./componets/pages/Reports";
import BillNoc from "./componets/pages/BillNoc";
import AssignedVendor from "./componets/pages/AssignedVendor";
import VerifyExpansesofCN from "./componets/pages/VerifyExpansesofCN";
import PostedBill from "./componets/pages/PostedBill";
import AnnexureDetails from "./componets/pages/AnnexureDetails";
import { ToastContainer } from "react-toastify";
import AllLr from "./componets/pages/AllLrdetails";
import ApprovedBills from "./componets/pages/ApprovedBills";

// Layout Component
const Layout = ({ children, isNavbarCollapsed, toggleNavbar }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ToastContainer />
      {/* Fixed Header */}
      {!isLoginPage && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Header onToggleNavbar={toggleNavbar} menuItems={menuItems} />
        </div>
      )}

      {/* Main Layout */}
      <div className={`flex flex-1 ${!isLoginPage ? "pt-16" : ""}`}>
        {/* Fixed Navbar */}
        {!isLoginPage && (
          <div className="fixed top-14 left-0 h-40">
            <Navbar items={menuItems} isCollapsed={isNavbarCollapsed} />
          </div>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 overflow-x-auto ${
            !isLoginPage ? (isNavbarCollapsed ? "ml-16" : "ml-72") : ""
          }`}>
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsNavbarCollapsed(true);
      } else {
        setIsNavbarCollapsed(false);
      }
    };
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <Layout
        isNavbarCollapsed={isNavbarCollapsed}
        toggleNavbar={() => setIsNavbarCollapsed(!isNavbarCollapsed)}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/vendor-details"
            element={<ProtectedRoute element={<VendorDetails />} />}
          />
          <Route
            path="/cn-without-challan"
            element={<ProtectedRoute element={<CnWithoutChallan />} />}
          />
          <Route
            path="/cn-details"
            element={<ProtectedRoute element={<CnDetails />} />}
          />
          <Route
            path="/bill-status"
            element={<ProtectedRoute element={<BillStatus />} />}
          />

          <Route
            path="/annexure-details"
            element={<ProtectedRoute element={<AnnexureDetails />} />}
          />
          <Route
            path="/Generate-annexure"
            element={<ProtectedRoute element={<GenerateAnnexure />} />}
          />
          <Route
            path="/bill-delete"
            element={<ProtectedRoute element={<BillDelete />} />}
          />
          <Route
            path="/pod-report"
            element={<ProtectedRoute element={<PodReport />} />}
          />
          <Route
            path="/cn-reports"
            element={<ProtectedRoute element={<CnReports />} />}
          />
          <Route
            path="/user-management"
            element={<ProtectedRoute element={<UserManageement />} />}
          />
          <Route
            path="/user-log"
            element={<ProtectedRoute element={<UserLog />} />}
          />
          <Route
            path="/lr-details"
            element={<ProtectedRoute element={<LrDetails />} />}
          />
          <Route
            path="/posted-bill"
            element={<ProtectedRoute element={<PostedBill />} />}
          />
          <Route
            path="/branch-verified"
            element={<ProtectedRoute element={<ApprovedBills />} />}
          />

          <Route
            path="/posted-bill"
            element={<ProtectedRoute element={<PostedBill />} />}
          />
          <Route
            path="/all-Lr"
            element={<ProtectedRoute element={<AllLr />} />}
          />

          <Route
            path="/bill-generate-using-exel-upload"
            element={
              <ProtectedRoute element={<BillGenerateUsingExlUpload />} />
            }
          />
          <Route
            path="/reports"
            element={<ProtectedRoute element={<Reports />} />}
          />
          <Route
            path="/bill-noc"
            element={<ProtectedRoute element={<BillNoc />} />}
          />

          <Route
            path="/assigned-vendor"
            element={<ProtectedRoute element={<AssignedVendor />} />}
          />

          <Route
            path="/verify-expance-of-cn"
            element={<ProtectedRoute element={<VerifyExpansesofCN />} />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
