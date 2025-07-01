// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DataTable from "react-data-table-component";
// import { getToken } from "../../Auth/auth";
// import { CustomTable } from "../Ui/CustomTable";
// import { jwtDecode } from "jwt-decode";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AnnextureDetails = ({ isNavbarCollapsed }) => {
//   const marginClass = isNavbarCollapsed ? "ml-16" : "ml-66";

//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [chlnVendorCode, setChlnVendorCode] = useState("");
//   const [totalRows, setTotalRows] = useState(0);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [rawData, setRawData] = useState([]);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const token = getToken();
//   const decodedToken = jwtDecode(token);
//   const USER_ID = decodedToken.id;
//   const [editFormData, setEditFormData] = useState({
//     CN_NO: "",
//     BRANCH_Weight: "",
//     BRANCH_LOCATIONS: "",
//     BRANCH_FLOOR: "",
//     BRANCH_Item_Description: "",
//     BRANCH_KM: "",
//     BRANCH_Latitude: "",
//     BRANCH_Longitude: "",
//     BRANCH_Flag: "Y",
//     BRANCH_REMARKS: "",
//     BRANCH_Crane: "",
//     BRANCH_Hydra: "",
//     BRANCH_Chain_Pulling: "",
//     BRANCH_HKM: "",
//     BRANCH_Labour_expenses: "",
//     BRANCH_Other_expenses: "",
//     BRANCH_Special_Vehicle: "",
//     BRANCH_ENTERED_BY: USER_ID,
//   });

//   const groupDataByAnnexure = (rawData) => {
//     const grouped = rawData.reduce((acc, item) => {
//       const annexureNo = item.ANNEXURE_NO;
//       if (!acc[annexureNo]) {
//         acc[annexureNo] = {
//           ANNEXURE_NO: annexureNo,
//           CHALLAN_VENDOR_CODE: item.CHALLAN_VENDOR_CODE,
//           TOTAL_AMOUNT: 0,
//           RNUM: item.RNUM,
//           items: [],
//         };
//       }
//       acc[annexureNo].TOTAL_AMOUNT += parseFloat(item.TOTAL_AMOUNT || 0);
//       acc[annexureNo].items.push(item);
//       return acc;
//     }, {});

//     return Object.values(grouped).map((group, index) => ({
//       ...group,
//       RNUM: index + 1,
//     }));
//   };

//   const fetchAnnexureDetails = async () => {
//     setLoading(true);
//     setError(false);

//     try {
//       const response = await axios.post(
//         "https://vmsnode.omlogistics.co.in/api/PostedBill",
//         {
//           page,
//           limit,
//           FROMDATE: fromDate,
//           TODATE: toDate,
//           CHLN_VENDOR_CODE: chlnVendorCode,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("fetchAnnexureDetails Response:", response.data);

//       if (response.data.data.length === 0) {
//         setError(true);
//         setData([]);
//         setFilteredData([]);
//         setRawData([]);
//         setTotalRows(0);
//       } else {
//         const groupedData = groupDataByAnnexure(response.data.data);
//         setRawData(response.data.data);
//         setData(groupedData);
//         setFilteredData(groupedData);
//         setTotalRows(response.data.totalRecords || groupedData.length);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       if (error.response?.status === 403) {
//         setError("Session expired. Please log in again.");
//         window.location.href = "/login";
//       } else {
//         setError(error.response?.data?.message || "An error occurred while fetching data.");
//       }
//       setData([]);
//       setFilteredData([]);
//       setRawData([]);
//       setTotalRows(0);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchAnnexureDetails();
//   }, [page, limit, fromDate, toDate, chlnVendorCode]);

//   useEffect(() => {
//     const result = data.filter((item) =>
//       item.ANNEXURE_NO.toString().includes(search)
//     );
//     setFilteredData(result);
//   }, [search, data]);

//   const handlePageChange = (page) => {
//     setPage(page);
//   };

//   const handleRowsPerPageChange = (newLimit, page) => {
//     setLimit(newLimit);
//     setPage(page);
//   };

