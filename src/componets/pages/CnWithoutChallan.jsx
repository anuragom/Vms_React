


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DataTable from "react-data-table-component";
// import { getToken } from "../../Auth/auth";
// import { saveAs } from "file-saver"; // For exporting to CSV

// const CnWithoutChallan = () => {
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [page, setPage] = useState(1); // Current page
//   const [limit, setLimit] = useState(50); // Rows per page
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [cnNo, setCnNo] = useState("");
//   const [totalRows, setTotalRows] = useState(0); // Total rows for pagination
//   const token = getToken();

//   // Fetch data when component mounts or when page/limit changes
//   useEffect(() => {
//     fetchCNWithoutChallanData();
//   }, [page, limit]); // Fetch data when page or limit changes

//   const fetchCNWithoutChallanData = async () => {
//     setLoading(true);
//     setError(false);

//     try {
//       const response = await axios.post(
//         "https://vmsnode.omlogistics.co.in/api/CNWithoutChallan",
//         {
//           page: page,
//           limit: limit,
//           FROMDATE: fromDate,
//           TODATE: toDate,
//           CNNO: cnNo,
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
//       setFilteredData(response.data.data);
//       setTotalRows(response.data.total || response.data.data.length); // Set total rows for pagination
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(true);
//     }

//     setLoading(false);
//   };

//   // Handle search by CN No
//   useEffect(() => {
//     const result = data.filter((item) =>
//       item.CN_CN_NO.toString().includes(search)
//     );
//     setFilteredData(result);
//   }, [search, data]);

//   // Handle page change
//   const handlePageChange = (page) => {
//     setPage(page);
//   };

//   // Handle rows per page change
//   const handleRowsPerPageChange = (newLimit, page) => {
//     setLimit(newLimit);
//     setPage(page);
//   };

//   // Export to CSV
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
//     saveAs(blob, "CN_Without_Challan.csv");
//   };

//   // Columns for the DataTable
//   const columns = [
//     {
//       name: "CN No",
//       selector: (row) => row.CN_CN_NO,
//       sortable: true,
//       width: "150px" 
//     },
//     {
//       name: "Manual CN No",
//       selector: (row) => row.CN_MANUAL_CN_NO,
//       sortable: true,
//       wrap: true,
//       width:"160px"
//     },
//     {
//       name: "CN Date",
//       selector: (row) => new Date(row.CN_CN_DATE).toLocaleDateString(),
//       sortable: true,
//        width:"140px"
//     },
//     {
//       name: "Source Branch Code",
//       selector: (row) => row.CN_SOURCE_BRANCH_CODE,
//       sortable: true,
//       wrap: true,
//        width:"180px"
//     },
//     {
//       name: "Destination Branch Code",
//       selector: (row) => row.CN_DESTINATION_BRANCH_CODE,
//       sortable: true,
//       wrap: true,
//        width:"180px"
//     },
//     {
//       name: "Item Description",
//       selector: (row) => row.CN_ITEM_DESCRIPT,
//       sortable: true,
//       wrap: true,
//        width:"170px"
//     },
//     {
//       name: "Total Packages",
//       selector: (row) => row.TOTAL_CN_PKG,
//       sortable: true,
//        width:"160px"
//     },
//     {
//       name: "Total Weight",
//       selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT,
//       sortable: true,
//        width:"160px"
//     },
//   ];

//   // Row per page options
//   const rowPerPageOptions = [50, 100, 150, 200, 300, 400, 500, 1000, 2000, 5000, 10000];

//   return (
//     <div className="p-4 w-full max-w-screen-2xl mx-auto">
//       {/* <h1 className="text-2xl font-bold mb-4">CN Without Challan</h1> */}

//       {/* Input Fields for CNWithoutChallan API */}
//       <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <div>
//           <label htmlFor="fromDate" className="block font-medium mb-1">
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
//           <label htmlFor="toDate" className="block font-medium mb-1">
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
//           <label htmlFor="cnNo" className="block font-medium mb-1">
//             CN No
//           </label>
//           <input
//             id="cnNo"
//             type="text"
//             placeholder="Enter CN No"
//             className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
//             value={cnNo}
//             onChange={(e) => setCnNo(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Search, Export to CSV, and Search by CN No in the same line */}
//       <div className="flex flex-col md:flex-row gap-4 mb-4">
//         <button
//           onClick={fetchCNWithoutChallanData}
//           className="p-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-[#2e2e2e]"
//         >
//           Search
//         </button>

//         <input
//           id="search"
//           type="text"
//           placeholder="Search by CN No"
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 flex-grow"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <button
//           onClick={exportToCSV}
//           className="p-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
//         >
//           Export to CSV
//         </button>
//       </div>

//       {/* Loading and Error Messages */}
//       {loading && <div className="text-blue-500">Loading...</div>}
//       {error && <div className="text-red-500">No data found</div>}

//       {/* DataTable */}
//       {!loading && !error && data.length > 0 && (
//         <div className="overflow-x-auto">
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

// export default CnWithoutChallan;


import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { saveAs } from "file-saver"; // For exporting to CSV

const CnWithoutChallan = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(50); // Rows per page
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [cnNo, setCnNo] = useState("");
  const [totalRows, setTotalRows] = useState(0); // Total rows for pagination
  const token = getToken();

  // Fetch data when component mounts or when page/limit changes
  useEffect(() => {
    fetchCNWithoutChallanData();
  }, [page, limit, fromDate, toDate, cnNo]); // Fetch data when page, limit, or filters change

  const fetchCNWithoutChallanData = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios.post(
        "https://vmsnode.omlogistics.co.in/api/CNWithoutChallan",
        {
          page: page,
          limit: limit,
          FROMDATE: fromDate,
          TODATE: toDate,
          CNNO: cnNo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data.length === 0) {
        setError(true);
        setData([]);
        setFilteredData([]);
      } else {
        setData(response.data.data);
        setFilteredData(response.data.data);
        setTotalRows(response.data.totalRecords || 0); // Ensure this matches the API response
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }

    setLoading(false);
  };

  // Handle search by CN No
  useEffect(() => {
    const result = data.filter((item) =>
      item.CN_CN_NO.toString().includes(search)
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

  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredData.map((row) => ({
      ROW_NUM: row.ROW_NUM,
      CN_CN_NO: row.CN_CN_NO,
      CN_MANUAL_CN_NO: row.CN_MANUAL_CN_NO,
      CN_CN_DATE: new Date(row.CN_CN_DATE).toLocaleDateString(),
      CN_SOURCE_BRANCH_CODE: row.CN_SOURCE_BRANCH_CODE,
      CN_DESTINATION_BRANCH_CODE: row.CN_DESTINATION_BRANCH_CODE,
      CN_ITEM_DESCRIPT: row.CN_ITEM_DESCRIPT,
      TOTAL_CN_PKG: row.TOTAL_CN_PKG,
      TOTAL_CN_ACTUAL_WEIGHT: row.TOTAL_CN_ACTUAL_WEIGHT,
    }));

    const csvHeaders = [
      "Row No",
      "CN No",
      "Manual CN No",
      "CN Date",
      "Source Branch Code",
      "Destination Branch Code",
      "Item Description",
      "Total Packages",
      "Total Weight",
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
    saveAs(blob, "CN_Without_Challan.csv");
  };

  // Columns for the DataTable
  const columns = [
    {
      name: "Row No",
      selector: (row) => row.ROW_NUM,
      sortable: true,
      width: "100px",
    },
    {
      name: "CN No",
      selector: (row) => row.CN_CN_NO,
      sortable: true,
    },
    {
      name: "Manual CN No",
      selector: (row) => row.CN_MANUAL_CN_NO,
      sortable: true,
    },
    {
      name: "CN Date",
      selector: (row) => new Date(row.CN_CN_DATE).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Source Branch",
      selector: (row) => row.CN_SOURCE_BRANCH_CODE,
      sortable: true,
    },
    {
      name: "Destination Branch",
      selector: (row) => row.CN_DESTINATION_BRANCH_CODE,
      sortable: true,
    },
    {
      name: "Item Description",
      selector: (row) => row.CN_ITEM_DESCRIPT,
      sortable: true,
    },
    {
      name: "Total Packages",
      selector: (row) => row.TOTAL_CN_PKG,
      sortable: true,
    },
    {
      name: "Total Weight",
      selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT,
      sortable: true,
    },
  ];

  // Pagination options
  const rowPerPageOptions = [50, 100, 200, 500, 1000];

  return (
    <div className="p-4">
      {/* Input Fields for CNWithoutChallan API */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="fromDate" className="block font-medium mb-1">
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
          <label htmlFor="toDate" className="block font-medium mb-1">
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
          <label htmlFor="cnNo" className="block font-medium mb-1">
            CN No
          </label>
          <input
            id="cnNo"
            type="text"
            placeholder="Enter CN No"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
            value={cnNo}
            onChange={(e) => setCnNo(e.target.value)}
          />
        </div>
      </div>

      {/* Search, Export to CSV, and Search by CN No */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={fetchCNWithoutChallanData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>

        <input
          type="text"
          placeholder="Search CN No"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={exportToCSV}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export to CSV
        </button>
      </div>

      {/* Loading and Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p>No data found</p>}

      {/* DataTable */}
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
        progressPending={loading} // Show loader when loading is true
        progressComponent={<div>Loading...</div>} // Custom loader component
        highlightOnHover
        striped
      />
    </div>
  );
};

export default CnWithoutChallan;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DataTable from "react-data-table-component";
// import { getToken } from "../../Auth/auth";
// import { saveAs } from "file-saver"; // For exporting to CSV

// const CnWithoutChallan = () => {
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(50);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [cnNo, setCnNo] = useState("");
//   const [totalRows, setTotalRows] = useState(0);

//   const token = getToken();

//   // Fetch data from API
//   useEffect(() => {
//     fetchCNWithoutChallanData();
//   }, [page, limit]);

//   const fetchCNWithoutChallanData = async () => {
//     setLoading(true);
//     setError(false);

//     try {
//       const response = await axios.post(
//         "https://vmsnode.omlogistics.co.in/api/CNWithoutChallan",
//         {
//           page,
//           limit,
//           FROMDATE: fromDate,
//           TODATE: toDate,
//           CNNO: cnNo,
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
//         setData([]);
//         setFilteredData([]);
//       } else {
//         setData(response.data.data);
//         setFilteredData(response.data.data);
//         setTotalRows(response.data.totalRecords || 0);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(true);
//     }

//     setLoading(false);
//   };

//   // Handle search by CN No
//   useEffect(() => {
//     const result = data.filter((item) =>
//       item.CN_CN_NO.toString().includes(search)
//     );
//     setFilteredData(result);
//   }, [search, data]);

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   // Handle rows per page change
//   const handleRowsPerPageChange = (newLimit, newPage) => {
//     setLimit(newLimit);
//     setPage(newPage);
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const csvData = filteredData.map((row) => ({
//       ROW_NUM: row.ROW_NUM,
//       CN_CN_NO: row.CN_CN_NO,
//       CN_MANUAL_CN_NO: row.CN_MANUAL_CN_NO,
//       CN_CN_DATE: new Date(row.CN_CN_DATE).toLocaleDateString(),
//       CN_SOURCE_BRANCH_CODE: row.CN_SOURCE_BRANCH_CODE,
//       CN_DESTINATION_BRANCH_CODE: row.CN_DESTINATION_BRANCH_CODE,
//       CN_ITEM_DESCRIPT: row.CN_ITEM_DESCRIPT,
//       TOTAL_CN_PKG: row.TOTAL_CN_PKG,
//       TOTAL_CN_ACTUAL_WEIGHT: row.TOTAL_CN_ACTUAL_WEIGHT,
//     }));

//     const csvHeaders = [
//       "ROW_NUM",
//       "CN No",
//       "Manual CN No",
//       "CN Date",
//       "Source Branch Code",
//       "Destination Branch Code",
//       "Item Description",
//       "Total Packages",
//       "Total Weight",
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
//     saveAs(blob, "CN_Without_Challan.csv");
//   };

//   // DataTable Columns
//   const columns = [
//     {
//       name: "Row No",
//       selector: (row) => row.ROW_NUM,
//       sortable: true,
//       width: "100px",
//     },
//     {
//       name: "CN No",
//       selector: (row) => row.CN_CN_NO,
//       sortable: true,
//     },
//     {
//       name: "Manual CN No",
//       selector: (row) => row.CN_MANUAL_CN_NO,
//       sortable: true,
//     },
//     {
//       name: "CN Date",
//       selector: (row) => new Date(row.CN_CN_DATE).toLocaleDateString(),
//       sortable: true,
//     },
//     {
//       name: "Source Branch",
//       selector: (row) => row.CN_SOURCE_BRANCH_CODE,
//       sortable: true,
//     },
//     {
//       name: "Destination Branch",
//       selector: (row) => row.CN_DESTINATION_BRANCH_CODE,
//       sortable: true,
//     },
//     {
//       name: "Item Description",
//       selector: (row) => row.CN_ITEM_DESCRIPT,
//       sortable: true,
//     },
//     {
//       name: "Total Packages",
//       selector: (row) => row.TOTAL_CN_PKG,
//       sortable: true,
//     },
//     {
//       name: "Total Weight",
//       selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT,
//       sortable: true,
//     },
//   ];

//   // Pagination options
//   const rowPerPageOptions = [50, 100, 200, 500, 1000];

//   return (
//     <div className="p-4">
//       <div className="flex gap-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search CN No"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//         <button
//           onClick={fetchCNWithoutChallanData}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Search
//         </button>
//         <button
//           onClick={exportToCSV}
//           className="bg-green-500 text-white px-4 py-2 rounded"
//         >
//           Export to CSV
//         </button>
//       </div>

//       {loading && <p>Loading...</p>}
//       {error && <p>No data found</p>}

//       <DataTable
//         columns={columns}
//         data={filteredData}
//         pagination
//         paginationServer
//         paginationTotalRows={totalRows}
//         paginationPerPage={limit}
//         paginationRowsPerPageOptions={rowPerPageOptions}
//         onChangePage={handlePageChange}
//         onChangeRowsPerPage={handleRowsPerPageChange}
//         progressPending={loading} // Show loader when loading is true
//         progressComponent={<div>Loading...</div>} // Custom loader component
//         highlightOnHover
//         striped
//       />
//     </div>
//   );
// };

// export default CnWithoutChallan;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import DataTable from "react-data-table-component";
// import { getToken } from "../../Auth/auth";
// import { saveAs } from "file-saver"; // For exporting to CSV
// import DatePicker from "react-datepicker"; // Date picker component
// import "react-datepicker/dist/react-datepicker.css"; // Date picker CSS

// const CnWithoutChallan = () => {
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(50);
//   const [fromDate, setFromDate] = useState(null); // Use null for initial state
//   const [toDate, setToDate] = useState(null); // Use null for initial state
//   const [cnNo, setCnNo] = useState("");
//   const [totalRows, setTotalRows] = useState(0);

//   const token = getToken();

//   // Fetch data from API
//   useEffect(() => {
//     fetchCNWithoutChallanData();
//   }, [page, limit]);

//   const fetchCNWithoutChallanData = async () => {
//     setLoading(true);
//     setError(false);

//     try {
//       const response = await axios.post(
//         "https://vmsnode.omlogistics.co.in/api/CNWithoutChallan",
//         {
//           page,
//           limit,
//           FROMDATE: fromDate ? formatDate(fromDate) : "", // Format date to dd-mm-yyyy
//           TODATE: toDate ? formatDate(toDate) : "", // Format date to dd-mm-yyyy
//           CNNO: cnNo,
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
//         setData([]);
//         setFilteredData([]);
//       } else {
//         setData(response.data.data);
//         setFilteredData(response.data.data);
//         setTotalRows(response.data.totalRecords || 0);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError(true);
//     }

//     setLoading(false);
//   };

//   // Format date to dd-mm-yyyy
//   const formatDate = (date) => {
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Handle search by CN No
//   useEffect(() => {
//     const result = data.filter((item) =>
//       item.CN_CN_NO.toString().includes(search)
//     );
//     setFilteredData(result);
//   }, [search, data]);

//   // Handle page change
//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   // Handle rows per page change
//   const handleRowsPerPageChange = (newLimit, newPage) => {
//     setLimit(newLimit);
//     setPage(newPage);
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const csvData = filteredData.map((row) => ({
//       ROW_NUM: row.ROW_NUM,
//       CN_CN_NO: row.CN_CN_NO,
//       CN_MANUAL_CN_NO: row.CN_MANUAL_CN_NO,
//       CN_CN_DATE: new Date(row.CN_CN_DATE).toLocaleDateString(),
//       CN_SOURCE_BRANCH_CODE: row.CN_SOURCE_BRANCH_CODE,
//       CN_DESTINATION_BRANCH_CODE: row.CN_DESTINATION_BRANCH_CODE,
//       CN_ITEM_DESCRIPT: row.CN_ITEM_DESCRIPT,
//       TOTAL_CN_PKG: row.TOTAL_CN_PKG,
//       TOTAL_CN_ACTUAL_WEIGHT: row.TOTAL_CN_ACTUAL_WEIGHT,
//     }));

//     const csvHeaders = [
//       "ROW_NUM",
//       "CN No",
//       "Manual CN No",
//       "CN Date",
//       "Source Branch Code",
//       "Destination Branch Code",
//       "Item Description",
//       "Total Packages",
//       "Total Weight",
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
//     saveAs(blob, "CN_Without_Challan.csv");
//   };

//   // DataTable Columns
//   const columns = [
//     {
//       name: "Row No",
//       selector: (row) => row.ROW_NUM,
//       sortable: true,
//       width: "100px",
//     },
//     {
//       name: "CN No",
//       selector: (row) => row.CN_CN_NO,
//       sortable: true,
//     },
//     {
//       name: "Manual CN No",
//       selector: (row) => row.CN_MANUAL_CN_NO,
//       sortable: true,
//     },
//     {
//       name: "CN Date",
//       selector: (row) => new Date(row.CN_CN_DATE).toLocaleDateString(),
//       sortable: true,
//     },
//     {
//       name: "Source Branch",
//       selector: (row) => row.CN_SOURCE_BRANCH_CODE,
//       sortable: true,
//     },
//     {
//       name: "Destination Branch",
//       selector: (row) => row.CN_DESTINATION_BRANCH_CODE,
//       sortable: true,
//     },
//     {
//       name: "Item Description",
//       selector: (row) => row.CN_ITEM_DESCRIPT,
//       sortable: true,
//     },
//     {
//       name: "Total Packages",
//       selector: (row) => row.TOTAL_CN_PKG,
//       sortable: true,
//     },
//     {
//       name: "Total Weight",
//       selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT,
//       sortable: true,
//     },
//   ];

//   // Pagination options
//   const rowPerPageOptions = [50, 100, 200, 500, 1000];

//   return (
//     <div className="p-4">
//       <div className="flex gap-4 mb-4">
//         <div>
//           <label>From Date</label>
//           <DatePicker
//             selected={fromDate}
//             onChange={(date) => setFromDate(date)}
//             dateFormat="dd-MM-yyyy"
//             placeholderText="Select From Date"
//             className="border p-2 rounded w-full"
//           />
//         </div>
//         <div>
//           <label>To Date</label>
//           <DatePicker
//             selected={toDate}
//             onChange={(date) => setToDate(date)}
//             dateFormat="dd-MM-yyyy"
//             placeholderText="Select To Date"
//             className="border p-2 rounded w-full"
//           />
//         </div>
//         <div>
//           <label>CN No</label>
//           <input
//             type="text"
//             placeholder="CN No"
//             value={cnNo}
//             onChange={(e) => setCnNo(e.target.value)}
//             className="border p-2 rounded w-full"
//           />
//         </div>
//         <button
//           onClick={fetchCNWithoutChallanData}
//           className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
//         >
//           Search
//         </button>
//         <button
//           onClick={exportToCSV}
//           className="bg-green-500 text-white px-4 py-2 rounded mt-6"
//         >
//           Export to CSV
//         </button>
//       </div>

//       {loading && <p>Loading...</p>}
//       {error && <p>No data found</p>}

//       <DataTable
//         columns={columns}
//         data={filteredData}
//         pagination
//         paginationServer
//         paginationTotalRows={totalRows}
//         paginationPerPage={limit}
//         paginationRowsPerPageOptions={rowPerPageOptions}
//         onChangePage={handlePageChange}
//         onChangeRowsPerPage={handleRowsPerPageChange}
//         progressPending={loading} // Show loader when loading is true
//         progressComponent={<div>Loading...</div>} // Custom loader component
//         highlightOnHover
//         striped
//       />
//     </div>
//   );
// };

// export default CnWithoutChallan;

