import { useEffect, useState, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken, getUserId } from "../../Auth/auth";

const columns = (visiblePasswordId, handleTogglePassword, updateUserStatus) => [
  {
    name: "Vendor ID",
    selector: (row) => row.userId,
    sortable: true,
  },
  {
    name: "Vendor Name",
    selector: (row) => row.userName,
    sortable: true,
  },
  {
    name: "Password",
    cell: (row) => (
      <span
        className="cursor-pointer"
        onClick={() => handleTogglePassword(row.userId)}
      >
        {visiblePasswordId === row.userId ? row.userPwd : "••••••••"}
      </span>
    ),
    sortable: false,
  },

  {
    name: "Status",
    cell: (row) => (
      <button
        onClick={() => updateUserStatus(row.userId, row.userStatus)}
        type="toggle"
        className={`cursor-pointer rounded-full px-2 py-1 ${row.userStatus === "1" ? "bg-green-500" : "bg-red-500"}`}>
        {row.userStatus === "1" ? "Active" : "Inactive"}
      </button>
    ),
    sortable: true,
  }
];

const VendorDetails = () => {
  const [tableData, setTableData] = useState([]);
  const [visiblePasswordId, setVisiblePasswordId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const enteredBy = getUserId();
  const [newVendor, setNewVendor] = useState({
    USER_ID: "",
    USER_NAME: "",
    ENTERED_BY: enteredBy,
    Status: 1
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const token = getToken();
  const dropdownRef = useRef(null);
  const [isVendorCodeDisabled, setIsVendorCodeDisabled] = useState(false);

  const [showChar, setShowChar] = useState(false);
    const [error, setError] = useState(null);

  const handleTogglePassword = (userId) => {
    setVisiblePasswordId((prevId) => (prevId === userId ? null : userId));
  };

  const updateUserStatus = async (userId, st) => {
    const payload = {
      USER_STATUS: st === "1" ? "0" : "1", //change the status to 0 or 1
      USER_ID: userId
    };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://vmsnode.omlogistics.co.in/api/updateVendorStatus",
      headers: {
        Authorization: ` ${token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload)
    }
    try {
      const res = await axios.request(config)
      if (res.data.error) {
        toast.error(res.data.msg)
      } else {
        toast.success(res.data.msg)
        setTableData(prev =>
          prev.map(row =>
            row.userId === userId
              ? { ...row, userStatus: st === "1" ? "0" : "1" }
              : row
          )
        );
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setError("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        setError(error.response?.data?.message || "An error occurred while fetching data.");
      }
      toast.error("Failed to update status");
    }
  }

  const fetchData = async () => {
    let data = JSON.stringify({});
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://vmsnode.omlogistics.co.in/api/SearchFlag",
      headers: {
        Authorization: ` ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      if (response.data && !response.data.error) {
        const mappedData = response.data.data.map((item) => ({
          userId: item.USER_ID,
          userName: item.USER_NAME,
          userPwd: item.USER_PASSWORD,
          userStatus: item.USER_STATUS,
        }));
        setTableData(mappedData);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setError("Session expired. Please log in again.");
        window.location.href = "/login";
      } else {
        setError(error.response?.data?.message || "An error occurred while fetching data.");
      }
      console.error("Error fetching data:", error);
    }
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    if (!newVendor.USER_ID || !newVendor.USER_NAME) {
      toast.error("Please fill in all fields.");
      return;
    }


    const payload = {
      USER_ID: newVendor.USER_ID,
      USER_NAME: newVendor.USER_NAME,
      ENTERED_BY: newVendor.ENTERED_BY,
    };



    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://vmsnode.omlogistics.co.in/api/addVendor",
      headers: {
        Authorization: ` ${token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(payload), // Send the payload
    };

    try {
      const response = await axios.request(config);
      if (response.data && !response.data.error) {
        toast.success(response.data.msg, {
          autoClose: 800,
        });
        setNewVendor({ USER_ID: "", USER_NAME: "", ENTERED_BY: enteredBy }); // Reset the form
        setShowAddForm(false);
        fetchData();
      } else {
        toast.error(response.data.msg);
      }
      setIsVendorCodeDisabled(false);
    } catch (error) {
      console.error(error.response.data.msg, error);
      toast.error(error.response.data.msg);
    }
  };

  const fetchVendorSuggestions = async (vendorCode) => {
    if (!vendorCode || vendorCode.length < 5) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    let data = JSON.stringify({
      VEND_OLD_CODE: vendorCode,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://vmsnode.omlogistics.co.in/api/VendorData",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      if (response.data && !response.data.error && response.data.data.length > 0) {
        setSuggestions(response.data.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }

    } catch (error) {
      console.error("Error fetching vendor suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedFetchVendorSuggestions = debounce(fetchVendorSuggestions, 800);

  const handleVendorCodeChange = (e) => {
    const value = e.target.value;
    if (value.length < 5) {
      setShowChar(true);
    } else {
      setShowChar(false);
    }
    // Check if the input starts with 5 or 6
    if (value.length > 0 && !/^[56]/.test(value)) {
      toast.error("Vendor Code must start with 5 or 6.");
      return; // Stop further processing if the input doesn't start with 5 or 6
    }

    // Update the state if the input is valid
    setNewVendor({ ...newVendor, USER_ID: value });
    debouncedFetchVendorSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setNewVendor({
      USER_ID: suggestion.VEND_OLD_CODE,
      USER_NAME: suggestion.VEND_VEND_NAME,
      ENTERED_BY: enteredBy, // Preserve ENTERED_BY
    });
    setShowSuggestions(false);
    setIsVendorCodeDisabled(true); // Disable the Vendor Code field
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-black">Vendor Details</h2>
        <button
          className="px-4 py-2 bg-[#01588E] text-white rounded-lg hover:bg-blue-600 transition duration-300"
          onClick={() => setShowAddForm(true)}
        >
          Add Vendor
        </button>
      </div>

      <DataTable
        columns={columns(visiblePasswordId, handleTogglePassword, updateUserStatus)}
        data={tableData}
        pagination
        striped
      />
      <ToastContainer />

      {showAddForm && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setShowAddForm(false)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Add New Vendor</h3>
              <form onSubmit={handleAddVendor}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    <div>
                      Vendor Code:
                    </div>
                    {showChar &&
                      <div className="text-xs font-normal text-red-500">
                        * Add atleast 5 characters
                      </div>
                    }
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={newVendor.USER_ID}
                    onChange={handleVendorCodeChange}
                    disabled={isVendorCodeDisabled}
                    required
                  />
                  {showSuggestions && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 mt-2 w-96  max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg"
                    >
                      {suggestions.map((suggestion) => (
                        <div
                          key={suggestion.VEND_OLD_CODE}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.VEND_VEND_NAME}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Vendor Name:
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newVendor.USER_NAME}
                    readOnly
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 mr-2 bg-gray-300 rounded-lg"
                    onClick={() => {
                      setNewVendor({ USER_ID: "", USER_NAME: "", ENTERED_BY: enteredBy });
                      setShowAddForm(false);
                      setIsVendorCodeDisabled(false); // Reset the disabled state
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorDetails;