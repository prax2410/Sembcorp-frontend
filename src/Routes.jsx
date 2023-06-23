import React, { Fragment } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";

// User Routes
import Login from "./user/Login";
import Register from "./user/Register";
import PrivateRoute from "./auth/PrivateRoute";
// import AdminRoute from "./auth/AdminRoute";

// Pages Routes
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Graphs from "./pages/Graphs";
import Settings from "./pages/Settings";

const AppRoutes = () => {
    return (
        <HashRouter>
            <Fragment>
                <Routes>
                    <Route exact path="/login" element={ <Login /> } />
                    <Route exact path="/register" element={<Register />} />    

                    <Route exact path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route exact path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                    <Route exact path="/graphs" element={<PrivateRoute><Graphs /></PrivateRoute>} />
                    <Route exact path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                    
                </Routes>
            </Fragment>
        </HashRouter>
        // <BrowserRouter>
        //     <Fragment>
        //         <Routes>
        //             {/* <Route exact path="/login" element={ <Login /> } />
        //             <Route exact path="/register" element={<Register />} /> */}

                    // <Route exact path="/" element={<Dashboard />} />
                    // <Route exact path="/reports" element={<Reports />} />
                    // <Route exact path="/graphs" element={<Graphs />} />
                    
        //             {/* Private routes that require login */}
        //             {/* <Route exact path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        //             <Route exact path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        //             <Route exact path="/adminReports" element={<AdminRoute><AdminReportsPage /></AdminRoute>} />
        //             <Route exact path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} />
        //             <Route exact path="/registerMachine" element={<PrivateRoute><RegisterMachine /></PrivateRoute>} />
                    
        //             <Route exact path="/settings" element={<AdminRoute><Settings /></AdminRoute>} /> */}
        //         </Routes>
		// 	</Fragment>
        // </BrowserRouter>
    );
};

export default AppRoutes;