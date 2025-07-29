import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { CustomTable } from "../Ui/CustomTable";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalFile, setModalFile] = useState(null);
  const [selectedAnnexureNo, setSelectedAnnexureNo] = useState("");
  const [checkResults, setCheckResults] = useState([]); // New state for check results
  const token = getToken();
  const decodedToken = jwtDecode(token);
  const USER_ID = decodedToken.id;
  const [editFormData, setEditFormData] = useState({
    CN_NO: "",
    BRANCH_WEIGHT: "",
    BRANCH_LOCATIONS: "",
    BRANCH_FLOOR: "",
    BRANCH_KM: "",
    BRANCH_LATITUDE: "",
    BRANCH_LONGITUDE: "",
    BRANCH_FLAG: "Y",
    BRANCH_REMARKS: "",
    BRANCH_CRANE: "",
    BRANCH_HYDRA: "",
    BRANCH_CHAIN_PULLING: "",
    BRANCH_HKMINPUT: "",
    BRANCH_HKM: "",
    BRANCH_LABOUR_EXPENSES: "",
    BRANCH_OTHER_EXPENSES: "",
    BRANCH_SPECIAL_VEHICLE: "",
    BRANCH_ENTERED_BY: USER_ID,
  });

  const groupDataByAnnexure = (rawData) => {
    const grouped = rawData.reduce((acc, item) => {
      const annexureNo = item.ANNEXURE_NO || "";
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
      acc[annexureNo].items.push({
        ...item,
        ANNEXURE_NO: annexureNo,
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

  // Handle file selection for modal bulk upload
  const handleModalFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === "text/csv" || selectedFile.type.includes("excel"))) {
      setModalFile(selectedFile);
    } else {
      toast.error("Please upload a valid CSV or Excel file.");
    }
  };

//handle data array




const checkRecordExists = (cnNo) => {
  let obj = {};
  
  // Flatten CN_NO values from data into obj
  data.forEach(i => {
    i.items.forEach(item => {
      obj[item.CN_NO] = true;
    });
  });

  // Check each cnNo value
  for (let i = 0; i < cnNo.length; i++) {
    const currentCN = cnNo[i];

    if (currentCN === undefined || currentCN === null || currentCN === "") {
      return toast.error("Please upload a CN");
    }

    if (!obj[currentCN]) {
      return false; // CN_NO not found in data
    }
  }

  return true; // All CN_NO values exist
};


  // Handle bulk upload with strict annexure validation
  const handleBulkUpload = async (fileToUpload, annexureNo) => {
    if (!fileToUpload) {
      toast.error("Please select a file to upload.");
      return;
    }
  
    setLoading(true);
  
    try {
      Papa.parse(fileToUpload, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          console.log("Parsed CSV Data:", result.data);
  
          // Validate parsed data
          if (!result.data || result.data.length === 0) {
            toast.error("No valid records found in the CSV file.");
            setLoading(false);
            return;
          }
          for(let i=0; i<result.data.length; i++){ 
            result.data[i]["ANNEXURE_NO"] = selectedAnnexureNo; 
          
           }
  
          // Filter records with matching ANNEXURE_NO
          const validRecords = result.data.filter(
            (row) => row.ANNEXURE_NO && row.ANNEXURE_NO === annexureNo
          );
          console.log("Valid Records:", validRecords);
  
          if (validRecords.length === 0) {
            toast.error("No records match the selected annexure number.");
            setLoading(false);
            return;
          }
  
          if (validRecords.length < result.data.length) {
            toast.warn(
              `${result.data.length - validRecords.length} records skipped due to incorrect ANNEXURE_NO.`
            );
          }
  
          // Extract CN numbers for validation
          const cnNumbers = validRecords.map((row) => row.CN_NO);
          console.log("CN Numbers:", cnNumbers);
  
          // Validate CN numbers with annexure
          try {
            await checkMultipleCnWithAnnexure(cnNumbers, annexureNo);
          } catch (error) {
            console.error("Error in checkMultipleCnWithAnnexure:", error);
            toast.error("Error validating CN numbers: " + error.message);
            setLoading(false);
            return;
          }
  
          // Map valid records to API-compatible format
          const parsedData = validRecords.map((row) => ({
            CN_NO: row.CN_NO || "",
            VENDOR_CODE: row.VENDOR_CODE || "",
            BRANCH_WEIGHT: row.BRANCH_WEIGHT || "",
            BRANCH_LOCATIONS: row.BRANCH_LOCATIONS || "",
            BRANCH_FLOOR: row.BRANCH_FLOOR || "",
            BRANCH_KM: row.BRANCH_KM || "",
            BRANCH_LATITUDE: row.BRANCH_LATITUDE || "",
            BRANCH_LONGITUDE: row.BRANCH_LONGITUDE || "",
            BRANCH_FLAG: row.BRANCH_FLAG || "Y",
            BRANCH_REMARKS: row.BRANCH_REMARKS || "",
            BRANCH_CRANE: row.BRANCH_CRANE || "",
            BRANCH_HYDRA: row.BRANCH_HYDRA || "",
            BRANCH_CHAIN_PULLING: row.BRANCH_CHAIN_PULLING || "",
            BRANCH_HKMINPUT: row.BRANCH_HKMINPUT || "",
            BRANCH_HKM: row.BRANCH_HKM || "",
            BRANCH_LABOUR_EXPENSES: row.BRANCH_LABOUR_EXPENSES || "",
            BRANCH_OTHER_EXPENSES: row.BRANCH_OTHER_EXPENSES || "",
            BRANCH_SPECIAL_VEHICLE: row.BRANCH_SPECIAL_VEHICLE || "",
            BRANCH_ENTERED_BY: USER_ID,
            BRANCH_MODIFIED_BY: USER_ID,
            ANNEXURE_NO: selectedAnnexureNo,
          }));
          console.log("Parsed Data for API:", parsedData);
  
          // Process each record (insert or update)
          const promises = parsedData.map(async (row) => {
            try {
              const AllCN = [];
              AllCN.push(row.CN_NO)
              const recordExists = await checkRecordExists(AllCN);
              console.log(recordExists, "Record exists for CN_NO:", row.CN_NO);
              const apiUrl = recordExists
                ? "https://vmsnode.omlogistics.co.in/api/updateBillVerification"
                : "https://vmsnode.omlogistics.co.in/api/insertBillVerification";
  
              console.log(`Sending request for CN_NO ${row.CN_NO} to ${apiUrl}:`, row);
  
              const response = await axios.post(apiUrl, parsedData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
  
              console.log(`Response for CN_NO ${row.CN_NO}:`, response.data);
  
              if (response.data.error) {
                throw new Error(response.data.msg || "Unknown error");
              }
  
              return {
                success: true,
                row,
                message: recordExists ? "Updated" : "Inserted",
              };
            } catch (error) {
              console.error("Error processing CN_NO ", error);
              return {
                success: false,
                row,
                message: error.message || "Failed to process record",
              };
            }
          });
  
          const results = await Promise.all(promises);
          console.log("API Results:", results);
  
          const successes = results.filter((r) => r.success);
          const failures = results.filter((r) => !r.success);
  
          if (successes.length > 0) {
            toast.success(
              `${successes.length} records processed successfully for annexure ${annexureNo}!`
            );
            await fetchAnnexureDetails();
            setModalFile(null);
            setModalOpen(false);
          }
  
          if (failures.length > 0) {
            failures.forEach((f) => {
              toast.error(`Failed to process CN_NO ${f.row.CN_NO}: ${f.message}`);
            });
          }
        },
        error: (error) => {
          console.error("Papa Parse Error:", error);
          toast.error("Error parsing file: " + error.message);
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Error uploading bulk data:", error);
      if (error.response?.status === 403) {
        setError("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        toast.error(error.response?.data?.message || "An error occurred while uploading data.");
      }
      setLoading(false);
    }
  };

  // Download sample CSV
  const downloadSampleCSV = () => {
    const headers = [
      "CN_NO",
      "VENDOR_CODE",
      "BRANCH_WEIGHT",
      "BRANCH_LOCATIONS",
      "BRANCH_FLOOR",
      "BRANCH_KM",
      "BRANCH_LATITUDE",
      "BRANCH_LONGITUDE",
      "BRANCH_REMARKS",
      "BRANCH_FLAG",
      "BRANCH_CRANE",
      "BRANCH_HYDRA",
      "BRANCH_CHAIN_PULLING",
      "BRANCH_HKMINPUT",
      "BRANCH_HKM",
      "BRANCH_LABOUR_EXPENSES",
      "BRANCH_OTHER_EXPENSES",
      "BRANCH_SPECIAL_VEHICLE",
    ];
    const sampleRow = [
      "12345",
      "VC001",
      "500",
      "Location1",
      "2",
      "10",
      "12.34",
      "56.78",
      "Remark",
      "Y",
      "Y",
      "Y",
      "Y",
      "5",
      "Y",
      "Y",
      "Y",
      "Y",
    ];
    const csvContent = [
      headers.join(","),
      sampleRow.join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `sample_lr_data_${selectedAnnexureNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to check multiple CN_NO against a specific ANNEXURE_NO
  const checkMultipleCnWithAnnexure = (cnNos, annexureNo) => {
    const results = [];
    
    // Iterate through each CN_NO
    for (const cnNo of cnNos) {
      // Find the record with the given CN_NO in rawData
      const record = rawData.find(item => item.CN_NO === cnNo);
      if (!record) {
        results.push({
          CN_NO: cnNo,
          ANNEXURE_NO: null,
          STATUS: false,
          MESSAGE: `CN_NO ${cnNo} not found in the dataset.`,
        });
      } else if (record.ANNEXURE_NO === annexureNo) {
        results.push({
          CN_NO: cnNo,
          ANNEXURE_NO: annexureNo,
          STATUS: true,
          MESSAGE: `CN_NO ${cnNo} is associated with ANNEXURE_NO ${annexureNo}.`,
          ...record // Include all fields from the record to match response.data.data structure
        });
      } else {
        results.push({
          CN_NO: cnNo,
          ANNEXURE_NO: record.ANNEXURE_NO,
          STATUS: false,
          MESSAGE: `CN_NO ${cnNo} is associated with ANNEXURE_NO ${record.ANNEXURE_NO}, not ${annexureNo}.`,
          ...record // Include all fields from the record to match response.data.data structure
        });
      }
    }
    
    return { data: results }; // Wrap results in a 'data' object to mimic API response structure
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
      selector: (row) => row.TOTAL_WEIGHT || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "KM",
      selector: (row) => row.KILOMETER || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Latitude",
      selector: (row) => row.LATITUDE || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Longitude",
      selector: (row) => row.LONGITUDE || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Floor (GPT, RRT)",
      selector: (row) => row.FLOOR || "-",
      sortable: true,
      wrap: true,
    },
    {
      name: "Verify",
      selector: (row) => {
        if (row.BRANCH_FLAG === "Y") {
          return <span className="font-bold">✅</span>;
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
              BRANCH_WEIGHT: row.BRANCH_WEIGHT || "",
              BRANCH_LOCATIONS: row.BRANCH_LOCATIONS || "",
              BRANCH_FLOOR: row.BRANCH_FLOOR || "",
              BRANCH_KM: row.BRANCH_KM || "",
              BRANCH_LATITUDE: row.BRANCH_LATITUDE || "",
              BRANCH_LONGITUDE: row.BRANCH_LONGITUDE || "",
              BRANCH_FLAG: row.BRANCH_FLAG || "Y",
              BRANCH_REMARKS: row.BRANCH_REMARKS || "",
              BRANCH_CRANE: row.BRANCH_CRANE || "",
              BRANCH_HYDRA: row.BRANCH_HYDRA || "",
              BRANCH_CHAIN_PULLING: row.BRANCH_CHAIN_PULLING || "",
              BRANCH_HKM: row.BRANCH_HKM || "",
              BRANCH_HKMINPUT: row.BRANCH_HKMINPUT || "",
              BRANCH_LABOUR_EXPENSES: row.BRANCH_LABOUR_EXPENSES || "",
              BRANCH_OTHER_EXPENSES: row.BRANCH_OTHER_EXPENSES || "",
              BRANCH_SPECIAL_VEHICLE: row.BRANCH_SPECIAL_VEHICLE || "",
              BRANCH_ENTERED_BY: USER_ID,
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
    setSelectedAnnexureNo(row.ANNEXURE_NO);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "Y" : "") : value,
    }));
  };

  const handleSave = async () => {
    if (!selectedRow?.ANNEXURE_NO) {
      toast.error("Annexure Number is missing for this CN_NO.");
      return;
    }

    let recordExists = false;
    try {
      const AllCN1 = [];
      AllCN1.push(editFormData.CN_NO)
      recordExists = await checkRecordExists(AllCN1);
      console.log(recordExists, "Record exists for CN_NO:", editFormData.CN_NO);
      const apiUrl = recordExists
        ? "https://vmsnode.omlogistics.co.in/api/updateBillVerification"
        : "https://vmsnode.omlogistics.co.in/api/insertBillVerification";

      const payload = {
        CN_NO: editFormData.CN_NO || selectedRow.CN_NO || "",
        ANNEXURE_NO: selectedRow.ANNEXURE_NO || "",
        VENDOR_CODE: selectedRow.CHALLAN_VENDOR_CODE || "",
        BRANCH_WEIGHT: editFormData.BRANCH_WEIGHT || selectedRow.TOTAL_WEIGHT || "",
        BRANCH_LOCATIONS: editFormData.BRANCH_LOCATIONS || selectedRow.LOCATIONS || "",
        BRANCH_FLOOR: editFormData.BRANCH_FLOOR || selectedRow.FLOOR || "",
        BRANCH_KM: editFormData.BRANCH_KM || selectedRow.KILOMETER || "",
        BRANCH_LATITUDE: editFormData.BRANCH_LATITUDE || selectedRow.LATITUDE || "",
        BRANCH_LONGITUDE: editFormData.BRANCH_LONGITUDE || selectedRow.LONGITUDE || "",
        BRANCH_FLAG: editFormData.BRANCH_FLAG || selectedRow.BRANCH_FLAG || "Y",
        BRANCH_REMARKS: editFormData.BRANCH_REMARKS || selectedRow.BRANCH_REMARKS || "",
        BRANCH_CRANE: editFormData.BRANCH_CRANE || selectedRow.BRANCH_CRANE || "",
        BRANCH_HYDRA: editFormData.BRANCH_HYDRA || selectedRow.BRANCH_HYDRA || "",
        BRANCH_CHAIN_PULLING: editFormData.BRANCH_CHAIN_PULLING || selectedRow.BRANCH_CHAIN_PULLING || "",
        BRANCH_HKMINPUT: editFormData.BRANCH_HKMINPUT || selectedRow.HEADLOAD_KM || "",
        BRANCH_HKM: editFormData.BRANCH_HKM || selectedRow.BRANCH_HKM || "",
        BRANCH_LABOUR_EXPENSES: editFormData.BRANCH_LABOUR_EXPENSES || selectedRow.BRANCH_LABOUR_EXPENSES || "",
        BRANCH_OTHER_EXPENSES: editFormData.BRANCH_OTHER_EXPENSES || selectedRow.BRANCH_OTHER_EXPENSES || "",
        BRANCH_SPECIAL_VEHICLE: editFormData.BRANCH_SPECIAL_VEHICLE || selectedRow.BRANCH_SPECIAL_VEHICLE || "",
        [recordExists ? "BRANCH_MODIFIED_BY" : "BRANCH_ENTERED_BY"]: USER_ID,
      };

      const response = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.error === false) {
        await fetchAnnexureDetails();
        setEditModalOpen(false);
        toast.success(recordExists ? "Data updated successfully!" : "Data inserted successfully!");
        window.location.reload();
      } else {
        const errorMessage = response.data.msg || "Unknown error occurred";
        toast.error(`Failed to ${recordExists ? "update" : "insert"} data: ${errorMessage}`);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setError("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        setError(error.response?.data?.message || "An error occurred while fetching data.");
        toast.error(`An error occurred while ${recordExists ? "updating" : "inserting"} data: ${error}`);
      }
    }
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
        <div className="text-center text-red-600 text-lg">No data found</div>
      )}

      {!loading && !error && data.length > 0 && (
        <>
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
        </>
      )}

      {/* Display check results */}
      {checkResults.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">CN Number Check Results</h2>
          <DataTable
            columns={[
              {
                name: "CN Number",
                selector: (row) => row.CN_NO,
                sortable: true,
                wrap: true,
              },
              {
                name: "Annexure No.",
                selector: (row) => row.ANNEXURE_NO || "-",
                sortable: true,
                wrap: true,
              },
              {
                name: "Status",
                selector: (row) => (row.STATUS ? "✅ Matched" : "❌ Not Matched"),
                sortable: true,
                wrap: true,
              },
              {
                name: "Message",
                selector: (row) => row.MESSAGE,
                sortable: true,
                wrap: true,
              },
              {
                name: "Total Weight",
                selector: (row) => row.TOTAL_WEIGHT || "-",
                sortable: true,
                wrap: true,
              },

            ]}
            data={checkResults}
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
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setFilteredData(data);
            setModalOpen(false);
            setModalFile(null);
            setSelectedAnnexureNo("");
          }}
        >
          <div
            className="bg-white rounded-lg overflow-hidden w-full m-2 max-w-5xl overflow-y-auto shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  LR Details for Annexure {selectedAnnexureNo}
                </h2>
                <div className="flex items-center gap-4">
                  <div>
                    <label
                      htmlFor="modalFileUpload"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Upload CSV for Annexure {selectedAnnexureNo}
                    </label>
                    <input
                      id="modalFileUpload"
                      type="file"
                      accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                      onChange={handleModalFileChange}
                    />
                  </div>
                  <button
                    onClick={() => handleBulkUpload(modalFile, selectedAnnexureNo)}
                    className="px-4 py-2 bg-[#01588E] text-white rounded-lg font-semibold hover:bg-[#014a73] transition-colors mt-6"
                  >
                    Upload
                  </button>
                  <button
                    onClick={downloadSampleCSV}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors mt-6"
                  >
                    Download Sample CSV
                  </button>
                </div>
              </div>
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
        </div>
      )}

      {editModalOpen && selectedRow && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] w-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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
                    Locations (Original)
                  </label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                    value={selectedRow.LOCATIONS || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor (Original)
                  </label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                    value={selectedRow.FLOOR || ""}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headload KM (Original)
                  </label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                    value={selectedRow.HEADLOAD_KM || ""}
                    disabled
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crane
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_CRANE"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_CRANE === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hydra
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_HYDRA"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_HYDRA === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chain Pulling
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_CHAIN_PULLING"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_CHAIN_PULLING === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Headload Expenses
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_HKM"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_HKM === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Labour Expenses
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_LABOUR_EXPENSES"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_LABOUR_EXPENSES === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Other Expenses
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_OTHER_EXPENSES"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_OTHER_EXPENSES === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Vehicle
                    </label>
                    <input
                      type="checkbox"
                      name="BRANCH_SPECIAL_VEHICLE"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-200"
                      checked={editFormData.BRANCH_SPECIAL_VEHICLE === "Y"}
                      onChange={handleInputChange}
                    />
                  </div>
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
                    name="BRANCH_WEIGHT"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_WEIGHT}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Locations
                  </label>
                  <input
                    type="text"
                    name="BRANCH_LOCATIONS"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_LOCATIONS}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor
                  </label>
                  <input
                    type="text"
                    name="BRANCH_FLOOR"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_FLOOR}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KM
                  </label>
                  <input
                    type="text"
                    name="BRANCH_KM"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_KM}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="BRANCH_LATITUDE"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_LATITUDE}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="BRANCH_LONGITUDE"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_LONGITUDE}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headload KM
                  </label>
                  <input
                    type="text"
                    name="BRANCH_HKMINPUT"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_HKMINPUT}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    name="BRANCH_REMARKS"
                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring focus:ring-blue-200"
                    value={editFormData.BRANCH_REMARKS}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setEdit-modalOpen(false)}
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