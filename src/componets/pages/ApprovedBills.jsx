import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth"; // Ensure this is correctly implemented
import { CustomTable } from "../Ui/CustomTable"; // Ensure this component exists
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApprovedBills = ({ isNavbarCollapsed }) => {
  const marginClass = isNavbarCollapsed ? "ml-16" : "ml-30"; // Adjusted margin for consistency

  // State declarations
  const [data, setData] = useState([]);
  const [rawData, setRawData] = useState([]); // Added missing rawData state
  const [filteredData, setFilteredData] = useState([]);
  const [modalData, setModalData] = useState([]); // Separate state for modal data
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Changed to null for better error handling
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chlnVendorCode, setChlnVendorCode] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const token = getToken();

  // Group data by ANNEXURE_NO
  const groupDataByAnnexure = (rawData) => {
    if (!Array.isArray(rawData)) return [];

    const grouped = rawData.reduce((acc, item) => {
      const annexureNo = item.ANNEXURE_NO || "Unknown"; // Fallback for missing ANNEXURE_NO
      if (!acc[annexureNo]) {
        acc[annexureNo] = {
          ANNEXURE_NO: annexureNo,
          VENDOR_CODE: item.VENDOR_CODE, 
          RNUM: item.RNUM || 0,
          items: [],
        };
      }
      acc[annexureNo].TOTAL_AMOUNT += parseFloat(item.TOTAL_AMOUNT || 0);
      acc[annexureNo].items.push({
        ...item,
        ANNEXURE_NO: annexureNo,
 
      });
      return acc;
    }, {});

    return Object.values(grouped).map((group, index) => ({
      ...group,
      RNUM: index + 1, // Assign row number
    }));
  };

  // Fetch annexure details from API
  const fetchAnnexureDetails = async () => {
    setLoading(true);
    setError(null);


    try {
      const response = await axios.get(
        "http://localhost:3001/api/getApprovedBill",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          payload: {
            page,
            limit,
            searchValue: search 
          },
        }
      );

      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error("Invalid response format from API");
      }

      if (response.data.data.length === 0) {
        setError("No data found for the selected criteria.");
        setData([]);
        setFilteredData([]);
        setRawData([]);
        setTotalRows(0);
        toast.info("No data found for the selected criteria.");
      } else {
        const groupedData = groupDataByAnnexure(response.data.data);
        setRawData(response.data.data);
        setData(groupedData);
        setFilteredData(groupedData);
        setTotalRows(response.data.totalRecords || groupedData.length);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      let errorMessage = "An error occurred while fetching data.";
      if (error.response?.status === 403) {
        errorMessage = "Session expired. Please log in again.";
        toast.error(errorMessage);
        window.location.href = "/login";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
      setData([]);
      setFilteredData([]);
      setRawData([]);
      setTotalRows(0);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when dependencies change
  useEffect(() => {
    fetchAnnexureDetails();
  }, [page, limit, fromDate, toDate, chlnVendorCode]);

  // Filter data based on search input
  useEffect(() => {
    const result = data.filter(
      (item) =>
        item.ANNEXURE_NO?.toString().toLowerCase().includes(search.toLowerCase()) 
        || item.VENDOR_CODE?.toString().toLowerCase().includes(search.toLowerCase())
       
    );
    setFilteredData(result);
  }, [search, data]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newLimit, newPage) => {
    setLimit(newLimit);
    setPage(newPage);
  };

  // Table columns for main table
  const columns = [
    {
      name: "Row No",
      selector: (row) => row.RNUM,
      sortable: true,
      wrap: true,
      width: "100px",
    },
    {
      name: "Annexure No.",
      selector: (row) => row.ANNEXURE_NO || "-",
      sortable: true,
      wrap: true,
    },
    {
        name: "Vendor Code.",
        selector: (row) => row.VENDOR_CODE || "-",
        sortable: true,
        wrap: true,
      },

  ];

  // Columns for modal table
  const modalColumns = [
    {
      name: "LR No.",
      selector: (row) => row.CN_NO || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Updated Weight",
      selector: (row) => row.BRANCH_WEIGHT || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Updated Locations",
      selector: (row) => row.BRANCH_LOCATIONS || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Updated Floor",
      selector: (row) => row.BRANCH_FLOOR || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Updated Item Description",
      selector: (row) => row.BRANCH_ITEM_DESCRIPTION || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Updated KM",
      selector: (row) => row.BRANCH_KM || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Updated Latitude",
      selector: (row) => row.BRANCH_LATITUDE || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Updated Longitude",
      selector: (row) => row.BRANCH_LONGITUDE || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Updated Remarks",
      selector: (row) => row.BRANCH_REMARKS || "-",
      sortable: true,
      wrap: true,
    },
    {
        name: "Updated Crane",
        selector: (row) => row.BRANCH_CRANE || "-",
        sortable: true,
        wrap: true,
      },
      {
        name: "Updated Hydra",
        selector: (row) => row.BRANCH_HYDRA || "-",
        sortable: true,
        wrap: true,
      },
      {
        name: "Updated Chain Pulling",
        selector: (row) => row.BRANCH_CHAIN_PULLING || "-",
        sortable: true,
        wrap: true,
      },
      {
        name: "Updated HKM",
        selector: (row) => row.BRANCH_HKM || "-",
        sortable: true,
        wrap: true,
      },
      {
        name: "Updated Labour Expenses",
        selector: (row) => row.BRANCH_LABOUR_EXPENSES || "-",
        sortable: true,
        wrap: true,
      },
      {
        name: "Updates Other Expenses",
        selector: (row) => row.BRANCH_SPECIAL_VEHICLE || "-",
        sortable: true,
        wrap: true,
      },
      {
        name: "Updates Special Vehicle",
        selector: (row) => row.BRANCH_SPECIAL_VEHICLE || "-",
        sortable: true,
        wrap: true,
      },
      
  ];

  const rowPerPageOptions = [20, 50, 100, 200, 500, 1000, 5000, 10000];

  // Handle row click to open modal
  const handleRowClick = (row) => {
    setModalData(row.items || []);
    setModalOpen(true);
  };

  // Close modal and reset modal data
  const handleModalClose = () => {
    setModalOpen(false);
    setModalData([]);
  };

  return (
    <div
      className={`bg-gray-50 py-3 px-6 ${marginClass} transition-all duration-300 min-h-screen`}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      {/* Filter Inputs */}
      <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-8xl mx-auto">

        <div className="col-span-1 space-y-2 md:flex items-end pb-1 gap-2 w-full">
          <div className="w-[70%]">
            <label
              htmlFor="search"
              className="whitespace-nowrap block text-xs font-medium text-gray-700 mb-1"
            >
              Search by Annex No or Vendor Code
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by Annex No or Vendor Code"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={fetchAnnexureDetails}
              className="whitespace-nowrap px-4 w-full py-2 bg-[#01588E] text-white rounded-lg font-semibold hover:bg-[#014a73] transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center text-blue-600 text-lg">Loading...</div>
      )}
      {error && (
        <div className="text-center text-red-600 text-lg">{error}</div>
      )}

      {/* Main Table */}
      {!loading && !error && data.length > 0 && (
        <CustomTable
          handleRowClick={handleRowClick}
          page={page}
          columns={columns}
          data={filteredData}
          totalRows={totalRows}
          limit={limit}
          rowPerPageOptions={rowPerPageOptions}
          handlePageChange={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
          filteredData={filteredData}
        />
      )}

      {/* Modal for Detailed View */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <div
            className="bg-white rounded-lg overflow-hidden w-full m-2 max-w-5xl max-h-[80vh] overflow-y-auto shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
      <div className="flex justify-end items-center p-2 ">
  <button
    onClick={handleModalClose}
    className="text-gray-600 hover:text-gray-800 focus:outline-none"
  >
    ✕
  </button>
</div>

            <div className="p-4">
              <DataTable
                columns={modalColumns}
                data={modalData}
                pagination
                paginationServer
                paginationTotalRows={modalData.length}
                paginationPerPage={limit}
                paginationDefaultPage={page}
                paginationRowsPerPageOptions={rowPerPageOptions}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleRowsPerPageChange}
                highlightOnHover
                responsive
                customStyles={{
                  headRow: {
                    style: {
                      fontSize: "13px",
                      backgroundColor: "#f9fafb",
                    },
                  },
                  cells: {
                    style: {
                      fontSize: "12px",
                    },
                  },
                }}
                fixedHeader
                fixedHeaderScrollHeight="60vh"
                noDataComponent={<div className="text-center p-4">No details available</div>}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedBills;