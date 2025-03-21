


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DataTable from "react-data-table-component";
// import { getToken } from "../../Auth/auth";
// import { saveAs } from "file-saver";
// import { jwtDecode } from "jwt-decode";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const LrDetails = ({ isNavbarCollapsed }) => {
//   const marginClass = isNavbarCollapsed ? "" : "";

//   // State variables
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(100);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [totalRows, setTotalRows] = useState(0);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);

//   const token = getToken();
//   const decodedToken = jwtDecode(token);
//   const USER_ID = decodedToken.id;

//   const openForm = (row) => {
//     setSelectedRow({
//       CN_CN_NO: row.CN_CN_NO,
//       SITE_ID: "",
//       KILOMETER: "",
//       RATE: "",
//       LATITUDE: "",
//       LONGITUDE: "",
//       FREIGHT: "", // Auto-calculated
//       UNION_KM: "",
//       EXTRA_POINT: "",
//       DT_EXPENSE: "",
//       ESCORT_EXPENSE: "",
//       LOADING_EXPENSE: "",
//       UNLOADING_EXPENSE: "",
//       LABOUR_EXPENSE: "",
//       OTHER_EXPENSE: "",
//       CRANE_HYDRA_EXPENSE: "",
//       HEADLOAD_EXPENSE: "",
//       CHAIN_PULLEY_EXPENSE: "",
//       TOLL_TAX: "",
//       PACKING_EXPENSE: "",
//       TOTAL_AMOUNT: "", // Auto-calculated
//       REMARKS: "",
//     });
//     setIsFormOpen(true);
//   };

//   const handleInputChange = (field, value) => {
//     setSelectedRow((prev) => {
//       const updatedRow = { ...prev, [field]: value };

//       // Auto-calculate Freight (Rate * Kilometer)
//       const kilometer = parseFloat(updatedRow.KILOMETER) || 0;
//       const rate = parseFloat(updatedRow.RATE) || 0;
//       updatedRow.FREIGHT = (kilometer * rate).toFixed(2);

//       // Auto-calculate Total Amount (sum of all expenses)
//       const expenses = [
//         parseFloat(updatedRow.FREIGHT) || 0,
//         parseFloat(updatedRow.UNION_KM) || 0,
//         parseFloat(updatedRow.EXTRA_POINT) || 0,
//         parseFloat(updatedRow.DT_EXPENSE) || 0,
//         parseFloat(updatedRow.ESCORT_EXPENSE) || 0,
//         parseFloat(updatedRow.LOADING_EXPENSE) || 0,
//         parseFloat(updatedRow.UNLOADING_EXPENSE) || 0,
//         parseFloat(updatedRow.LABOUR_EXPENSE) || 0,
//         parseFloat(updatedRow.OTHER_EXPENSE) || 0,
//         parseFloat(updatedRow.CRANE_HYDRA_EXPENSE) || 0,
//         parseFloat(updatedRow.HEADLOAD_EXPENSE) || 0,
//         parseFloat(updatedRow.CHAIN_PULLEY_EXPENSE) || 0,
//         parseFloat(updatedRow.TOLL_TAX) || 0,
//         parseFloat(updatedRow.PACKING_EXPENSE) || 0,
//       ];
//       updatedRow.TOTAL_AMOUNT = expenses.reduce((sum, val) => sum + val, 0).toFixed(2);

//       return updatedRow;
//     });
//   };

//   const fetchLrDetailsData = async () => {
//     setLoading(true);
//     setError(false);

//     try {
//       const payload = {
//         page,
//         limit,
//         FROMDATE: fromDate || "",
//         TODATE: toDate || "",
//         CNNO: search || "",
//         USER_ID,
//       };

//       const response = await axios.post(
//         "https://vmsnode.omlogistics.co.in/api/lrDetails",
//         payload,
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
//       setFilteredData(response.data.data);
//       setTotalRows(response.data.total || response.data.data.length);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(true);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchLrDetailsData();
//   }, [page, limit, fromDate, toDate, search]);

//   const handleSearch = () => {
//     setPage(1);
//     fetchLrDetailsData();
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

//   const handleActionClick = (row) => {
//     openForm(row);
//   };

//   const closeForm = () => {
//     setIsFormOpen(false);
//     setSelectedRow(null);
//   };

//   const handleSaveExpenses = async () => {
//     if (!selectedRow) return;

//     const payload = {
//       CN_CN_NO: selectedRow.CN_CN_NO,
//       SITE_ID: parseFloat(selectedRow.SITE_ID) || 1,
//       KILOMETER: parseFloat(selectedRow.KILOMETER) || 0,
//       RATE: parseFloat(selectedRow.RATE) || 0,
//       LATITUDE: parseFloat(selectedRow.LATITUDE) || 0,
//       LONGITUDE: parseFloat(selectedRow.LONGITUDE) || 0,
//       FREIGHT: parseFloat(selectedRow.FREIGHT) || 0,
//       UNION_KM: parseFloat(selectedRow.UNION_KM) || 0,
//       EXTRA_POINT: parseFloat(selectedRow.EXTRA_POINT) || 0,
//       DT_EXPENSE: parseFloat(selectedRow.DT_EXPENSE) || 0,
//       ESCORT_EXPENSE: parseFloat(selectedRow.ESCORT_EXPENSE) || 0,
//       LOADING_EXPENSE: parseFloat(selectedRow.LOADING_EXPENSE) || 0,
//       UNLOADING_EXPENSE: parseFloat(selectedRow.UNLOADING_EXPENSE) || 0,
//       LABOUR_EXPENSE: parseFloat(selectedRow.LABOUR_EXPENSE) || 0,
//       OTHER_EXPENSE: parseFloat(selectedRow.OTHER_EXPENSE) || 0,
//       CRANE_HYDRA_EXPENSE: parseFloat(selectedRow.CRANE_HYDRA_EXPENSE) || 0,
//       HEADLOAD_EXPENSE: parseFloat(selectedRow.HEADLOAD_EXPENSE) || 0,
//       CHAIN_PULLEY_EXPENSE: parseFloat(selectedRow.CHAIN_PULLEY_EXPENSE) || 0,
//       TOLL_TAX: parseFloat(selectedRow.TOLL_TAX) || 0,
//       PACKING_EXPENSE: parseFloat(selectedRow.PACKING_EXPENSE) || 0,
//       TOTAL_AMOUNT: parseFloat(selectedRow.TOTAL_AMOUNT) || 0,
//       REMARKS: selectedRow.REMARKS || "No remarks",
//       ENTERED_BY: "admin",
//       MODIFIED_BY: "admin",
//     };

//     try {
//       const response = await axios.post(
//         "https://vmsnode.omlogistics.co.in/api/addExpenses",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.error === false) {
//         toast.success(response.data.msg || "Expenses saved successfully!", {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           theme: "colored",
//         });
//         closeForm();
//         fetchLrDetailsData();
//       } else {
//         toast.error(response.data.msg || "", {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           theme: "colored",
//         });
//       }
//     } catch (error) {
//       console.error("Error saving expenses:", error);
//       toast.error("Failed to insert Expense or CN_CN_NO already exist.", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "colored",
//       });
//     }
//   };

  
//   const columns = [
//     { name: "Row Number", selector: (row) => row.ROW_NUM || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "CN No", selector: (row) => row.CN_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
//     {
//       name: "Action",
//       cell: (row) => (
//         <button
//           onClick={() => handleActionClick(row)}
//           className="text-blue-500 text-xl hover:text-blue-700"
//         >
//           +
//         </button>
//       ),
//       width: "70px",
//     },
//     { name: "Manual CN No", selector: (row) => row.CN_MANUAL_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "CN Date", selector: (row) => (row.CN_CN_DATE ? new Date(row.CN_CN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "150px" },
//     { name: "Source Branch Code", selector: (row) => row.CN_SOURCE_BRANCH_CODE || "-", sortable: true, wrap: true, width: "170px" },
//     { name: "Destination Branch Code", selector: (row) => row.CN_DESTINATION_BRANCH_CODE || "-", sortable: true, wrap: true, width: "190px" },
//     { name: "Mode VAT", selector: (row) => row.CN_MODE_VAT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Item Description", selector: (row) => row.CN_ITEM_DESCRIPT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Total Packages", selector: (row) => row.TOTAL_CN_PKG || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Total Weight", selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Challan Vendor Code", selector: (row) => row.CHLN_VENDOR_CODE || "-", sortable: true, wrap: true, width: "190px" },
//     { name: "Challan No", selector: (row) => row.CHLN_CHLN_NO || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Challan Date", selector: (row) => (row.CHLN_CHLN_DATE ? new Date(row.CHLN_CHLN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "170px" },
//     { name: "Lorry No", selector: (row) => row.CHLN_LORRY_NO || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Site ID", selector: (row) => row.SITE_ID || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Kilometer", selector: (row) => row.KILOMETER || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Rate", selector: (row) => row.RATE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Latitude", selector: (row) => row.LATITUDE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Longitude", selector: (row) => row.LONGITUDE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Freight", selector: (row) => row.FREIGHT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Union KM", selector: (row) => row.UNION_KM || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Extra Point", selector: (row) => row.EXTRA_POINT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "DT Expense", selector: (row) => row.DT_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Escort Expense", selector: (row) => row.ESCORT_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Loading Expense", selector: (row) => row.LOADING_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Unloading Expense", selector: (row) => row.UNLOADING_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Labour Expense", selector: (row) => row.LABOUR_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Other Expense", selector: (row) => row.OTHER_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Crane Hydra Expense", selector: (row) => row.CRANE_HYDRA_EXPENSE || "-", sortable: true, wrap: true, width: "170px" },
//     { name: "Headload Expense", selector: (row) => row.HEADLOAD_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Chain Pulley Expense", selector: (row) => row.CHAIN_PULLEY_EXPENSE || "-", sortable: true, wrap: true, width: "170px" },
//     { name: "Toll Tax", selector: (row) => row.TOLL_TAX || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Packing Expense", selector: (row) => row.PACKING_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Total Amount", selector: (row) => row.TOTAL_AMOUNT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Remarks", selector: (row) => row.REMARKS || "-", sortable: true, wrap: true, width: "200px" },
//   ];

//   const rowPerPageOptions = [50, 100, 150, 200, 300, 400, 500, 1000, 2000, 5000, 10000];

//   return (
//     <div className={`min-h-screen bg-gray-50 p-6 ${marginClass} transition-all duration-300`}>
//       <ToastContainer />

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

//       {loading && <div className="text-center text-blue-600 text-lg">Loading...</div>}
//       {error && <div className="text-center text-red-600 text-lg">No data found</div>}

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
//               headRow: { style: { backgroundColor: "#01588E", color: "white", fontWeight: "bold" } },
//               cells: { style: { fontSize: "14px", color: "#374151" } },
//               rows: {
//                 style: {
//                   "&:nth-child(even)": { backgroundColor: "#f9fafb" },
//                   "&:hover": { backgroundColor: "#f3f4f6" },
//                 },
//               },
//             }}
//           />
//         </div>
//       )}

//       {isFormOpen && selectedRow && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-lg">
//             <h2 className="text-xl font-bold mb-4">Details for CN No: {selectedRow.CN_CN_NO}</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Left Column */}
//               <div>
//                 <div>
//                   <label>CN No</label>
//                   <input
//                     type="text"
//                     value={selectedRow.CN_CN_NO || ""}
//                     className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Site ID</label>
//                   <input
//                     type="number"
//                     value={selectedRow.SITE_ID || ""}
//                     onChange={(e) => handleInputChange("SITE_ID", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Kilometer</label>
//                   <input
//                     type="number"
//                     value={selectedRow.KILOMETER || ""}
//                     onChange={(e) => handleInputChange("KILOMETER", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Rate (per Km)</label>
//                   <input
//                     type="number"
//                     value={selectedRow.RATE || ""}
//                     onChange={(e) => handleInputChange("RATE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Latitude</label>
//                   <input
//                     type="number"
//                     value={selectedRow.LATITUDE || ""}
//                     onChange={(e) => handleInputChange("LATITUDE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Longitude</label>
//                   <input
//                     type="number"
//                     value={selectedRow.LONGITUDE || ""}
//                     onChange={(e) => handleInputChange("LONGITUDE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Freight (Auto-calculated)</label>
//                   <input
//                     type="number"
//                     value={selectedRow.FREIGHT || ""}
//                     className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Union/Km</label>
//                   <input
//                     type="number"
//                     value={selectedRow.UNION_KM || ""}
//                     onChange={(e) => handleInputChange("UNION_KM", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Extra Point</label>
//                   <input
//                     type="number"
//                     value={selectedRow.EXTRA_POINT || ""}
//                     onChange={(e) => handleInputChange("EXTRA_POINT", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Dt Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.DT_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("DT_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div>
//                 <div>
//                   <label>Escort Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.ESCORT_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("ESCORT_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Loading Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.LOADING_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("LOADING_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Unloading Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.UNLOADING_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("UNLOADING_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Labour Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.LABOUR_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("LABOUR_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Other Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.OTHER_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("OTHER_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Crane/Hydra Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.CRANE_HYDRA_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("CRANE_HYDRA_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Chain Pulley Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.CHAIN_PULLEY_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("CHAIN_PULLEY_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Toll Tax</label>
//                   <input
//                     type="number"
//                     value={selectedRow.TOLL_TAX || ""}
//                     onChange={(e) => handleInputChange("TOLL_TAX", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Packing Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.PACKING_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("PACKING_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Total Amount (Auto-calculated)</label>
//                   <input
//                     type="number"
//                     value={selectedRow.TOTAL_AMOUNT || ""}
//                     className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Remarks</label>
//                   <textarea
//                     value={selectedRow.REMARKS || ""}
//                     onChange={(e) => handleInputChange("REMARKS", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                     rows="3"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end gap-4">
//               <button
//                 onClick={closeForm}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleSaveExpenses}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LrDetails;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DataTable from "react-data-table-component";
// import { getToken } from "../../Auth/auth";
// import { saveAs } from "file-saver";
// import { jwtDecode } from "jwt-decode";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const LrDetails = ({ isNavbarCollapsed }) => {
//   const marginClass = isNavbarCollapsed ? "" : "";

//   // State variables
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(100);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [totalRows, setTotalRows] = useState(0);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [formMode, setFormMode] = useState("add"); // "add" or "update"

//   const token = getToken();
//   const decodedToken = jwtDecode(token);
//   const USER_ID = decodedToken.id;

//   const openFormInAddMode = (row) => {
//     setFormMode("add");
//     setSelectedRow({
//       CN_CN_NO: row.CN_CN_NO,
  
//       KILOMETER: "",
//       RATE: "",
//       LATITUDE: "",
//       LONGITUDE: "",
//       FREIGHT: "",
//       UNION_KM: "",
//       EXTRA_POINT: "",
//       DT_EXPENSE: "",
//       ESCORT_EXPENSE: "",
//       LOADING_EXPENSE: "",
//       UNLOADING_EXPENSE: "",
//       LABOUR_EXPENSE: "",
//       OTHER_EXPENSE: "",
//       CRANE_HYDRA_EXPENSE: "",
//       HEADLOAD_EXPENSE: "",
//       CHAIN_PULLEY_EXPENSE: "",
//       TOLL_TAX: "",
//       PACKING_EXPENSE: "",
//       TOTAL_AMOUNT: "",
//       REMARKS: "",
//     });
//     setIsFormOpen(true);
//   };

//   const openFormInUpdateMode = (row) => {
//     setFormMode("update");
//     setSelectedRow({
//       CN_CN_NO: row.CN_CN_NO,
//       // SITE_ID: row.SITE_ID || "",
//       KILOMETER: row.KILOMETER || "",
//       RATE: row.RATE || "",
//       LATITUDE: row.LATITUDE || "",
//       LONGITUDE: row.LONGITUDE || "",
//       FREIGHT: row.FREIGHT || "",
//       UNION_KM: row.UNION_KM || "",
//       EXTRA_POINT: row.EXTRA_POINT || "",
//       DT_EXPENSE: row.DT_EXPENSE || "",
//       ESCORT_EXPENSE: row.ESCORT_EXPENSE || "",
//       LOADING_EXPENSE: row.LOADING_EXPENSE || "",
//       UNLOADING_EXPENSE: row.UNLOADING_EXPENSE || "",
//       LABOUR_EXPENSE: row.LABOUR_EXPENSE || "",
//       OTHER_EXPENSE: row.OTHER_EXPENSE || "",
//       CRANE_HYDRA_EXPENSE: row.CRANE_HYDRA_EXPENSE || "",
//       HEADLOAD_EXPENSE: row.HEADLOAD_EXPENSE || "",
//       CHAIN_PULLEY_EXPENSE: row.CHAIN_PULLEY_EXPENSE || "",
//       TOLL_TAX: row.TOLL_TAX || "",
//       PACKING_EXPENSE: row.PACKING_EXPENSE || "",
//       TOTAL_AMOUNT: row.TOTAL_AMOUNT || "",
//       REMARKS: row.REMARKS || "",
//     });
//     setIsFormOpen(true);
//   };

//   const handleInputChange = (field, value) => {
//     setSelectedRow((prev) => {
//       const updatedRow = { ...prev, [field]: value };

//       // Auto-calculate Freight (Rate * Kilometer)
//       const kilometer = parseFloat(updatedRow.KILOMETER) || 0;
//       const rate = parseFloat(updatedRow.RATE) || 0;
//       updatedRow.FREIGHT = (kilometer * rate).toFixed(2);

//       // Auto-calculate Total Amount (sum of all expenses)
//       const expenses = [
//         parseFloat(updatedRow.FREIGHT) || 0,
//         parseFloat(updatedRow.UNION_KM) || 0,
//         parseFloat(updatedRow.EXTRA_POINT) || 0,
//         parseFloat(updatedRow.DT_EXPENSE) || 0,
//         parseFloat(updatedRow.ESCORT_EXPENSE) || 0,
//         parseFloat(updatedRow.LOADING_EXPENSE) || 0,
//         parseFloat(updatedRow.UNLOADING_EXPENSE) || 0,
//         parseFloat(updatedRow.LABOUR_EXPENSE) || 0,
//         parseFloat(updatedRow.OTHER_EXPENSE) || 0,
//         parseFloat(updatedRow.CRANE_HYDRA_EXPENSE) || 0,
//         parseFloat(updatedRow.HEADLOAD_EXPENSE) || 0,
//         parseFloat(updatedRow.CHAIN_PULLEY_EXPENSE) || 0,
//         parseFloat(updatedRow.TOLL_TAX) || 0,
//         parseFloat(updatedRow.PACKING_EXPENSE) || 0,
//       ];
//       updatedRow.TOTAL_AMOUNT = expenses.reduce((sum, val) => sum + val, 0).toFixed(2);

//       return updatedRow;
//     });
//   };

//   const fetchLrDetailsData = async () => {
//     setLoading(true);
//     setError(false);

//     try {
//       const payload = {
//         page,
//         limit,
//         FROMDATE: fromDate || "",
//         TODATE: toDate || "",
//         CNNO: search || "",
//         USER_ID,
//       };

//       const response = await axios.post(
//         "https://vmsnode.omlogistics.co.in/api/lrDetails",
//         payload,
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
//       setFilteredData(response.data.data);
//       setTotalRows(response.data.total || response.data.data.length);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(true);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchLrDetailsData();
//   }, [page, limit, fromDate, toDate, search]);

//   const handleSearch = () => {
//     setPage(1);
//     fetchLrDetailsData();
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

//   const closeForm = () => {
//     setIsFormOpen(false);
//     setSelectedRow(null);
//   };

//   const handleSaveExpenses = async () => {
//     if (!selectedRow) return;

//     const payload = {
//       CN_CN_NO: selectedRow.CN_CN_NO,
//       // SITE_ID: parseFloat(selectedRow.SITE_ID) || 1,
//       KILOMETER: parseFloat(selectedRow.KILOMETER) || 0,
//       RATE: parseFloat(selectedRow.RATE) || 0,
//       LATITUDE: parseFloat(selectedRow.LATITUDE) || 0,
//       LONGITUDE: parseFloat(selectedRow.LONGITUDE) || 0,
//       FREIGHT: parseFloat(selectedRow.FREIGHT) || 0,
//       UNION_KM: parseFloat(selectedRow.UNION_KM) || 0,
//       EXTRA_POINT: parseFloat(selectedRow.EXTRA_POINT) || 0,
//       DT_EXPENSE: parseFloat(selectedRow.DT_EXPENSE) || 0,
//       ESCORT_EXPENSE: parseFloat(selectedRow.ESCORT_EXPENSE) || 0,
//       LOADING_EXPENSE: parseFloat(selectedRow.LOADING_EXPENSE) || 0,
//       UNLOADING_EXPENSE: parseFloat(selectedRow.UNLOADING_EXPENSE) || 0,
//       LABOUR_EXPENSE: parseFloat(selectedRow.LABOUR_EXPENSE) || 0,
//       OTHER_EXPENSE: parseFloat(selectedRow.OTHER_EXPENSE) || 0,
//       CRANE_HYDRA_EXPENSE: parseFloat(selectedRow.CRANE_HYDRA_EXPENSE) || 0,
//       HEADLOAD_EXPENSE: parseFloat(selectedRow.HEADLOAD_EXPENSE) || 0,
//       CHAIN_PULLEY_EXPENSE: parseFloat(selectedRow.CHAIN_PULLEY_EXPENSE) || 0,
//       TOLL_TAX: parseFloat(selectedRow.TOLL_TAX) || 0,
//       PACKING_EXPENSE: parseFloat(selectedRow.PACKING_EXPENSE) || 0,
//       TOTAL_AMOUNT: parseFloat(selectedRow.TOTAL_AMOUNT) || 0,
//       REMARKS: selectedRow.REMARKS || "No remarks",
//       ENTERED_BY: "admin",
//       MODIFIED_BY: "admin",
//     };

//     const apiUrl = formMode === "add"
//       ? "https://vmsnode.omlogistics.co.in/api/addExpenses"
//       : "https://vmsnode.omlogistics.co.in/api/updateExpenses";

//     try {
//       const response = await axios.post(apiUrl, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.data.error === false) {
//         toast.success(response.data.msg || `${formMode === "add" ? "Added" : "Updated"} successfully!`, {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           theme: "colored",
//         });
//         closeForm();
//         fetchLrDetailsData();
//       } else {
//         toast.error(response.data.msg || "Operation failed", {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           theme: "colored",
//         });
//       }
//     } catch (error) {
//       console.error(`Error ${formMode === "add" ? "adding" : "updating"} expenses:`, error);
//       toast.error(`Failed to ${formMode === "add" ? "add" : "update"} expenses`, {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "colored",
//       });
//     }
//   };

//   const columns = [
//     { name: "Row Number", selector: (row) => row.ROW_NUM || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "CN No", selector: (row) => row.CN_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
//     {
//       name: "Action",
//       cell: (row) => (
//         <div className="flex gap-2">
//           <button
//             onClick={() => openFormInAddMode(row)}
//             className="text-blue-500 text-xl hover:text-blue-700"
//           >
//             +
//           </button>
//           <button
//             onClick={() => openFormInUpdateMode(row)}
//             className="text-green-500 text-xl hover:text-green-700"
//           >
//             ✎
//           </button>
//         </div>
//       ),
//       width: "100px",
//     },
//     { name: "Manual CN No", selector: (row) => row.CN_MANUAL_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "CN Date", selector: (row) => (row.CN_CN_DATE ? new Date(row.CN_CN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "150px" },
//     { name: "Source Branch Code", selector: (row) => row.CN_SOURCE_BRANCH_CODE || "-", sortable: true, wrap: true, width: "170px" },
//     { name: "Destination Branch Code", selector: (row) => row.CN_DESTINATION_BRANCH_CODE || "-", sortable: true, wrap: true, width: "190px" },
//     { name: "Mode VAT", selector: (row) => row.CN_MODE_VAT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Item Description", selector: (row) => row.CN_ITEM_DESCRIPT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Total Packages", selector: (row) => row.TOTAL_CN_PKG || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Total Weight", selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Challan Vendor Code", selector: (row) => row.CHLN_VENDOR_CODE || "-", sortable: true, wrap: true, width: "190px" },
//     { name: "Challan No", selector: (row) => row.CHLN_CHLN_NO || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Challan Date", selector: (row) => (row.CHLN_CHLN_DATE ? new Date(row.CHLN_CHLN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "170px" },
//     { name: "Lorry No", selector: (row) => row.CHLN_LORRY_NO || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Site ID", selector: (row) => row.SITE_ID || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Kilometer", selector: (row) => row.KILOMETER || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Rate", selector: (row) => row.RATE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Latitude", selector: (row) => row.LATITUDE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Longitude", selector: (row) => row.LONGITUDE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Freight", selector: (row) => row.FREIGHT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Union KM", selector: (row) => row.UNION_KM || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Extra Point", selector: (row) => row.EXTRA_POINT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "DT Expense", selector: (row) => row.DT_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Escort Expense", selector: (row) => row.ESCORT_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Loading Expense", selector: (row) => row.LOADING_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Unloading Expense", selector: (row) => row.UNLOADING_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Labour Expense", selector: (row) => row.LABOUR_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Other Expense", selector: (row) => row.OTHER_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Crane Hydra Expense", selector: (row) => row.CRANE_HYDRA_EXPENSE || "-", sortable: true, wrap: true, width: "170px" },
//     { name: "Headload Expense", selector: (row) => row.HEADLOAD_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Chain Pulley Expense", selector: (row) => row.CHAIN_PULLEY_EXPENSE || "-", sortable: true, wrap: true, width: "170px" },
//     { name: "Toll Tax", selector: (row) => row.TOLL_TAX || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Packing Expense", selector: (row) => row.PACKING_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Total Amount", selector: (row) => row.TOTAL_AMOUNT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Remarks", selector: (row) => row.REMARKS || "-", sortable: true, wrap: true, width: "200px" },
//   ];

//   const rowPerPageOptions = [50, 100, 150, 200, 300, 400, 500, 1000, 2000, 5000, 10000];

//   return (
//     <div className={`min-h-screen bg-gray-50 p-6 ${marginClass} transition-all duration-300`}>
//       <ToastContainer />

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

//       {loading && <div className="text-center text-blue-600 text-lg">Loading...</div>}
//       {error && <div className="text-center text-red-600 text-lg">No data found</div>}

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
//               headRow: { style: { backgroundColor: "#01588E", color: "white", fontWeight: "bold" } },
//               cells: { style: { fontSize: "14px", color: "#374151" } },
//               rows: {
//                 style: {
//                   "&:nth-child(even)": { backgroundColor: "#f9fafb" },
//                   "&:hover": { backgroundColor: "#f3f4f6" },
//                 },
//               },
//             }}
//           />
//         </div>
//       )}

//       {isFormOpen && selectedRow && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-lg">
//             <h2 className="text-xl font-bold mb-4">
//               {formMode === "add" ? "Add Expenses" : "Update Expenses"} for CN No: {selectedRow.CN_CN_NO}
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Left Column */}
//               <div>
//                 <div>
//                   <label>CN No</label>
//                   <input
//                     type="text"
//                     value={selectedRow.CN_CN_NO || ""}
//                     className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Site ID</label>
//                   <input
//                     type="number"
//                     value={selectedRow.SITE_ID || ""}
//                     onChange={(e) => handleInputChange("SITE_ID", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Kilometer</label>
//                   <input
//                     type="number"
//                     value={selectedRow.KILOMETER || ""}
//                     onChange={(e) => handleInputChange("KILOMETER", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Rate (per Km)</label>
//                   <input
//                     type="number"
//                     value={selectedRow.RATE || ""}
//                     onChange={(e) => handleInputChange("RATE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Latitude</label>
//                   <input
//                     type="number"
//                     value={selectedRow.LATITUDE || ""}
//                     onChange={(e) => handleInputChange("LATITUDE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Longitude</label>
//                   <input
//                     type="number"
//                     value={selectedRow.LONGITUDE || ""}
//                     onChange={(e) => handleInputChange("LONGITUDE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Freight (Auto-calculated)</label>
//                   <input
//                     type="number"
//                     value={selectedRow.FREIGHT || ""}
//                     className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Union/Km</label>
//                   <input
//                     type="number"
//                     value={selectedRow.UNION_KM || ""}
//                     onChange={(e) => handleInputChange("UNION_KM", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Extra Point</label>
//                   <input
//                     type="number"
//                     value={selectedRow.EXTRA_POINT || ""}
//                     onChange={(e) => handleInputChange("EXTRA_POINT", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Dt Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.DT_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("DT_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div>
//                 <div>
//                   <label>Escort Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.ESCORT_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("ESCORT_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Loading Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.LOADING_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("LOADING_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Unloading Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.UNLOADING_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("UNLOADING_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Labour Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.LABOUR_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("LABOUR_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Other Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.OTHER_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("OTHER_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Crane/Hydra Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.CRANE_HYDRA_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("CRANE_HYDRA_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Chain Pulley Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.CHAIN_PULLEY_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("CHAIN_PULLEY_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Toll Tax</label>
//                   <input
//                     type="number"
//                     value={selectedRow.TOLL_TAX || ""}
//                     onChange={(e) => handleInputChange("TOLL_TAX", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Packing Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.PACKING_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("PACKING_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Total Amount (Auto-calculated)</label>
//                   <input
//                     type="number"
//                     value={selectedRow.TOTAL_AMOUNT || ""}
//                     className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Remarks</label>
//                   <textarea
//                     value={selectedRow.REMARKS || ""}
//                     onChange={(e) => handleInputChange("REMARKS", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                     rows="3"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end gap-4">
//               <button
//                 onClick={closeForm}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleSaveExpenses}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 {formMode === "add" ? "Add" : "Update"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LrDetails;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DataTable from "react-data-table-component";
// import { getToken } from "../../Auth/auth";
// import { saveAs } from "file-saver";
// import { jwtDecode } from "jwt-decode";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const LrDetails = ({ isNavbarCollapsed }) => {
//   const marginClass = isNavbarCollapsed ? "" : "";

//   // State variables
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(100);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [totalRows, setTotalRows] = useState(0);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [formMode, setFormMode] = useState("add"); // "add" or "update"

//   const token = getToken();
//   const decodedToken = jwtDecode(token);
//   const USER_ID = decodedToken.id;

//   // const openFormInAddMode = (row) => {
//   //   setFormMode("add");
//   //   setSelectedRow({
//   //     CN_CN_NO: row.CN_CN_NO,
//   //     KILOMETER: "",
//   //     RATE: "",
//   //     LATITUDE: "",
//   //     LONGITUDE: "",
//   //     FREIGHT: "",
//   //     UNION_KM: "",
//   //     EXTRA_POINT: "",
//   //     DT_EXPENSE: "",
//   //     ESCORT_EXPENSE: "",
//   //     LOADING_EXPENSE: "",
//   //     UNLOADING_EXPENSE: "",
//   //     LABOUR_EXPENSE: "",
//   //     OTHER_EXPENSE: "",
//   //     CRANE_HYDRA_EXPENSE: "",
//   //     HEADLOAD_EXPENSE: "",
//   //     CHAIN_PULLEY_EXPENSE: "",
//   //     TOLL_TAX: "",
//   //     PACKING_EXPENSE: "",
//   //     TOTAL_AMOUNT: "",
//   //     REMARKS: "",
//   //     ENTERED_BY: "admin",
//   //     MODIFIED_BY: "admin"
//   //   });
//   //   setIsFormOpen(true);
//   // };

//   const openFormInAddMode = (row) => {
//     setFormMode("add");
//     setSelectedRow({
//       CN_CN_NO: row.CN_CN_NO,
  
//       KILOMETER: "",
//       RATE: "",
//       LATITUDE: "",
//       LONGITUDE: "",
//       FREIGHT: "",
//       UNION_KM: "",
//       EXTRA_POINT: "",
//       DT_EXPENSE: "",
//       ESCORT_EXPENSE: "",
//       LOADING_EXPENSE: "",
//       UNLOADING_EXPENSE: "",
//       LABOUR_EXPENSE: "",
//       OTHER_EXPENSE: "",
//       CRANE_HYDRA_EXPENSE: "",
//       HEADLOAD_EXPENSE: "",
//       CHAIN_PULLEY_EXPENSE: "",
//       TOLL_TAX: "",
//       PACKING_EXPENSE: "",
//       TOTAL_AMOUNT: "",
//       REMARKS: "",
//     });
//     setIsFormOpen(true);
//   };
//   const openFormInUpdateMode = (row) => {
//     setFormMode("update");
//     setSelectedRow({
//       CN_CN_NO: row.CN_CN_NO,
//       KILOMETER: row.KILOMETER || "",
//       RATE: row.RATE || "",
//       LATITUDE: row.LATITUDE || "",
//       LONGITUDE: row.LONGITUDE || "",
//       FREIGHT: row.FREIGHT || "",
//       UNION_KM: row.UNION_KM || "",
//       EXTRA_POINT: row.EXTRA_POINT || "",
//       DT_EXPENSE: row.DT_EXPENSE || "",
//       ESCORT_EXPENSE: row.ESCORT_EXPENSE || "",
//       LOADING_EXPENSE: row.LOADING_EXPENSE || "",
//       UNLOADING_EXPENSE: row.UNLOADING_EXPENSE || "",
//       LABOUR_EXPENSE: row.LABOUR_EXPENSE || "",
//       OTHER_EXPENSE: row.OTHER_EXPENSE || "",
//       CRANE_HYDRA_EXPENSE: row.CRANE_HYDRA_EXPENSE || "",
//       HEADLOAD_EXPENSE: row.HEADLOAD_EXPENSE || "",
//       CHAIN_PULLEY_EXPENSE: row.CHAIN_PULLEY_EXPENSE || "",
//       TOLL_TAX: row.TOLL_TAX || "",
//       PACKING_EXPENSE: row.PACKING_EXPENSE || "",
//       TOTAL_AMOUNT: row.TOTAL_AMOUNT || "",
//       REMARKS: row.REMARKS || "",
//     });
//     setIsFormOpen(true);
//   };

//   const handleInputChange = (field, value) => {
//     setSelectedRow((prev) => {
//       const updatedRow = { ...prev, [field]: value };

//       // Auto-calculate Freight (Rate * Kilometer)
//       const kilometer = parseFloat(updatedRow.KILOMETER) || 0;
//       const rate = parseFloat(updatedRow.RATE) || 0;
//       updatedRow.FREIGHT = (kilometer * rate).toFixed(2);

//       // Auto-calculate Total Amount (sum of all expenses)
//       const expenses = [
//         parseFloat(updatedRow.FREIGHT) || 0,
//         parseFloat(updatedRow.UNION_KM) || 0,
//         parseFloat(updatedRow.EXTRA_POINT) || 0,
//         parseFloat(updatedRow.DT_EXPENSE) || 0,
//         parseFloat(updatedRow.ESCORT_EXPENSE) || 0,
//         parseFloat(updatedRow.LOADING_EXPENSE) || 0,
//         parseFloat(updatedRow.UNLOADING_EXPENSE) || 0,
//         parseFloat(updatedRow.LABOUR_EXPENSE) || 0,
//         parseFloat(updatedRow.OTHER_EXPENSE) || 0,
//         parseFloat(updatedRow.CRANE_HYDRA_EXPENSE) || 0,
//         parseFloat(updatedRow.HEADLOAD_EXPENSE) || 0,
//         parseFloat(updatedRow.CHAIN_PULLEY_EXPENSE) || 0,
//         parseFloat(updatedRow.TOLL_TAX) || 0,
//         parseFloat(updatedRow.PACKING_EXPENSE) || 0,
//       ];
//       updatedRow.TOTAL_AMOUNT = expenses.reduce((sum, val) => sum + val, 0).toFixed(2);

//       return updatedRow;
//     });
//   };

//   const fetchLrDetailsData = async () => {
//     setLoading(true);
//     setError(false);

//     try {
//       const payload = {
//         page,
//         limit,
//         FROMDATE: fromDate || "",
//         TODATE: toDate || "",
//         CNNO: search || "",
//         USER_ID,
//       };

//       const response = await axios.post(
//         "https://vmsnode.omlogistics.co.in/api/lrDetails",
//         payload,
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
//       setFilteredData(response.data.data);
//       setTotalRows(response.data.total || response.data.data.length);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(true);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchLrDetailsData();
//   }, [page, limit, fromDate, toDate, search]);

//   const handleSearch = () => {
//     setPage(1);
//     fetchLrDetailsData();
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

//   const closeForm = () => {
//     setIsFormOpen(false);
//     setSelectedRow(null);
//   };

//   const handleSaveExpenses = async () => {
//     if (!selectedRow) return;

//     const payload = {
//       cn_cn_no: selectedRow.CN_CN_NO,
//       kilometer: parseFloat(selectedRow.KILOMETER) || 0,
//       rate: parseFloat(selectedRow.RATE) || 0,
//       latitude: parseFloat(selectedRow.LATITUDE) || 0,
//       longitude: parseFloat(selectedRow.LONGITUDE) || 0,
//       freight: parseFloat(selectedRow.FREIGHT) || 0,
//       union_km: parseFloat(selectedRow.UNION_KM) || 0,
//       extra_point: parseFloat(selectedRow.EXTRA_POINT) || 0,
//       dt_expense: parseFloat(selectedRow.DT_EXPENSE) || 0,
//       escort_expense: parseFloat(selectedRow.ESCORT_EXPENSE) || 0,
//       loading_expense: parseFloat(selectedRow.LOADING_EXPENSE) || 0,
//       unloading_expense: parseFloat(selectedRow.UNLOADING_EXPENSE) || 0,
//       labour_expense: parseFloat(selectedRow.LABOUR_EXPENSE) || 0,
//       other_expense: parseFloat(selectedRow.OTHER_EXPENSE) || 0,
//       crane_hydra_expense: parseFloat(selectedRow.CRANE_HYDRA_EXPENSE) || 0,
//       headload_expense: parseFloat(selectedRow.HEADLOAD_EXPENSE) || 0,
//       chain_pulley_expense: parseFloat(selectedRow.CHAIN_PULLEY_EXPENSE) || 0,
//       toll_tax: parseFloat(selectedRow.TOLL_TAX) || 0,
//       packing_expense: parseFloat(selectedRow.PACKING_EXPENSE) || 0,
//       total_amount: parseFloat(selectedRow.TOTAL_AMOUNT) || 0,
//       remarks: selectedRow.REMARKS || "No remarks",
//       modified_by: "admin",
//     };

//     console.log("Payload:", payload);
//     console.log("Token:", token);

//     const apiUrl = formMode === "add"
//       ? "https://vmsnode.omlogistics.co.in/api/addExpenses"
//       : "https://vmsnode.omlogistics.co.in/api/updateExpenses";

//     try {
//       const response = await axios.post(apiUrl, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.data.error === false) {
//         toast.success(response.data.msg || `${formMode === "add" ? "Added" : "Updated"} successfully!`, {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           theme: "colored",
//         });
//         closeForm();
//         fetchLrDetailsData();
//       } else {
//         toast.error(response.data.msg || "Operation failed", {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           theme: "colored",
//         });
//       }
//     } catch (error) {
//       console.error("API Error:", error.response?.data || error.message);
//       toast.error(`Failed to ${formMode === "add" ? "add" : "update"} expenses: ${error.response?.data?.msg || error.message}`, {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "colored",
//       });
//     }
//   };

//   const columns = [
//     { name: "Row Number", selector: (row) => row.ROW_NUM || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "CN No", selector: (row) => row.CN_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
//     {
//       name: "Action",
//       cell: (row) => (
//         <div className="flex gap-2">
//           <button
//             onClick={() => openFormInAddMode(row)}
//             className="text-blue-500 text-xl hover:text-blue-700"
//           >
//             +
//           </button>
//           <button
//             onClick={() => openFormInUpdateMode(row)}
//             className="text-green-500 text-xl hover:text-green-700"
//           >
//             ✎
//           </button>
//         </div>
//       ),
//       width: "100px",
//     },
//     { name: "Manual CN No", selector: (row) => row.CN_MANUAL_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "CN Date", selector: (row) => (row.CN_CN_DATE ? new Date(row.CN_CN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "150px" },
//     { name: "Source Branch Code", selector: (row) => row.CN_SOURCE_BRANCH_CODE || "-", sortable: true, wrap: true, width: "170px" },
//     { name: "Destination Branch Code", selector: (row) => row.CN_DESTINATION_BRANCH_CODE || "-", sortable: true, wrap: true, width: "190px" },
//     { name: "Mode VAT", selector: (row) => row.CN_MODE_VAT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Item Description", selector: (row) => row.CN_ITEM_DESCRIPT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Total Packages", selector: (row) => row.TOTAL_CN_PKG || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Total Weight", selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Challan Vendor Code", selector: (row) => row.CHLN_VENDOR_CODE || "-", sortable: true, wrap: true, width: "190px" },
//     { name: "Challan No", selector: (row) => row.CHLN_CHLN_NO || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Challan Date", selector: (row) => (row.CHLN_CHLN_DATE ? new Date(row.CHLN_CHLN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "170px" },
//     { name: "Lorry No", selector: (row) => row.CHLN_LORRY_NO || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Site ID", selector: (row) => row.SITE_ID || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Kilometer", selector: (row) => row.KILOMETER || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Rate", selector: (row) => row.RATE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Latitude", selector: (row) => row.LATITUDE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Longitude", selector: (row) => row.LONGITUDE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Freight", selector: (row) => row.FREIGHT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Union KM", selector: (row) => row.UNION_KM || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Extra Point", selector: (row) => row.EXTRA_POINT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "DT Expense", selector: (row) => row.DT_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Escort Expense", selector: (row) => row.ESCORT_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Loading Expense", selector: (row) => row.LOADING_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Unloading Expense", selector: (row) => row.UNLOADING_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Labour Expense", selector: (row) => row.LABOUR_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Other Expense", selector: (row) => row.OTHER_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Crane Hydra Expense", selector: (row) => row.CRANE_HYDRA_EXPENSE || "-", sortable: true, wrap: true, width: "170px" },
//     { name: "Headload Expense", selector: (row) => row.HEADLOAD_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Chain Pulley Expense", selector: (row) => row.CHAIN_PULLEY_EXPENSE || "-", sortable: true, wrap: true, width: "170px" },
//     { name: "Toll Tax", selector: (row) => row.TOLL_TAX || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Packing Expense", selector: (row) => row.PACKING_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Total Amount", selector: (row) => row.TOTAL_AMOUNT || "-", sortable: true, wrap: true, width: "150px" },
//     { name: "Remarks", selector: (row) => row.REMARKS || "-", sortable: true, wrap: true, width: "200px" },
//   ];

//   const rowPerPageOptions = [50, 100, 150, 200, 300, 400, 500, 1000, 2000, 5000, 10000];

//   return (
//     <div className={`min-h-screen bg-gray-50 p-6 ${marginClass} transition-all duration-300`}>
//       <ToastContainer />

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

//       {loading && <div className="text-center text-blue-600 text-lg">Loading...</div>}
//       {error && <div className="text-center text-red-600 text-lg">No data found</div>}

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
//               headRow: { style: { backgroundColor: "#01588E", color: "white", fontWeight: "bold" } },
//               cells: { style: { fontSize: "14px", color: "#374151" } },
//               rows: {
//                 style: {
//                   "&:nth-child(even)": { backgroundColor: "#f9fafb" },
//                   "&:hover": { backgroundColor: "#f3f4f6" },
//                 },
//               },
//             }}
//           />
//         </div>
//       )}

//       {isFormOpen && selectedRow && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-lg">
//             <h2 className="text-xl font-bold mb-4">
//               {formMode === "add" ? "Add Expenses" : "Update Expenses"} for CN No: {selectedRow.CN_CN_NO}
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Left Column */}
//               <div>
//                 <div>
//                   <label>CN No</label>
//                   <input
//                     type="text"
//                     value={selectedRow.CN_CN_NO || ""}
//                     className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Kilometer</label>
//                   <input
//                     type="number"
//                     value={selectedRow.KILOMETER || ""}
//                     onChange={(e) => handleInputChange("KILOMETER", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Rate (per Km)</label>
//                   <input
//                     type="number"
//                     value={selectedRow.RATE || ""}
//                     onChange={(e) => handleInputChange("RATE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Latitude</label>
//                   <input
//                     type="number"
//                     value={selectedRow.LATITUDE || ""}
//                     onChange={(e) => handleInputChange("LATITUDE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Longitude</label>
//                   <input
//                     type="number"
//                     value={selectedRow.LONGITUDE || ""}
//                     onChange={(e) => handleInputChange("LONGITUDE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Freight (Auto-calculated)</label>
//                   <input
//                     type="number"
//                     value={selectedRow.FREIGHT || ""}
//                     className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Union/Km</label>
//                   <input
//                     type="number"
//                     value={selectedRow.UNION_KM || ""}
//                     onChange={(e) => handleInputChange("UNION_KM", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Extra Point</label>
//                   <input
//                     type="number"
//                     value={selectedRow.EXTRA_POINT || ""}
//                     onChange={(e) => handleInputChange("EXTRA_POINT", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Dt Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.DT_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("DT_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div>
//                 <div>
//                   <label>Escort Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.ESCORT_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("ESCORT_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Loading Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.LOADING_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("LOADING_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Unloading Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.UNLOADING_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("UNLOADING_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Labour Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.LABOUR_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("LABOUR_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Other Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.OTHER_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("OTHER_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Crane/Hydra Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.CRANE_HYDRA_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("CRANE_HYDRA_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Chain Pulley Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.CHAIN_PULLEY_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("CHAIN_PULLEY_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Toll Tax</label>
//                   <input
//                     type="number"
//                     value={selectedRow.TOLL_TAX || ""}
//                     onChange={(e) => handleInputChange("TOLL_TAX", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Packing Expense</label>
//                   <input
//                     type="number"
//                     value={selectedRow.PACKING_EXPENSE || ""}
//                     onChange={(e) => handleInputChange("PACKING_EXPENSE", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label>Total Amount (Auto-calculated)</label>
//                   <input
//                     type="number"
//                     value={selectedRow.TOTAL_AMOUNT || ""}
//                     className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Remarks</label>
//                   <textarea
//                     value={selectedRow.REMARKS || ""}
//                     onChange={(e) => handleInputChange("REMARKS", e.target.value)}
//                     className="w-full border rounded-lg p-2"
//                     rows="3"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end gap-4">
//               <button
//                 onClick={closeForm}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleSaveExpenses}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 {formMode === "add" ? "Add" : "Update"}
//               </button>
//             </div>
//           </div>
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
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [selectedRow, setSelectedRow] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "update"

  const token = getToken();
  const decodedToken = jwtDecode(token);
  const USER_ID = decodedToken.id;

  const openFormInAddMode = (row) => {
    setFormMode("add");
    setSelectedRow({
      CN_CN_NO: row.CN_CN_NO,
      KILOMETER: "",
      RATE: "",
      LATITUDE: "",
      LONGITUDE: "",
      FREIGHT: "",
      UNION_KM: "",
      EXTRA_POINT: "",
      DT_EXPENSE: "",
      ESCORT_EXPENSE: "",
      LOADING_EXPENSE: "",
      UNLOADING_EXPENSE: "",
      LABOUR_EXPENSE: "",
      OTHER_EXPENSE: "",
      CRANE_HYDRA_EXPENSE: "",
      HEADLOAD_EXPENSE: "",
      CHAIN_PULLEY_EXPENSE: "",
      TOLL_TAX: "",
      PACKING_EXPENSE: "",
      TOTAL_AMOUNT: "",
      REMARKS: "",
    });
    setIsFormOpen(true);
  };

  const openFormInUpdateMode = (row) => {
    setFormMode("update");
    setSelectedRow({
      CN_CN_NO: row.CN_CN_NO,
      KILOMETER: row.KILOMETER || "",
      RATE: row.RATE || "",
      LATITUDE: row.LATITUDE || "",
      LONGITUDE: row.LONGITUDE || "",
      FREIGHT: row.FREIGHT || "",
      UNION_KM: row.UNION_KM || "",
      EXTRA_POINT: row.EXTRA_POINT || "",
      DT_EXPENSE: row.DT_EXPENSE || "",
      ESCORT_EXPENSE: row.ESCORT_EXPENSE || "",
      LOADING_EXPENSE: row.LOADING_EXPENSE || "",
      UNLOADING_EXPENSE: row.UNLOADING_EXPENSE || "",
      LABOUR_EXPENSE: row.LABOUR_EXPENSE || "",
      OTHER_EXPENSE: row.OTHER_EXPENSE || "",
      CRANE_HYDRA_EXPENSE: row.CRANE_HYDRA_EXPENSE || "",
      HEADLOAD_EXPENSE: row.HEADLOAD_EXPENSE || "",
      CHAIN_PULLEY_EXPENSE: row.CHAIN_PULLEY_EXPENSE || "",
      TOLL_TAX: row.TOLL_TAX || "",
      PACKING_EXPENSE: row.PACKING_EXPENSE || "",
      TOTAL_AMOUNT: row.TOTAL_AMOUNT || "",
      REMARKS: row.REMARKS || "",
    });
    setIsFormOpen(true);
  };

  const handleInputChange = (field, value) => {
    setSelectedRow((prev) => {
      const updatedRow = { ...prev, [field]: value };

      // Auto-calculate Freight (Rate * Kilometer)
      const kilometer = parseFloat(updatedRow.KILOMETER) || 0;
      const rate = parseFloat(updatedRow.RATE) || 0;
      updatedRow.FREIGHT = (kilometer * rate).toFixed(2);

      // Auto-calculate Total Amount (sum of all expenses)
      const expenses = [
        parseFloat(updatedRow.FREIGHT) || 0,
        parseFloat(updatedRow.UNION_KM) || 0,
        parseFloat(updatedRow.EXTRA_POINT) || 0,
        parseFloat(updatedRow.DT_EXPENSE) || 0,
        parseFloat(updatedRow.ESCORT_EXPENSE) || 0,
        parseFloat(updatedRow.LOADING_EXPENSE) || 0,
        parseFloat(updatedRow.UNLOADING_EXPENSE) || 0,
        parseFloat(updatedRow.LABOUR_EXPENSE) || 0,
        parseFloat(updatedRow.OTHER_EXPENSE) || 0,
        parseFloat(updatedRow.CRANE_HYDRA_EXPENSE) || 0,
        parseFloat(updatedRow.HEADLOAD_EXPENSE) || 0,
        parseFloat(updatedRow.CHAIN_PULLEY_EXPENSE) || 0,
        parseFloat(updatedRow.TOLL_TAX) || 0,
        parseFloat(updatedRow.PACKING_EXPENSE) || 0,
      ];
      updatedRow.TOTAL_AMOUNT = expenses.reduce((sum, val) => sum + val, 0).toFixed(2);

      return updatedRow;
    });
  };

  const fetchLrDetailsData = async () => {
    setLoading(true);
    setError(false);

    try {
      const payload = {
        page,
        limit,
        FROMDATE: fromDate || "",
        TODATE: toDate || "",
        CNNO: search || "",
        USER_ID,
      };

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

      if (response.data.data.length === 0) {
        setError(true);
      }

      setData(response.data.data);
      setFilteredData(response.data.data);
      setTotalRows(response.data.total || response.data.data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLrDetailsData();
  }, [page, limit, fromDate, toDate, search]);

  const handleSearch = () => {
    setPage(1);
    fetchLrDetailsData();
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (newLimit, page) => {
    setLimit(newLimit);
    setPage(page);
  };

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

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedRow(null);
  };

  const handleSaveExpenses = async () => {
    if (!selectedRow) return;

    let payload;
    if (formMode === "add") {
      // Payload for addExpenses (uppercase keys, includes ENTERED_BY)
      payload = {
        CN_CN_NO: selectedRow.CN_CN_NO,
        KILOMETER: parseFloat(selectedRow.KILOMETER) || 0,
        RATE: parseFloat(selectedRow.RATE) || 0,
        LATITUDE: parseFloat(selectedRow.LATITUDE) || 0,
        LONGITUDE: parseFloat(selectedRow.LONGITUDE) || 0,
        FREIGHT: parseFloat(selectedRow.FREIGHT) || 0,
        UNION_KM: parseFloat(selectedRow.UNION_KM) || 0,
        EXTRA_POINT: parseFloat(selectedRow.EXTRA_POINT) || 0,
        DT_EXPENSE: parseFloat(selectedRow.DT_EXPENSE) || 0,
        ESCORT_EXPENSE: parseFloat(selectedRow.ESCORT_EXPENSE) || 0,
        LOADING_EXPENSE: parseFloat(selectedRow.LOADING_EXPENSE) || 0,
        UNLOADING_EXPENSE: parseFloat(selectedRow.UNLOADING_EXPENSE) || 0,
        LABOUR_EXPENSE: parseFloat(selectedRow.LABOUR_EXPENSE) || 0,
        OTHER_EXPENSE: parseFloat(selectedRow.OTHER_EXPENSE) || 0,
        CRANE_HYDRA_EXPENSE: parseFloat(selectedRow.CRANE_HYDRA_EXPENSE) || 0,
        HEADLOAD_EXPENSE: parseFloat(selectedRow.HEADLOAD_EXPENSE) || 0,
        CHAIN_PULLEY_EXPENSE: parseFloat(selectedRow.CHAIN_PULLEY_EXPENSE) || 0,
        TOLL_TAX: parseFloat(selectedRow.TOLL_TAX) || 0,
        PACKING_EXPENSE: parseFloat(selectedRow.PACKING_EXPENSE) || 0,
        TOTAL_AMOUNT: parseFloat(selectedRow.TOTAL_AMOUNT) || 0,
        REMARKS: selectedRow.REMARKS || "No remarks",
        ENTERED_BY: "admin",
        MODIFIED_BY: "admin",
      };
    } else {
      // Payload for updateExpenses (lowercase keys, no ENTERED_BY)
      payload = {
        cn_cn_no: selectedRow.CN_CN_NO,
        kilometer: parseFloat(selectedRow.KILOMETER) || 0,
        rate: parseFloat(selectedRow.RATE) || 0,
        latitude: parseFloat(selectedRow.LATITUDE) || 0,
        longitude: parseFloat(selectedRow.LONGITUDE) || 0,
        freight: parseFloat(selectedRow.FREIGHT) || 0,
        union_km: parseFloat(selectedRow.UNION_KM) || 0,
        extra_point: parseFloat(selectedRow.EXTRA_POINT) || 0,
        dt_expense: parseFloat(selectedRow.DT_EXPENSE) || 0,
        escort_expense: parseFloat(selectedRow.ESCORT_EXPENSE) || 0,
        loading_expense: parseFloat(selectedRow.LOADING_EXPENSE) || 0,
        unloading_expense: parseFloat(selectedRow.UNLOADING_EXPENSE) || 0,
        labour_expense: parseFloat(selectedRow.LABOUR_EXPENSE) || 0,
        other_expense: parseFloat(selectedRow.OTHER_EXPENSE) || 0,
        crane_hydra_expense: parseFloat(selectedRow.CRANE_HYDRA_EXPENSE) || 0,
        headload_expense: parseFloat(selectedRow.HEADLOAD_EXPENSE) || 0,
        chain_pulley_expense: parseFloat(selectedRow.CHAIN_PULLEY_EXPENSE) || 0,
        toll_tax: parseFloat(selectedRow.TOLL_TAX) || 0,
        packing_expense: parseFloat(selectedRow.PACKING_EXPENSE) || 0,
        total_amount: parseFloat(selectedRow.TOTAL_AMOUNT) || 0,
        remarks: selectedRow.REMARKS || "No remarks",
        modified_by: "admin",
      };
    }

    console.log("Payload:", payload);
    console.log("Token:", token);

    const apiUrl = formMode === "add"
      ? "https://vmsnode.omlogistics.co.in/api/addExpenses"
      : "https://vmsnode.omlogistics.co.in/api/updateExpenses";

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.error === false) {
        toast.success(response.data.msg || `${formMode === "add" ? "Added" : "Updated"} successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        closeForm();
        fetchLrDetailsData();
      } else {
        toast.error(response.data.msg || "Operation failed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error(`Failed to ${formMode === "add" ? "add" : "update"} expenses: ${error.response?.data?.msg || error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const columns = [
    { name: "Row Number", selector: (row) => row.ROW_NUM || "-", sortable: true, wrap: true, width: "150px" },
    { name: "CN No", selector: (row) => row.CN_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openFormInAddMode(row)}
            className="text-blue-500 text-xl hover:text-blue-700"
          >
            +
          </button>
          <button
            onClick={() => openFormInUpdateMode(row)}
            className="text-green-500 text-xl hover:text-green-700"
          >
            ✎
          </button>
        </div>
      ),
      width: "100px",
    },
    { name: "Manual CN No", selector: (row) => row.CN_MANUAL_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
    { name: "CN Date", selector: (row) => (row.CN_CN_DATE ? new Date(row.CN_CN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "150px" },
    { name: "Source Branch Code", selector: (row) => row.CN_SOURCE_BRANCH_CODE || "-", sortable: true, wrap: true, width: "170px" },
    { name: "Destination Branch Code", selector: (row) => row.CN_DESTINATION_BRANCH_CODE || "-", sortable: true, wrap: true, width: "190px" },
    { name: "Mode VAT", selector: (row) => row.CN_MODE_VAT || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Item Description", selector: (row) => row.CN_ITEM_DESCRIPT || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Total Packages", selector: (row) => row.TOTAL_CN_PKG || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Total Weight", selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Challan Vendor Code", selector: (row) => row.CHLN_VENDOR_CODE || "-", sortable: true, wrap: true, width: "190px" },
    { name: "Challan No", selector: (row) => row.CHLN_CHLN_NO || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Challan Date", selector: (row) => (row.CHLN_CHLN_DATE ? new Date(row.CHLN_CHLN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "170px" },
    { name: "Lorry No", selector: (row) => row.CHLN_LORRY_NO || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Site ID", selector: (row) => row.SITE_ID || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Kilometer", selector: (row) => row.KILOMETER || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Rate", selector: (row) => row.RATE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Latitude", selector: (row) => row.LATITUDE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Longitude", selector: (row) => row.LONGITUDE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Freight", selector: (row) => row.FREIGHT || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Union KM", selector: (row) => row.UNION_KM || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Extra Point", selector: (row) => row.EXTRA_POINT || "-", sortable: true, wrap: true, width: "150px" },
    { name: "DT Expense", selector: (row) => row.DT_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Escort Expense", selector: (row) => row.ESCORT_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Loading Expense", selector: (row) => row.LOADING_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Unloading Expense", selector: (row) => row.UNLOADING_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Labour Expense", selector: (row) => row.LABOUR_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Other Expense", selector: (row) => row.OTHER_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Crane Hydra Expense", selector: (row) => row.CRANE_HYDRA_EXPENSE || "-", sortable: true, wrap: true, width: "170px" },
    { name: "Headload Expense", selector: (row) => row.HEADLOAD_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Chain Pulley Expense", selector: (row) => row.CHAIN_PULLEY_EXPENSE || "-", sortable: true, wrap: true, width: "170px" },
    { name: "Toll Tax", selector: (row) => row.TOLL_TAX || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Packing Expense", selector: (row) => row.PACKING_EXPENSE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Total Amount", selector: (row) => row.TOTAL_AMOUNT || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Remarks", selector: (row) => row.REMARKS || "-", sortable: true, wrap: true, width: "200px" },
  ];

  const rowPerPageOptions = [50, 100, 150, 200, 300, 400, 500, 1000, 2000, 5000, 10000];

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${marginClass} transition-all duration-300`}>
      <ToastContainer />

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

      {loading && <div className="text-center text-blue-600 text-lg">Loading...</div>}
      {error && <div className="text-center text-red-600 text-lg">No data found</div>}

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
              headRow: { style: { backgroundColor: "#01588E", color: "white", fontWeight: "bold" } },
              cells: { style: { fontSize: "14px", color: "#374151" } },
              rows: {
                style: {
                  "&:nth-child(even)": { backgroundColor: "#f9fafb" },
                  "&:hover": { backgroundColor: "#f3f4f6" },
                },
              },
            }}
          />
        </div>
      )}

      {isFormOpen && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {formMode === "add" ? "Add Expenses" : "Update Expenses"} for CN No: {selectedRow.CN_CN_NO}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column */}
              <div>
                <div>
                  <label>CN No</label>
                  <input
                    type="text"
                    value={selectedRow.CN_CN_NO || ""}
                    className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label>Kilometer</label>
                  <input
                    type="number"
                    value={selectedRow.KILOMETER || ""}
                    onChange={(e) => handleInputChange("KILOMETER", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Rate (per Km)</label>
                  <input
                    type="number"
                    value={selectedRow.RATE || ""}
                    onChange={(e) => handleInputChange("RATE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Latitude</label>
                  <input
                    type="number"
                    value={selectedRow.LATITUDE || ""}
                    onChange={(e) => handleInputChange("LATITUDE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Longitude</label>
                  <input
                    type="number"
                    value={selectedRow.LONGITUDE || ""}
                    onChange={(e) => handleInputChange("LONGITUDE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Freight (Auto-calculated)</label>
                  <input
                    type="number"
                    value={selectedRow.FREIGHT || ""}
                    className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label>Union/Km</label>
                  <input
                    type="number"
                    value={selectedRow.UNION_KM || ""}
                    onChange={(e) => handleInputChange("UNION_KM", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Extra Point</label>
                  <input
                    type="number"
                    value={selectedRow.EXTRA_POINT || ""}
                    onChange={(e) => handleInputChange("EXTRA_POINT", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Dt Expense</label>
                  <input
                    type="number"
                    value={selectedRow.DT_EXPENSE || ""}
                    onChange={(e) => handleInputChange("DT_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div>
                  <label>Escort Expense</label>
                  <input
                    type="number"
                    value={selectedRow.ESCORT_EXPENSE || ""}
                    onChange={(e) => handleInputChange("ESCORT_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Loading Expense</label>
                  <input
                    type="number"
                    value={selectedRow.LOADING_EXPENSE || ""}
                    onChange={(e) => handleInputChange("LOADING_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Unloading Expense</label>
                  <input
                    type="number"
                    value={selectedRow.UNLOADING_EXPENSE || ""}
                    onChange={(e) => handleInputChange("UNLOADING_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Labour Expense</label>
                  <input
                    type="number"
                    value={selectedRow.LABOUR_EXPENSE || ""}
                    onChange={(e) => handleInputChange("LABOUR_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Other Expense</label>
                  <input
                    type="number"
                    value={selectedRow.OTHER_EXPENSE || ""}
                    onChange={(e) => handleInputChange("OTHER_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Crane/Hydra Expense</label>
                  <input
                    type="number"
                    value={selectedRow.CRANE_HYDRA_EXPENSE || ""}
                    onChange={(e) => handleInputChange("CRANE_HYDRA_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Chain Pulley Expense</label>
                  <input
                    type="number"
                    value={selectedRow.CHAIN_PULLEY_EXPENSE || ""}
                    onChange={(e) => handleInputChange("CHAIN_PULLEY_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Toll Tax</label>
                  <input
                    type="number"
                    value={selectedRow.TOLL_TAX || ""}
                    onChange={(e) => handleInputChange("TOLL_TAX", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Packing Expense</label>
                  <input
                    type="number"
                    value={selectedRow.PACKING_EXPENSE || ""}
                    onChange={(e) => handleInputChange("PACKING_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Total Amount (Auto-calculated)</label>
                  <input
                    type="number"
                    value={selectedRow.TOTAL_AMOUNT || ""}
                    className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label>Remarks</label>
                  <textarea
                    value={selectedRow.REMARKS || ""}
                    onChange={(e) => handleInputChange("REMARKS", e.target.value)}
                    className="w-full border rounded-lg p-2"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={closeForm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Close
              </button>
              <button
                onClick={handleSaveExpenses}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {formMode === "add" ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LrDetails;