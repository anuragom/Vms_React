


import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getToken } from "../../Auth/auth";
import { saveAs } from "file-saver"; // For exporting to CSV
import { CustomTable } from "../Ui/CustomTable";

const CnWithoutChallan = ({ isNavbarCollapsed }) => {
  const marginClass = isNavbarCollapsed ? "ml-16" : "ml-66";

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(20); // Rows per page
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [cnNo, setCnNo] = useState("");
  const [totalRows, setTotalRows] = useState(0); // Total rows for pagination
  const [lastSearchParams, setLastSearchParams] = useState({});
  const token = getToken();
  const firstUpdate = useRef(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchCNWithoutChallanData();
  }, []);


  //This useEffect will run only when the dependancy changes and will not run on initial load
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    fetchCNWithoutChallanDataOnPageChange();
  }, [limit, page]);


  const fetchCNWithoutChallanDataOnPageChange = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const currentParams = {
      page,
      limit,
      fromDate,
      toDate,
      cnNo
    };

    if (JSON.stringify(currentParams) === JSON.stringify(lastSearchParams)) {
      return;
    }

    setUpdateLoading(true);

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
      } else {
        setData(response.data.data);
        setFilteredData(response.data.data);
      }

      setLastSearchParams(currentParams);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 403) {
        setError("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        setError(error.response?.data?.message || "An error occurred while fetching data.");
      }
    }

    setUpdateLoading(false);
  };


  const fetchCNWithoutChallanData = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const currentParams = {
      page,
      limit,
      fromDate,
      toDate,
      cnNo
    };

    if (JSON.stringify(currentParams) === JSON.stringify(lastSearchParams)) {
      return;
    }

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

      setLastSearchParams(currentParams);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 403) {
        setError("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        setError(error.response?.data?.message || "An error occurred while fetching data.");
      }
    }

    setLoading(false);
  };


  useEffect(() => {
    const result = data.filter((item) =>
      item.CN_CN_NO.toString().includes(search)
    );
    setFilteredData(result);
  }, [search, data]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Create a new search with updated page
    fetchCNWithoutChallanData();
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newLimit, newPage) => {
    setLimit(newLimit);
    setPage(newPage);
    // Create a new search with updated limit and page
    fetchCNWithoutChallanData();
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
      width: "140px",
    },
    {
      name: "Manual CN No",
      selector: (row) => row.CN_MANUAL_CN_NO,
      sortable: true,
      width: "160px",
    },
    {
      name: "CN Date",
      selector: (row) => new Date(row.CN_CN_DATE).toLocaleDateString(),
      sortable: true,
      width: "140px",
    },
    {
      name: "Source Branch",
      selector: (row) => row.CN_SOURCE_BRANCH_CODE,
      sortable: true,
      width: "180px",
    },
    {
      name: "Destination Branch",
      selector: (row) => row.CN_DESTINATION_BRANCH_CODE,
      sortable: true,
      width: "180px",
    },
    {
      name: "Item Description",
      selector: (row) => row.CN_ITEM_DESCRIPT,
      sortable: true,
      width: "170px",
    },
    {
      name: "Total Packages",
      selector: (row) => row.TOTAL_CN_PKG,
      sortable: true,
      width: "160px",
    },
    {
      name: "Total Weight",
      selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT,
      sortable: true,
      width: "160px",
    },
  ];

  // Pagination options 
  const rowPerPageOptions = [20, 50, 100, 200, 500, 1000, 5000, 10000];

  return (
    <div className={`bg-gray-50 py-3 px-6 ${marginClass} transition-all duration-300`}>
      {/* Input Fields for CNWithoutChallan API */}
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
          <label htmlFor="cnNo" className="block text-xs font-medium text-gray-700 mb-1">
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
              onClick={(e) => fetchCNWithoutChallanData(e)}
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

      {/* Loading and Error Messages */}
      {loading && <div className="text-center text-blue-600 text-lg">Loading...</div>}
      {error && <div className="text-center text-red-600 text-lg">No data found</div>}

      {/* DataTable */}
      {!loading && !error && data.length > 0 && (
        <>
          {updateLoading && <div className="text-center text-blue-600 text-sm">Updating...</div>}
          <CustomTable page={page} columns={columns} data={filteredData} totalRows={totalRows} limit={limit} rowPerPageOptions={rowPerPageOptions} handlePageChange={handlePageChange} handleRowsPerPageChange={handleRowsPerPageChange} filteredData={filteredData} />
        </>
      )}
    </div>
  );
};

export default CnWithoutChallan;







