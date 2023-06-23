import React, { useEffect, useState } from 'react'
import Moment from 'moment';
import { BsDownload } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { FiFilter } from "react-icons/fi"

import Layout from '../layout/Layout';
import { API } from "../config";
import GraphFilters from '../components/ui/GraphFilters'
import DropdownNew from '../components/ui/Dropdown'
import "../styles/reports.css";
import "../styles/loader.css";

const Reports = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    const defaultDate = `${year}-${month}-${day}`;
    
    const date = new Date();
    const showTime = date.getHours()
        + ':' + date.getMinutes()
        + ":" + date.getSeconds();
    
    const [filterCardIsOpen, setFilterCardIsOpen] = useState(false);
    const [filterValues, setFilterValues] = useState({
        periodFrom: defaultDate + ' 00:01:00',
        periodTo: defaultDate + ' ' + showTime,
    });
    const [filteredData, setFilteredData] = useState([])
    const [loading, setLoading] = useState(true);
    const [popup, setPopup] = useState({
        error: '',
        success: false,
        message: ''
    })
    const [listOfMachines, setListOfMachines] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState({});

    // Destructuring values
    const { periodFrom, periodTo } = filterValues

    // Pop ups---------------------------------------------------------------------------------------------
    const showError = () => (
        <div
            className='alert alert-danger'
            style={{ display: popup.error ? '' : 'none' }}
        >
            {popup.error}
        </div>
    );

    const showSuccess = () => (
        <div
            className='alert alert-info'
            style={{ display: popup.success ? '' : 'none' }}
        >
            {popup.message}
        </div>
    );

    useEffect(() => {
        if (popup.error) {
            setTimeout(() => {
                setPopup({
                    ...popup,
                    error: false,
                });
            }, 10 * 1000)
        }
        if (popup.success) {
            setTimeout(() => {
                setPopup({
                    ...popup,
                    success: false,
                });
            }, 10 * 1000)
        }
    }, [popup]);
    // ----------------------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------
    // Fetching list of machines from the db
    useEffect(() => {
        let isMounted = true;
        const fetchWegid = async () => {
            try {
                const res = await fetch(`${API}/fetchWegid`);
                const result = await res.json();
                const data = result.listOfWegid;
                
                const machinesWithFormat = data.map((machine, i) => {
                    const formattedMachine = machine.replace("-", "");
                    return { name: formattedMachine, value: machine, id: i + 1 };
                });
                setListOfMachines(machinesWithFormat);
                setSelectedMachine(machinesWithFormat[0]);
                
            } catch (error) {
                console.error(error);
            }
        };
        if(isMounted) fetchWegid();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        // console.log(selectedMachine);
    }, [selectedMachine]);

    // ----------------------------------------------------------------------------------------------------
    // Fetch Data
    useEffect(() => {
        const getFilteredReportDataFromDb = () => {
            const bodyData = {
                periodFrom,
                periodTo,
                selectedMachine: selectedMachine.name.toLowerCase()
            }
            // console.log(bodyData);
            fetch(`${API}/getFilteredData`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bodyData)
            })
                .then(res => {
                    res.json().then(res => {
                        const data = res.data;
                        // console.log(data);
                        if (data !== []) {
                            setFilteredData([data][0]);
                            setLoading(false)
                            // setMessage()
                        } else {
                            setFilteredData(prevUnfilteredData => prevUnfilteredData);
                        }
                    })
                })
        }

        setLoading(true);
        if(Object.keys(selectedMachine).length !== 0) getFilteredReportDataFromDb();
    }, [periodFrom, periodTo, selectedMachine]);

    // ----------------------------------------------------------------------------------------------------
    // Animate rows
    // const animateTableRows = () => {
    //     const rows = document.querySelectorAll('.table-row');
    //     rows.forEach((row, index) => {
    //         setTimeout(() => {
    //             row.classList.add('table-row-enter');
    //         }, index * 1);
    //     });
    // };

    // useEffect(() => {
    //     if (!loading) {
    //         animateTableRows();
    //     }
    // }, [loading]);
    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // Email button handler
    const handleEmailButton = async (e) => {
        e.preventDefault();

        if (periodFrom !== '' && periodTo !== '') {
            const fetchRequestBody = {
                filteredDateFrom: periodFrom,
                filteredDateTo: periodTo,
                selectedMachine: [selectedMachine.name.toLowerCase()]
            };

            await fetch(`${API}/emailReport`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fetchRequestBody)
            }).then(async (res) => {
                const data = await res.json()
                if (data.status) {
                    setPopup({
                        ...popup,
                        success: true,
                        message: data.message
                    })
                } else {
                    setPopup({ ...popup, success: false, error: data.message });
                }
                if (res.status === 400) {
                    // alert("The report you are trying to email is greater than 25MB");
                    setPopup({ ...popup, success: false, error: data.message });
                }
            });
        } else {
            alert("Select machines and dates from filter")
        }
    };
    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // Download button handler
    var filename = '';
    const handleDownloadButton = async (e) => {
        e.preventDefault();

        if (periodFrom !== '' && periodTo !== '') {
            const fetchRequestBody = {
                filteredDateFrom: periodFrom,
                filteredDateTo: periodTo,
                selectedMachine: [selectedMachine.name.toLowerCase()]
            };

            const res = await fetch(`${API}/generateFileAndGetFilename`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fetchRequestBody)
            })
            const result = await res.json();
            filename = result.filename;

            fetch(`${API}/downloadReport?filename=${filename}`, {
                method: "GET"
            })
                .then(async (res) => {
                    if (res.ok) {
                        const blob = await res.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        a.click();
                    } else {
                        throw new Error('Error downloading file.');
                    }
                });
        } else {
            alert("Select machines and dates from filter")
        }
    };
    // ----------------------------------------------------------------------------------------------------

    return (
        <Layout>
            <div className='reports--container'>
                <div className="reports--header">
                    <p className='reports--header-title'>Reports</p>
                    {showError()}
                    {showSuccess()}
                    <div className="reports--filters">
                        {/* Dropdown */}
                        {selectedMachine && (
                            <DropdownNew
                                selectedMachine={{
                                    name: selectedMachine.name,
                                    value: selectedMachine.value,
                                    id: selectedMachine.id
                                }}
                                setSelectedMachine={setSelectedMachine}
                                items={listOfMachines}
                            />
                        )}
                        {/* Filter button */}
                        <div className="dropdown">
                            <button className="dropbtn" onClick={() => setFilterCardIsOpen(!filterCardIsOpen)}>
                                <p>Filters</p>
                                <FiFilter style={{ color: "#fff" }} />
                            </button>
                            {
                                filterCardIsOpen &&
                                <div className="dropdown-content">
                                    <GraphFilters
                                        setFilterValues={setFilterValues}
                                        filterCardIsOpen={filterCardIsOpen}
                                        setFilterCardIsOpen={setFilterCardIsOpen}
                                    />
                                </div>
                            }
                        </div>
                        {/* Email button */}
                        <button
                            className='sembcorp--buttons'
                            onClick={(e) => handleEmailButton(e)}
                            // disabled={Object.keys(filteredData).length === 0}
                            disabled
                        >
                            <p>Email</p>
                            <AiOutlineMail />
                        </button>
                        {/* Download */}
                        <button
                            className='sembcorp--buttons'
                            onClick={(e) => handleDownloadButton(e)}
                            disabled={Object.keys(filteredData).length === 0}
                        >
                            <p>Download</p>
                            <BsDownload />
                        </button>
                    </div>
                </div>

                {/* table */}
                <div className='reports--table-container'>
                    {loading ?
                        (
                            <div className='loader--wrapper'>
                                <div className="loader"></div>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>ID</th>
                                        <th>WEGID</th>
                                        <th>Frequency</th>
                                        <th>Magnitude</th>
                                        <th>Decible</th>
                                        <th>Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData && Object.keys(filteredData).map((rows, i) => {
                                        return (
                                            <tr key={i} className="table-row">
                                                <td>{i + 1}</td>
                                                <td>{filteredData[rows].id}</td>
                                                <td>{filteredData[rows].wegid}</td>
                                                <td>{filteredData[rows].frequency}</td>
                                                <td>{filteredData[rows].magnitude}</td>
                                                <td>{filteredData[rows].decible}</td>
                                                <td>{filteredData[rows].created_on && Moment(new Date(filteredData[rows].created_on)).format("DD/MM/YYYY hh:mm:ss A")}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                </div>
            </div>
        </Layout>
    );
};

export default Reports;