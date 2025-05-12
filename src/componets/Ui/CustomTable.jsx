import DataTable from "react-data-table-component";

export const CustomTable = ({handleRowClick, updateLoading ,page,columns, data, totalRows, limit, rowPerPageOptions, handlePageChange, handleRowsPerPageChange, filteredData }) => {
    return (
        <div className=" overflow-x-auto max-w-8xl mx-auto rounded-lg  shadow-xl">
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
                            borderTopLeftRadius: "10px",
                            borderTopRightRadius: "10px",
                        }
                    }
                }}
                fixedHeader
                fixedHeaderScrollHeight="70vh"
                onRowClicked={handleRowClick}
                pointerOnHover
            />
            
        </div>
    )
}
