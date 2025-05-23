import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { saveAs } from "file-saver";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomTable } from "../Ui/CustomTable";

const PostedBill = ({ isNavbarCollapsed }) => {
  const marginClass = isNavbarCollapsed ? "" : "";

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
  const [limit, setLimit] = useState(100);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);


  const token = getToken();
  const decodedToken = jwtDecode(token);
  const USER_ID = decodedToken.id;

  const fetchPostedBillData = async () => {
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
        "https://vmsnode.omlogistics.co.in/api/PostedBill",
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
    fetchPostedBillData();
  }, [page, limit, fromDate, toDate, search]);

  const handleSearch = () => {
    setPage(1);
    fetchPostedBillData();
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
      ANNEXURE_NO: row.ANNEXURE_NO,
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
      "ANNEXURE_NO",
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
    { name: "Row No", selector: (row) => row.RNUM || "-", sortable: true, wrap: true, width: "100px" },
    { name: "Annexure No", selector: (row) => row.ANNEXURE_NO || "-", sortable: true, wrap: true, width: "150px" },
    { name: "CN No", selector: (row) => row.CN_NO || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Manual CN No", selector: (row) => row.MANUAL_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
    { name: "CN Date", selector: (row) => (row.CN_DATE ? new Date(row.CN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "150px" },
    { name: "Source Branch Code", selector: (row) => row.SOURCE_BRANCH_CODE || "-", sortable: true, wrap: true, width: "170px" },
    { name: "Destination Branch Code", selector: (row) => row.DESTINATION_BRANCH_CODE || "-", sortable: true, wrap: true, width: "190px" },
    { name: "Mode VAT", selector: (row) => CNMODEVATMap[row.MODE_VAT] || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Item Description", selector: (row) => row.ITEM_DESCRIPTION || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Total Packages", selector: (row) => row.TOTAL_PACKAGES || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Total Weight", selector: (row) => row.TOTAL_WEIGHT || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Challan Vendor Code", selector: (row) => row.CHALLAN_VENDOR_CODE || "-", sortable: true, wrap: true, width: "190px" },
    { name: "Challan No", selector: (row) => row.CHALLAN_NO || "-", sortable: true, wrap: true, width: "150px" },
    { name: "Challan Date", selector: (row) => (row.CHALLAN_DATE ? new Date(row.CHALLAN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "170px" },
    { name: "Lorry No", selector: (row) => row.LORRY_NO || "-", sortable: true, wrap: true, width: "150px" },
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



  const rowPerPageOptions = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

  return (
    <div className={` bg-gray-50 p-6 ${marginClass} transition-all duration-300`}>
      <ToastContainer />

      <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-8xl mx-auto ">
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
            <label htmlFor="search" className="whitespace-nowrap block text-xs font-medium text-gray-700 mb-1 ">
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
        </div>
      </div>

      {loading && <div className="text-center text-blue-600 text-lg">Loading...</div>}
      {error && <div className="text-center text-red-600 text-lg">No data found</div>}

      {!loading && !error && data.length > 0 && (
        <>
          <CustomTable  page={page} columns={columns} data={filteredData} totalRows={totalRows} limit={limit} rowPerPageOptions={rowPerPageOptions} handlePageChange={handlePageChange} handleRowsPerPageChange={handleRowsPerPageChange} filteredData={filteredData} />
        </>
      )}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="rounded-lg overflow-hidden w-full m-2 max-w-4xl overflow-y-auto shadow-lg relative"
            onClick={e => e.stopPropagation()}
          >
            <div className=" overflow-x-auto max-w-8xl mx-auto shadow-xl">
              <DataTable
          
                data={filteredData}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
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
                    }
                  }
                }}
                fixedHeader
                fixedHeaderScrollHeight="70vh"
              />

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostedBill