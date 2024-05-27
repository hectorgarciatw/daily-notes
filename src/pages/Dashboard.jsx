import React from "react";
import Content from "../components/Content";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useLocation } from "react-router-dom";

const Dashboard = () => {
    const location = useLocation();
    // Obtención del avatar y el nombre del usuario
    const { photoURL, userName } = location.state || {};
    return (
        <div className="flex flex-col min-h-screen dashboard">
            <Navbar photoURL={photoURL} userName={userName} />
            <div className="flex flex-grow">
                <header className="flex-grow p-4">
                    <Content />
                </header>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
