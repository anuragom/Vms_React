import DataTable from "react-data-table-component";

export const CustomTable = ({ page,columns, data, totalRows, limit, rowPerPageOptions, handlePageChange, handleRowsPerPageChange, filteredData }) => {
    return (
        <div className="overflow-x-auto max-w-8xl mx-auto rounded-lg shadow-xl">
            <DataTable
                columns={columns}
                data={filteredData}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
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
                            backgroundColor: "#01588E",
                            color: "white",
                            // fontWeight: "bold"
                        }
                    },
                    cells: {
                        style: {
                            fontSize: "13px",
                            color: "#374151"
                        }
                    },
                    rows: {
                        style: {
                            "&:nth-child(even)": { backgroundColor: "#f9fafb" },
                            "&:hover": { backgroundColor: "#f3f4f6" },
                        },
                    },
                    table: {
                        style: {
                            overflowX: 'hidden',
                        },
                    },
                    tableWrapper: {
                        style: {
                            '::-webkit-scrollbar': {
                                display: 'none',
                            },
                            'scrollbarWidth': 'none',
                            '-ms-overflow-style': 'none',
                        },
                    },
                }}
                fixedHeader
                fixedHeaderScrollHeight="70vh"
            />
        </div>
    )
}
