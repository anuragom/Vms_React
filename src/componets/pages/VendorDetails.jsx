
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const columns = (visiblePasswordId, handleTogglePassword) => [
  {
    name: "Vendor ID",
    selector: (row) => row.userId,
    sortable: true,
    width: "",
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
];

const VendorDetails = () => {
  const [tableData, setTableData] = useState([]);
  const [visiblePasswordId, setVisiblePasswordId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVendor, setNewVendor] = useState({
    USER_ID: "",
    USER_NAME: "",
  });

  const handleTogglePassword = (userId) => {
    setVisiblePasswordId((prevId) => (prevId === userId ? null : userId));
  };

  const fetchData = async () => {
    let data = JSON.stringify({});
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://vmsnode.omlogistics.co.in/api/SearchFlag",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("API Response:", response.data);

      if (response.data && !response.data.error) {
        const mappedData = response.data.data.map((item) => ({
          userId: item.USER_ID,
          userName: item.USER_NAME,
          userPwd: item.USER_PWD,
        }));
        setTableData(mappedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();

    if (!newVendor.USER_ID || !newVendor.USER_NAME) {
      toast.error("Please fill in all fields.");
      return;
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://vmsnode.omlogistics.co.in/api/addVendor",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(newVendor),
    };

    try {
      const response = await axios.request(config);
      console.log("Add Vendor Response:", response.data);

      if (response.data && !response.data.error) {
        // toast.success("Vendor added successfully!");
        toast.success("Vendor added successfully!", {
          autoClose: 800,  // Auto-close in 0.8 seconds
        });
        setNewVendor({ USER_ID: "", USER_NAME: "" });
        setShowAddForm(false);
        fetchData();
      } else {
        toast.error("Failed to add vendor.");
      }
    } catch (error) {
      console.error("Error adding vendor:", error);
      toast.error("Failed to add vendor.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md relative">
      {/* Header and Button on Same Line */}
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
        columns={columns(visiblePasswordId, handleTogglePassword)}
        data={tableData}
        pagination
        striped
        customStyles={{
          headCells: {
            style: {
              fontSize: "16px",  // Increase font size here
              fontWeight: "semi-bold",
            },
          },
        }}
      />
      <ToastContainer />

      {/* Modal Popup Form */}
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
                    Vendor Code:
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={newVendor.USER_ID}
                    onChange={(e) =>
                      setNewVendor({ ...newVendor, USER_ID: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Vendor Name:
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={newVendor.USER_NAME}
                    onChange={(e) =>
                      setNewVendor({ ...newVendor, USER_NAME: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 mr-2 bg-gray-300 rounded-lg"
                    onClick={() => setShowAddForm(false)}
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
