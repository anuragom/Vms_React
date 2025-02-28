

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
//       width: "154px",
//     },
//     {
//       name: "Manual CN No",
//       selector: (row) => row.CN_MANUAL_CN_NO,
//       sortable: true,
//       width: "200px",
//       wrap: true,
//     },
//     {
//       name: "CN Date",
//       selector: (row) => new Date(row.CN_CN_DATE).toLocaleDateString(),
//       sortable: true,
//       width: "150px",
//     },
//     {
//       name: "Source Branch Code",
//       selector: (row) => row.CN_SOURCE_BRANCH_CODE,
//       sortable: true,
//       width: "200px",
//       wrap: true,
//     },
//     {
//       name: "Destination Branch Code",
//       selector: (row) => row.CN_DESTINATION_BRANCH_CODE,
//       sortable: true,
//       width: "200px",
//       wrap: true,
//     },
//     {
//       name: "Item Description",
//       selector: (row) => row.CN_ITEM_DESCRIPT,
//       sortable: true,
//       width: "200px",
//       wrap: true,
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

//   // Row per page options
//   const rowPerPageOptions = [50, 100, 150, 200, 300, 400, 500,1000,2000,5000,10000];

//   return (
//     <div className="p-4 w-[58rem] lg:w-[64rem] 2xl:w-[100rem]">
//       <h1 className="text-2xl font-bold mb-4">CN Without Challan</h1>

//       {/* Input Fields for CNWithoutChallan API */}
//       <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
//       <div className="flex gap-4 mb-4">
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
//         <DataTable
//           columns={columns}
//           data={filteredData}
//           pagination
//           paginationServer
//           paginationTotalRows={totalRows}
//           paginationPerPage={limit}
//           paginationRowsPerPageOptions={rowPerPageOptions}
//           onChangePage={handlePageChange}
//           onChangeRowsPerPage={handleRowsPerPageChange}
//           highlightOnHover
//           responsive
//           customStyles={{
//             headRow: {
//               style: {
//                 backgroundColor: "#f7fafc",
//               },
//             },
//           }}
//         />
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
  }, [page, limit]); // Fetch data when page or limit changes

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
      }

      setData(response.data.data);
      setFilteredData(response.data.data);
      setTotalRows(response.data.total || response.data.data.length); // Set total rows for pagination
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
  const handlePageChange = (page) => {
    setPage(page);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newLimit, page) => {
    setLimit(newLimit);
    setPage(page);
  };

  // Export to CSV
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
      name: "CN No",
      selector: (row) => row.CN_CN_NO,
      sortable: true,
    },
    {
      name: "Manual CN No",
      selector: (row) => row.CN_MANUAL_CN_NO,
      sortable: true,
      wrap: true,
    },
    {
      name: "CN Date",
      selector: (row) => new Date(row.CN_CN_DATE).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Source Branch Code",
      selector: (row) => row.CN_SOURCE_BRANCH_CODE,
      sortable: true,
      wrap: true,
    },
    {
      name: "Destination Branch Code",
      selector: (row) => row.CN_DESTINATION_BRANCH_CODE,
      sortable: true,
      wrap: true,
    },
    {
      name: "Item Description",
      selector: (row) => row.CN_ITEM_DESCRIPT,
      sortable: true,
      wrap: true,
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

  // Row per page options
  const rowPerPageOptions = [50, 100, 150, 200, 300, 400, 500, 1000, 2000, 5000, 10000];

  return (
    <div className="p-4 w-full max-w-screen-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">CN Without Challan</h1>

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

      {/* Search, Export to CSV, and Search by CN No in the same line */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <button
          onClick={fetchCNWithoutChallanData}
          className="p-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-[#2e2e2e]"
        >
          Search
        </button>

        <input
          id="search"
          type="text"
          placeholder="Search by CN No"
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 flex-grow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={exportToCSV}
          className="p-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
        >
          Export to CSV
        </button>
      </div>

      {/* Loading and Error Messages */}
      {loading && <div className="text-blue-500">Loading...</div>}
      {error && <div className="text-red-500">No data found</div>}

      {/* DataTable */}
      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto">
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
                  backgroundColor: "#f7fafc",
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CnWithoutChallan;