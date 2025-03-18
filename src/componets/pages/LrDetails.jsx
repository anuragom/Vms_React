


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DataTable from "react-data-table-component";
// import { getToken } from "../../Auth/auth";
// import { saveAs } from "file-saver";

// const LrDetails = ({ isNavbarCollapsed }) => {
//   // Adjust margin based on Navbar collapse state
//   const marginClass = isNavbarCollapsed ? "" : "";

//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState(""); // CNNO value for search
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(100);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [totalRows, setTotalRows] = useState(0);
//   const token = getToken();

//   // Function to fetch data from the API
//   const fetchLrDetailsData = async () => {
//     setLoading(true);
//     setError(false);

//     try {
//       const response = await axios.post(
//         "https://vmsnode.omlogistics.co.in/api/lrDetails",
//         {
//           page: page,
//           limit: limit,
//           FROMDATE: fromDate,
//           TODATE: toDate,
//           CNNO: search, // Include CNNO in the API request payload
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.data.length === 0) {
//         setError(true);
//       }

//       setData(response.data.data);
//       setFilteredData(response.data.data); // No client-side filtering; use API response directly
//       setTotalRows(response.data.total || response.data.data.length);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(true);
//     }

//     setLoading(false);
//   };

//   // Fetch data on component mount (default fetch)
//   useEffect(() => {
//     fetchLrDetailsData();
//   }, [page, limit]); // Fetch data when page or limit changes

//   // Handle search button click
//   const handleSearch = () => {
//     setPage(1); // Reset to first page on new search
//     fetchLrDetailsData(); // Fetch data with the current search (CNNO) value
//   };

//   const handlePageChange = (page) => {
//     setPage(page);
//   };

//   const handleRowsPerPageChange = (newLimit, page) => {
//     setLimit(newLimit);
//     setPage(page);
//   };

//   const exportToCSV = () => {
//     const csvData = filteredData.map((row) => ({
//       CN_CN_NO: row.CN_CN_NO,
//       CN_MANUAL_CN_NO: row.CN_MANUAL_CN_NO,
//       CN_CN_DATE: new Date(row.CN_CN_DATE).toLocaleDateString(),
//       CN_SOURCE_BRANCH_CODE: row.CN_SOURCE_BRANCH_CODE,
//       CN_DESTINATION_BRANCH_CODE: row.CN_DESTINATION_BRANCH_CODE,
//       CN_ITEM_DESCRIPT: row.CN_ITEM_DESCRIPT,
//       TOTAL_CN_PKG: row.TOTAL_CN_PKG,
//       TOTAL_CN_ACTUAL_WEIGHT: row.TOTAL_CN_ACTUAL_WEIGHT,
//       CHLN_VENDOR_CODE: row.CHLN_VENDOR_CODE,
//       CHLN_CHLN_NO: row.CHLN_CHLN_NO,
//       CHLN_CHLN_DATE: new Date(row.CHLN_CHLN_DATE).toLocaleDateString(),
//       CHLN_LORRY_NO: row.CHLN_LORRY_NO,
//     }));

//     const csvHeaders = [
//       "CN No",
//       "Manual CN No",
//       "CN Date",
//       "Source Branch Code",
//       "Destination Branch Code",
//       "Item Description",
//       "Total Packages",
//       "Total Weight",
//       "Challan Vendor Code",
//       "Challan No",
//       "Challan Date",
//       "Lorry No",
//     ];

//     const csv = [
//       csvHeaders.join(","),
//       ...csvData.map((row) =>
//         Object.values(row)
//           .map((value) => `"${value}"`)
//           .join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "LR_Details.csv");
//   };

//   const columns = [
//     { name: "CN No", selector: (row) => row.CN_CN_NO, sortable: true, wrap: true },
//     { name: "Manual CN No", selector: (row) => row.CN_MANUAL_CN_NO, sortable: true, wrap: true, width: "150px" },
//     { name: "CN Date", selector: (row) => new Date(row.CN_CN_DATE).toLocaleDateString(), sortable: true, wrap: true },
//     { name: "Source Branch Code", selector: (row) => row.CN_SOURCE_BRANCH_CODE, sortable: true, wrap: true, width: "170px" },
//     { name: "Destination Branch Code", selector: (row) => row.CN_DESTINATION_BRANCH_CODE, sortable: true, wrap: true, width: "190px" },
//     { name: "Item Description", selector: (row) => row.CN_ITEM_DESCRIPT, sortable: true, wrap: true, width: "150px" },
//     { name: "Total Packages", selector: (row) => row.TOTAL_CN_PKG, sortable: true, wrap: true, width: "150px" },
//     { name: "Total Weight", selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT, sortable: true, wrap: true, width: "150px" },
//     { name: "Challan Vendor Code", selector: (row) => row.CHLN_VENDOR_CODE, sortable: true, wrap: true, width: "190px" },
//     { name: "Challan No", selector: (row) => row.CHLN_CHLN_NO, sortable: true, wrap: true, width: "150px" },
//     { name: "Challan Date", selector: (row) => new Date(row.CHLN_CHLN_DATE).toLocaleDateString(), sortable: true, wrap: true, width: "170px" },
//     { name: "Lorry No", selector: (row) => row.CHLN_LORRY_NO, sortable: true, wrap: true },
//   ];

//   const rowPerPageOptions = [50, 100, 150, 200, 300, 400, 500, 1000, 2000, 5000, 10000];

//   return (
//     <div className={`min-h-screen bg-gray-50 p-6 ${marginClass} transition-all duration-300`}>
//       {/* <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 tracking-tight">
//         LR Details
//       </h1> */}

//       {/* Input Fields */}
//       <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
//         <div>
//           <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
//             From Date
//           </label>
//           <input
//             id="fromDate"
//             type="date"
//             className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
//             To Date
//           </label>
//           <input
//             id="toDate"
//             type="date"
//             className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
//             Search by CN No
//           </label>
//           <input
//             id="search"
//             type="text"
//             placeholder="Enter CN No"
//             className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Search and Export Buttons */}
//       <div className="flex flex-col sm:flex-row gap-4 mb-6 max-w-6xl mx-auto">
//         <button
//           onClick={handleSearch}
//           className="px-4 py-2 bg-[#01588E] text-white rounded-lg font-semibold hover:bg-[#014a73] transition-colors"
//         >
//           Search
//         </button>
//         <button
//           onClick={exportToCSV}
//           className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
//         >
//           Export to CSV
//         </button>
//       </div>

//       {/* Loading and Error Messages */}
//       {loading && <div className="text-center text-blue-600 text-lg">Loading...</div>}
//       {error && <div className="text-center text-red-600 text-lg">No data found</div>}

//       {/* DataTable */}
//       {!loading && !error && data.length > 0 && (
//         <div className="overflow-x-auto max-w-6xl mx-auto">
//           <DataTable
//             columns={columns}
//             data={filteredData}
//             pagination
//             paginationServer
//             paginationTotalRows={totalRows}
//             paginationPerPage={limit}
//             paginationRowsPerPageOptions={rowPerPageOptions}
//             onChangePage={handlePageChange}
//             onChangeRowsPerPage={handleRowsPerPageChange}
//             highlightOnHover
//             responsive
//             customStyles={{
//               headRow: {
//                 style: {
//                   backgroundColor: "#01588E",
//                   color: "white",
//                   fontWeight: "bold",
//                 },
//               },
//               cells: {
//                 style: {
//                   fontSize: "14px",
//                   color: "#374151", // text-gray-700
//                 },
//               },
//               rows: {
//                 style: {
//                   "&:nth-child(even)": {
//                     backgroundColor: "#f9fafb", // bg-gray-50
//                   },
//                   "&:hover": {
//                     backgroundColor: "#f3f4f6", // bg-gray-100
//                   },
//                 },
//               },
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default LrDetails;


import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { saveAs } from "file-saver";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode

const LrDetails = ({ isNavbarCollapsed }) => {
  const marginClass = isNavbarCollapsed ? "" : "";

  // State variables
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalRows, setTotalRows] = useState(0);

  // Get the token from your authentication logic
  const token = getToken();

  // Decode the token to extract the `id` field
  const decodedToken = jwtDecode(token);
  console.log("Decoded Token:", decodedToken); // Debugging: Check the decoded token
  const USER_ID = decodedToken.id; // Extract `id` from the token
  console.log("USER_ID:", USER_ID); // Debugging: Verify USER_ID is correctly extracted

  // Function to fetch data from the API
  const fetchLrDetailsData = async () => {
    setLoading(true);
    setError(false);

    try {
      // Prepare the payload for the API request
      const payload = {
        page: page,
        limit: limit,
        FROMDATE: fromDate,
        TODATE: toDate,
        CNNO: search,
        USER_ID: USER_ID, // Include USER_ID in the payload
      };

      console.log("API Payload:", payload); // Debugging: Verify the payload

      // Make the API request
      const response = await axios.post(
        "https://vmsnode.omlogistics.co.in/api/lrDetails",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Handle empty response
      if (response.data.data.length === 0) {
        setError(true);
      }

      // Update state with the fetched data
      setData(response.data.data);
      setFilteredData(response.data.data);
      setTotalRows(response.data.total || response.data.data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }

    setLoading(false);
  };

  // Fetch data on component mount or when page/limit changes
  useEffect(() => {
    fetchLrDetailsData();
  }, [page, limit]);

  // Handle search button click
  const handleSearch = () => {
    setPage(1); // Reset to the first page on new search
    fetchLrDetailsData(); // Fetch data with the current search (CNNO) value
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    setPage(page);
  };

  // Handle rows per page change for pagination
  const handleRowsPerPageChange = (newLimit, page) => {
    setLimit(newLimit);
    setPage(page);
  };

  // Export data to CSV
  const exportToCSV = () => {
    const csvData = filteredData.map((row) => ({
      CN_CN_NO: row.CN_CN_NO,
      CN_MANUAL_CN_NO: row.CN_MANUAL_CN_NO,
      CN_CN_DATE: new Date(row.CN_CN_DATE).toLocaleDateString(),
      CN_SOURCE_BRANCH_CODE: row.CN_SOURCE_BRANCH_CODE,
      CN_DESTINATION_BRANCH_CODE: row.CN_DESTINATION_BRANCH_CODE,
      CN_ITEM_DESCRIPT: row.CN_ITEM_DESCRIPT,
      TOTAL_CN_PKG: row.TOTAL_CN_PKG,
      TOTAL_CN_ACTUAL_WEIGHT: row.TOTAL_CN_ACTUAL_WEIGHT,
      CHLN_VENDOR_CODE: row.CHLN_VENDOR_CODE,
      CHLN_CHLN_NO: row.CHLN_CHLN_NO,
      CHLN_CHLN_DATE: new Date(row.CHLN_CHLN_DATE).toLocaleDateString(),
      CHLN_LORRY_NO: row.CHLN_LORRY_NO,
    }));

    const csvHeaders = [
      "CN No",
      "Manual CN No",
      "CN Date",
      "Source Branch Code",
      "Destination Branch Code",
      "Item Description",
      "Total Packages",
      "Total Weight",
      "Challan Vendor Code",
      "Challan No",
      "Challan Date",
      "Lorry No",
    ];

    const csv = [
      csvHeaders.join(","),
      ...csvData.map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "LR_Details.csv");
  };

  // Define columns for the DataTable
  const columns = [
    { name: "CN No", selector: (row) => row.CN_CN_NO, sortable: true, wrap: true ,width: "150px" },
    { name: "Manual CN No", selector: (row) => row.CN_MANUAL_CN_NO, sortable: true, wrap: true, width: "150px" },
    { name: "CN Date", selector: (row) => new Date(row.CN_CN_DATE).toLocaleDateString(), sortable: true, wrap: true ,width: "150px" },
    { name: "Source Branch Code", selector: (row) => row.CN_SOURCE_BRANCH_CODE, sortable: true, wrap: true, width: "170px" },
    { name: "Destination Branch Code", selector: (row) => row.CN_DESTINATION_BRANCH_CODE, sortable: true, wrap: true, width: "190px" },
    { name: "Item Description", selector: (row) => row.CN_ITEM_DESCRIPT, sortable: true, wrap: true, width: "150px" },
    { name: "Total Packages", selector: (row) => row.TOTAL_CN_PKG, sortable: true, wrap: true, width: "150px" },
    { name: "Total Weight", selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT, sortable: true, wrap: true, width: "150px" },
    { name: "Challan Vendor Code", selector: (row) => row.CHLN_VENDOR_CODE, sortable: true, wrap: true, width: "190px" },
    { name: "Challan No", selector: (row) => row.CHLN_CHLN_NO, sortable: true, wrap: true, width: "150px" },
    { name: "Challan Date", selector: (row) => new Date(row.CHLN_CHLN_DATE).toLocaleDateString(), sortable: true, wrap: true, width: "170px" },
    { name: "Lorry No", selector: (row) => row.CHLN_LORRY_NO, sortable: true, wrap: true ,width: "150px" },
  ];

  // Row per page options for pagination
  const rowPerPageOptions = [50, 100, 150, 200, 300, 400, 500, 1000, 2000, 5000, 10000];

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${marginClass} transition-all duration-300`}>
      {/* Input Fields */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        <div>
          <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            id="fromDate"
            type="date"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            id="toDate"
            type="date"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by CN No
          </label>
          <input
            id="search"
            type="text"
            placeholder="Enter CN No"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Search and Export Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 max-w-6xl mx-auto">
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-[#01588E] text-white rounded-lg font-semibold hover:bg-[#014a73] transition-colors"
        >
          Search
        </button>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          Export to CSV
        </button>
      </div>

      {/* Loading and Error Messages */}
      {loading && <div className="text-center text-blue-600 text-lg">Loading...</div>}
      {error && <div className="text-center text-red-600 text-lg">No data found</div>}

      {/* DataTable */}
      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto max-w-6xl mx-auto">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={limit}
            paginationRowsPerPageOptions={rowPerPageOptions}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            highlightOnHover
            responsive
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: "#01588E",
                  color: "white",
                  fontWeight: "bold",
                },
              },
              cells: {
                style: {
                  fontSize: "14px",
                  color: "#374151", // text-gray-700
                },
              },
              rows: {
                style: {
                  "&:nth-child(even)": {
                    backgroundColor: "#f9fafb", // bg-gray-50
                  },
                  "&:hover": {
                    backgroundColor: "#f3f4f6", // bg-gray-100
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default LrDetails;