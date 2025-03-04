


import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { saveAs } from "file-saver";

const CnWithChallan = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chlnVendorCode, setChlnVendorCode] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const token = getToken();

  useEffect(() => {
    fetchCnWithChallanData();
  }, [page, limit]);

  const fetchCnWithChallanData = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios.post(
        "https://vmsnode.omlogistics.co.in/api/cnwithChallan",
        {
          page: page,
          limit: limit,
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
    const result = data.filter((item) =>
      item.CN_CN_NO.toString().includes(search)
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
    saveAs(blob, "CN_With_Challan.csv");
  };

  const columns = [
    { name: "CN No", selector: (row) => row.CN_CN_NO, sortable: true, wrap: true },
    { name: "Manual CN No", selector: (row) => row.CN_MANUAL_CN_NO, sortable: true, wrap: true , width:"160px"},
    { name: "CN Date", selector: (row) => new Date(row.CN_CN_DATE).toLocaleDateString(), sortable: true, wrap: true },
    { name: "Source Branch Code", selector: (row) => row.CN_SOURCE_BRANCH_CODE, sortable: true, wrap: true , width:"180px"},
    { name: "Destination Branch Code", selector: (row) => row.CN_DESTINATION_BRANCH_CODE, sortable: true, wrap: true , width:"190px" },
    { name: "Item Description", selector: (row) => row.CN_ITEM_DESCRIPT, sortable: true, wrap: true , width:"160px"},
    { name: "Total Packages", selector: (row) => row.TOTAL_CN_PKG, sortable: true, wrap: true , width:"160px" },
    { name: "Total Weight", selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT, sortable: true, wrap: true , width:"160px" },
    { name: "Challan Vendor Code", selector: (row) => row.CHLN_VENDOR_CODE, sortable: true, wrap: true , width:"180px" },
    { name: "Challan No", selector: (row) => row.CHLN_CHLN_NO, sortable: true, wrap: true , width:"150px" },
    { name: "Challan Date", selector: (row) => new Date(row.CHLN_CHLN_DATE).toLocaleDateString(), sortable: true, wrap: true , width:"160px"},
    { name: "Lorry No", selector: (row) => row.CHLN_LORRY_NO, sortable: true, wrap: true },
  ];

  const rowPerPageOptions = [50, 100, 150, 200, 300, 400, 500, 1000, 2000, 5000, 10000];

  return (
    <div className="p-4 w-full max-w-screen-2xl mx-auto">
      {/* <h1 className="text-2xl font-bold mb-4">CN With Challan</h1> */}

      {/* Input Fields */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <label htmlFor="chlnVendorCode" className="block font-medium mb-1">
            Challan Vendor Code
          </label>
          <input
            id="chlnVendorCode"
            type="text"
            placeholder="Enter Challan Vendor Code"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
            value={chlnVendorCode}
            onChange={(e) => setChlnVendorCode(e.target.value)}
          />
        </div>
      </div>

      {/* Search, Export, and Search by CN No */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <button
          onClick={fetchCnWithChallanData}
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

export default CnWithChallan; 