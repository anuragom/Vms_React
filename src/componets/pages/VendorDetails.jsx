


import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const columns = (visiblePasswordId, handleTogglePassword) => [
  {
    name: "User ID",
    selector: (row) => row.userId,
    sortable: true,
  },
  {
    name: "User Name",
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
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [visiblePasswordId, setVisiblePasswordId] = useState(null);

  const handleTogglePassword = (userId) => {
    // Toggle the visibility of the clicked password
    setVisiblePasswordId((prevId) => (prevId === userId ? null : userId));
  };

  useEffect(() => {
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

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-black mb-4">Vendor Details</h2>
      <DataTable
        columns={columns(visiblePasswordId, handleTogglePassword)}
        data={tableData}
        pagination
        striped
      />
    </div>
  );
};

export default VendorDetails;
