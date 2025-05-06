import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { saveAs } from "file-saver";
import { CustomTable } from "../Ui/CustomTable";

const CnWithChallan = ({ isNavbarCollapsed }) => {
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
  const [lastSearchParams, setLastSearchParams] = useState({});
  const token = getToken();

  useEffect(() => {
    fetchCnWithChallanData();
  }, [limit, page]);

  const fetchCnWithChallanData = async () => {
    const currentParams = {
      page,
      limit,
      fromDate,
      toDate,
      chlnVendorCode
    };

    if (JSON.stringify(currentParams) === JSON.stringify(lastSearchParams)) {
      return;
    }

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
        setData([]);
        setFilteredData([]);
      } else {
        setData(response.data.data);
        setFilteredData(response.data.data);
        setTotalRows(response.data.totalRecords || response.data.data.length);
      }

      setLastSearchParams(currentParams);
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
    { name: "Row No", selector: (row) => row.ROW_NUM, sortable: true, wrap: true, width: "" },
    { name: "CN No", selector: (row) => row.CN_CN_NO, sortable: true, wrap: true, width: "150px" },
    { name: "Manual CN No", selector: (row) => row.CN_MANUAL_CN_NO, sortable: true, wrap: true, width: "160px" },
    { name: "CN Date", selector: (row) => new Date(row.CN_CN_DATE).toLocaleDateString(), sortable: true, wrap: true, width: "140px" },
    { name: "Source Branch Code", selector: (row) => row.CN_SOURCE_BRANCH_CODE, sortable: true, wrap: true, width: "180px" },
    { name: "Destination Branch Code", selector: (row) => row.CN_DESTINATION_BRANCH_CODE, sortable: true, wrap: true, width: "190px" },
    { name: "Item Description", selector: (row) => row.CN_ITEM_DESCRIPT, sortable: true, wrap: true, width: "160px" },
    { name: "Total Packages", selector: (row) => row.TOTAL_CN_PKG, sortable: true, wrap: true, width: "160px" },
    { name: "Total Weight", selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT, sortable: true, wrap: true, width: "160px" },
    { name: "Challan Vendor Code", selector: (row) => row.CHLN_VENDOR_CODE, sortable: true, wrap: true, width: "180px" },
    { name: "Challan No", selector: (row) => row.CHLN_CHLN_NO, sortable: true, wrap: true, width: "150px" },
    { name: "Challan Date", selector: (row) => new Date(row.CHLN_CHLN_DATE).toLocaleDateString(), sortable: true, wrap: true, width: "160px" },
    { name: "Lorry No", selector: (row) => row.CHLN_LORRY_NO, sortable: true, wrap: true, width: "150px" },
  ];

  const rowPerPageOptions = [20, 50, 100, 200, 500, 1000, 5000, 10000];

  return (
    <div className={`bg-gray-50 py-3 px-6 ${marginClass} transition-all duration-300`}>
      <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-8xl mx-auto">
        <div>
          <label htmlFor="fromDate" className="block text-xs font-medium text-gray-700 mb-1">
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
          <label htmlFor="toDate" className="block text-xs font-medium text-gray-700 mb-1">
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
          <label htmlFor="chlnVendorCode" className="block text-xs font-medium text-gray-700 mb-1">
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

        <div className="col-span-2 space-y-2 md:flex items-end pb-1 gap-2">
          <div className="w-full">
            <label htmlFor="search" className="whitespace-nowrap block text-xs font-medium text-gray-700 mb-1">
              Search by CN No
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by CN No"
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto">
            <button
              onClick={fetchCnWithChallanData}
              className="whitespace-nowrap px-4 w-full md:w-auto py-2 bg-[#01588E] text-white rounded-lg font-semibold hover:bg-[#014a73] transition-colors"
            >
              Search
            </button>
          </div>
          <div className="w-full md:w-auto">
            <button
              onClick={exportToCSV}
              className="whitespace-nowrap px-4 w-full md:w-auto py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Export to CSV
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="text-center text-blue-600 text-lg">Loading...</div>}
      {error && <div className="text-center text-red-600 text-lg">No data found</div>}

      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto max-w-8xl mx-auto rounded-lg shadow-xl">
           <CustomTable page={page} columns={columns} data={filteredData} totalRows={totalRows} limit={limit} rowPerPageOptions={rowPerPageOptions} handlePageChange={handlePageChange} handleRowsPerPageChange={handleRowsPerPageChange} filteredData={filteredData} />
        </div>
      )}
    </div>
  );
};

export default CnWithChallan;