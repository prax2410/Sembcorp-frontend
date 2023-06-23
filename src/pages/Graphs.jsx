import React, { useEffect, useState } from 'react'
import { FiFilter } from "react-icons/fi"
import Moment from 'moment-timezone';

import Layout from '../layout/Layout';
import { API } from "../config";
// import TabNavItem from '../components/ui/tabComponents/TabNavItem'
// import TabContent from '../components/ui/tabComponents/TabContent'
import DropdownNew from '../components/ui/Dropdown'
import GraphFilters from '../components/ui/GraphFilters'
import ChartsForGraphs from '../components/ui/chartsForGraphs';
import "../styles/graphs.css"

const Graphs = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDate.getDate().toString().padStart(2, '0')

    const defaultDate = `${year}-${month}-${day}`;
    
    const date = new Date()
    const showTime = date.getHours()
        + ':' + date.getMinutes()
        + ":" + date.getSeconds()
    
    // const [activeTabButtons, setActiveTabButtons] = useState("tab1")
    // const [unFilteredData, setUnFilteredData] = useState([])
    const [activeGraphData, setActiveGraphData] = useState({
        frequency: [],
        magnitude: [],
        decible: [],
        created_on: []
    })
    const [listOfMachines, setListOfMachines] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState({});
    const [filteredData, setFilteredData] = useState([])
    const [filterCardIsOpen, setFilterCardIsOpen] = useState(false);
    const [filterValues, setFilterValues] = useState({
        periodFrom: defaultDate + ' 00:01:00',
        periodTo: defaultDate + ' ' + showTime
    })

    // Destructuring values
    const { periodFrom, periodTo } = filterValues

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
                            // setMessage()
                        } else {
                            setFilteredData(prevUnfilteredData => prevUnfilteredData);
                        }
                    })
                })
        }

        if (Object.keys(selectedMachine).length !== 0) getFilteredReportDataFromDb();
    }, [periodFrom, periodTo, selectedMachine]);
    
    const changeTimeStamp = (logTime) => {
        const date = Moment.utc(logTime);
        const formattedDate = date.tz("Asia/Kolkata").format("DD-MMM-YY, h:mm a");
        return formattedDate;
    };

    useEffect(() => {
        if (filteredData.length !== 0) {
            setActiveGraphData(prevGraphData => {
                const updatedGraphData = { ...prevGraphData };
                updatedGraphData.created_on = filteredData.map(data => changeTimeStamp(data.created_on));
                updatedGraphData.frequency = filteredData.map(data => Number(data.frequency));
                updatedGraphData.magnitude = filteredData.map(data => Number(data.magnitude));
                updatedGraphData.decible = filteredData.map(data => Number(data.decible));
                
                return updatedGraphData;
            });
        }
    }, [filteredData]);
    
    // useEffect(() => {
    //     if (filteredData.length !== 0) {
    //         setActiveGraphData(prevGraphData => {
    //             const updatedGraphData = { ...prevGraphData };
    //             updatedGraphData.created_on = filteredData.map(data => changeTimeStamp(data.created_on));
    //             if (activeTabButtons === 'tab1') {
    //                 updatedGraphData.frequency = filteredData.map(data => Number(data.frequency));
    //             } else if (activeTabButtons === 'tab2') {
    //                 updatedGraphData.magnitude = filteredData.map(data => Number(data.magnitude));
    //             } else if (activeTabButtons === 'tab3') {
    //                 updatedGraphData.decible = filteredData.map(data => Number(data.decible));
    //             }
            
    //             return updatedGraphData;
    //         });
    //     }
    // }, [activeTabButtons, filteredData]);


    useEffect(() => {
        // console.log(filterValues)
    }, [filterValues])
    
    useEffect(() => {
        // console.log(filteredData)
    }, [filteredData])

    useEffect(() => {
        // console.log(activeGraphData);
    }, [activeGraphData])

    return (
        <Layout>
            <div className='graphs--container'>
                <div className="graphs--header">
                    <p>Graphs</p>
                    <div className="graphs--filters">
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
                    <div className="dropdown">
                        <button className="dropbtn sembcorp--buttons" onClick={() => setFilterCardIsOpen(!filterCardIsOpen)}>
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
                    </div>
                </div>
                <div className="graphs--graph-body-wrapper">
                    {activeGraphData.frequency &&
                        <ChartsForGraphs
                            width="100%"
                            height="61dvh"
                            labelForChart={activeGraphData.created_on}
                            dataSets={[
                                {
                                    label: "Frequency",
                                    graphData: activeGraphData.frequency,
                                    lineColor: "red",
                                },
                                {
                                    label: "Magnitude",
                                    graphData: activeGraphData.magnitude,
                                    lineColor: "yellow",
                                },
                                {
                                    label: "Decible",
                                    graphData: activeGraphData.decible,
                                    lineColor: "blue",
                                }
                            ]}
                        />
                    }
                    {/* tab switches */}
                    {/* <div className="graphs--tab-navs">
                        <ul>
                            <TabNavItem
                                title="Frequency"
                                id="tab1"
                                activeTab={activeTabButtons}
                                setActiveTab={setActiveTabButtons}
                            />
                            <TabNavItem
                                title="Magnitude"
                                id="tab2"
                                activeTab={activeTabButtons}
                                setActiveTab={setActiveTabButtons}
                            />
                            <TabNavItem
                                title="Decible"
                                id="tab3"
                                activeTab={activeTabButtons}
                                setActiveTab={setActiveTabButtons}
                            />
                        </ul>
                    </div> */}
                    {/* Tab contents */}
                    {/* <div className="graphs--chart-area">
                        <TabContent id="tab1" activeTab={activeTabButtons}>
                            {activeGraphData.frequency &&
                                <ChartsForGraphs
                                    width="100%"
                                    height="61dvh"
                                    labelForChart={activeGraphData.created_on}
                                    dataSets={[
                                        {
                                            label: "Frequency",
                                            graphData: activeGraphData.frequency,
                                            lineColor: "#426C2A",
                                        }
                                    ]}
                                />
                            }
                        </TabContent>
                        <TabContent id="tab2" activeTab={activeTabButtons}>
                            {activeGraphData.magnitude &&
                                <ChartsForGraphs
                                    width="100%"
                                    height="61dvh"
                                    labelForChart={activeGraphData.created_on}
                                    dataSets={[
                                        {
                                            label: "Magnitude",
                                            graphData: activeGraphData.magnitude,
                                            lineColor: "#426C2A",
                                        }
                                    ]}
                                />
                            }
                        </TabContent>
                        <TabContent id="tab3" activeTab={activeTabButtons}>
                            {activeGraphData.decible &&
                                <ChartsForGraphs
                                    width="100%"
                                    height="61dvh"
                                    labelForChart={activeGraphData.created_on}
                                    dataSets={[
                                        {
                                            label: "Decible",
                                            graphData: activeGraphData.decible,
                                            lineColor: "#426C2A",
                                        }
                                    ]}
                                />
                            }
                        </TabContent>
                    </div> */}
                </div>
            </div>
        </Layout>
    )
};

export default Graphs