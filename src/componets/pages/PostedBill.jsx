import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { saveAs } from "file-saver";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";

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
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnnexureData, setSelectedAnnexureData] = useState([]);
  const [selectedAnnexureNo, setSelectedAnnexureNo] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRowData, setEditRowData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [showLocation, setShowLocation] = useState(false);

  const token = getToken();
  const decodedToken = jwtDecode(token);
  const USER_ID = decodedToken.id;

  // Function to process data and add disabled property
  const processDataForDisabling = (rawData) => {
    // Group by CHALLAN_NO
    const challanGroups = rawData.reduce((acc, record) => {
      const { CHALLAN_NO, UPDATEDFLAG } = record;
      if (!acc[CHALLAN_NO]) {
        acc[CHALLAN_NO] = { records: [], hasUpdatedFlag: false };
      }
      acc[CHALLAN_NO].records.push({ ...record, disabled: false });
      if (UPDATEDFLAG === "Y") {
        acc[CHALLAN_NO].hasUpdatedFlag = true;
      }
      return acc;
    }, {});

    // Mark records as disabled if any CN_NO in the group has UPDATEDFLAG = "Y"
    Object.values(challanGroups).forEach(group => {
      if (group.hasUpdatedFlag) {
        group.records.forEach(record => {
          record.disabled = true;
        });
      }
    });

    // Flatten records back into an array
    return Object.values(challanGroups).flatMap(group => group.records);
  };

  const fetchPostedBillData = useCallback(async () => {
    setLoading(true);
    setError(null);

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
        "https://vmsnode.omlogistics.co.in/api/PostedBillByVendors",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.data || response.data.data.length === 0) {
        setError("No data found for the given criteria.");
        setData([]);
        setFilteredData([]);
        setTotalRows(0);
        return;
      }

      // Process data to add disabled property
      const processedData = processDataForDisabling(response.data.data);
      setData(processedData);
      setFilteredData(processedData);
      setTotalRows(response.data.total || response.data.data.length);
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
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, fromDate, toDate, search, token, USER_ID]);

  useEffect(() => {
    fetchPostedBillData();
  }, [fetchPostedBillData]);

  const debouncedSearch = useCallback(
    debounce(() => {
      setPage(1);
      fetchPostedBillData();
    }, 500),
    [fetchPostedBillData]
  );

  const handleSearch = () => {
    debouncedSearch();
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
      CN_NO: row.CN_NO,
      ANNEXURE_NO: row.ANNEXURE_NO,
      CN_MANUAL_CN_NO: row.MANUAL_CN_NO,
      CN_DATE: new Date(row.CN_DATE).toLocaleDateString(),
      SOURCE_BRANCH_CODE: row.SOURCE_BRANCH_CODE,
      DESTINATION_BRANCH_CODE: row.DESTINATION_BRANCH_CODE,
      ITEM_DESCRIPTION: row.ITEM_DESCRIPTION,
      TOTAL_PACKAGES: row.TOTAL_PACKAGES,
      TOTAL_WEIGHT: row.TOTAL_WEIGHT,
      CHALLAN_VENDOR_CODE: row.CHALLAN_VENDOR_CODE,
      CHALLAN_NO: row.CHALLAN_NO,
      CHALLAN_DATE: new Date(row.CHALLAN_DATE).toLocaleDateString(),
      LORRY_NO: row.LORRY_NO,
      DISABLED: row.disabled ? "Yes" : "No", // Add disabled status to CSV
    }));

    const csvHeaders = [
      "CN No",
      "Annexure No",
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
      "Disabled",
    ];

    const csv = [
      csvHeaders.join(","),
      ...csvData.map((row) =>
        Object.values(row)
          .map((value) => `"${value || '-'}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Posted_Bill.csv");
  };

  const groupedData = data.reduce((acc, row) => {
    const annexureNo = row.ANNEXURE_NO || "-";
    if (!acc[annexureNo]) {
      acc[annexureNo] = {
        annexureNo,
        enteredDate: row.CN_DATE
          ? new Date(row.CN_DATE).toLocaleDateString()
          : "-",
        totalFreight: 0,
        rows: [],
      };
    }
    acc[annexureNo].rows.push(row);
    acc[annexureNo].totalFreight += parseFloat(row.FREIGHT || 0);
    return acc;
  }, {});

  const summaryData = Object.values(groupedData).map((group) => ({
    ...group,
    totalFreight: group.totalFreight.toFixed(2),
  }));

  const summaryColumns = [
    {
      name: "Annexure No",
      selector: (row) => row.annexureNo,
      sortable: true,
      wrap: true,
      width: "200px",
      cell: (row) => (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => {
            setSelectedAnnexureNo(row.annexureNo);
            setSelectedAnnexureData(row.rows);
            setModalOpen(true);
          }}
        >
          {row.annexureNo}
        </button>
      ),
    },
    {
      name: "Entered Date",
      selector: (row) => row.enteredDate,
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "Total Freight",
      selector: (row) => row.totalFreight,
      sortable: true,
      wrap: true,
      width: "200px",
      cell: (row) => `₹${row.totalFreight}`,
    },
  ];

  const handleEdit = (row) => {
    setEditRowData({
      cn_cn_no: parseInt(row.CN_NO) || 0,
      kilometer: parseFloat(row.KILOMETER) || 0,
      site_id: parseInt(row.OTPL_SITE_ID) || 0,
      floor: row.FLOOR || "",
      moment_type: Object.keys(CNMODEVATMap).find(
        (key) => CNMODEVATMap[key] === row.MODE_VAT
      ) || "",
      locations: row.LOCATIONS || "",
      rate: parseFloat(row.RATE) || 0,
      latitude: parseFloat(row.LATITUDE) || 0,
      longitude: parseFloat(row.LONGITUDE) || 0,
      freight: parseFloat(row.FREIGHT) || 0,
      union_km: parseFloat(row.UNION_KM) || 0,
      extra_point: parseFloat(row.EXTRA_POINT) || 0,
      dt_expense: parseFloat(row.DT_EXPENSE) || 0,
      escort_expense: parseFloat(row.ESCORT_EXPENSE) || 0,
      loading_expense: parseFloat(row.LOADING_EXPENSE) || 0,
      unloading_expense: parseFloat(row.UNLOADING_EXPENSE) || 0,
      labour_expense: parseFloat(row.LABOUR_EXPENSE) || 0,
      other_expense: parseFloat(row.OTHER_EXPENSE) || 0,
      crane_hydra_expense: parseFloat(row.CRANE_HYDRA_EXPENSE) || 0,
      headload_expense: parseFloat(row.HEADLOAD_EXPENSE) || 0,
      headload_km: parseInt(row.HEADLOAD_KM) || 0,
      chain_pulley_expense: parseFloat(row.CHAIN_PULLEY_EXPENSE) || 0,
      toll_tax: parseFloat(row.TOLL_TAX) || 0,
      packing_expense: parseFloat(row.PACKING_EXPENSE) || 0,
      total_amount: parseFloat(row.TOTAL_AMOUNT) || 0,
      remarks: row.REMARKS || "",
      modified_by: USER_ID,
    });
    setShowLocation(!!row.LOCATIONS);
    setFormErrors({});
    setEditModalOpen(true);
  };

  const handleNumericInputChange = (field, value) => {
    const filteredValue =
      field === "moment_type"
        ? value.replace(/[^\d]/g, "")
        : value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    handleInputChange({ target: { name: field, value: filteredValue } });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditRowData((prev) => ({
      ...prev,
      [name]: ["cn_cn_no", "site_id", "headload_km"].includes(name)
        ? parseInt(value) || 0
        : [
            "kilometer",
            "rate",
            "freight",
            "union_km",
            "extra_point",
            "dt_expense",
            "escort_expense",
            "loading_expense",
            "unloading_expense",
            "labour_expense",
            "other_expense",
            "crane_hydra_expense",
            "headload_expense",
            "chain_pulley_expense",
            "toll_tax",
            "packing_expense",
            "total_amount",
            "latitude",
            "longitude",
          ].includes(name)
        ? parseFloat(value) || 0
        : name === "moment_type"
        ? value
        : value,
    }));

    setFormErrors((prev) => {
      const errors = { ...prev };
      const requiredFields = ["rate", "latitude", "longitude", "kilometer"];

      if (requiredFields.includes(name)) {
        if (!value && value !== 0) {
          errors[name] = `${name.replace(/_/g, " ")} is required`;
        } else if (isNaN(parseFloat(value))) {
          errors[name] = `${name.replace(/_/g, " ")} must be a valid number`;
        } else {
          delete errors[name];
        }
      } else if (name === "locations" && showLocation) {
        if (!value && value !== 0) {
          errors.locations = "Location is required";
        } else {
          delete errors.locations;
        }
      } else if (name === "moment_type") {
        if (!value) {
          errors.moment_type = "Moment Type is required";
        } else {
          delete errors.moment_type;
        }
      } else if (name !== "remarks" && name !== "floor") {
        if (value !== "" && value !== undefined && value !== null) {
          if (isNaN(parseFloat(value))) {
            errors[name] = `${name.replace(/_/g, " ")} must be a valid number`;
          } else {
            delete errors[name];
          }
        } else {
          delete errors[name];
        }
      } else {
        delete errors[name];
      }

      return errors;
    });
  };

  const handleSaveEdit = async () => {
    const errors = {};
    const requiredFields = ["rate", "latitude", "longitude", "kilometer"];
    requiredFields.forEach((field) => {
      const value = editRowData[field];
      if (!value && value !== 0) {
        errors[field] = `${field.replace(/_/g, " ")} is required`;
      } else if (isNaN(parseFloat(value))) {
        errors[field] = `${field.replace(/_/g, " ")} must be a valid number`;
      }
    });

    if (showLocation && !editRowData.locations) {
      errors.locations = "Location is required";
    }

    if (!editRowData.moment_type) {
      errors.moment_type = "Moment Type is required";
    } else if (!["1", "2", "3", "4", "5", "6", "7", "8"].includes(editRowData.moment_type)) {
      errors.moment_type = "Moment Type must be a number between 1 and 8";
    }

    Object.keys(editRowData).forEach((field) => {
      if (
        !requiredFields.includes(field) &&
        field !== "remarks" &&
        field !== "floor" &&
        field !== "moment_type" &&
        field !== "locations" &&
        editRowData[field] !== "" &&
        editRowData[field] !== undefined &&
        editRowData[field] !== null
      ) {
        if (isNaN(parseFloat(editRowData[field]))) {
          errors[field] = `${field.replace(/_/g, " ")} must be a valid number`;
        }
      }
    });

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form before saving.");
      return;
    }

    try {
      const { site_id, ...payload } = editRowData;

      const response = await axios.post(
        "https://vmsnode.omlogistics.co.in/api/updateExpenses",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.error === false) {
        const response2 = await axios.post(
          "https://vmsnode.omlogistics.co.in/api/updateProcessedExpenses",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response2.data.error === false) {
          toast.success("Expenses updated successfully");
          setEditModalOpen(false);
          setEditRowData({});
          setFormErrors({});
          setShowLocation(false);
          setPage(1);
          await fetchPostedBillData();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error(response2.data.message || "Failed to update processed expenses");
        }
      } else {
        toast.error(response.data.message || "Failed to update CN");
      }
    } catch (error) {
      console.error("Error updating CN:", error);
      toast.error(error.response?.data?.message || "Failed to update CN");
    }
  };

  const detailColumns = [
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
    { name: "Site ID", selector: (row) => row.OTPL_SITE_ID || "-", sortable: true, wrap: true, width: "150px" },
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
    { name: "Latitude", selector: (row) => row.LATITUDE || "-", sortable: true, wrap: true, width: "145px" },
    { name: "Longitude", selector: (row) => row.LONGITUDE || "-", sortable: true, wrap: true, width: "145px" },
    { name: "Remarks", selector: (row) => row.REMARKS || "-", sortable: true, wrap: true, width: "200px" },
    {
      name: "Action",
      cell: (row) => (
        <button
          className={`px-3 py-1 text-white rounded text-sm ${
            row.disabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={() => !row.disabled && handleEdit(row)}
          disabled={row.disabled}
          title={row.disabled ? "Editing disabled due to updated record in this challan" : "Edit"}
        >
          Edit
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  const rowPerPageOptions = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

  return (
    <div className={`bg-gray-50 p-6 ${marginClass} transition-all duration-300`}>
      <ToastContainer />
      {/* Rest of your JSX remains unchanged */}
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
              onKeyUp={handleSearch}
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
      {error && <div className="text-center text-red-600 text-lg">{error}</div>}

      {!loading && !error && summaryData.length > 0 && (
        <div className="overflow-x-auto max-w-8xl mx-auto shadow-xl">
          <DataTable
            columns={summaryColumns}
            data={summaryData}
            pagination
            paginationServer
            paginationTotalRows={summaryData.length}
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
          />
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg overflow-hidden w-full m-2 max-w-6xl max-h-[90vh] overflow-y-auto shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">
                CN Details for Annexure No: {selectedAnnexureNo}
              </h2>
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setModalOpen(false);
                  setSelectedAnnexureData([]);
                  setSelectedAnnexureNo("");
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
              <div className="overflow-x-auto">
                {selectedAnnexureData.length === 0 ? (
                  <div className="text-center text-gray-600 p-4">
                    No CNs found for this annexure
                  </div>
                ) : (
                  <DataTable
                    columns={detailColumns}
                    data={selectedAnnexureData}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 50]}
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
                    fixedHeaderScrollHeight="60vh"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Edit CN: {editRowData.cn_cn_no}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "cn_cn_no", label: "CN No", type: "number", readOnly: true },
                { name: "kilometer", label: "Kilometer", type: "number", required: true },
                { name: "site_id", label: "Site ID", type: "number", readOnly: true },
                { name: "floor", label: "Floor", type: "text" },
                { name: "moment_type", label: "Moment Type", type: "number" },
                { name: "rate", label: "Rate", type: "number", required: true },
                { name: "latitude", label: "Latitude", type: "number", required: true },
                { name: "longitude", label: "Longitude", type: "number", required: true },
                { name: "freight", label: "Freight (Auto-calculated)", type: "number", readOnly: true },
                { name: "union_km", label: "Union KM", type: "number" },
                { name: "extra_point", label: "Extra Point", type: "number" },
                { name: "dt_expense", label: "DT Expense", type: "number" },
                { name: "escort_expense", label: "Escort Expense", type: "number" },
                { name: "loading_expense", label: "Loading Expense", type: "number" },
                { name: "unloading_expense", label: "Unloading Expense", type: "number" },
                { name: "labour_expense", label: "Labour Expense", type: "number" },
                { name: "other_expense", label: "Other Expense", type: "number" },
                { name: "crane_hydra_expense", label: "Crane Hydra Expense", type: "number" },
                { name: "headload_expense", label: "Headload Expense", type: "number" },
                { name: "headload_km", label: "Headload KM", type: "number" },
                { name: "chain_pulley_expense", label: "Chain Pulley Expense", type: "number" },
                { name: "toll_tax", label: "Toll Tax", type: "number" },
                { name: "packing_expense", label: "Packing Expense", type: "number" },
                { name: "total_amount", label: "Total Amount (Auto-calculated)", type: "number", readOnly: true },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={editRowData[field.name] || ""}
                    onChange={(e) =>
                      field.type === "number" && !field.readOnly
                        ? handleNumericInputChange(field.name, e.target.value)
                        : handleInputChange(e)
                    }
                    readOnly={field.readOnly}
                    placeholder={field.placeholder || ""}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 ${
                      formErrors[field.name] ? "border-red-500" : "border-gray-300"
                    } ${field.readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  />
                  {field.name === "moment_type" && editRowData.moment_type && CNMODEVATMap[editRowData.moment_type]}
                  {formErrors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">{formErrors[field.name]}</p>
                  )}
                </div>
              ))}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showLocation}
                    onChange={(e) => setShowLocation(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Include Location <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
              {showLocation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Locations <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="locations"
                    value={editRowData.locations || ""}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 ${
                      formErrors.locations ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.locations && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.locations}</p>
                  )}
                </div>
              )}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={editRowData.remarks || ""}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 ${
                    formErrors.remarks ? "border-red-500" : "border-gray-300"
                  }`}
                  rows="4"
                />
                {formErrors.remarks && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.remarks}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSaveEdit}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditRowData({});
                  setFormErrors({});
                  setShowLocation(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostedBill;