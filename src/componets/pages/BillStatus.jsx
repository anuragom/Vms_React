import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { CustomTable } from "../Ui/CustomTable";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BillStatus = ({ isNavbarCollapsed }) => {
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
  const [totalRows, setTotalRows] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [selectedAnnexureNo, setSelectedAnnexureNo] = useState("");
  const [selectedCnData, setSelectedCnData] = useState(null);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [otherModalOpen, setOtherModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState({
    CN_CN_NO: "",
    KILOMETER: "",
    MOMENT_TYPE: "",
    FLOOR: "",
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
  const [showLocation, setShowLocation] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const token = getToken();
  const decodedToken = jwtDecode(token);
  const USER_ID = decodedToken?.id;

  const momentTypeOptions = [
    { value: "1", label: "1/NRGP" },
    { value: "2", label: "2/SRN" },
    { value: "3", label: "3/CAM" },
    { value: "4", label: "4/IUT" },
    { value: "5", label: "5/RMO" },
    { value: "6", label: "6/MGMT GR" },
    { value: "7", label: "7/FIX NRGP" },
    { value: "8", label: "8/FIX SRN" },
  ];

  // Updated validation function with extra validation logic
  const validateForm = (row) => {
    const errors = {};
    const requiredFields = ["RATE", "LATITUDE", "LONGITUDE", "KILOMETER"];

    // Validate Location if checkbox is checked
    if (showLocation) {
      if (!row.LOCATIONS && row.LOCATIONS !== 0) {
        errors.LOCATIONS = "Location is required";
      } else if (isNaN(parseFloat(row.LOCATIONS))) {
        errors.LOCATIONS = "Location must be a valid number";
      } else if (parseFloat(row.LOCATIONS) < 0) {
        errors.LOCATIONS = "Location must be a non-negative number";
      }
    }

    // Validate required fields
    requiredFields.forEach((field) => {
      if (!row[field] && row[field] !== 0) {
        errors[field] = `${field.replace(/_/g, " ")} is required`;
      } else if (isNaN(parseFloat(row[field]))) {
        errors[field] = `${field.replace(/_/g, " ")} must be a valid number`;
      } else {
        // Additional validations for specific fields
        if (field === "KILOMETER" && parseFloat(row[field]) <= 0) {
          errors[field] = "Kilometer must be a positive number";
        }
        if (field === "RATE" && parseFloat(row[field]) <= 0) {
          errors[field] = "Rate must be a positive number";
        }
        if (field === "LATITUDE") {
          const latitude = parseFloat(row[field]);
          if (latitude < -90 || latitude > 90) {
            errors[field] = "Latitude must be between -90 and 90";
          }
        }
        if (field === "LONGITUDE") {
          const longitude = parseFloat(row[field]);
          if (longitude < -180 || longitude > 180) {
            errors[field] = "Longitude must be between -180 and 180";
          }
        }
      }
    });

    // Validate optional numeric fields
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
        } else if (parseFloat(row[field]) < 0) {
          errors[field] = `${field.replace(/_/g, " ")} must be a non-negative number`;
        }
      }
    });

    // Validate REMARKS length
    if (row.REMARKS && row.REMARKS.length > 500) {
      errors.REMARKS = "Remarks must not exceed 500 characters";
    }

    return errors;
  };

  // Handle input change with validation and auto-calculations
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
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
          // Additional validations for specific fields
          if (field === "KILOMETER" && parseFloat(value) <= 0) {
            errors[field] = "Kilometer must be a positive number";
          } else if (field === "RATE" && parseFloat(value) <= 0) {
            errors[field] = "Rate must be a positive number";
          } else if (field === "LATITUDE") {
            const latitude = parseFloat(value);
            if (latitude < -90 || latitude > 90) {
              errors[field] = "Latitude must be between -90 and 90";
            } else {
              delete errors[field];
            }
          } else if (field === "LONGITUDE") {
            const longitude = parseFloat(value);
            if (longitude < -180 || longitude > 180) {
              errors[field] = "Longitude must be between -180 and 180";
            } else {
              delete errors[field];
            }
          } else {
            delete errors[field];
          }
        }
      } else if (field === "LOCATIONS" && showLocation) {
        if (!value && value !== 0) {
          errors.LOCATIONS = "Location is required";
        } else if (isNaN(parseFloat(value))) {
          errors.LOCATIONS = "Location must be a valid number";
        } else if (parseFloat(value) < 0) {
          errors.LOCATIONS = "Location must be a non-negative number";
        } else {
          delete errors.LOCATIONS;
        }
      } else if (field === "REMARKS") {
        if (value && value.length > 500) {
          errors.REMARKS = "Remarks must not exceed 500 characters";
        } else {
          delete errors.REMARKS;
        }
      } else if (field !== "MOMENT_TYPE") {
        if (value !== "" && value !== undefined && value !== null) {
          if (isNaN(parseFloat(value))) {
            errors[field] = `${field.replace(/_/g, " ")} must be a valid number`;
          } else if (parseFloat(value) < 0) {
            errors[field] = `${field.replace(/_/g, " ")} must be a non-negative number`;
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

  // Handle numeric input to allow only valid numbers
  const handleNumericInputChange = (field, value) => {
    const filteredValue = value
      .replace(/[^\d.-]/g, "") // Allow digits, decimal point, and negative sign
      .replace(/(\..*)\./g, "$1") // Allow only one decimal point
      .replace(/(-\d*)\-/g, "$1"); // Allow only one negative sign at the start
    handleInputChange(field, filteredValue);
  };

  const groupDataByAnnexure = (rawData, billVerificationData) => {
    console.log("billVerificationData contents:", billVerificationData);
    const billVerificationMap = billVerificationData.reduce((acc, bill) => {
      if (!bill || !bill.BILL_CN_CN_NO) {
        console.warn("Skipping bill with missing BILL_CN_CN_NO:", bill);
        return acc;
      }
      const key = String(bill.BILL_CN_CN_NO).trim().toLowerCase();
      console.log("Mapping BILL_CN_CN_NO:", key, "type:", typeof bill.BILL_CN_CN_NO);
      acc[key] = bill;
      return acc;
    }, {});
    console.log("billVerificationMap:", billVerificationMap);
    console.log("CN_NO in rawData:", rawData.map(item => item.CN_NO));

    const grouped = rawData.reduce((acc, item) => {
      const annexureNo = item.ANNEXURE_NO || "";
      if (!acc[annexureNo]) {
        acc[annexureNo] = {
          ANNEXURE_NO: annexureNo,
          CHALLAN_VENDOR_CODE: item.VENDOR_CODE,
          RNUM: item.RNUM,
          items: [],
          TOTAL_AMOUNT: 0,
        };
      }
      acc[annexureNo].TOTAL_AMOUNT += parseFloat(item.TOTAL_AMOUNT || 0);
      acc[annexureNo].items.push({
        ...item,
        ANNEXURE_NO: annexureNo,
        billVerification: billVerificationMap[String(item.CN_NO).trim().toLowerCase()] || null,
      });
      return acc;
    }, {});

    const groupedData = Object.values(grouped).map((group, index) => ({
      ...group,
      RNUM: index + 1,
    }));
    return groupedData;
  };

  const fetchAnnexureDetails = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await axios.post(
        "https://vmsnode.omlogistics.co.in/api/searchBillverification",
        {
          page,
          limit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );

      console.log("API Response:", JSON.stringify(response.data, null, 2));
      console.log("billVerificationData:", response.data.billVerificationData);

      if (!response.data.data || response.data.data.length === 0) {
        setError("No data available.");
        setData([]);
        setFilteredData([]);
        setRawData([]);
        setTotalRows(0);
      } else {
        const billVerificationData = response.data.billVerificationData || [];
        if (billVerificationData.length === 0) {
          console.warn("No bill verification data received.");
          toast.warn("No bill verification data available.");
        }
        const groupedData = groupDataByAnnexure(response.data.data, billVerificationData);
        setRawData(response.data.data);
        setData(groupedData);
        setFilteredData(groupedData);
        setTotalRows(response.data.totalRecords || groupedData.length);
      }
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
      setRawData([]);
      setTotalRows(0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAnnexureDetails();
  }, [page, limit]);

  useEffect(() => {
    const result = data.filter((item) =>
      item.ANNEXURE_NO.toString().toLowerCase().includes(search.toLowerCase())
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
      cell: (row) => (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => handleRowClick(row)}
        >
          {row.ANNEXURE_NO}
        </button>
      ),
    },
    {
      name: "Vendor Code",
      selector: (row) => row.CHALLAN_VENDOR_CODE,
      sortable: true,
      wrap: true,
    },
  ];

  const cnColumns = [
    {
      name: "CN No.",
      selector: (row) => row.CN_NO,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => handleCnClick(row)}
        >
          {row.CN_NO}
        </button>
      ),
    },
  ];

  const branchModalColumns = [
    {
      name: "Field",
      selector: (row) => row.key,
      sortable: true,
      wrap: true,
    },
    {
      name: "Value",
      selector: (row) => row.value || "-",
      sortable: true,
      wrap: true,
    },
  ];

  const otherModalColumns = [
    {
      name: "Field",
      selector: (row) => row.key,
      sortable: true,
      wrap: true,
    },
    {
      name: "Value",
      selector: (row) => row.value || "-",
      sortable: true,
      wrap: true,
    },
  ];

  const rowPerPageOptions = [20, 50, 100, 200, 500, 1000, 5000, 10000];

  const handleRowClick = (row) => {
    setSelectedAnnexureNo(row.ANNEXURE_NO);
    setFilteredData(row.items);
    setModalOpen(true);
    setSelectedCnData(null);
    setBranchModalOpen(false);
    setOtherModalOpen(false);
    setFormModalOpen(false);
    setFormData({
      CN_CN_NO: "",
      KILOMETER: "",
      MOMENT_TYPE: "",
      FLOOR: "",
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
    setFormMode("add");
    setShowLocation(false);
    setFormErrors({});
  };

  const handleCnClick = (row) => {
    console.log(
      "Selected CN:",
      typeof row.CN_NO,
      "Bill Verification:",
      row.billVerification ? typeof row.billVerification.BILL_CN_CN_NO : "null/undefined"
    );
    setSelectedCnData(row);
    console.log("Selected CN Data:", row);
    setBranchModalOpen(true);
    setOtherModalOpen(true);
  
    const billData = row.billVerification && String(row.billVerification.BILL_CN_CN_NO) === row.CN_NO ? row.billVerification : null;
    console.log("Bill Data for form:", billData);
  
    if (!billData) { 
      console.warn(`No bill verification data found for CN_NO: ${row.CN_NO}`);
      toast.warn(`No bill verification data available for CN ${row.CN_NO}. You can add new expense details.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  
    setFormMode(billData ? "update" : "add");
    setFormData({
      CN_CN_NO: row.CN_NO || "",
      KILOMETER: billData?.BILL_KILOMETER || "",
      MOMENT_TYPE: billData?.BILL_MOMENT_TYPE || "",
      FLOOR: billData?.BILL_FLOOR || "",
      LOCATIONS: billData?.BILL_LOCATIONS || "",
      RATE: billData?.BILL_RATE || "",
      LATITUDE: billData?.BILL_LATITUDE || "",
      LONGITUDE: billData?.BILL_LONGITUDE || "",
      FREIGHT: billData?.BILL_FREIGHT || "",
      UNION_KM: billData?.BILL_UNION_KM || "",
      EXTRA_POINT: billData?.BILL_EXTRA_POINT || "",
      DT_EXPENSE: billData?.BILL_DT_EXPENSE || "",
      ESCORT_EXPENSE: billData?.BILL_ESCORT_EXPENSE || "",
      LOADING_EXPENSE: billData?.BILL_LOADING_EXPENSE || "",
      UNLOADING_EXPENSE: billData?.BILL_UNLOADING_EXPENSE || "",
      LABOUR_EXPENSE: billData?.BILL_LABOUR_EXPENSE || "",
      OTHER_EXPENSE: billData?.BILL_OTHER_EXPENSE || "",
      CRANE_HYDRA_EXPENSE: billData?.BILL_CRANE_HYDRA_EXPENSE || "",
      HEADLOAD_EXPENSE: billData?.BILL_HEADLOAD_EXPENSE || "",
      HEADLOAD_KM: billData?.BILL_HEADLOAD_KM || "",
      CHAIN_PULLEY_EXPENSE: billData?.BILL_CHAIN_PULLEY_EXPENSE || "",
      TOLL_TAX: billData?.BILL_TOLL_TAX || "",
      PACKING_EXPENSE: billData?.BILL_PACKING_EXPENSE || "",
      TOTAL_AMOUNT: billData?.BILL_TOTAL_AMOUNT || "",
      REMARKS: billData?.BILL_REMARKS || "",
    });
  
    setShowLocation(!!billData?.BILL_LOCATIONS);
    setFormModalOpen(true);
    setFormErrors({});
  };

  const getBranchModalData = (row) => {
    const fieldMap = {
      CN_NO: "CN No",
      BRANCH_WEIGHT: "Weight",
      BRANCH_LOCATIONS: "Locations",
      BRANCH_FLOOR: "Floor",
      BRANCH_KM: "Km",
      BRANCH_LATITUDE: "Latitude",
      BRANCH_LONGITUDE: "Longitude",
      BRANCH_REMARKS: "Remarks",
      BRANCH_CRANE: "Crane Expense",
      BRANCH_HYDRA: "Hydra Expense",
      BRANCH_CHAIN_PULLING: "Chain Pully Expense",
      BRANCH_HKM: "Headload Km",
      BRANCH_LABOUR_EXPENSES: "Labour Expense",
      BRANCH_OTHER_EXPENSES: "Other Expense",
      BRANCH_SPECIAL_VEHICLE: "Special",
      BRANCH_HEADLOAD_METER: "Headload Meter",
    };

    return Object.keys(fieldMap).map((key) => ({
      key: fieldMap[key],
      value: row[key] != null ? row[key] : "-",
    }));
  };

  const getOtherModalData = (row) => {
    console.log("getOtherModalData for CN:", row.CN_NO, "Bill Verification:", row.billVerification);
    const fieldMap = {
      CN_CN_NO: "CN No",
      SITE_ID: "Site ID",
      KILOMETER: "Km",
      BILL_KILOMETER: "Bill Km",
      RATE: "Rate",
      BILL_RATE: "Bill Rate",
      LATITUDE: "Latitude",
      BILL_LATITUDE: "Bill Latitude",
      LONGITUDE: "Longitude",
      BILL_LONGITUDE: "Bill Longitude",
      FREIGHT: "Freight",
      BILL_FREIGHT: "Bill Freight",
      UNION_KM: "Union Km",
      BILL_UNION_KM: "Bill Union Km",
      EXTRA_POINT: "Extra Point",
      BILL_EXTRA_POINT: "Bill Extra Point",
      DT_EXPENSE: "DT Expense",
      BILL_DT_EXPENSE: "Bill DT Expense",
      ESCORT_EXPENSE: "Escort Expense",
      BILL_ESCORT_EXPENSE: "Bill Escort Expense",
      LOADING_EXPENSE: "Loading Expense",
      BILL_LOADING_EXPENSE: "Bill Loading Expense",
      UNLOADING_EXPENSE: "Unloading Expense",
      BILL_UNLOADING_EXPENSE: "Bill Unloading Expense",
      LABOUR_EXPENSE: "Labour Expense",
      BILL_LABOUR_EXPENSE: "Bill Labour Expense",
      OTHER_EXPENSE: "Other Expense",
      BILL_OTHER_EXPENSE: "Bill Other Expense",
      CRANE_HYDRA_EXPENSE: "Crane Hydra Expense",
      BILL_CRANE_HYDRA_EXPENSE: "Bill Crane Hydra Expense",
      HEADLOAD_EXPENSE: "Headload Expense",
      BILL_HEADLOAD_EXPENSE: "Bill Headload Expense",
      CHAIN_PULLEY_EXPENSE: "Chain Pulley Expense",
      BILL_CHAIN_PULLEY_EXPENSE: "Bill Chain Pulley Expense",
      TOLL_TAX: "Toll Tax",
      BILL_TOLL_TAX: "Bill Toll Tax",
      PACKING_EXPENSE: "Packing Expense",
      BILL_PACKING_EXPENSE: "Bill Packing Expense",
      TOTAL_AMOUNT: "Total Amount",
      BILL_TOTAL_AMOUNT: "Bill Total Amount",
      REMARKS: "Remarks",
      BILL_REMARKS: "Bill Remarks",
      LOCATIONS: "Locations",
      BILL_LOCATIONS: "Bill Locations",
      HEADLOAD_KM: "Headload Km",
      BILL_HEADLOAD_KM: "Bill Headload Km",
      FLOOR: "Floor",
      BILL_FLOOR: "Bill Floor",
      MOMENT_TYPE: "Moment Type",
      BILL_MOMENT_TYPE: "Bill Moment Type",
    };

    return Object.keys(fieldMap)
      .filter((key) => {
        if (key.startsWith("BILL_")) {
          return row.billVerification && row.billVerification.BILL_CN_CN_NO === row.CN_NO;
        }
        return true;
      })
      .map((key) => ({
        key: fieldMap[key],
        value: key.startsWith("BILL_") && row.billVerification && row.billVerification.BILL_CN_CN_NO === row.CN_NO
          ? row.billVerification[key] || "-"
          : row[key] || "-",
      }));
  };

  const handleFormSubmit = async (e, mode) => {
    e.preventDefault();

    const errors = validateForm(formData);
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

    try {
      const payload = {
        BILL_CN_CN_NO: formData.CN_CN_NO,
        BILL_KILOMETER: parseFloat(formData.KILOMETER) || 0,
        BILL_MOMENT_TYPE: formData.MOMENT_TYPE || "",
        BILL_FLOOR: formData.FLOOR || "",
        BILL_LOCATIONS: showLocation ? parseFloat(formData.LOCATIONS) || 0 : 0,
        BILL_RATE: parseFloat(formData.RATE) || 0,
        BILL_LATITUDE: formData.LATITUDE || "",
        BILL_LONGITUDE: formData.LONGITUDE || "",
        BILL_FREIGHT: parseFloat(formData.FREIGHT) || 0,
        BILL_UNION_KM: parseFloat(formData.UNION_KM) || 0,
        BILL_EXTRA_POINT: parseFloat(formData.EXTRA_POINT) || 0,
        BILL_DT_EXPENSE: parseFloat(formData.DT_EXPENSE) || 0,
        BILL_ESCORT_EXPENSE: parseFloat(formData.ESCORT_EXPENSE) || 0,
        BILL_LOADING_EXPENSE: parseFloat(formData.LOADING_EXPENSE) || 0,
        BILL_UNLOADING_EXPENSE: parseFloat(formData.UNLOADING_EXPENSE) || 0,
        BILL_LABOUR_EXPENSE: parseFloat(formData.LABOUR_EXPENSE) || 0,
        BILL_OTHER_EXPENSE: parseFloat(formData.OTHER_EXPENSE) || 0,
        BILL_CRANE_HYDRA_EXPENSE: parseFloat(formData.CRANE_HYDRA_EXPENSE) || 0,
        BILL_HEADLOAD_EXPENSE: parseFloat(formData.HEADLOAD_EXPENSE) || 0,
        BILL_HEADLOAD_KM: parseFloat(formData.HEADLOAD_KM) || 0,
        BILL_CHAIN_PULLEY_EXPENSE: parseFloat(formData.CHAIN_PULLEY_EXPENSE) || 0,
        BILL_TOLL_TAX: parseFloat(formData.TOLL_TAX) || 0,
        BILL_PACKING_EXPENSE: parseFloat(formData.PACKING_EXPENSE) || 0,
        BILL_TOTAL_AMOUNT: parseFloat(formData.TOTAL_AMOUNT) || 0,
        BILL_REMARKS: formData.REMARKS || "",
        ...(mode === "add"
          ? { BILL_ENTERED_BY: USER_ID, BILL_MODIFIED_BY: USER_ID }
          : { BILL_MODIFIED_BY: USER_ID }),
      };

      const apiUrl =
        mode === "add"
          ? "https://vmsnode.omlogistics.co.in/api/billVerifyExpenses"
          : "https://vmsnode.omlogistics.co.in/api/updateBillVerifyExpenses";

      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.error === false) {
        toast.success(
          `${mode === "add" ? "Expenses added" : "Expenses updated"} successfully!`,
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
        setFormModalOpen(false);
        setFormData({
          CN_CN_NO: "",
          KILOMETER: "",
          MOMENT_TYPE: "",
          FLOOR: "",
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
        setShowLocation(false);
        setFormMode("add");
        setFormErrors({});
        fetchAnnexureDetails();
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
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.msg ||
          `Failed to ${mode === "add" ? "add" : "update"} expenses.`,
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

  const customTableStyles = {
    headRow: {
      style: {
        fontSize: "13px",
        zIndex: 10,
      },
    },
    table: {
      style: {
        zIndex: 10,
      },
    },
  };

  return (
    <div
      className={`bg-gray-50 py-3 px-6 ${marginClass} transition-all duration-300`}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-8xl mx-auto">
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
        <div className="text-center text-red-600 text-lg">{error}</div>
      )}
      {!loading && !error && filteredData.length === 0 && (
        <div className="text-center text-gray-600 text-lg">
          No data available for the specified criteria.
        </div>
      )}
      {!loading && !error && filteredData.length > 0 && (
        <CustomTable
          handleRowClick={handleRowClick}
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
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setFilteredData(data);
            setModalOpen(false);
            setSelectedAnnexureNo("");
            setSelectedCnData(null);
            setBranchModalOpen(false);
            setOtherModalOpen(false);
            setFormModalOpen(false);
            setFormData({
              CN_CN_NO: "",
              KILOMETER: "",
              MOMENT_TYPE: "",
              FLOOR: "",
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
            setFormMode("add");
            setShowLocation(false);
            setFormErrors({});
          }}
        >
          <div
            className="bg-white rounded-lg overflow-hidden w-full m-2 max-w-5xl overflow-y-auto shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Details for Annexure {selectedAnnexureNo}
                </h2>
              </div>
              <div className="overflow-x-auto max-w-10xl mx-auto shadow-xl relative z-10 overflow-hidden">
                <DataTable
                  columns={cnColumns}
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
                  customStyles={customTableStyles}
                  fixedHeader
                  fixedHeaderScrollHeight="50vh"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {branchModalOpen && selectedCnData && (
        <div
          className="fixed top-1/2 right-[34rem] sm:left-auto transform -translate-y-1/2 bg-white rounded-lg overflow-hidden w-[90%] sm:w-[45%] max-w-md max-h-[80vh] overflow-y-auto shadow-lg z-[100]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Branch Details for CN: {selectedCnData.CN_NO}
              </h3>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setBranchModalOpen(false)}
              >
                Close
              </button>
            </div>
            <DataTable
              columns={branchModalColumns}
              data={getBranchModalData(selectedCnData)}
              highlightOnHover
              responsive
              customStyles={{
                headRow: {
                  style: {
                    fontSize: "13px",
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {otherModalOpen && selectedCnData && (
        <div
          className="fixed top-1/2 left-5 transform -translate-y-1/2 bg-white rounded-lg overflow-hidden w-[90%] sm:w-[45%] max-w-md max-h-[80vh] overflow-y-auto shadow-lg z-[100]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Vendor Details for CN: {selectedCnData.CN_NO}
              </h3>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setOtherModalOpen(false)}
              >
                Close
              </button>
            </div>
            <DataTable
              columns={otherModalColumns}
              data={getOtherModalData(selectedCnData)}
              highlightOnHover
              responsive
              customStyles={{
                headRow: {
                  style: {
                    fontSize: "13px",
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {formModalOpen && selectedCnData && (
        <div
          className="fixed top-1/2 right-8 transform -translate-y-1/2 bg-white rounded-lg overflow-hidden w-[90%] sm:w-[30%] max-w-4xl max-h-[80vh] overflow-y-auto shadow-lg z-[100]"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-8xl max-h-[80vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {formMode === "add" ? "Add" : "Update"} Expenses for CN No:{" "}
              {selectedCnData.CN_NO}
            </h2>
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CN No
                    </label>
                    <input
                      type="text"
                      name="CN_CN_NO"
                      value={formData.CN_CN_NO}
                      className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <div className="mt-4">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kilometer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="KILOMETER"
                      value={formData.KILOMETER}
                      onChange={(e) => handleNumericInputChange("KILOMETER", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.KILOMETER ? "border-red-500" : ""}`}
                    />
                    {formErrors.KILOMETER && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.KILOMETER}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location {showLocation && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      name="LOCATIONS"
                      value={formData.LOCATIONS}
                      onChange={(e) => handleInputChange("LOCATIONS", e.target.value)}
                      disabled={!showLocation}
                      className={`w-full border rounded-lg p-2 ${formErrors.LOCATIONS ? "border-red-500" : ""}`}
                    />
                    {formErrors.LOCATIONS && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.LOCATIONS}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rate <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="RATE"
                      value={formData.RATE}
                      onChange={(e) => handleNumericInputChange("RATE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.RATE ? "border-red-500" : ""}`}
                    />
                    {formErrors.RATE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.RATE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Latitude <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="LATITUDE"
                      value={formData.LATITUDE}
                      onChange={(e) => handleNumericInputChange("LATITUDE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.LATITUDE ? "border-red-500" : ""}`}
                    />
                    {formErrors.LATITUDE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.LATITUDE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Longitude <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="LONGITUDE"
                      value={formData.LONGITUDE}
                      onChange={(e) => handleNumericInputChange("LONGITUDE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.LONGITUDE ? "border-red-500" : ""}`}
                    />
                    {formErrors.LONGITUDE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.LONGITUDE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Freight (Auto-calculated)
                    </label>
                    <input
                      type="text"
                      name="FREIGHT"
                      value={formData.FREIGHT}
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
                      value=""
                      className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Moment Type
                    </label>
                    <select
                      name="MOMENT_TYPE"
                      value={formData.MOMENT_TYPE}
                      onChange={(e) => handleInputChange("MOMENT_TYPE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.MOMENT_TYPE ? "border-red-500" : ""}`}
                    >
                      <option value="">Select Moment Type</option>
                      {momentTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.MOMENT_TYPE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.MOMENT_TYPE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Floor
                    </label>
                    <input
                      type="text"
                      name="FLOOR"
                      value={formData.FLOOR}
                      onChange={(e) => handleNumericInputChange("FLOOR", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.FLOOR ? "border-red-500" : ""}`}
                    />
                    {formErrors.FLOOR && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.FLOOR}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Union/Km
                    </label>
                    <input
                      type="text"
                      name="UNION_KM"
                      value={formData.UNION_KM}
                      onChange={(e) => handleNumericInputChange("UNION_KM", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.UNION_KM ? "border-red-500" : ""}`}
                    />
                    {formErrors.UNION_KM && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.UNION_KM}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Extra Point
                    </label>
                    <input
                      type="text"
                      name="EXTRA_POINT"
                      value={formData.EXTRA_POINT}
                      onChange={(e) => handleNumericInputChange("EXTRA_POINT", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.EXTRA_POINT ? "border-red-500" : ""}`}
                    />
                    {formErrors.EXTRA_POINT && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.EXTRA_POINT}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dt Expense
                    </label>
                    <input
                      type="text"
                      name="DT_EXPENSE"
                      value={formData.DT_EXPENSE}
                      onChange={(e) => handleNumericInputChange("DT_EXPENSE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.DT_EXPENSE ? "border-red-500" : ""}`}
                    />
                    {formErrors.DT_EXPENSE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.DT_EXPENSE}</p>
                    )}
                  </div>
                </div>

                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Escort Expense
                    </label>
                    <input
                      type="text"
                      name="ESCORT_EXPENSE"
                      value={formData.ESCORT_EXPENSE}
                      onChange={(e) => handleNumericInputChange("ESCORT_EXPENSE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.ESCORT_EXPENSE ? "border-red-500" : ""}`}
                    />
                    {formErrors.ESCORT_EXPENSE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.ESCORT_EXPENSE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loading Expense
                    </label>
                    <input
                      type="text"
                      name="LOADING_EXPENSE"
                      value={formData.LOADING_EXPENSE}
                      onChange={(e) => handleNumericInputChange("LOADING_EXPENSE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.LOADING_EXPENSE ? "border-red-500" : ""}`}
                    />
                    {formErrors.LOADING_EXPENSE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.LOADING_EXPENSE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Unloading Expense
                    </label>
                    <input
                      type="text"
                      name="UNLOADING_EXPENSE"
                      value={formData.UNLOADING_EXPENSE}
                      onChange={(e) => handleNumericInputChange("UNLOADING_EXPENSE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.UNLOADING_EXPENSE ? "border-red-500" : ""}`}
                    />
                    {formErrors.UNLOADING_EXPENSE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.UNLOADING_EXPENSE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Labour Expense
                    </label>
                    <input
                      type="text"
                      name="LABOUR_EXPENSE"
                      value={formData.LABOUR_EXPENSE}
                      onChange={(e) => handleNumericInputChange("LABOUR_EXPENSE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.LABOUR_EXPENSE ? "border-red-500" : ""}`}
                    />
                    {formErrors.LABOUR_EXPENSE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.LABOUR_EXPENSE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Other Expense
                    </label>
                    <input
                      type="text"
                      name="OTHER_EXPENSE"
                      value={formData.OTHER_EXPENSE}
                      onChange={(e) => handleNumericInputChange("OTHER_EXPENSE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.OTHER_EXPENSE ? "border-red-500" : ""}`}
                    />
                    {formErrors.OTHER_EXPENSE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.OTHER_EXPENSE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Crane/Hydra Expense
                    </label>
                    <input
                      type="text"
                      name="CRANE_HYDRA_EXPENSE"
                      value={formData.CRANE_HYDRA_EXPENSE}
                      onChange={(e) => handleNumericInputChange("CRANE_HYDRA_EXPENSE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.CRANE_HYDRA_EXPENSE ? "border-red-500" : ""}`}
                    />
                    {formErrors.CRANE_HYDRA_EXPENSE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.CRANE_HYDRA_EXPENSE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Headload Expense
                    </label>
                    <input
                      type="text"
                      name="HEADLOAD_EXPENSE"
                      value={formData.HEADLOAD_EXPENSE}
                      onChange={(e) => handleNumericInputChange("HEADLOAD_EXPENSE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.HEADLOAD_EXPENSE ? "border-red-500" : ""}`}
                    />
                    {formErrors.HEADLOAD_EXPENSE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.HEADLOAD_EXPENSE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      H.K.M (Headload meter)
                    </label>
                    <input
                      type="text"
                      name="HEADLOAD_KM"
                      value={formData.HEADLOAD_KM}
                      onChange={(e) => handleNumericInputChange("HEADLOAD_KM", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.HEADLOAD_KM ? "border-red-500" : ""}`}
                    />
                    {formErrors.HEADLOAD_KM && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.HEADLOAD_KM}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chain Pulley Expense
                    </label>
                    <input
                      type="text"
                      name="CHAIN_PULLEY_EXPENSE"
                      value={formData.CHAIN_PULLEY_EXPENSE}
                      onChange={(e) => handleNumericInputChange("CHAIN_PULLEY_EXPENSE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.CHAIN_PULLEY_EXPENSE ? "border-red-500" : ""}`}
                    />
                    {formErrors.CHAIN_PULLEY_EXPENSE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.CHAIN_PULLEY_EXPENSE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Toll Tax
                    </label>
                    <input
                      type="text"
                      name="TOLL_TAX"
                      value={formData.TOLL_TAX}
                      onChange={(e) => handleNumericInputChange("TOLL_TAX", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.TOLL_TAX ? "border-red-500" : ""}`}
                    />
                    {formErrors.TOLL_TAX && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.TOLL_TAX}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Packing Expense
                    </label>
                    <input
                      type="text"
                      name="PACKING_EXPENSE"
                      value={formData.PACKING_EXPENSE}
                      onChange={(e) => handleNumericInputChange("PACKING_EXPENSE", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.PACKING_EXPENSE ? "border-red-500" : ""}`}
                    />
                    {formErrors.PACKING_EXPENSE && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.PACKING_EXPENSE}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total Amount (Auto-calculated)
                    </label>
                    <input
                      type="text"
                      name="TOTAL_AMOUNT"
                      value={formData.TOTAL_AMOUNT}
                      className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Remarks
                    </label>
                    <textarea
                      name="REMARKS"
                      value={formData.REMARKS}
                      onChange={(e) => handleInputChange("REMARKS", e.target.value)}
                      className={`w-full border rounded-lg p-2 ${formErrors.REMARKS ? "border-red-500" : ""}`}
                      rows="3"
                    />
                    {formErrors.REMARKS && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.REMARKS}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={() => {
                    setFormModalOpen(false);
                    setFormErrors({});
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={(e) => handleFormSubmit(e, formMode)}
                >
                  {formMode === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillStatus;