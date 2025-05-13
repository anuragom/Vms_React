import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { CustomTable } from "../Ui/CustomTable";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const token = getToken();
const decodedToken = jwtDecode(token);
const USER_ID = decodedToken.id;

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
  const [updateLoading, setUpdateLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editFormData, setEditFormData] = useState({
    CN_NO: "",
    Updated_Weight: "",
    Updated_Item_Description: "",
    Updated_KM: "",
    Updated_Latitude: "",
    Updated_Longitude: "",
    UPDATEDREMARKS: "",
    MODIFIED_BY: USER_ID,
  });

  const groupDataByAnnexure = (rawData) => {
    const grouped = rawData.reduce((acc, item) => {
      const annexureNo = item.ANNEXURE_NO;
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
      acc[annexureNo].items.push(item);
      return acc;
    }, {});

    return Object.values(grouped).map((group, index) => ({
      ...group,
      RNUM: index + 1,
    }));
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

      console.log("fetchAnnexureDetails Response:", response.data);

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
      setError(true);
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
      selector: (row) => {
        if (row.UPDATEDFLAG === "Y" && row.UPDATED_WEIGHT != null) {
          return row.UPDATED_WEIGHT;
        }
        return row.TOTAL_WEIGHT || "-";
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Item",
      selector: (row) => {
        if (row.UPDATEDFLAG === "Y" && row.UPDATED_ITEM_DESCRIPTION != null) {
          return row.UPDATED_ITEM_DESCRIPTION;
        }
        return row.ITEM_DESCRIPTION || "-";
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "KM",
      selector: (row) => {
        if (row.UPDATEDFLAG === "Y" && row.UPDATED_KM != null) {
          return row.UPDATED_KM;
        }
        return row.KILOMETER || "-";
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Latitude",
      selector: (row) => {
        if (row.UPDATEDFLAG === "Y" && row.UPDATED_LATITUDE != null) {
          return row.UPDATED_LATITUDE;
        }
        return row.LATITUDE || "-";
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Longitude",
      selector: (row) => {
        if (row.UPDATEDFLAG === "Y" && row.UPDATED_LONGITUDE != null) {
          return row.UPDATED_LONGITUDE;
        }
        return row.LONGITUDE || "-";
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Floor (GPT, RRT)",
      selector: (row) => row.TOTAL_CN_PKG || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Verify",
      selector: (row) => {
        if (row.UPDATEDFLAG === "Y") {
          return (
            <span className="text-green-500 font-bold">✔</span> // Green checkmark
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
            setSelectedRow(row);
            setEditFormData({
              CN_NO: row.CN_NO,
              Updated_Weight:
                row.UPDATEDFLAG === "Y" && row.UPDATED_WEIGHT != null
                  ? row.UPDATED_WEIGHT
                  : "",
              Updated_Item_Description:
                row.UPDATEDFLAG === "Y" && row.UPDATED_ITEM_DESCRIPTION != null
                  ? row.UPDATED_ITEM_DESCRIPTION
                  : "",
              Updated_KM:
                row.UPDATEDFLAG === "Y" && row.UPDATED_KM != null
                  ? row.UPDATED_KM
                  : "",
              Updated_Latitude:
                row.UPDATEDFLAG === "Y" && row.UPDATED_LATITUDE != null
                  ? row.UPDATED_LATITUDE
                  : "",
              Updated_Longitude:
                row.UPDATEDFLAG === "Y" && row.UPDATED_LONGITUDE != null
                  ? row.UPDATED_LONGITUDE
                  : "",
              UPDATEDREMARKS:
                row.UPDATEDFLAG === "Y" && row.UPDATEDREMARKS != null
                  ? row.UPDATEDREMARKS
                  : "",
              MODIFIED_BY: USER_ID,
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
    setFilteredData(row.items);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        "https://vmsnode.omlogistics.co.in/api/updateBillVerification",
        {
          CN_NO: editFormData.CN_NO,
          Updated_Weight: editFormData.Updated_Weight,
          Updated_Item_Description: editFormData.Updated_Item_Description,
          Updated_KM: editFormData.Updated_KM,
          Updated_Latitude: editFormData.Updated_Latitude,
          Updated_Longitude: editFormData.Updated_Longitude,
          UPDATEDREMARKS: editFormData.UPDATEDREMARKS,
          MODIFIED_BY: editFormData.MODIFIED_BY,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("updateBillVerification response:", response.data);

      if (response.data.error === false) {
        await fetchAnnexureDetails();
        setEditModalOpen(false);
        toast.success("Data updated successfully!");
      } else {
        const errorMessage = response.data.msg || "Unknown error occurred";
        toast.error(`Failed to update data: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      const errorMessage = error.response?.data?.msg || "Network error occurred";
      toast.error(`An error occurred while updating data: ${errorMessage}`);
    }
  };

  return (
    <div
      className={`bg-gray-50 py-3 px-6 ${marginClass} transition-all duration-300`}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
      <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-8xl mx-auto">


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
          {updateLoading && (
            <div className="text-center text-blue-600 text-sm">Updating...</div>
          )}
          <CustomTable
            handleRowClick={handleRowClick}
            updateLoading={updateLoading}
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
            className="bg-white rounded-lg p-6 w-full max-w-4xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Edit Details</h2>
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
                    name="Updated_Weight"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.Updated_Weight}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Description
                  </label>
                  <input
                    type="text"
                    name="Updated_Item_Description"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.Updated_Item_Description}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KM
                  </label>
                  <input
                    type="text"
                    name="Updated_KM"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.Updated_KM}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="Updated_Latitude"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.Updated_Latitude}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="Updated_Longitude"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.Updated_Longitude}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    name="UPDATEDREMARKS"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.UPDATEDREMARKS}
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