import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { getToken } from "../../Auth/auth";
import { saveAs } from "file-saver";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import { CustomTable } from "../Ui/CustomTable";

const LrDetails = ({ isNavbarCollapsed }) => {
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
  const [selectedRow, setSelectedRow] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState(null);
  const [formReadOnly, setFormReadOnly] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showLocation, setShowLocation] = useState(false); // New state for checkbox toggle
  const firstUpdate = useRef(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const CNMODEVATMap = {
    1: "1/NRGP",
    2: "2/SRN",
    3: "3/CAM",
    4: "4/IUT",
    5: "5/RMO",
    6: "6/MGMT GR",
    7: "7/FIX NRGP",
    8: "8/FIX SRN",
  };
  const CNMODEVATMapforExcel = {
    1: "NRGP",
    2: "SRN",
    3: "CAM",
    4: "IUT",
    5: "RMO",
    6: "MGMT GR",
    7: "FIX NRGP",
    8: "FIX SRN",
  };

  const token = getToken();
  const decodedToken = jwtDecode(token);
  const USER_ID = decodedToken.id;

  // Validation function for form fields
  const validateForm = (row) => {
    const errors = {};
    const requiredFields = ["RATE", "LATITUDE", "LONGITUDE", "KILOMETER"];

    // Validate Location if checkbox is checked
    if (showLocation) {
      if (!row.LOCATIONS && row.LOCATIONS !== 0) {
        errors.LOCATIONS = "Location is required";
      }
    }

    requiredFields.forEach((field) => {
      if (!row[field] && row[field] !== 0) {
        errors[field] = `${field.replace(/_/g, " ")} is required`;
      } else if (isNaN(parseFloat(row[field]))) {
        errors[field] = `${field.replace(/_/g, " ")} must be a valid number`;
      }
    });

    const optionalNumericFields = [
      "UNION_KM",
      "EXTRA_POINT",
      "FLOOR",
      "DT_EXPENSE",
      "ESCORT_EXPENSE",
      "LOADING_EXPENSE",
      "UNLOADING_EXPENSE",
      "LABOUR_EXPENSE",
      "OTHER_EXPENSE",
      "CRANE_HYDRA_EXPENSE",
      "HEADLOAD_EXPENSE",
      "HEADLOAD_KM",
      "CHAIN_PULLEY_EXPENSE",
      "TOLL_TAX",
      "PACKING_EXPENSE",
    ];

    optionalNumericFields.forEach((field) => {
      if (
        row[field] !== "" &&
        row[field] !== undefined &&
        row[field] !== null
      ) {
        if (isNaN(parseFloat(row[field]))) {
          errors[field] = `${field.replace(/_/g, " ")} must be a valid number`;
        }
      }
    });

    return errors;
  };

  const openFormInAddMode = (row) => {
    setFormMode("add");
    setShowLocation(false); // Default to unchecked
    setSelectedRow({
      CN_CN_NO: row.CN_CN_NO,
      SITE_ID: row.OTPL_SITE_ID || "",
      FLOOR: row.FLOOR || "",
      MOMENT_TYPE: row.CN_MODE_VAT || "",
      KILOMETER: "",
      LOCATIONS: "",
      RATE: "",
      LATITUDE: "",
      LONGITUDE: "",
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
      HEADLOAD_KM: "",
      CHAIN_PULLEY_EXPENSE: "",
      TOLL_TAX: "",
      PACKING_EXPENSE: "",
      TOTAL_AMOUNT: "",
      REMARKS: "",
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openFormInUpdateMode = (row) => {
    setFormMode("update");
    setFormReadOnly(false);
    setShowLocation(!!row.LOCATIONS); // Show Location if it has a value
    setSelectedRow({
      CN_CN_NO: row.CN_CN_NO,
      KILOMETER: row.KILOMETER || "",
      SITE_ID: row.OTPL_SITE_ID || "",
      FLOOR: row.FLOOR || "",
      MOMENT_TYPE: row.CN_MODE_VAT || "",
      LOCATIONS: row.LOCATIONS || "",
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
      HEADLOAD_KM: row.HEADLOAD_KM || "",
      CHAIN_PULLEY_EXPENSE: row.CHAIN_PULLEY_EXPENSE || "",
      TOLL_TAX: row.TOLL_TAX || "",
      PACKING_EXPENSE: row.PACKING_EXPENSE || "",
      TOTAL_AMOUNT: row.TOTAL_AMOUNT || "",
      REMARKS: row.REMARKS || "",
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openFormInReadMode = (row) => {
    setFormMode("read");
    setFormReadOnly(true);
    setShowLocation(!!row.LOCATIONS);
    setSelectedRow({
      CN_CN_NO: row.CN_CN_NO,
      KILOMETER: row.KILOMETER || "",
      SITE_ID: row.OTPL_SITE_ID || "",
      FLOOR: row.FLOOR || "",
      MOMENT_TYPE: row.CN_MODE_VAT || "",
      LOCATIONS: row.LOCATIONS || "",
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
      HEADLOAD_KM: row.HEADLOAD_KM || "",
      CHAIN_PULLEY_EXPENSE: row.CHAIN_PULLEY_EXPENSE || "",
      TOLL_TAX: row.TOLL_TAX || "",
      PACKING_EXPENSE: row.PACKING_EXPENSE || "",
      TOTAL_AMOUNT: row.TOTAL_AMOUNT || "",
      REMARKS: row.REMARKS || "",
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleInputChange = (field, value) => {
    setSelectedRow((prev) => {
      const updatedRow = { ...prev, [field]: value };

      // Auto-calculate Freight (Rate * Kilometer)
      const kilometer = parseFloat(updatedRow.KILOMETER) || 0;
      const rate = parseFloat(updatedRow.RATE) || 0;
      updatedRow.FREIGHT = (kilometer * rate).toFixed(2);

      // Auto-calculate Total Amount
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
      updatedRow.TOTAL_AMOUNT = expenses
        .reduce((sum, val) => sum + val, 0)
        .toFixed(2);

      return updatedRow;
    });

    // Validate the field on change
    setFormErrors((prev) => {
      const errors = { ...prev };
      const requiredFields = ["RATE", "LATITUDE", "LONGITUDE", "KILOMETER"];

      if (requiredFields.includes(field)) {
        if (!value && value !== 0) {
          errors[field] = `${field.replace(/_/g, " ")} is required`;
        } else if (isNaN(parseFloat(value))) {
          errors[field] = `${field.replace(/_/g, " ")} must be a valid number`;
        } else {
          delete errors[field];
        }
      } else if (field === "LOCATIONS" && showLocation) {
        if (!value && value !== 0) {
          errors.LOCATIONS = "Location is required";
        } else {
          delete errors.LOCATIONS;
        }
      } else if (field !== "REMARKS") {
        if (value !== "" && value !== undefined && value !== null) {
          if (isNaN(parseFloat(value))) {
            errors[field] = `${field.replace(
              /_/g,
              " "
            )} must be a valid number`;
          } else {
            delete errors[field];
          }
        } else {
          delete errors[field];
        }
      }

      return errors;
    });
  };

  const handleNumericInputChange = (field, value) => {
    const filteredValue = value
      .replace(/[^\d.]/g, "")
      .replace(/(\..*)\./g, "$1");
    handleInputChange(field, filteredValue);
  };

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
      setTotalRows(response.data.totalRecords || response.data.data.length);
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
      setTotalRows(response.data.totalRecords || response.data.data.length);
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
      SITE_ID: row.OTPL_SITE_ID,
      FLOOR: row.FLOOR,
      MOMENT_TYPE: row.CN_MODE_VAT,
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
      "Site ID",
      "Source Branch Code",
      "Destination Branch Code",
      "Item Description",
      "Total Packages",
      "Total Weight",
      "Challan Vendor Code",
      "Challan No",
      "Challan Date",
      "Lorry No",
      "Floor",
      "Moment Type",
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
    setFormReadOnly(false);
    setFormErrors({});
    setShowLocation(false);
  };

  const handleEscKeyPress = (event) => {
    if (event.key === "Escape") {
      if (isFormOpen) {
        closeForm();
      } else if (isBulkUploadOpen) {
        closeBulkUpload();
      }
    }
  };

  useEffect(() => {
    if (isFormOpen || isBulkUploadOpen) {
      document.addEventListener("keydown", handleEscKeyPress);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [isFormOpen, isBulkUploadOpen]);

  const closeBulkUpload = () => {
    setIsBulkUploadOpen(false);
    setUploadFile(null);
    setUploadProgress(0);
    setUploadResults(null);
  };

  const handleSaveExpenses = async () => {
    if (!selectedRow) return;

    const errors = validateForm(selectedRow);
    setFormErrors(errors);

    const requiredFields = ["KILOMETER", "RATE", "LATITUDE", "LONGITUDE"];
    if (showLocation) {
      requiredFields.push("LOCATIONS");
    }
    const hasRequiredFieldErrors = Object.keys(errors).some((key) =>
      requiredFields.includes(key)
    );

    if (hasRequiredFieldErrors) {
      toast.error("Please fill all required fields correctly", {
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

    let payload;
    if (formMode === "add") {
      payload = {
        CN_CN_NO: selectedRow.CN_CN_NO,
        KILOMETER: parseFloat(selectedRow.KILOMETER) || 0,
        MOMENT_TYPE: selectedRow.MOMENT_TYPE || "",
        FLOOR: selectedRow.FLOOR || "",
        LOCATIONS: showLocation ? selectedRow.LOCATIONS || 0 : 0,
        RATE: parseFloat(selectedRow.RATE),
        LATITUDE: selectedRow.LATITUDE,
        LONGITUDE: selectedRow.LONGITUDE,
        FREIGHT: parseFloat(selectedRow.FREIGHT),
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
        HEADLOAD_KM: parseFloat(selectedRow.HEADLOAD_KM) || 0,
        CHAIN_PULLEY_EXPENSE: parseFloat(selectedRow.CHAIN_PULLEY_EXPENSE) || 0,
        TOLL_TAX: parseFloat(selectedRow.TOLL_TAX) || 0,
        PACKING_EXPENSE: parseFloat(selectedRow.PACKING_EXPENSE) || 0,
        TOTAL_AMOUNT: parseFloat(selectedRow.TOTAL_AMOUNT),
        REMARKS: selectedRow.REMARKS || "",
        ENTERED_BY: USER_ID,
        MODIFIED_BY: USER_ID,
      };
    } else {
      payload = {
        cn_cn_no: selectedRow.CN_CN_NO,
        kilometer: parseFloat(selectedRow.KILOMETER) || 0,
        moment_type: parseFloat(selectedRow.MOMENT_TYPE) || "",
        floor: parseFloat(selectedRow.FLOOR) || "",
        locations: showLocation ? selectedRow.LOCATIONS || 0 : 0,
        rate: parseFloat(selectedRow.RATE),
        latitude: selectedRow.LATITUDE,
        longitude: selectedRow.LONGITUDE,
        freight: parseFloat(selectedRow.FREIGHT),
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
        headload_km: parseFloat(selectedRow.HEADLOAD_KM) || 0,
        chain_pulley_expense: parseFloat(selectedRow.CHAIN_PULLEY_EXPENSE) || 0,
        toll_tax: parseFloat(selectedRow.TOLL_TAX) || 0,
        packing_expense: parseFloat(selectedRow.PACKING_EXPENSE) || 0,
        total_amount: parseFloat(selectedRow.TOTAL_AMOUNT),
        remarks: selectedRow.REMARKS || "",
        modified_by: USER_ID,
      };
    }

    const apiUrl =
      formMode === "add"
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
        toast.success(
          response.data.msg ||
            `${formMode === "add" ? "Added" : "Updated"} successfully!`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          }
        );
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
      toast.error(
        `Failed to ${formMode === "add" ? "add" : "update"} expenses: ${
          error.response?.data?.msg || error.message
        }`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        "CN No": "",
        "Kilometer": "",
        "Floor": "",
        "Moment Type": "",
        "Locations": "",
        "Rate (per Km)": "",
        "Latitude": "",
        "Longitude": "",
        "Union/Km": "",
        "Extra Point": "",
        "Dt Expense": "",
        "Escort Expense": "",
        "Headload Expense": "",
        "H.K.M( Headload meter) ": "",
        "Loading Expense": "",
        "Unloading Expense": "",
        "Labour Expense": "",
        "Other Expense": "",
        "Crane/Hydra Expense": "",
        "Chain Pulley Expense": "",
        "Toll Tax": "",
        "Packing Expense": "",
        "Remarks": "",
      },
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
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

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
      // DATE VALIDATION ===================================================
      let dateValidationFailed = false;
      const dateValidationResults = [];

      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999); // Include entire end day

        data.forEach((row, index) => {
          const cnDateStr = row["CN Date"];
          console.log("CN Date:", cnDateStr);

          const cnDate = new Date(cnDateStr);


          if (cnDate < from || cnDate > to) {
            dateValidationResults.push({
              row: index + 2,
              cnNo: row["CN No"],
              error: `CN Date (${cnDateStr}) is not between ${fromDate} and ${toDate}`,
            });
            dateValidationFailed = true;
          }
        });
      }

      if (dateValidationFailed) {
        setUploadResults({
          total: data.length,
          invalid: dateValidationResults,
          valid: 0,
          added: 0,
          updated: 0,
          failed: data.length,
          errors: [
            {
              cnNo: "Multiple",
              message: "Date validation failed",
              operation: "validation",
            },
          ],
        });

        toast.error(
          "CN Date validation failed. Please check dates in your file.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          }
        );
        return;
      }
      // END DATE VALIDATION ===============================================

      const processedData = data.map((row) => {
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
          parseFloat(row["Headload Expense"]) || 0,
          parseFloat(row["Chain Pulley Expense"]) || 0,
          parseFloat(row["Toll Tax"]) || 0,
          parseFloat(row["Packing Expense"]) || 0,
        ];
        const totalAmount = expenses.reduce((sum, val) => sum + val, 0);

        return {
          CN_CN_NO: row["CN No"],
          FLOOR: row["Floor"] || "",
          MOMENT_TYPE: row["Moment Type"] || "",
          KILOMETER: kilometer,
          LOCATIONS: row["Locations"] || 0,
          RATE: rate,
          LATITUDE: row["Latitude"] || 0,
          LONGITUDE: row["Longitude"] || 0,
          FREIGHT: freight,
          UNION_KM: parseFloat(row["Union/Km"]) || 0,
          EXTRA_POINT: parseFloat(row["Extra Point"]) || 0,
          DT_EXPENSE: parseFloat(row["Dt Expense"]) || 0,
          ESCORT_EXPENSE: parseFloat(row["Escort Expense"]) || 0,
          LOADING_EXPENSE: parseFloat(row["Loading Expense"]) || 0,
          UNLOADING_EXPENSE: parseFloat(row["Unloading Expense"]) || 0,
          LABOUR_EXPENSE: parseFloat(row["Labour Expense"]) || 0,
          OTHER_EXPENSE: parseFloat(row["Other Expense"]) || 0,
          CRANE_HYDRA_EXPENSE: parseFloat(row["Crane/Hydra Expense"]) || 0,
          HEADLOAD_EXPENSE: parseFloat(row["Headload Expense"]) || 0,
          HEADLOAD_KM: parseFloat(row["H.K.M( Headload meter) "]) || 0,
          CHAIN_PULLEY_EXPENSE: parseFloat(row["Chain Pulley Expense"]) || 0,
          TOLL_TAX: parseFloat(row["Toll Tax"]) || 0,
          PACKING_EXPENSE: parseFloat(row["Packing Expense"]) || 0,
          TOTAL_AMOUNT: totalAmount,
          REMARKS: row["Remarks"] || "",
          CNTODATE: new Date(toDate),
          CNFROMDATE: new Date(fromDate),
          ENTERED_BY: USER_ID,
          MODIFIED_BY: USER_ID,
        };
      });

      const validationResults = data.map((row, index) => {
        const errors = [];
        if (!row["CN No"]) errors.push("CN No is required");
        if (!row["Kilometer"] && row["Kilometer"] !== 0)
          errors.push("Kilometer is required");
        if (row["Locations"] && !isNaN(parseFloat(row["Locations"]))) {
          if (!row["Locations"] && row["Locations"] !== 0)
            errors.push("Location is required");
        }
        if (!row["Rate (per Km)"] && row["Rate (per Km)"] !== 0)
          errors.push("Rate is required");
        if (!row["Latitude"] && row["Latitude"] !== 0)
          errors.push("Latitude is required");
        if (!row["Longitude"] && row["Longitude"] !== 0)
          errors.push("Longitude is required");

        const numericFields = [
          "Kilometer",
          "Rate (per Km)",
          "Floor",
          "Latitude",
          "Longitude",
          "Union/Km",
          "Extra Point",
          "Dt Expense",
          "Escort Expense",
          "Loading Expense",
          "Unloading Expense",
          "Labour Expense",
          "Other Expense",
          "Crane/Hydra Expense",
          "Headload Expense",
          "H.K.M( Headload meter) ",
          "Chain Pulley Expense",
          "Toll Tax",
          "Packing Expense",
        ];
        numericFields.forEach((field) => {
          if (row[field] && isNaN(parseFloat(row[field]))) {
            errors.push(`${field.replace(/_/g, " ")} must be a valid number`);
          }
        });

        return {
          row: index + 2,
          cnNo: row["CN No"],
          isValid: errors.length === 0,
          errors: errors.length > 0 ? errors.join(", ") : null,
        };
      });

      const invalidRows = validationResults.filter((item) => !item.isValid);
      if (invalidRows.length > 0) {
        setUploadResults({
          total: processedData.length,
          invalid: invalidRows,
          valid: processedData.length - invalidRows.length,
          added: 0,
          updated: 0,
          failed: 0,
          errors: [],
        });
        return;
      }

      const results = {
        added: 0,
        updated: 0,
        failed: 0,
        errors: [],
      };

      try {
        const addResponse = await axios.post(
          "https://vmsnode.omlogistics.co.in/api/addExpenses",
          processedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (addResponse.data.error === false) {
          results.added += processedData.length;
        } else {
          if (
            addResponse.data.msg?.includes("Expenses already added") ||
            addResponse.data.error
          ) {
            const updatePayload = processedData.map((item) => ({
              cn_cn_no: item.CN_CN_NO,
              kilometer: item.KILOMETER,
              moment_type: item.CN_MODE_VAT,
              floor: item.FLOOR,
              locations: item.LOCATIONS,
              rate: item.RATE,
              latitude: item.LATITUDE,
              longitude: item.LONGITUDE,
              freight: item.FREIGHT,
              union_km: item.UNION_KM,
              extra_point: item.EXTRA_POINT,
              dt_expense: item.DT_EXPENSE,
              escort_expense: item.ESCORT_EXPENSE,
              loading_expense: item.LOADING_EXPENSE,
              unloading_expense: item.UNLOADING_EXPENSE,
              labour_expense: item.LABOUR_EXPENSE,
              other_expense: item.OTHER_EXPENSE,
              crane_hydra_expense: item.CRANE_HYDRA_EXPENSE,
              headload_expense: item.HEADLOAD_EXPENSE,
              headload_km: item.HEADLOAD_KM,
              chain_pulley_expense: item.CHAIN_PULLEY_EXPENSE,
              toll_tax: item.TOLL_TAX,
              packing_expense: item.PACKING_EXPENSE,
              total_amount: item.TOTAL_AMOUNT,
              cntodate: new Date(toDate),
              cnfromdate: new Date(fromDate),
              remarks: item.REMARKS,
              modified_by: item.MODIFIED_BY,
            }));

            try {
              const updateResponse = await axios.post(
                "https://vmsnode.omlogistics.co.in/api/updateExpenses",
                updatePayload,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (updateResponse.data.error === false) {
                results.updated += processedData.length;
              } else {
                results.failed += processedData.length;
                results.errors.push({
                  cnNo: "Multiple",
                  message:
                    updateResponse.data.msg || "Failed to update expenses",
                  operation: "update",
                });
              }
            } catch (updateError) {
              results.failed += processedData.length;
              results.errors.push({
                cnNo: "Multiple",
                message:
                  updateError.response?.data?.msg ||
                  updateError.message ||
                  "Unknown error during update",
                operation: "update",
              });
            }
          } else {
            results.failed += processedData.length;
            results.errors.push({
              cnNo: "Multiple",
              message: addResponse.data.msg || "Failed to add expenses",
              operation: "add",
            });
          }
        }
      } catch (addError) {
        if (
          addError.response?.data?.error &&
          addError.response?.data?.msg?.trim() ===
            "Expenses already added in this CN no"
        ) {
          const updatePayload = processedData.map((item) => ({
            cn_cn_no: item.CN_CN_NO,
            kilometer: item.KILOMETER,
            moment_type: item.CN_MODE_VAT,
            floor: item.FLOOR,
            locations: item.LOCATIONS,
            rate: item.RATE,
            latitude: item.LATITUDE,
            longitude: item.LONGITUDE,
            freight: item.FREIGHT,
            union_km: item.UNION_KM,
            extra_point: item.EXTRA_POINT,
            dt_expense: item.DT_EXPENSE,
            escort_expense: item.ESCORT_EXPENSE,
            loading_expense: item.LOADING_EXPENSE,
            unloading_expense: item.UNLOADING_EXPENSE,
            labour_expense: item.LABOUR_EXPENSE,
            other_expense: item.OTHER_EXPENSE,
            crane_hydra_expense: item.CRANE_HYDRA_EXPENSE,
            headload_expense: item.HEADLOAD_EXPENSE,
            headload_km: item.HEADLOAD_KM,
            chain_pulley_expense: item.CHAIN_PULLEY_EXPENSE,
            toll_tax: item.TOLL_TAX,
            packing_expense: item.PACKING_EXPENSE,
            total_amount: item.TOTAL_AMOUNT,
            cntodate: new Date(toDate),
            cnfromdate: new Date(fromDate),
            remarks: item.REMARKS,
            modified_by: item.MODIFIED_BY,
          }));

          try {
            const updateResponse = await axios.post(
              "https://vmsnode.omlogistics.co.in/api/updateExpenses",
              updatePayload,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (updateResponse.data.error === false) {
              results.updated += processedData.length;
            } else {
              results.failed += processedData.length;
              results.errors.push({
                cnNo: "Multiple",
                message: updateResponse.data.msg || "Failed to update expenses",
                operation: "update",
              });
            }
          } catch (updateError) {
            results.failed += processedData.length;
            results.errors.push({
              cnNo: "Multiple",
              message:
                updateError.response?.data?.msg ||
                updateError.message ||
                "Unknown error during update",
              operation: "update",
            });
          }
        } else {
          results.failed += processedData.length;
          results.errors.push({
            cnNo: "Multiple",
            message:
              addError.response?.data?.msg ||
              addError.message ||
              "Unknown error during add",
            operation: "add",
          });
        }
      }

      setUploadResults({
        total: processedData.length,
        invalid: [],
        valid: processedData.length,
        added: results.added,
        updated: results.updated,
        failed: results.failed,
        errors: results.errors,
      });
      setUploadProgress(100);

      if (results.added > 0) {
        toast.success(`${results.added} records added successfully`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
      if (results.updated > 0) {
        toast.success(`${results.updated} records updated successfully`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
      if (results.failed > 0) {
        toast.error(`${results.failed} records failed to process`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }

      fetchLrDetailsData();
    } catch (error) {
      toast.error(
        `Error processing file: ${
          error.message || "All columns should be available"
        }`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
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
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-3 sticky-action-col">
          {row.KILOMETER || row.RATE || row.FREIGHT || row.TOTAL_AMOUNT ? (
            <button
              onClick={() => openFormInReadMode(row)}
              className="text-blue-500 text-xs"
              title="View Expenses"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 12C3 7 8 4 12 4C16 4 21 7 23 12C21 17 16 20 12 20C8 20 3 17 1 12Z"
                  stroke="blue"
                  stroke-width="2"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="black"
                  stroke-width="2"
                  fill="none"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => openFormInAddMode(row)}
              className="text-blue-500 text-2xl hover:text-blue-700"
              title="Add Expenses"
            >
              +
            </button>
          )}
          <button
            onClick={() => openFormInUpdateMode(row)}
            className="text-green-500 text-2xl hover:text-green-700"
            title="Edit Expenses"
          >
            ✎
          </button>
        </div>
      ),
      width: "100px",
    },
    {
      name: "Row No",
      selector: (row) => row.ROW_NUM || "-",
      sortable: true,
      wrap: true,
      width: "",
    },
    {
      name: "CN No",
      selector: (row) => row.CN_CN_NO || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Manual CN No",
      selector: (row) => row.CN_MANUAL_CN_NO || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "CN Date",
      selector: (row) =>
        row.CN_CN_DATE ? new Date(row.CN_CN_DATE).toLocaleDateString() : "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Challan No",
      selector: (row) => row.CHLN_CHLN_NO || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Source Branch Code",
      selector: (row) => row.CN_SOURCE_BRANCH_CODE || "-",
      sortable: true,
      wrap: true,
      width: "170px",
    },
    {
      name: "Destination Branch Code",
      selector: (row) => row.CN_DESTINATION_BRANCH_CODE || "-",
      sortable: true,
      wrap: true,
      width: "190px",
    },
    {
      name: "Mode VAT",
      selector: (row) => CNMODEVATMap[row.CN_MODE_VAT] || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Item Description",
      selector: (row) => row.CN_ITEM_DESCRIPT || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Total Packages",
      selector: (row) => row.TOTAL_CN_PKG || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Total Weight",
      selector: (row) => row.TOTAL_CN_ACTUAL_WEIGHT || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Challan Vendor Code",
      selector: (row) => row.CHLN_VENDOR_CODE || "-",
      sortable: true,
      wrap: true,
      width: "190px",
    },
    
    {
      name: "Challan Date",
      selector: (row) =>
        row.CHLN_CHLN_DATE
          ? new Date(row.CHLN_CHLN_DATE).toLocaleDateString()
          : "-",
      sortable: true,
      wrap: true,
      width: "170px",
    },
    {
      name: "Lorry No",
      selector: (row) => row.CHLN_LORRY_NO || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Site ID",
      selector: (row) => row.OTPL_SITE_ID || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Kilometer",
      selector: (row) => row.KILOMETER || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Locations",
      selector: (row) => row.LOCATIONS || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Rate",
      selector: (row) => row.RATE || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Freight",
      selector: (row) => row.FREIGHT || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Union KM",
      selector: (row) => row.UNION_KM || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Extra Point",
      selector: (row) => row.EXTRA_POINT || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "DT Expense",
      selector: (row) => row.DT_EXPENSE || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Escort Expense",
      selector: (row) => row.ESCORT_EXPENSE || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Loading Expense",
      selector: (row) => row.LOADING_EXPENSE || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Unloading Expense",
      selector: (row) => row.UNLOADING_EXPENSE || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Labour Expense",
      selector: (row) => row.LABOUR_EXPENSE || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Other Expense",
      selector: (row) => row.OTHER_EXPENSE || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Crane Hydra Expense",
      selector: (row) => row.CRANE_HYDRA_EXPENSE || "-",
      sortable: true,
      wrap: true,
      width: "170px",
    },
    {
      name: "Headload Km",
      selector: (row) => row.HEADLOAD_KM || "-",
      sortable: true,
      wrap: true,
      width: "170px",
    },
    {
      name: "Headload Expense",
      selector: (row) => row.HEADLOAD_EXPENSE || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Chain Pulley Expense",
      selector: (row) => row.CHAIN_PULLEY_EXPENSE || "-",
      sortable: true,
      wrap: true,
      width: "170px",
    },
    {
      name: "Toll Tax",
      selector: (row) => row.TOLL_TAX || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Packing Expense",
      selector: (row) => row.PACKING_EXPENSE || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Total Amount",
      selector: (row) => row.TOTAL_AMOUNT || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Latitude",
      selector: (row) => row.LATITUDE || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Longitude",
      selector: (row) => row.LONGITUDE || "-",
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: "Remarks",
      selector: (row) => row.REMARKS || "-",
      sortable: true,
      wrap: true,
      width: "200px",
    },
  ];

  const rowPerPageOptions = [20, 50, 100, 200, 500, 1000, 5000, 10000];

  return (
    <div
      className={`bg-gray-50 py-3 px-6 ${marginClass} transition-all duration-300`}
    >
      <ToastContainer />

      <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-8xl mx-auto">
        <div>
          <label
            htmlFor="fromDate"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
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
          <label
            htmlFor="toDate"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
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
            <label
              htmlFor="search"
              className="whitespace-nowrap block text-xs font-medium text-gray-700 mb-1"
            >
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
              onClick={() => setIsBulkUploadOpen(true)}
              className="whitespace-nowrap px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors w-full"
            >
              Bulk Upload
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

      {isFormOpen && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {formMode === "add"
                ? "Add Expenses"
                : formMode === "update"
                ? "Update Expenses"
                : "View Expenses"}{" "}
              for CN No: {selectedRow.CN_CN_NO}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column */}
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CN No
                  </label>
                  <input
                    type="text"
                    value={selectedRow.CN_CN_NO || ""}
                    className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                {!formReadOnly && (
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showLocation}
                        onChange={(e) => setShowLocation(e.target.checked)}
                        disabled={formReadOnly}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Include Location <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kilometer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedRow.KILOMETER || ""}
                    onChange={(e) =>
                      handleNumericInputChange("KILOMETER", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.KILOMETER ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.KILOMETER && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.KILOMETER}
                    </p>
                  )}
                </div>
                {showLocation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={selectedRow.LOCATIONS || ""}
                      onChange={(e) =>
                        handleInputChange("LOCATIONS", e.target.value)
                      }
                      readOnly={formReadOnly}
                      className={`w-full border rounded-lg p-2 ${
                        formErrors.LOCATIONS ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.LOCATIONS && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.LOCATIONS}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rate (per Km) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedRow.RATE || ""}
                    onChange={(e) =>
                      handleNumericInputChange("RATE", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.RATE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.RATE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.RATE}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedRow.LATITUDE || ""}
                    onChange={(e) =>
                      handleNumericInputChange("LATITUDE", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.LATITUDE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.LATITUDE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.LATITUDE}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={selectedRow.LONGITUDE || ""}
                    onChange={(e) =>
                      handleNumericInputChange("LONGITUDE", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.LONGITUDE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.LONGITUDE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.LONGITUDE}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Freight (Auto-calculated)
                  </label>
                  <input
                    type="text"
                    value={selectedRow.FREIGHT || ""}
                    className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Site Id
                  </label>
                  <input
                    type="text"
                    value={selectedRow.OTPL_SITE_ID || ""}
                    readOnly
                    className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
  <label className="block text-sm font-medium text-gray-700">
    Moment Type
  </label>
  <select
    value={selectedRow.MOMENT_TYPE || ""}
    onChange={(e) => handleInputChange("MOMENT_TYPE", e.target.value)}
    disabled={formReadOnly}
    className={`w-full border rounded-lg p-2 ${
      formErrors.MOMENT_TYPE ? "border-red-500" : ""
    }`}
  >
    <option value="">Select Moment Type</option>
    {Object.entries(CNMODEVATMap).map(([key, value]) => (
      <option key={key} value={key}>
        {value}
      </option>
    ))}
  </select>
  {formErrors.MOMENT_TYPE && (
    <p className="text-red-500 text-xs mt-1">
      {formErrors.MOMENT_TYPE}
    </p>
  )}
</div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Floor
                  </label>
                  <input
                    type="text"
                    value={selectedRow.FLOOR || ""}
                    onChange={(e) =>
                      handleNumericInputChange("FLOOR", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.FLOOR ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.FLOOR && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.FLOOR}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Union/Km
                  </label>
                  <input
                    type="text"
                    value={selectedRow.UNION_KM || ""}
                    onChange={(e) =>
                      handleNumericInputChange("UNION_KM", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.UNION_KM ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.UNION_KM && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.UNION_KM}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Extra Point
                  </label>
                  <input
                    type="text"
                    value={selectedRow.EXTRA_POINT || ""}
                    onChange={(e) =>
                      handleNumericInputChange("EXTRA_POINT", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.EXTRA_POINT ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.EXTRA_POINT && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.EXTRA_POINT}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dt Expense
                  </label>
                  <input
                    type="text"
                    value={selectedRow.DT_EXPENSE || ""}
                    onChange={(e) =>
                      handleNumericInputChange("DT_EXPENSE", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.DT_EXPENSE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.DT_EXPENSE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.DT_EXPENSE}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Escort Expense
                  </label>
                  <input
                    type="text"
                    value={selectedRow.ESCORT_EXPENSE || ""}
                    onChange={(e) =>
                      handleNumericInputChange("ESCORT_EXPENSE", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.ESCORT_EXPENSE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.ESCORT_EXPENSE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.ESCORT_EXPENSE}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loading Expense
                  </label>
                  <input
                    type="text"
                    value={selectedRow.LOADING_EXPENSE || ""}
                    onChange={(e) =>
                      handleNumericInputChange(
                        "LOADING_EXPENSE",
                        e.target.value
                      )
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.LOADING_EXPENSE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.LOADING_EXPENSE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.LOADING_EXPENSE}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unloading Expense
                  </label>
                  <input
                    type="text"
                    value={selectedRow.UNLOADING_EXPENSE || ""}
                    onChange={(e) =>
                      handleNumericInputChange(
                        "UNLOADING_EXPENSE",
                        e.target.value
                      )
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.UNLOADING_EXPENSE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.UNLOADING_EXPENSE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.UNLOADING_EXPENSE}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Labour Expense
                  </label>
                  <input
                    type="text"
                    value={selectedRow.LABOUR_EXPENSE || ""}
                    onChange={(e) =>
                      handleNumericInputChange("LABOUR_EXPENSE", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.LABOUR_EXPENSE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.LABOUR_EXPENSE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.LABOUR_EXPENSE}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Other Expense
                  </label>
                  <input
                    type="text"
                    value={selectedRow.OTHER_EXPENSE || ""}
                    onChange={(e) =>
                      handleNumericInputChange("OTHER_EXPENSE", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.OTHER_EXPENSE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.OTHER_EXPENSE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.OTHER_EXPENSE}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Crane/Hydra Expense
                  </label>
                  <input
                    type="text"
                    value={selectedRow.CRANE_HYDRA_EXPENSE || ""}
                    onChange={(e) =>
                      handleNumericInputChange(
                        "CRANE_HYDRA_EXPENSE",
                        e.target.value
                      )
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.CRANE_HYDRA_EXPENSE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.CRANE_HYDRA_EXPENSE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.CRANE_HYDRA_EXPENSE}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Headload Expense
                  </label>
                  <input
                    type="text"
                    value={selectedRow.HEADLOAD_EXPENSE || ""}
                    onChange={(e) =>
                      handleNumericInputChange(
                        "HEADLOAD_EXPENSE",
                        e.target.value
                      )
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.HEADLOAD_EXPENSE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.HEADLOAD_EXPENSE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.HEADLOAD_EXPENSE}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    H.K.M( Headload meter)
                  </label>
                  <input
                    type="text"
                    value={selectedRow.HEADLOAD_KM || ""}
                    onChange={(e) =>
                      handleNumericInputChange("HEADLOAD_KM", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.HEADLOAD_KM ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.HEADLOAD_KM && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.HEADLOAD_KM}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Chain Pulley Expense
                  </label>
                  <input
                    type="text"
                    value={selectedRow.CHAIN_PULLEY_EXPENSE || ""}
                    onChange={(e) =>
                      handleNumericInputChange(
                        "CHAIN_PULLEY_EXPENSE",
                        e.target.value
                      )
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.CHAIN_PULLEY_EXPENSE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.CHAIN_PULLEY_EXPENSE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.CHAIN_PULLEY_EXPENSE}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Toll Tax
                  </label>
                  <input
                    type="text"
                    value={selectedRow.TOLL_TAX || ""}
                    onChange={(e) =>
                      handleNumericInputChange("TOLL_TAX", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.TOLL_TAX ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.TOLL_TAX && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.TOLL_TAX}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Packing Expense
                  </label>
                  <input
                    type="text"
                    value={selectedRow.PACKING_EXPENSE || ""}
                    onChange={(e) =>
                      handleNumericInputChange(
                        "PACKING_EXPENSE",
                        e.target.value
                      )
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.PACKING_EXPENSE ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.PACKING_EXPENSE && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.PACKING_EXPENSE}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Amount (Auto-calculated)
                  </label>
                  <input
                    type="text"
                    value={selectedRow.TOTAL_AMOUNT || ""}
                    className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Remarks
                  </label>
                  <textarea
                    value={selectedRow.REMARKS || ""}
                    onChange={(e) =>
                      handleInputChange("REMARKS", e.target.value)
                    }
                    readOnly={formReadOnly}
                    className={`w-full border rounded-lg p-2 ${
                      formErrors.REMARKS ? "border-red-500" : ""
                    }`}
                    rows="3"
                  />
                  {formErrors.REMARKS && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.REMARKS}
                    </p>
                  )}
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
              {!formReadOnly && (
                <button
                  onClick={handleSaveExpenses}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {formMode === "add" ? "Add" : "Update"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isBulkUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4">Bulk Upload Expenses</h2>

            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
            </div>

            <p className="text-red-700 ">
              We recommend uploading expenses for more than 7 days at once.
            </p>
             
            <p className="text-sm text-gray-600 mb-4">
              Please ensure the Excel file follows the given MODEVAT
              </p>

            <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Key</th>
            <th className="border px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(CNMODEVATMapforExcel).map(([key, value]) => (
            <tr key={key}>
              <td className="border px-4 py-2 text-center">{key}</td>
              <td className="border px-4 py-2">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
                {uploadResults.invalid.length > 0 ? (
                  <>
                    <p className="text-red-600">
                      {uploadResults.invalid.length} invalid rows found (out of{" "}
                      {uploadResults.total})
                    </p>
                    <div className="mt-2 max-h-40 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Row
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              CN No
                            </th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Errors
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {uploadResults.invalid.map((row, index) => (
                            <tr key={index}>
                              <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                                {row.row}
                              </td>
                              <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                                {row.cnNo || "-"}
                              </td>
                              <td className="px-2 py-1 whitespace-nowrap text-sm text-red-600">
                                {row.errors}
                              </td>
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
                      Successfully added {uploadResults.added} and updated{" "}
                      {uploadResults.updated} records
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
                              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CN No
                              </th>
                              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Error
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {uploadResults.errors.map((error, index) => (
                              <tr key={index}>
                                <td className="px-2 py-1 whitespace-nowrap text-sm text-gray-500">
                                  {error.cnNo}
                                </td>
                                <td className="px-2 py-1 whitespace-nowrap text-sm text-red-600">
                                  {error.message}
                                </td>
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
