
import axios from "axios";
import DataTable from "react-data-table-component";
import { CustomTable } from "../Ui/CustomTable";
import { useEffect, useState } from "react";
import { getToken } from "../../Auth/auth";
import {ToastContainer } from "react-toastify";

const ApprovedBills = ({ isNavbarCollapsed }) => {

    const marginClass = isNavbarCollapsed ? "ml-16" : "ml-66";
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
    const [modalOpen, setModalOpen] = useState(false);
    const token = getToken();

    
  
    const fetchPostedBillData = async () => {
      setLoading(true);
      setError(false);
  
      try {

        const response = await axios.post(
          "https://vmsnode.omlogistics.co.in/api/getApprovedBills",
          {},
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
  
  
    const columns = [
      { name: "Row No", selector: (row) => row.ROW_NUM || "-", sortable: true, wrap: true, width: "100px" },
      { name: "CN No", selector: (row) => row.CN_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
      { name: "CN Date", selector: (row) => (row.CN_CN_DATE ? new Date(row.CN_CN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "150px" },
      { name: "Source Branch Code", selector: (row) => row.CN_SOURCE_BRANCH_CODE || "-", sortable: true, wrap: true, width: "170px" },
      { name: "Destination Branch Code", selector: (row) => row.CN_DESTINATION_BRANCH_CODE || "-", sortable: true, wrap: true, width: "190px" },
      { name: "Challan No", selector: (row) => row.CHLN_CHLN_NO || "-", sortable: true, wrap: true, width: "150px" },
      { name: "Challan Date", selector: (row) => (row.CHLN_CHLN_DATE ? new Date(row.CHLN_CHLN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "170px" },
      { name: "Lorry No", selector: (row) => row.CHLN_LORRY_NO || "-", sortable: true, wrap: true, width: "150px" }
     
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
}

export default ApprovedBills