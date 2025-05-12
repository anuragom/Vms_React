import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { getToken } from "../../Auth/auth";
import { saveAs } from "file-saver";
import { CustomTable } from "../Ui/CustomTable";

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
    const [lastSearchParams, setLastSearchParams] = useState({});
    const token = getToken();
    const firstUpdate = useRef(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);


    useEffect(() => {
        fetchAnnexureDetails();
    }, []);


    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        fetchAnnexureDetailsOnPageChange();
    }, [limit, page]);

    const fetchAnnexureDetailsOnPageChange = async () => {
        const currentParams = {
            page,
            limit,
            fromDate,
            toDate,
            chlnVendorCode
        };

        if (JSON.stringify(currentParams) === JSON.stringify(lastSearchParams)) {
            return;
        }

        setUpdateLoading(true);
        setError(false);

        try {
            const response = await axios.post(
                "https://vmsnode.omlogistics.co.in/api/PostedBill",
                {
                    page: page,
                    limit: limit,
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
            } else {
                setData(response.data.data);
                setFilteredData(response.data.data);
            }

            setLastSearchParams(currentParams);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(true);
        }

        setUpdateLoading(false);
    };

    const fetchAnnexureDetails = async () => {
        const currentParams = {
            page,
            limit,
            fromDate,
            toDate,
            chlnVendorCode
        };

        if (JSON.stringify(currentParams) === JSON.stringify(lastSearchParams)) {
            return;
        }

        setLoading(true);
        setError(false);

        try {
            const response = await axios.post(
                "https://vmsnode.omlogistics.co.in/api/PostedBill",
                {
                    page: page,
                    limit: limit,
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
            } else {
                setData(response.data.data);
                setFilteredData(response.data.data);
                setTotalRows(response.data.totalRecords || response.data.data.length);
            }

            setLastSearchParams(currentParams);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(true);
        }

        setLoading(false);
    };

    useEffect(() => {
        const result = data.filter((item) =>
            item.CN_NO.toString().includes(search)
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
        { name: "Row No", selector: (row) =>  row.RNUM, sortable: true, wrap: true, width: "100px" },
        { name: "Annexure No.", selector: (row) => row.ANNEXURE_NO, sortable: true, wrap: true, width: "" },
        { name: "Vendor Code", selector: (row) => row.CHALLAN_VENDOR_CODE, sortable: true, wrap: true, width: "" },
        { name: "Total Amount", selector: (row) => row.TOTAL_AMOUNT, sortable: true, wrap: true, width: "" },
        { name: "NOC", selector: (row) => row.ITEM_DESCRIPT, sortable: true, wrap: true, width: "" },
        { name: "NOC Date", selector: (row) => row.TOTAL_CN_PKG, sortable: true, wrap: true, width: "" }
    ];  
    const modalColumns = [
        { name: "LR No.", selector: (row) => row.ROW_NUM, sortable: true, wrap: true, width: "100px" },
        { name: "LR Date", selector: (row) => row.CN_NO, sortable: true, wrap: true, width: "" },
        { name: "Mode", selector: (row) => row.MANUAL_CN_NO, sortable: true, wrap: true, width: "" },
        { name: "VAT", selector: (row) => row.SOURCE_BRANCH_CODE, sortable: true, wrap: true, width: "" },
        { name: "Packet Count", selector: (row) => row.ITEM_DESCRIPTION, sortable: true, wrap: true, width: "" },
        { name: "Weight", selector: (row) => row.TOTAL_CN_PKG, sortable: true, wrap: true, width: "" },
        { name: "Item", selector: (row) => row.TOTAL_CN_PKG, sortable: true, wrap: true, width: "" },
        { name: "Description", selector: (row) => row.TOTAL_CN_PKG, sortable: true, wrap: true, width: "" },
        { name: "KM", selector: (row) => row.TOTAL_CN_PKG, sortable: true, wrap: true, width: "" },
        { name: "Latitude", selector: (row) => row.TOTAL_CN_PKG, sortable: true, wrap: true, width: "" },
        { name: "Longitude", selector: (row) => row.TOTAL_CN_PKG, sortable: true, wrap: true, width: "" },
        { name: "Floor (GPT, RRT)", selector: (row) => row.TOTAL_CN_PKG, sortable: true, wrap: true, width: "" }
    ];
    

    const rowPerPageOptions = [20, 50, 100, 200, 500, 1000, 5000, 10000];

    const handleRowClick = (row) => {
        setModalOpen(true);
    }

    return (
        <div className={`bg-gray-50 py-3 px-6 ${marginClass} transition-all duration-300`}>
            <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-8xl mx-auto">
                <div>
                    <label htmlFor="fromDate" className="block text-xs font-medium text-gray-700 mb-1">
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

                <div >
                    <label htmlFor="toDate" className="block text-xs font-medium text-gray-700 mb-1">
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
                        <label htmlFor="search" className="whitespace-nowrap block text-xs font-medium text-gray-700 mb-1">
                            Search by Annex No
                        </label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Search by CN No"
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="">
                        <button
                            onClick={fetchAnnexureDetails}
                            className="whitespace-nowrap px-4 w-full py-2 bg-[#01588E] text-white rounded-lg font-semibold hover:bg-[#014a73] transition-colors"
                        >
                            Search
                        </button>
                    </div>

                </div>
            </div>

            {loading && <div className="text-center text-blue-600 text-lg">Loading...</div>}
            {error && <div className="text-center text-red-600 text-lg">No data found</div>}

            {!loading && !error && data.length > 0 && (
                <>
                    {updateLoading && <div className="text-center text-blue-600 text-sm">Updating...</div>}
                    <CustomTable handleRowClick={handleRowClick} updateLoading={updateLoading} page={page} columns={columns} data={filteredData} totalRows={totalRows} limit={limit} rowPerPageOptions={rowPerPageOptions} handlePageChange={handlePageChange} handleRowsPerPageChange={handleRowsPerPageChange} filteredData={filteredData} />
                </>
            )}
            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="rounded-lg overflow-hidden w-full m-2 max-w-4xl overflow-y-auto shadow-lg relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className=" overflow-x-auto max-w-8xl mx-auto shadow-xl">
                            <DataTable
                                columns={modalColumns}
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
                                        }
                                    }
                                }}
                                fixedHeader
                                fixedHeaderScrollHeight="70vh"
                            />

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnextureDetails;