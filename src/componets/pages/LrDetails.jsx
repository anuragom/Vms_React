import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { saveAs } from "file-saver";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";

const LrDetails = ({ isNavbarCollapsed }) => {
  const marginClass = isNavbarCollapsed ? "" : "";

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
  const [selectedRow, setSelectedRow] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState(null);

  const token = getToken();
  const decodedToken = jwtDecode(token);
  const USER_ID = decodedToken.id;

  const openFormInAddMode = (row) => {
    setFormMode("add");
    setSelectedRow({
      CN_CN_NO: row.CN_CN_NO,
      KILOMETER: "",
      RATE: "",
      FREIGHT: "",
      UNION_KM: "",
      EXTRA_POINT: "",
      DT_EXPENSE: "",
      ESCORT_EXPENSE: "",
      LOADING_EXPENSE: "",
      UNLOADING_EXPENSE: "",
      LABOUR_EXPENSE: "",
      OTHER_EXPENSE: "",
      CRANE_HYDRA_EXPENSE: "",
      HEADLOAD_EXPENSE: "",
      CHAIN_PULLEY_EXPENSE: "",
      TOLL_TAX: "",
      PACKING_EXPENSE: "",
      TOTAL_AMOUNT: "",
      REMARKS: "",
    });
    setIsFormOpen(true);
  };

  const openFormInUpdateMode = (row) => {
    setFormMode("update");
    setSelectedRow({
      CN_CN_NO: row.CN_CN_NO,
      KILOMETER: row.KILOMETER || "",
      RATE: row.RATE || "",
      LATITUDE: row.LATITUDE || "",
      LONGITUDE: row.LONGITUDE || "",
      FREIGHT: row.FREIGHT || "",
      UNION_KM: row.UNION_KM || "",
      EXTRA_POINT: row.EXTRA_POINT || "",
      DT_EXPENSE: row.DT_EXPENSE || "",
      ESCORT_EXPENSE: row.ESCORT_EXPENSE || "",
      LOADING_EXPENSE: row.LOADING_EXPENSE || "",
      UNLOADING_EXPENSE: row.UNLOADING_EXPENSE || "",
      LABOUR_EXPENSE: row.LABOUR_EXPENSE || "",
      OTHER_EXPENSE: row.OTHER_EXPENSE || "",
      CRANE_HYDRA_EXPENSE: row.CRANE_HYDRA_EXPENSE || "",
      HEADLOAD_EXPENSE: row.HEADLOAD_EXPENSE || "",
      CHAIN_PULLEY_EXPENSE: row.CHAIN_PULLEY_EXPENSE || "",
      TOLL_TAX: row.TOLL_TAX || "",
      PACKING_EXPENSE: row.PACKING_EXPENSE || "",
      TOTAL_AMOUNT: row.TOTAL_AMOUNT || "",
      REMARKS: row.REMARKS || "",
    });
    setIsFormOpen(true);
  };

  const handleInputChange = (field, value) => {
    setSelectedRow((prev) => {
      const updatedRow = { ...prev, [field]: value };

      // Auto-calculate Freight (Rate * Kilometer)
      const kilometer = parseFloat(updatedRow.KILOMETER) || 0;
      const rate = parseFloat(updatedRow.RATE) || 0;
      updatedRow.FREIGHT = (kilometer * rate).toFixed(2);

      // Auto-calculate Total Amount (sum of all expenses)
      const expenses = [
        parseFloat(updatedRow.FREIGHT) || 0,
        parseFloat(updatedRow.UNION_KM) || 0,
        parseFloat(updatedRow.EXTRA_POINT) || 0,
        parseFloat(updatedRow.DT_EXPENSE) || 0,
        parseFloat(updatedRow.ESCORT_EXPENSE) || 0,
        parseFloat(updatedRow.LOADING_EXPENSE) || 0,
        parseFloat(updatedRow.UNLOADING_EXPENSE) || 0,
        parseFloat(updatedRow.LABOUR_EXPENSE) || 0,
        parseFloat(updatedRow.OTHER_EXPENSE) || 0,
        parseFloat(updatedRow.CRANE_HYDRA_EXPENSE) || 0,
        parseFloat(updatedRow.HEADLOAD_EXPENSE) || 0,
        parseFloat(updatedRow.CHAIN_PULLEY_EXPENSE) || 0,
        parseFloat(updatedRow.TOLL_TAX) || 0,
        parseFloat(updatedRow.PACKING_EXPENSE) || 0,
      ];
      updatedRow.TOTAL_AMOUNT = expenses.reduce((sum, val) => sum + val, 0).toFixed(2);

      return updatedRow;
    });
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
        "https://vmsnode.omlogistics.co.in/api/lrDetails",
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
    fetchLrDetailsData();
  }, [page, limit, fromDate, toDate, search]);

  const handleSearch = () => {
    setPage(1);
    fetchLrDetailsData();
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
    saveAs(blob, "LR_Details.csv");
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedRow(null);
  };

  const closeBulkUpload = () => {
    setIsBulkUploadOpen(false);
    setUploadFile(null);
    setUploadProgress(0);
    setUploadResults(null);
  };

  const handleSaveExpenses = async () => {
    if (!selectedRow) return;

    let payload;
    if (formMode === "add") {
      payload = {
        CN_CN_NO: selectedRow.CN_CN_NO,
        KILOMETER: parseFloat(selectedRow.KILOMETER) || 0,
        RATE: parseFloat(selectedRow.RATE) || 0,
        LATITUDE: parseFloat(selectedRow.LATITUDE) || 0,
        LONGITUDE: parseFloat(selectedRow.LONGITUDE) || 0,
        FREIGHT: parseFloat(selectedRow.FREIGHT) || 0,
        UNION_KM: parseFloat(selectedRow.UNION_KM) || 0,
        EXTRA_POINT: parseFloat(selectedRow.EXTRA_POINT) || 0,
        DT_EXPENSE: parseFloat(selectedRow.DT_EXPENSE) || 0,
        ESCORT_EXPENSE: parseFloat(selectedRow.ESCORT_EXPENSE) || 0,
        LOADING_EXPENSE: parseFloat(selectedRow.LOADING_EXPENSE) || 0,
        UNLOADING_EXPENSE: parseFloat(selectedRow.UNLOADING_EXPENSE) || 0,
        LABOUR_EXPENSE: parseFloat(selectedRow.LABOUR_EXPENSE) || 0,
        OTHER_EXPENSE: parseFloat(selectedRow.OTHER_EXPENSE) || 0,
        CRANE_HYDRA_EXPENSE: parseFloat(selectedRow.CRANE_HYDRA_EXPENSE) || 0,
        HEADLOAD_EXPENSE: parseFloat(selectedRow.HEADLOAD_EXPENSE) || 0,
        CHAIN_PULLEY_EXPENSE: parseFloat(selectedRow.CHAIN_PULLEY_EXPENSE) || 0,
        TOLL_TAX: parseFloat(selectedRow.TOLL_TAX) || 0,
        PACKING_EXPENSE: parseFloat(selectedRow.PACKING_EXPENSE) || 0,
        TOTAL_AMOUNT: parseFloat(selectedRow.TOTAL_AMOUNT) || 0,
        REMARKS: selectedRow.REMARKS || "No remarks",
        ENTERED_BY: "admin",
        MODIFIED_BY: "admin",
      };
    } else {
      payload = {
        cn_cn_no: selectedRow.CN_CN_NO,
        kilometer: parseFloat(selectedRow.KILOMETER) || 0,
        rate: parseFloat(selectedRow.RATE) || 0,
        latitude: parseFloat(selectedRow.LATITUDE) || 0,
        longitude: parseFloat(selectedRow.LONGITUDE) || 0,
        freight: parseFloat(selectedRow.FREIGHT) || 0,
        union_km: parseFloat(selectedRow.UNION_KM) || 0,
        extra_point: parseFloat(selectedRow.EXTRA_POINT) || 0,
        dt_expense: parseFloat(selectedRow.DT_EXPENSE) || 0,
        escort_expense: parseFloat(selectedRow.ESCORT_EXPENSE) || 0,
        loading_expense: parseFloat(selectedRow.LOADING_EXPENSE) || 0,
        unloading_expense: parseFloat(selectedRow.UNLOADING_EXPENSE) || 0,
        labour_expense: parseFloat(selectedRow.LABOUR_EXPENSE) || 0,
        other_expense: parseFloat(selectedRow.OTHER_EXPENSE) || 0,
        crane_hydra_expense: parseFloat(selectedRow.CRANE_HYDRA_EXPENSE) || 0,
        headload_expense: parseFloat(selectedRow.HEADLOAD_EXPENSE) || 0,
        chain_pulley_expense: parseFloat(selectedRow.CHAIN_PULLEY_EXPENSE) || 0,
        toll_tax: parseFloat(selectedRow.TOLL_TAX) || 0,
        packing_expense: parseFloat(selectedRow.PACKING_EXPENSE) || 0,
        total_amount: parseFloat(selectedRow.TOTAL_AMOUNT) || 0,
        remarks: selectedRow.REMARKS || "No remarks",
        modified_by: "admin",
      };
    }

    const apiUrl = formMode === "add"
      ? "https://vmsnode.omlogistics.co.in/api/addExpenses"
      : "https://vmsnode.omlogistics.co.in/api/updateExpenses";

    try {
      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.error === false) {
        toast.success(response.data.msg || `${formMode === "add" ? "Added" : "Updated"} successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        closeForm();
        fetchLrDetailsData();
      } else {
        toast.error(response.data.msg || "Operation failed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error(`Failed to ${formMode === "add" ? "add" : "update"} expenses: ${error.response?.data?.msg || error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        "CN No": "",
        "Kilometer": "",
        "Rate (per Km)": "",
        "Latitude": "",
        "Longitude": "",
        "Union/Km": "",
        "Extra Point": "",
        "Dt Expense": "",
        "Escort Expense": "",
        "Headload Expense": "",
        "Loading Expense": "",
        "Unloading Expense": "",
        "Labour Expense": "",
        "Other Expense": "",
        "Crane/Hydra Expense": "",
        "Chain Pulley Expense": "",
        "Toll Tax": "",
        "Packing Expense": "",
        "Remarks": ""
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses Template");
    XLSX.writeFile(workbook, "Expenses_Template.xlsx");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validExtensions = [".xlsx", ".xls", ".csv"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      toast.error("Please upload a valid Excel file (.xlsx, .xls, .csv)", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    setUploadFile(file);
  };

  const processBulkUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a file to upload", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    setUploadProgress(0);
    setUploadResults(null);

    try {
      const data = await readExcelFile(uploadFile);
      if (!data || data.length === 0) {
        throw new Error("No valid data found in the file");
      }

      // Process each row
      const processedData = data.map(row => {
        const kilometer = parseFloat(row["Kilometer"]) || 0;
        const rate = parseFloat(row["Rate (per Km)"]) || 0;
        const freight = kilometer * rate;

        const expenses = [
          freight,
          parseFloat(row["Union/Km"]) || 0,
          parseFloat(row["Extra Point"]) || 0,
          parseFloat(row["Dt Expense"]) || 0,
          parseFloat(row["Escort Expense"]) || 0,
          parseFloat(row["Loading Expense"]) || 0,
          parseFloat(row["Unloading Expense"]) || 0,
          parseFloat(row["Labour Expense"]) || 0,
          parseFloat(row["Other Expense"]) || 0,
          parseFloat(row["Crane/Hydra Expense"]) || 0,
          parseFloat(row["Chain Pulley Expense"]) || 0,
          parseFloat(row["Toll Tax"]) || 0,
          parseFloat(row["Packing Expense"]) || 0,
          parseFloat(row["Headload Expense"]) || 0,

        ];
        const totalAmount = expenses.reduce((sum, val) => sum + val, 0);

        return {
          CN_CN_NO: row["CN No"],
          KILOMETER: kilometer,
          RATE: rate,
          LATITUDE: parseFloat(row["Latitude"]) || 0,
          LONGITUDE: parseFloat(row["Longitude"]) || 0,
          FREIGHT: freight,
          UNION_KM: parseFloat(row["Union/Km"]) || 0,
          EXTRA_POINT: parseFloat(row["Extra Point"]) || 0,
          DT_EXPENSE: parseFloat(row["Dt Expense"]) || 0,
          HEADLOAD_EXPENSE: parseFloat(row["Chain Pulley Expense"]) || 0,
          ESCORT_EXPENSE: parseFloat(row["Escort Expense"]) || 0,
          LOADING_EXPENSE: parseFloat(row["Loading Expense"]) || 0,
          UNLOADING_EXPENSE: parseFloat(row["Unloading Expense"]) || 0,
          LABOUR_EXPENSE: parseFloat(row["Labour Expense"]) || 0,
          OTHER_EXPENSE: parseFloat(row["Other Expense"]) || 0,
          CRANE_HYDRA_EXPENSE: parseFloat(row["Crane/Hydra Expense"]) || 0,
          CHAIN_PULLEY_EXPENSE: parseFloat(row["Chain Pulley Expense"]) || 0,
          TOLL_TAX: parseFloat(row["Toll Tax"]) || 0,
          PACKING_EXPENSE: parseFloat(row["Packing Expense"]) || 0,
          TOTAL_AMOUNT: totalAmount,
          REMARKS: row["Remarks"] || "No remarks",
          ENTERED_BY: "admin",
          MODIFIED_BY: "admin",
        };
      });

      // Validate data
      const validationResults = processedData.map((item, index) => {
        const errors = [];
        if (!item.CN_CN_NO) errors.push("CN No is required");
        if (isNaN(item.KILOMETER)) errors.push("Kilometer must be a number");
        if (isNaN(item.RATE)) errors.push("Rate must be a number");
        if (item.KILOMETER < 0) errors.push("Kilometer must be positive");
        if (item.RATE < 0) errors.push("Rate must be positive");

        return {
          row: index + 2, // +2 because Excel rows start at 1 and header is row 1
          cnNo: item.CN_CN_NO,
          isValid: errors.length === 0,
          errors: errors.length > 0 ? errors.join(", ") : null
        };
      });

      const invalidRows = validationResults.filter(item => !item.isValid);
      if (invalidRows.length > 0) {
        setUploadResults({
          total: processedData.length,
          invalid: invalidRows,
          valid: processedData.length - invalidRows.length
        });
        return;
      }

      // Upload valid data
      const results = {
        success: 0,
        failed: 0,
        errors: []
      };

      for (let i = 0; i < processedData.length; i++) {
        try {
          const response = await axios.post(
            "https://vmsnode.omlogistics.co.in/api/addExpenses",
            processedData[i],
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.error === false) {
            results.success++;
          } else {
            results.failed++;
            results.errors.push({
              cnNo: processedData[i].CN_CN_NO,
              message: response.data.msg || "Unknown error"
            });
          }
        } catch (error) {
          results.failed++;
          results.errors.push({
            cnNo: processedData[i].CN_CN_NO,
            message: error.response?.data?.msg || error.message || "Unknown error"
          });
        }

        // Update progress
        setUploadProgress(Math.round(((i + 1) / processedData.length) * 100));
      }

      setUploadResults(results);
      fetchLrDetailsData();
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(`Error processing file: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const columns = [
    { name: "Row Number", selector: (row) => row.ROW_NUM || "-", sortable: true, wrap: true, width: "150px" },
    { name: "CN No", selector: (row) => row.CN_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => openFormInAddMode(row)}
            className="text-blue-500 text-xl hover:text-blue-700"
          >
            +
          </button>
          <button
            onClick={() => openFormInUpdateMode(row)}
            className="text-green-500 text-xl hover:text-green-700"
          >
            ✎
          </button>
        </div>
      ),
      width: "100px",
    },
    { name: "Manual CN No", selector: (row) => row.CN_MANUAL_CN_NO || "-", sortable: true, wrap: true, width: "150px" },
    { name: "CN Date", selector: (row) => (row.CN_CN_DATE ? new Date(row.CN_CN_DATE).toLocaleDateString() : "-"), sortable: true, wrap: true, width: "150px" },
    { name: "Source Branch Code", selector: (row) => row.CN_SOURCE_BRANCH_CODE || "-", sortable: true, wrap: true, width: "170px" },
    { name: "Destination Branch Code", selector: (row) => row.CN_DESTINATION_BRANCH_CODE || "-", sortable: true, wrap: true, width: "190px" },
    { name: "Mode VAT", selector: (row) => row.CN_MODE_VAT || "-", sortable: true, wrap: true, width: "150px" },
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

  const rowPerPageOptions = [50, 100, 150, 200, 300, 400, 500, 1000, 2000, 5000, 10000];

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${marginClass} transition-all duration-300`}>
      <ToastContainer />

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        <div>
          <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
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
          <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
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
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
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
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 max-w-6xl mx-auto">
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-[#01588E] text-white rounded-lg font-semibold hover:bg-[#014a73] transition-colors"
        >
          Search
        </button>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          Export to CSV
        </button>
        <button
          onClick={() => setIsBulkUploadOpen(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
        >
          Bulk Upload
        </button>
      </div>

      {loading && <div className="text-center text-blue-600 text-lg">Loading...</div>}
      {error && <div className="text-center text-red-600 text-lg">No data found</div>}

      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto max-w-6xl mx-auto">
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
              headRow: { style: { backgroundColor: "#01588E", color: "white", fontWeight: "bold" } },
              cells: { style: { fontSize: "14px", color: "#374151" } },
              rows: {
                style: {
                  "&:nth-child(even)": { backgroundColor: "#f9fafb" },
                  "&:hover": { backgroundColor: "#f3f4f6" },
                },
              },
            }}
          />
        </div>
      )}

      {isFormOpen && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {formMode === "add" ? "Add Expenses" : "Update Expenses"} for CN No: {selectedRow.CN_CN_NO}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column */}
              <div>
                <div>
                  <label>CN No</label>
                  <input
                    type="text"
                    value={selectedRow.CN_CN_NO || ""}
                    className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label>Kilometer</label>
                  <input
                    type="number"
                    value={selectedRow.KILOMETER || ""}
                    onChange={(e) => handleInputChange("KILOMETER", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Rate (per Km)</label>
                  <input
                    type="number"
                    value={selectedRow.RATE || ""}
                    onChange={(e) => handleInputChange("RATE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Latitude</label>
                  <input
                    type="number"
                    value={selectedRow.LATITUDE || ""}
                    onChange={(e) => handleInputChange("LATITUDE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Longitude</label>
                  <input
                    type="number"
                    value={selectedRow.LONGITUDE || ""}
                    onChange={(e) => handleInputChange("LONGITUDE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Freight (Auto-calculated)</label>
                  <input
                    type="number"
                    value={selectedRow.FREIGHT || ""}
                    className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label>Union/Km</label>
                  <input
                    type="number"
                    value={selectedRow.UNION_KM || ""}
                    onChange={(e) => handleInputChange("UNION_KM", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Extra Point</label>
                  <input
                    type="number"
                    value={selectedRow.EXTRA_POINT || ""}
                    onChange={(e) => handleInputChange("EXTRA_POINT", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Dt Expense</label>
                  <input
                    type="number"
                    value={selectedRow.DT_EXPENSE || ""}
                    onChange={(e) => handleInputChange("DT_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div>
                  <label>Escort Expense</label>
                  <input
                    type="number"
                    value={selectedRow.ESCORT_EXPENSE || ""}
                    onChange={(e) => handleInputChange("ESCORT_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Loading Expense</label>
                  <input
                    type="number"
                    value={selectedRow.LOADING_EXPENSE || ""}
                    onChange={(e) => handleInputChange("LOADING_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Unloading Expense</label>
                  <input
                    type="number"
                    value={selectedRow.UNLOADING_EXPENSE || ""}
                    onChange={(e) => handleInputChange("UNLOADING_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Labour Expense</label>
                  <input
                    type="number"
                    value={selectedRow.LABOUR_EXPENSE || ""}
                    onChange={(e) => handleInputChange("LABOUR_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Other Expense</label>
                  <input
                    type="number"
                    value={selectedRow.OTHER_EXPENSE || ""}
                    onChange={(e) => handleInputChange("OTHER_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Crane/Hydra Expense</label>
                  <input
                    type="number"
                    value={selectedRow.CRANE_HYDRA_EXPENSE || ""}
                    onChange={(e) => handleInputChange("CRANE_HYDRA_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                <label>HeadLoad Expense</label>
                  <input
                    type="number"
                    value={selectedRow.HEADLOAD_EXPENSE || ""}
                    onChange={(e) => handleInputChange("HEADLOAD_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Chain Pulley Expense</label>
                  <input
                    type="number"
                    value={selectedRow.CHAIN_PULLEY_EXPENSE || ""}
                    onChange={(e) => handleInputChange("CHAIN_PULLEY_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Toll Tax</label>
                  <input
                    type="number"
                    value={selectedRow.TOLL_TAX || ""}
                    onChange={(e) => handleInputChange("TOLL_TAX", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Packing Expense</label>
                  <input
                    type="number"
                    value={selectedRow.PACKING_EXPENSE || ""}
                    onChange={(e) => handleInputChange("PACKING_EXPENSE", e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label>Total Amount (Auto-calculated)</label>
                  <input
                    type="number"
                    value={selectedRow.TOTAL_AMOUNT || ""}
                    className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label>Remarks</label>
                  <textarea
                    value={selectedRow.REMARKS || ""}
                    onChange={(e) => handleInputChange("REMARKS", e.target.value)}
                    className="w-full border rounded-lg p-2"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={closeForm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Close
              </button>
              <button
                onClick={handleSaveExpenses}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {formMode === "add" ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isBulkUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4">Bulk Upload Expenses</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Excel File (.xlsx, .xls, .csv)
              </label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {uploadFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {uploadFile.name}
                </p>
              )}
            </div>

            <div className="mb-4">
              <button
                onClick={downloadTemplate}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Download Sample Template
              </button>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Uploading: {uploadProgress}% complete
                </p>
              </div>
            )}

            {uploadResults && (
              <div className="mb-4 p-4 border rounded-lg">
                <h3 className="font-bold mb-2">Upload Results:</h3>
                {uploadResults.invalid ? (
                  <>
                    <p className="text-red-600">
                      {uploadResults.invalid.length} invalid rows found (out of {uploadResults.total})
                    </p>
                    <div className="mt-2 max-h-40 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Row</th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CN No</th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Errors</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {uploadResults.invalid.map((row, index) => (
                            <tr key={index}>
                              <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">{row.row}</td>
                              <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">{row.cnNo || "-"}</td>
                              <td className="px-2 py-1 whitespace-nowrap text-sm text-red-600">{row.errors}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Please correct the errors and try again.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-green-600">
                      Successfully processed {uploadResults.success} records
                    </p>
                    {uploadResults.failed > 0 && (
                      <p className="text-red-600">
                        Failed to process {uploadResults.failed} records
                      </p>
                    )}
                    {uploadResults.errors.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CN No</th>
                              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {uploadResults.errors.map((error, index) => (
                              <tr key={index}>
                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">{error.cnNo}</td>
                                <td className="px-2 py-1 whitespace-nowrap text-sm text-red-600">{error.message}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={closeBulkUpload}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Close
              </button>
              <button
                onClick={processBulkUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={!uploadFile}
              >
                Process Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LrDetails;