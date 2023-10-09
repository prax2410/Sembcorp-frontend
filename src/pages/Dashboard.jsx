import React, { useState, useEffect, useCallback } from 'react';
import Layout from "../layout/Layout";
import {API} from "../config";

import "../styles/dashboard.css";

import { io } from "socket.io-client";

const socket = io("http://localhost:3003");
// const socket = io("http://sembcorp.esys.co.in:3003");

const Dashboard = () => {
    const [listOfMachines, setListOfMachines] = useState([]);
    const [states, setStates] = useState({});

    const handleUpdateState = (wegid, newState) => {
        setStates(prevStates => ({
            ...prevStates,
            [wegid]: newState
        }));
    };

    const fetchWegid = useCallback(async () => {
        const response = await fetch(`${API}/fetchWegid`);
        const result = await response.json();
        const data = result.listOfWegid;

        if (data.length !== 0) {
            const temp = data.map(machine => machine.replace("-", ""));
            setListOfMachines(temp);
        } else {
            setListOfMachines([]);
        }
    }, []);

    useEffect(() => {
        fetchWegid();
    }, [fetchWegid]);

    useEffect(() => {
        const handleReceiveTemp = liveDatum => {
            const { data } = liveDatum;
            const key = data.wegid;
            handleUpdateState(key, data);
        };

        socket.on("recieve-temp", handleReceiveTemp);

        return () => {
            socket.off("recieve-temp", handleReceiveTemp);
        };
    }, []);

    return (
        <Layout>
            <div className="dashboard--container">
                {listOfMachines.map(machineName => {
                    const formattedMachineName = `${machineName.substr(0, 5)}-${machineName.substr(5)}`;
                    const state = states[formattedMachineName];

                    return (
                        <div className="demo-data" key={machineName}>
                            <p>{state ? state.wegid : machineName}</p>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Frequency</td>
                                        <td>{state ? state.frequency : 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Magnitude</td>
                                        <td>{state ? state.magnitude : 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Decible</td>
                                        <td>{state ? state.decible : 0}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
};

export default Dashboard