//   const columns = [
//     {
//       name: "Row No",
//       selector: (row) => row.RNUM,
//       sortable: true,
//       wrap: true,
//       width: "100px",
//     },
//     {
//       name: "Annexure No.",
//       selector: (row) => row.ANNEXURE_NO,
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Vendor Code",
//       selector: (row) => row.CHALLAN_VENDOR_CODE,
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Total Amount",
//       selector: (row) => row.TOTAL_AMOUNT.toFixed(2),
//       sortable: true,
//       wrap: true,
//     },
//   ];

//   const modalColumns = [
//     {
//       name: "LR No.",
//       selector: (row) => row.CN_NO,
//       sortable: true,
//       wrap: true,
//       width: "150px",
//     },
//     {
//       name: "LR Date",
//       selector: (row) =>
//         row.CN_DATE ? new Date(row.CN_DATE).toLocaleDateString() : "-",
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Mode",
//       selector: (row) => row.MODE_VAT,
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Packet Count",
//       selector: (row) => row.TOTAL_PACKAGES,
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Weight",
//       selector: (row) => row.TOTAL_WEIGHT || "-",
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Item",
//       selector: (row) => row.ITEM_DESCRIPTION || "-",
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "KM",
//       selector: (row) => row.KILOMETER || "-",
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Latitude",
//       selector: (row) => row.LATITUDE || "-",
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Longitude",
//       selector: (row) => row.LONGITUDE || "-",
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Floor (GPT, RRT)",
//       selector: (row) => row.FLOOR || "-",
//       sortable: true,
//       wrap: true,
//     },
//     {
//       name: "Verify",
//       selector: (row) => {
//         if (row.BRANCH_FLAG === "Y") {
//           return (
//             <span className="text-green-500 font-bold">✔</span>
//           );
//         }
//         return "❌";
//       },
//       sortable: true,
//       wrap: true,
//       width: "100px",
//     },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <button
//           className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//           onClick={() => {
//             setSelectedRow(row);
//             setEditFormData({
//               CN_NO: row.CN_NO,
//               BRANCH_Weight: row.BRANCH_Weight || "",
//               BRANCH_LOCATIONS: row.BRANCH_LOCATIONS || "",
//               BRANCH_FLOOR: row.BRANCH_FLOOR || "",
//               BRANCH_Item_Description: row.BRANCH_Item_Description || "",
//               BRANCH_KM: row.BRANCH_KM || "",
//               BRANCH_Latitude: row.BRANCH_Latitude || "",
//               BRANCH_Longitude: row.BRANCH_Longitude || "",
//               BRANCH_Flag: row.BRANCH_Flag || "Y",
//               BRANCH_REMARKS: row.BRANCH_REMARKS || "",
//               BRANCH_Crane: row.BRANCH_Crane || "",
//               BRANCH_Hydra: row.BRANCH_Hydra || "",
//               BRANCH_Chain_Pulling: row.BRANCH_Chain_Pulling || "",
//               BRANCH_HKM: row.BRANCH_HKM || "",
//               BRANCH_Labour_expenses: row.BRANCH_Labour_expenses || "",
//               BRANCH_Other_expenses: row.BRANCH_Other_expenses || "",
//               BRANCH_Special_Vehicle: row.BRANCH_Special_Vehicle || "",
//               BRANCH_ENTERED_BY: USER_ID,
//             });
//             setEditModalOpen(true);
//           }}
//         >
//           Edit
//         </button>
//       ),
//       ignoreRowClick: true,
//       allowOverflow: true,
//       button: true,
//     },
//   ];

//   const rowPerPageOptions = [20, 50, 100, 200, 500, 1000, 5000, 10000];

//   const handleRowClick = (row) => {
//     setFilteredData(row.items);
//     setModalOpen(true);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setEditFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? (checked ? "Y" : "") : value,
//     }));
//   };

//   const checkRecordExists = async (cnNo) => {
    
