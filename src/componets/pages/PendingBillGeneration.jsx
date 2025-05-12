import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { saveAs } from "file-saver";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomTable } from "../Ui/CustomTable";

const PendingBillGenerationrDetails = ({ isNavbarCollapsed }) => {
  const marginClass = isNavbarCollapsed ? "ml-16" : "ml-66";

  const CNMODEVATMap = {
    "1": "NRGP",
    "2": "SRN",
    "3": "CAM",
    "4": "IUT",
    "5": "RMO",
    "6": "MGMT GR",
    "7": "FIX NRGP",
    "8": "FIX SRN",
  };

  // State variables
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const firstUpdate = useRef(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const token = getToken();
  const decodedToken = jwtDecode(token);
  const USER_ID = decodedToken.id;

  const fetchLrDetailsDataOnPageChange = async () => {
    setUpdateLoading(true);
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
        "https://vmsnode.omlogistics.co.in/api/PendingBillGeneration",
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
      setTotalRows(response.data.totalRecords || response.data.data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }

    setUpdateLoading(false);
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
        "https://vmsnode.omlogistics.co.in/api/PendingBillGeneration",
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
      setTotalRows(response.data.totalRecords || response.data.data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLrDetailsData();
  }, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    fetchLrDetailsDataOnPageChange();
  }, [limit, page]);


  useEffect(() => {
    const result = data.filter((item) =>
      item.CN_CN_NO.toString().includes(search)
    );
    setFilteredData(result);
  }, [search, data]);

  // Handle individual row checkbox
  const handleRowSelect = (row) => {
    let updatedSelectedRows;
    if (selectedRows.some((selected) => selected.CN_CN_NO === row.CN_CN_NO)) {
      updatedSelectedRows = selectedRows.filter(
        (selected) => selected.CN_CN_NO !== row.CN_CN_NO
      );
    } else {
      updatedSelectedRows = [...selectedRows, row];
    }
    setSelectedRows(updatedSelectedRows);
    setSelectAll(updatedSelectedRows.length === filteredData.length);
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...filteredData]);
    }
    setSelectAll(!selectAll);
  };

  // Handle submit button click
  const handleSubmitSelected = async () => {
    if (selectedRows.length === 0) {
      toast.warn("No rows selected!");
      return;
    }



    // Make API call with selected rows
    try {
      const payload = {

        selectedRows: selectedRows.map((row) => ({
          CN_NO: row.CN_CN_NO,
          MANUAL_CN_NO: row.CN_MANUAL_CN_NO,
          CN_DATE: row.CN_CN_DATE,
          SOURCE_BRANCH_CODE: row.CN_SOURCE_BRANCH_CODE,
          DESTINATION_BRANCH_CODE: row.CN_DESTINATION_BRANCH_CODE,
          MODE_VAT: row.CN_MODE_VAT,
          ITEM_DESCRIPTION: row.CN_ITEM_DESCRIPT,
          TOTAL_PACKAGES: row.TOTAL_CN_PKG,
          TOTAL_WEIGHT: row.TOTAL_CN_ACTUAL_WEIGHT,
          CHALLAN_VENDOR_CODE: row.CHLN_VENDOR_CODE,
          CHALLAN_NO: row.CHLN_CHLN_NO,
          CHALLAN_DATE: new Date(row.CHLN_CHLN_DATE).toISOString().split('T')[0],
          LORRY_NO: row.CHLN_LORRY_NO,
          SITE_ID: row.SITE_ID,
          KILOMETER: row.KILOMETER,
          RATE: row.RATE,
          FREIGHT: row.FREIGHT,
          UNION_KM: row.UNION_KM,
          EXTRA_POINT: row.EXTRA_POINT,
          DT_EXPENSE: row.DT_EXPENSE,
          ESCORT_EXPENSE: row.ESCORT_EXPENSE,
          LOADING_EXPENSE: row.LOADING_EXPENSE,
          UNLOADING_EXPENSE: row.UNLOADING_EXPENSE,
          LABOUR_EXPENSE: row.LABOUR_EXPENSE,
          OTHER_EXPENSE: row.OTHER_EXPENSE,
          CRANE_HYDRA_EXPENSE: row.CRANE_HYDRA_EXPENSE,
          HEADLOAD_EXPENSE: row.HEADLOAD_EXPENSE,
          CHAIN_PULLEY_EXPENSE: row.CHAIN_PULLEY_EXPENSE, // Add this field in your row if not present
          TOLL_TAX: row.TOLL_TAX,
          PACKING_EXPENSE: row.PACKING_EXPENSE,
          TOTAL_AMOUNT: row.TOTAL_AMOUNT,
          LATITUDE: row.LATITUDE,
          LONGITUDE: row.LONGITUDE,
          REMARKS: row.REMARKS,
          ENTERED_BY: USER_ID,
          MODIFIED_BY: USER_ID,
          ANEXURE_FLAG: "Y"
        })),
      };

      const response = await axios.post(
        "https://vmsnode.omlogistics.co.in/api/AddbillProcessing", // Placeholder endpoint
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Selected rows processed successfully!");
      setLoading(true);
    } catch (error) {
      console.error("Error processing selected rows:", error);
      toast.error(error.response?.data?.msg || "Error processing selected rows");
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchLrDetailsData();
  };

  const handlePageChange = (page) => {
    setPage(page);
    setSelectedRows([]);
    setSelectAll(false);
  };

  const handleRowsPerPageChange = (newLimit, page) => {
    setLimit(newLimit);
    setPage(page);
    setSelectedRows([]);
    setSelectAll(false);
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
    saveAs(blob, "Pending_Bill_Generation.csv");
  };

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
        />
      ),
      selector: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.some(
            (selected) => selected.CN_CN_NO === row.CN_CN_NO
          )}
          onChange={() => handleRowSelect(row)}
        />
      ),
      sortable: false,
      width: "50px",
    },
    { name: "Row Number", selector: (row) => row.ROW_NUM || "-", sortable: true, wrap: true, width: "150px" },
    { name: "CN No", selector: (row) => row.CN_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Manual CN No", selector: (row) => row.CN_MANUAL_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
    { name: "CN Date", selector: (row) => (row.CN_CN_DATE ? new Date(row.CN_CN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "150px" },
    { name: "Source Branch Code", selector: (row) => row.CN_SOURCE_BRANCH_CODE || "-", sortable: true, wrap: true, width: "170px" },
    { name: "Destination Branch Code", selector: (row) => row.CN_DESTINATION_BRANCH_CODE || "-", sortable: true, wrap: true, width: "190px" },
    { name: "Mode VAT", selector: (row) => CNMODEVATMap[row.CN_MODE_VAT] || "-", sortable: true, wrap: true, width: "150px" },
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
    { name: "Latitude", selector: (row) => row.LATITUDE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Longitude", selector: (row) => row.LONGITUDE || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Remarks", selector: (row) => row.REMARKS || "-", sortable: true, wrap: true, width: "200px" },
  ];

  const rowPerPageOptions = [20, 50, 100, 200, 500, 1000, 5000, 10000];

  return (
    <div className={`bg-gray-50 py-3 px-6 ${marginClass} transition-all duration-300`}>
      <ToastContainer />

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
        <div className="col-span-3 space-y-2 md:flex items-end pb-1 gap-2">
          <div className="w-full">
            <label htmlFor="search" className="whitespace-nowrap block text-xs font-medium text-gray-700 mb-1">
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
          <div className="w-full md:w-auto">
            <button
              onClick={handleSearch}
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
          <div className="w-full md:w-auto">
            <button
              onClick={handleSubmitSelected}
              className="whitespace-nowrap px-4 w-full md:w-auto py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
            >
              Generate Annexure
            </button>
          </div>
        </div>
      </div>

      {loading && <div className="text-center text-blue-600 text-lg">Loading...</div>}
      {error && <div className="text-center text-red-600 text-lg">No data found</div>}

      {!loading && !error && data.length > 0 && (
        <>
          {updateLoading && <div className="text-center text-blue-600 text-sm">Updating...</div>}
          <CustomTable updateLoading={updateLoading} page={page} columns={columns} data={filteredData} totalRows={totalRows} limit={limit} rowPerPageOptions={rowPerPageOptions} handlePageChange={handlePageChange} handleRowsPerPageChange={handleRowsPerPageChange} filteredData={filteredData} />
        </>
      )}
    </div>
  );
};
  
export default PendingBillGenerationrDetails;