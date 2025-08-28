import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { getToken } from "../../Auth/auth";

const BillVerifyPosted = () => {
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  const [columns, setColumns] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const rowPerPageOptions = [10, 20, 30, 50];

  const token = getToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          "https://vmsnode.omlogistics.co.in/api/searchBillVerified",
          { page, limit },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = res.data.data || [];
        setData(responseData);

        // Dynamically generate columns
        if (responseData.length > 0) {
            let generatedColumns = Object.keys(responseData[0]).map((key) => {
              const column = {
                name: key.replace(/^BILL_/, "").replace(/_/g, " "),
                selector: (row) =>
                  row[key] !== null && row[key] !== undefined
                    ? row[key].toString()
                    : "N/A",
                sortable: true,
                wrap: true,
              };
          
              if (key === "CN_CN_NO") {
                column.cell = (row) => (
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleRowClick(row)}
                  >
                    {row[key] !== null && row[key] !== undefined
                      ? row[key].toString()
                      : "-"}
                  </button>
                );
              } else {
                column.cell = (row) => (
                  <div className="text-gray-800">
                    {row[key] !== null && row[key] !== undefined
                      ? row[key].toString()
                      : "-"}
                  </div>
                );
              }
          
              return column;
            });
          
            // Ensure ROW_NUM is always the first column
            const rowNumColumn = generatedColumns.find(
              (col) => col.name.toLowerCase() === "row num"
            );
          
            if (rowNumColumn) {
              generatedColumns = [
                rowNumColumn,
                ...generatedColumns.filter((col) => col !== rowNumColumn),
              ];
            }
          
            setColumns(generatedColumns);
          }
          
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setPending(false);
      }
    };

    fetchData();
  }, [token, page, limit]);

  // Handle row click (placeholder for interactivity)
  const handleRowClick = (row) => {
    console.log("Clicked row:", row);
    // Add logic here, e.g., open a modal with details like in BillStatus
    // For now, just log the row data
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing rows per page
  };

  // Custom styles to match BillStatus
  const customTableStyles = {
    headRow: {
      style: {
        backgroundColor:"#01588E",
        borderTopLeftRadius: "0.5rem",
        borderTopRightRadius: "0.5rem",
      },
    },
    headCells: {
      style: {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#fff",
        padding: "15px",
        whiteSpace: "normal",   // allow wrapping
        wordBreak: "break-word", // break long text
        textOverflow: "clip",   // remove "..."
        overflow: "visible",
        minWidth: "150px",
        maxWidth: "250px",      // optional (prevents headers from stretching too much)
      },
    },
    cells: {
      style: {
        fontSize: "12px",
        color: "#374151",
        padding: "12px",
      },
    },
    table: {
      style: {
        zIndex: 10,
        backgroundColor: "#ffffff",
        borderRadius: "0.5rem",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  };
  

  return (
    <div className="bg-gray-50 py-3 px-6 transition-all duration-300">
      {pending && (
        <div className="text-center text-blue-600 text-lg">Loading...</div>
      )}
      {!pending && data.length === 0 && (
        <div className="text-center text-gray-600 text-lg">
          No data available for the specified criteria.
        </div>
      )}
      {!pending && data.length > 0 && (
        <div className="overflow-x-auto max-w-10xl mx-auto shadow-xl relative z-10 overflow-hidden">
          <DataTable
            columns={columns}
            data={data}
            progressPending={pending}
            pagination
            paginationServer
            paginationTotalRows={data.length}
            paginationPerPage={limit}
            paginationDefaultPage={page}
            paginationRowsPerPageOptions={rowPerPageOptions}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            highlightOnHover
            responsive
            striped
            customStyles={customTableStyles}
            fixedHeader
            fixedHeaderScrollHeight="60vh"
            noDataComponent={
              <div className="text-center p-4 text-gray-600">
                No details available
              </div>
            }
            dense
          />
        </div>
      )}
    </div>
  );
};

export default BillVerifyPosted;