//     try {
//       const response = await axios.post(
//         "https://vmsnode.omlogistics.co.in/api/checkBillVerification",
//         { CN_NO: cnNo },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       // Return true if error is false (record exists, so update), false otherwise (record doesn't exist, so insert)
//       return !response.data.error;
//     } catch (error) {
//       console.error("Error checking record existence:", error);
//       if (error.response?.status === 403) {
//         setError("Session expired. Please log in again.");
//         window.location.href = "/login";
//       } else {
//         setError(error.response?.data?.message || "An error occurred while fetching data.");
//       }
//       // Default to insert if check fails
//       return false;
//     }
//   };
//   const handleSave = async () => {
//     let recordExists = false; // Define recordExists outside the try block
//     try {
//       recordExists = await checkRecordExists(editFormData.CN_NO);
//       const apiUrl = recordExists
//         ? "https://vmsnode.omlogistics.co.in/api/updateBillVerification"
//         : "https://vmsnode.omlogistics.co.in/api/insertBillVerification";

//       const payload = {
//         CN_NO: editFormData.CN_NO,
//         BRANCH_Weight: editFormData.BRANCH_Weight,
//         BRANCH_LOCATIONS: editFormData.BRANCH_LOCATIONS,
//         BRANCH_FLOOR: editFormData.BRANCH_FLOOR,
//         BRANCH_Item_Description: editFormData.BRANCH_Item_Description,
//         BRANCH_KM: editFormData.BRANCH_KM,
//         BRANCH_Latitude: editFormData.BRANCH_Latitude,
//         BRANCH_Longitude: editFormData.BRANCH_Longitude,
//         BRANCH_Flag: editFormData.BRANCH_Flag,
//         BRANCH_REMARKS: editFormData.BRANCH_REMARKS,
//         BRANCH_Crane: editFormData.BRANCH_Crane,
//         BRANCH_Hydra: editFormData.BRANCH_Hydra,
//         BRANCH_Chain_Pulling: editFormData.BRANCH_Chain_Pulling,
//         BRANCH_HKM: editFormData.BRANCH_HKM,
//         BRANCH_Labour_expenses: editFormData.BRANCH_Labour_expenses,
//         BRANCH_Other_expenses: editFormData.BRANCH_Other_expenses,
//         BRANCH_Special_Vehicle: editFormData.BRANCH_Special_Vehicle,
//         [recordExists ? "BRANCH_MODIFIED_BY" : "BRANCH_ENTERED_BY"]: USER_ID,
//       };
   
//       const response = await axios.post(apiUrl, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.data.error === false) {
//         await fetchAnnexureDetails();
//         setEditModalOpen(false);
//         toast.success(recordExists ? "Data updated successfully!" : "Data inserted successfully!");
//         window.location.reload();
//       } else {
//         const errorMessage = response.data.msg || "Unknown error occurred";
//         toast.error(`Failed to ${recordExists ? "update" : "insert"} data: ${errorMessage}`);
//       }
//     } catch (error) {
//       if (error.response?.status === 403) {
//         setError("Session expired. Please log in again.");
//         window.location.href = "/login";
//       } else {
//         setError(error.response?.data?.message || "An error occurred while fetching data.");
//       }
     
//       toast.error(`An error occurred while ${recordExists ? "updating" : "inserting"} data: ${errorMessage}`);
//     }
//   };

//   return (
//     <div
//       className={`bg-gray-50 py-3 px-6 ${marginClass} transition-all duration-300`}
//     >
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//       />
//       <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-8xl mx-auto">
//         <div>
//           <label
//             htmlFor="fromDate"
//             className="block text-xs font-medium text-gray-700 mb-1"
//           >
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
//           <label
//             htmlFor="toDate"
//             className="block text-xs font-medium text-gray-700 mb-1"
//           >
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
//         <div className="col-span-1 space-y-2 md:flex items-end pb-1 gap-2 w-full">
//           <div className="w-[70%]">
//             <label
//               htmlFor="search"
//               className="whitespace-nowrap block text-xs font-medium text-gray-700 mb-1"
//             >
//               Search by Annex No
//             </label>
//             <input
//               id="search"
//               type="text"
//               placeholder="Search by Annex No"
//               className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <div>
//             <button
//               onClick={fetchAnnexureDetails}
//               className="whitespace-nowrap px-4 w-full py-2 bg-[#01588E] text-white rounded-lg font-semibold hover:bg-[#014a73] transition-colors"
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       {loading && (
//         <div className="text-center text-blue-600 text-lg">Loading...</div>
//       )}
//       {error && (
//         <div className="text-center text-red-600 text-lg">No data found</div>
//       )}

//       {!loading && !error && data.length > 0 && (
//         <>
//           <CustomTable
//             handleRowClick={handleRowClick}
//             page={page}
//             columns={columns}
//             data={filteredData}
//             totalRows={totalRows}
//             limit={limit}
//             rowPerPageOptions={rowPerPageOptions}
//             handlePageChange={handlePageChange}
//             handleRowsPerPageChange={handleRowsPerPageChange}
//             filteredData={filteredData}
//           />
//         </>
//       )}

//       {modalOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//           onClick={() => {
//             setFilteredData(data);
//             setModalOpen(false);
//           }}
//         >
//           <div
//             className="rounded-lg overflow-hidden w-full m-2 max-w-5xl overflow-y-auto shadow-lg relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="overflow-x-auto max-w-10xl mx-auto shadow-xl">
//               <DataTable
//                 columns={modalColumns}
//                 data={filteredData}
//                 pagination
//                 paginationServer
//                 paginationTotalRows={filteredData.length}
//                 paginationPerPage={limit}
//                 paginationDefaultPage={page}
//                 paginationRowsPerPageOptions={rowPerPageOptions}
//                 onChangePage={handlePageChange}
//                 onChangeRowsPerPage={handleRowsPerPageChange}
//                 highlightOnHover
//                 responsive
//                 customStyles={{
//                   headRow: {
//                     style: {
//                       fontSize: "13px",
//                     },
//                   },
//                 }}
//                 fixedHeader
//                 fixedHeaderScrollHeight="70vh"
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {editModalOpen && selectedRow && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
//           onClick={() => setEditModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] w-full overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     CN_No (Original)
//                   </label>
//                   <input
//                     type="text"
//                     className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
//                     value={selectedRow.CN_NO || ""}
//                     disabled
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Weight (Original)
//                   </label>
//                   <input
//                     type="text"
//                     className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
//                     value={selectedRow.TOTAL_WEIGHT || ""}
//                     disabled
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Locations (Original)
//                   </label>
//                   <input
//                     type="text"
//                     className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
//                     value={selectedRow.LOCATIONS || ""}
//                     disabled
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Floor (Original)
//                   </label>
//                   <input
//                     type="text"
//                     className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
//                     value={selectedRow.FLOOR || ""}
//                     disabled
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Item Description (Original)
//                   </label>
//                   <input
//                     type="text"
//                     className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
//                     value={selectedRow.ITEM_DESCRIPTION || ""}
//                     disabled
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     KM (Original)
//                   </label>
//                   <input
//                     type="text"
//                     className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
//                     value={selectedRow.KILOMETER || ""}
//                     disabled
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Latitude (Original)
//                   </label>
//                   <input
//                     type="text"
//                     className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
//                     value={selectedRow.LATITUDE || ""}
//                     disabled
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Longitude (Original)
//                   </label>
//                   <input
//                     type="text"
//                     className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
//                     value={selectedRow.LONGITUDE || ""}
//                     disabled
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Crane
//                     </label>
//                     <input
//                       type="checkbox"
//                       name="BRANCH_Crane"
//                       className="h-5 w-5 text-blue-600 focus:ring-blue-200"
//                       checked={editFormData.BRANCH_Crane === "Y"}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Hydra
//                     </label>
//                     <input
//                       type="checkbox"
//                       name="BRANCH_Hydra"
//                       className="h-5 w-5 text-blue-600 focus:ring-blue-200"
//                       checked={editFormData.BRANCH_Hydra === "Y"}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Chain Pulling
//                     </label>
//                     <input
//                       type="checkbox"
//                       name="BRANCH_Chain_Pulling"
//                       className="h-5 w-5 text-blue-600 focus:ring-blue-200"
//                       checked={editFormData.BRANCH_Chain_Pulling === "Y"}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       HKM
//                     </label>
//                     <input
//                       type="checkbox"
//                       name="BRANCH_HKM"
//                       className="h-5 w-5 text-blue-600 focus:ring-blue-200"
//                       checked={editFormData.BRANCH_HKM === "Y"}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Labour Expenses
//                     </label>
//                     <input
//                       type="checkbox"
//                       name="BRANCH_Labour_expenses"
//                       className="h-5 w-5 text-blue-600 focus:ring-blue-200"
//                       checked={editFormData.BRANCH_Labour_expenses === "Y"}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Other Expenses
//                     </label>
//                     <input
//                       type="checkbox"
//                       name="BRANCH_Other_expenses"
//                       className="h-5 w-5 text-blue-600 focus:ring-blue-200"
//                       checked={editFormData.BRANCH_Other_expenses === "Y"}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Special Vehicle
//                     </label>
//                     <input
//                       type="checkbox"
//                       name="BRANCH_Special_Vehicle"
//                       className="h-5 w-5 text-blue-600 focus:ring-blue-200"
//                       checked={editFormData.BRANCH_Special_Vehicle === "Y"}
//                       onChange={handleInputChange}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     CN_No
//                   </label>
//                   <input
//                     type="text"
//                     className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
//                     value={editFormData.CN_NO || ""}
//                     disabled
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Weight
//                   </label>
//                   <input
//                     type="text"
//                     name="BRANCH_Weight"
//                     className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
//                     value={editFormData.BRANCH_Weight}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Locations
//                   </label>
//                   <input
//                     type="text"
//                     name="BRANCH_LOCATIONS"
//                     className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
//                     value={editFormData.BRANCH_LOCATIONS}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Floor
//                   </label>
//                   <input
//                     type="text"
//                     name="BRANCH_FLOOR"
//                     className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
//                     value={editFormData.BRANCH_FLOOR}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Item Description
//                   </label>
//                   <input
//                     type="text"
//                     name="BRANCH_Item_Description"
//                     className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
//                     value={editFormData.BRANCH_Item_Description}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     KM
//                   </label>
//                   <input
//                     type="text"
//                     name="BRANCH_KM"
//                     className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
//                     value={editFormData.BRANCH_KM}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Latitude
//                   </label>
//                   <input
//                     type="text"
//                     name="BRANCH_Latitude"
//                     className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
//                     value={editFormData.BRANCH_Latitude}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Longitude
//                   </label>
//                   <input
//                     type="text"
//                     name="BRANCH_Longitude"
//                     className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
//                     value={editFormData.BRANCH_Longitude}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Remarks
//                   </label>
//                   <textarea
//                     name="BRANCH_REMARKS"
//                     className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
//                     value={editFormData.BRANCH_REMARKS}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end space-x-2">
//               <button
//                 className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
//                 onClick={() => setEditModalOpen(false)}
//               >
//                 Close
//               </button>
//               <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                 onClick={handleSave}
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

// export default AnnextureDetails;



import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { CustomTable } from "../Ui/CustomTable";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AnnextureDetails = ({ isNavbarCollapsed }) => {
  const marginClass = isNavbarCollapsed ? "ml-16" : "ml-66";

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chlnVendorCode, setChlnVendorCode] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const token = getToken();
  const decodedToken = jwtDecode(token);
  const USER_ID = decodedToken.id;
  const [editFormData, setEditFormData] = useState({
    CN_NO: "",
    BRANCH_Weight: "",
    BRANCH_LOCATIONS: "",
    BRANCH_FLOOR: "",
    BRANCH_Item_Description: "",
    BRANCH_KM: "",
    BRANCH_Latitude: "",
    BRANCH_Longitude: "",
    BRANCH_Flag: "Y",
    BRANCH_REMARKS: "",
    BRANCH_Crane: "",
    BRANCH_Hydra: "",
    BRANCH_Chain_Pulling: "",
    BRANCH_HKM: "",
    BRANCH_Labour_expenses: "",
    BRANCH_Other_expenses: "",
    BRANCH_Special_Vehicle: "",
    BRANCH_ENTERED_BY: USER_ID,
  });

  const groupDataByAnnexure = (rawData) => {
    // console.log("Raw Data from PostedBill:", rawData); // Debug log
    const grouped = rawData.reduce((acc, item) => {
      const annexureNo = item.ANNEXURE_NO || "";
      if (!acc[annexureNo]) {
        acc[annexureNo] = {
          ANNEXURE_NO: annexureNo,
          CHALLAN_VENDOR_CODE: item.CHALLAN_VENDOR_CODE,
          TOTAL_AMOUNT: 0,
          RNUM: item.RNUM,
          items: [],
        };
      }
      acc[annexureNo].TOTAL_AMOUNT += parseFloat(item.TOTAL_AMOUNT || 0);
      acc[annexureNo].items.push({
        ...item,
        ANNEXURE_NO: annexureNo, // Explicitly include ANNEXURE_NO
      });
      return acc;
    }, {});

    const groupedData = Object.values(grouped).map((group, index) => ({
      ...group,
      RNUM: index + 1,
    }));
    // console.log("Grouped Data:", groupedData); // Debug log
    return groupedData;
  };

  const fetchAnnexureDetails = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios.post(
        "https://vmsnode.omlogistics.co.in/api/PostedBill",
        {
          page,
          limit,
          FROMDATE: fromDate,
          TODATE: toDate,
          CHLN_VENDOR_CODE: chlnVendorCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("fetchAnnexureDetails Response:", response.data); // Debug log

      if (response.data.data.length === 0) {
        setError(true);
        setData([]);
        setFilteredData([]);
        setRawData([]);
        setTotalRows(0);
      } else {
        const groupedData = groupDataByAnnexure(response.data.data);
        setRawData(response.data.data);
        setData(groupedData);
        setFilteredData(groupedData);
        setTotalRows(response.data.totalRecords || groupedData.length);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 403) {
        setError("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        setError(error.response?.data?.message || "An error occurred while fetching data.");
      }
      setData([]);
      setFilteredData([]);
      setRawData([]);
      setTotalRows(0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAnnexureDetails();
  }, [page, limit, fromDate, toDate, chlnVendorCode]);

  useEffect(() => {
    const result = data.filter((item) =>
      item.ANNEXURE_NO.toString().includes(search)
    );
    setFilteredData(result);
  }, [search, data]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = (newLimit, page) => {
    setLimit(newLimit);
    setPage(page);
  };

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
      selector: (row) => row.ANNEXURE_NO,
      sortable: true,
      wrap: true,
    },
    {
      name: "Vendor Code",
      selector: (row) => row.CHALLAN_VENDOR_CODE,
      sortable: true,
      wrap: true,
    },
    {
      name: "Total Amount",
      selector: (row) => row.TOTAL_AMOUNT.toFixed(2),
      sortable: true,
      wrap: true,
    },
  ];

  const modalColumns = [
    {
      name: "LR No.",
      selector: (row) => row.CN_NO,
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "LR Date",
      selector: (row) =>
        row.CN_DATE ? new Date(row.CN_DATE).toLocaleDateString() : "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Mode",
      selector: (row) => row.MODE_VAT,
      sortable: true,
      wrap: true,
    },
    {
      name: "Packet Count",
      selector: (row) => row.TOTAL_PACKAGES,
      sortable: true,
      wrap: true,
    },
    {
      name: "Weight",
      selector: (row) => row.TOTAL_WEIGHT || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Item",
      selector: (row) => row.ITEM_DESCRIPTION || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "KM",
      selector: (row) => row.KILOMETER || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Latitude",
      selector: (row) => row.LATITUDE || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Longitude",
      selector: (row) => row.LONGITUDE || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Floor (GPT, RRT)",
      selector: (row) => row.FLOOR || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Verify",
      selector: (row) => {
        if (row.BRANCH_FLAG === "Y") {
          return (
            <span className="text-green-500 font-bold">✔</span>
          );
        }
        return "❌";
      },
      sortable: true,
      wrap: true,
      width: "100px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            // console.log("Selected Row for Edit:", row); // Debug log
            setSelectedRow(row);
            setEditFormData({
              CN_NO: row.CN_NO,
              BRANCH_Weight: row.BRANCH_Weight || "",
              BRANCH_LOCATIONS: row.BRANCH_LOCATIONS || "",
              BRANCH_FLOOR: row.BRANCH_FLOOR || "",
              BRANCH_Item_Description: row.BRANCH_Item_Description || "",
              BRANCH_KM: row.BRANCH_KM || "",
              BRANCH_Latitude: row.BRANCH_Latitude || "",
              BRANCH_Longitude: row.BRANCH_Longitude || "",
              BRANCH_Flag: row.BRANCH_Flag || "Y",
              BRANCH_REMARKS: row.BRANCH_REMARKS || "",
              BRANCH_Crane: row.BRANCH_Crane || "",
              BRANCH_Hydra: row.BRANCH_Hydra || "",
              BRANCH_Chain_Pulling: row.BRANCH_Chain_Pulling || "",
              BRANCH_HKM: row.BRANCH_HKM || "",
              BRANCH_Labour_expenses: row.BRANCH_Labour_expenses || "",
              BRANCH_Other_expenses: row.BRANCH_Other_expenses || "",
              BRANCH_Special_Vehicle: row.BRANCH_Special_Vehicle || "",
              BRANCH_ENTERED_BY: USER_ID,
            });
            setEditModalOpen(true);
          }}
        >
          Edit
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const rowPerPageOptions = [20, 50, 100, 200, 500, 1000, 5000, 10000];

  const handleRowClick = (row) => {
    // console.log("Row Items for Modal:", row.items); // Debug log
    setFilteredData(row.items);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "Y" : "") : value,
    }));
  };

  const checkRecordExists = async (cnNo) => {
    try {
      const response = await axios.post(
        "https://vmsnode.omlogistics.co.in/api/checkBillVerification",
        { CN_NO: cnNo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return !response.data.error;
    } catch (error) {
      console.error("Error checking record existence:", error);
      if (error.response?.status === 403) {
        setError("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        setError(error.response?.data?.message || "An error occurred while fetching data.");
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (!selectedRow?.ANNEXURE_NO) {
      toast.error("Annexure Number is missing for this CN_NO.");
      return;
    }

    let recordExists = false;
    try {
      recordExists = await checkRecordExists(editFormData.CN_NO);
      const apiUrl = recordExists
        ? "https://vmsnode.omlogistics.co.in/api/updateBillVerification"
        : "https://vmsnode.omlogistics.co.in/api/insertBillVerification";

      const payload = {
        CN_NO: editFormData.CN_NO,
        ANNEXURE_NO: selectedRow.ANNEXURE_NO,
        BRANCH_Weight: editFormData.BRANCH_Weight,
        BRANCH_LOCATIONS: editFormData.BRANCH_LOCATIONS,
        BRANCH_FLOOR: editFormData.BRANCH_FLOOR,
        BRANCH_Item_Description: editFormData.BRANCH_Item_Description,
        BRANCH_KM: editFormData.BRANCH_KM,
        BRANCH_Latitude: editFormData.BRANCH_Latitude,
        BRANCH_Longitude: editFormData.BRANCH_Longitude,
        BRANCH_Flag: editFormData.BRANCH_Flag,
        BRANCH_REMARKS: editFormData.BRANCH_REMARKS,
        BRANCH_Crane: editFormData.BRANCH_Crane,
        BRANCH_Hydra: editFormData.BRANCH_Hydra,
        BRANCH_Chain_Pulling: editFormData.BRANCH_Chain_Pulling,
        BRANCH_HKM: editFormData.BRANCH_HKM,
        BRANCH_Labour_expenses: editFormData.BRANCH_Labour_expenses,
        BRANCH_Other_expenses: editFormData.BRANCH_Other_expenses,
        BRANCH_Special_Vehicle: editFormData.BRANCH_Special_Vehicle,
        [recordExists ? "BRANCH_MODIFIED_BY" : "BRANCH_ENTERED_BY"]: USER_ID,
      };

  
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data.error === false) {
        await fetchAnnexureDetails();
        setEditModalOpen(false);
        toast.success(recordExists ? "Data updated successfully!" : "Data inserted successfully!");
        window.location.reload();
      } else {
        const errorMessage = response.data.msg || "Unknown error occurred";
        toast.error(`Failed to ${recordExists ? "update" : "insert"} data: ${errorMessage}`);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setError("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        setError(error.response?.data?.message || "An error occurred while fetching data.");
      }
      toast.error(`An error occurred while ${recordExists ? "updating" : "inserting"} data: ${error}`);
    }
  };

  return (
    <div
      className={`bg-gray-50 py-3 px-6 ${marginClass} transition-all duration-300`}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-8xl mx-auto">
        <div>
          <label
            htmlFor="fromDate"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
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
          <label
            htmlFor="toDate"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
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
        <div className="col-span-1 space-y-2 md:flex items-end pb-1 gap-2 w-full">
          <div className="w-[70%]">
            <label
              htmlFor="search"
              className="whitespace-nowrap block text-xs font-medium text-gray-700 mb-1"
            >
              Search by Annex No
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by Annex No"
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

      {loading && (
        <div className="text-center text-blue-600 text-lg">Loading...</div>
      )}
      {error && (
        <div className="text-center text-red-600 text-lg">No data found</div>
      )}

      {!loading && !error && data.length > 0 && (
        <>
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
        </>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setFilteredData(data);
            setModalOpen(false);
          }}
        >
          <div
            className="rounded-lg overflow-hidden w-full m-2 max-w-5xl overflow-y-auto shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-x-auto max-w-10xl mx-auto shadow-xl">
              <DataTable
                columns={modalColumns}
                data={filteredData}
                pagination
                paginationServer
                paginationTotalRows={filteredData.length}
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
                    },
                  },
                }}
                fixedHeader
                fixedHeaderScrollHeight="70vh"
              />
            </div>
          </div>
        </div>
      )}

      {editModalOpen && selectedRow && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] w-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CN_No (Original)
                  </label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                    value={selectedRow.CN_NO || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (Original)
                  </label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                    value={selectedRow.TOTAL_WEIGHT || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Locations (Original)
                  </label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                    value={selectedRow.LOCATIONS || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor (Original)
                  </label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                    value={selectedRow.FLOOR || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Description (Original)
                  </label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                    value={selectedRow.ITEM_DESCRIPTION || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KM (Original)
                  </label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                    value={selectedRow.KILOMETER || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude (Original)
                  </label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                    value={selectedRow.LATITUDE || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude (Original)
                  </label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                    value={selectedRow.LONGITUDE || ""}
                    disabled
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crane
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_Crane"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_Crane === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hydra
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_Hydra"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_Hydra === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chain Pulling
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_Chain_Pulling"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_Chain_Pulling === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      HKM
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_HKM"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_HKM === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Labour Expenses
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_Labour_expenses"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_Labour_expenses === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Other Expenses
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_Other_expenses"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_Other_expenses === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Vehicle
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_Special_Vehicle"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_Special_Vehicle === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CN_No
                  </label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                    value={editFormData.CN_NO || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <input
                    type="text"
                    name="BRANCH_Weight"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_Weight}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Locations
                  </label>
                  <input
                    type="text"
                    name="BRANCH_LOCATIONS"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_LOCATIONS}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor
                  </label>
                  <input
                    type="text"
                    name="BRANCH_FLOOR"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_FLOOR}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Description
                  </label>
                  <input
                    type="text"
                    name="BRANCH_Item_Description"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_Item_Description}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KM
                  </label>
                  <input
                    type="text"
                    name="BRANCH_KM"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_KM}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="BRANCH_Latitude"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_Latitude}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="BRANCH_Longitude"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_Longitude}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    name="BRANCH_REMARKS"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_REMARKS}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setEditModalOpen(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnextureDetails;