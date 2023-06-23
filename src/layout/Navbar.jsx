import React from "react";
import { NavLink, Navigate } from "react-router-dom";
import { logout } from "../auth"
import Clock from 'react-live-clock';
import Moment from "moment";
import "./navbar.css";
// Icons and logos
// import Logo from '../assets/Tata_Power_Logo.png';

const Navbar = () => {

    // To display date and time clock on navbar
    // const n = new Date().toDateString().split(' ').slice(1).join(' ');
    const n = Moment(new Date()).format("DD-MM-yyyy");
    const day = new Date().toDateString().split(' ')[0];

    return (
        <>
            <div className="navbar-wrapper">
                <nav className="navbar-container">
                    {/* Logo(s) will go here */}
                    {/* <img className="tata-logo" src={Logo} alt="/" /> */}
                    <NavLink
                        className="navbar--logo"
                        to='/'
                        end>
                        <h2 style={{marginLeft: "1em", fontSize: "1.5em", color: "#426C2A"}}>SEMBCORP(Demo)</h2>
                    </NavLink>

                    {/* Menu */}
                    <div className="menu-items">
                        <ul>
                            <li>
                                <NavLink
                                    className={({ isActive }) => (isActive ? 'tab-is-active' : 'tab-is-not-active')}
                                    to="/"
                                    end
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    className={({ isActive }) => (isActive ? 'tab-is-active' : 'tab-is-not-active')}
                                    to="/reports"
                                >
                                    Reports
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    className={({ isActive }) => (isActive ? 'tab-is-active' : 'tab-is-not-active')}
                                    to="/graphs"
                                >
                                    Graphs
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    className={({ isActive }) => (isActive ? 'tab-is-active' : 'tab-is-not-active')}
                                    to="/settings"
                                >
                                    Settings
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    style={{ color: "#1C4C00", fontWeight: "700" }}
                                    onClick={() =>
                                        logout(() => {
                                            <Navigate to="/login" replace={true} />;
                                        })
                                    }
                                    to="/login"
                                >
                                    Logout
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Clock */}
                    <div className="navbar--clock-container">
                        <h4>{n}</h4>
                        <h3>{day}  <Clock format={'HH:mm A'} ticking={true} /></h3>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Navbar;
