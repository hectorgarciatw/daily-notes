import React from "react";
import Content from "../components/Content";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Dashboard = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
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
