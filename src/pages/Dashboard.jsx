import React, { useEffect } from 'react';
import Content from '../components/Content';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    // Obtención del avatar y el nombre del usuario
    const { photoURL, userName, email } = location.state || { email: undefined };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen dashboard">
            <Navbar photoURL={photoURL} userName={userName} />

            <div className="flex flex-grow">
                <header className="flex-grow p-4">
                    <Content email={email} />
                </header>
            </div>
            <Footer />
            {/* 
            <div className="flex items-center mt-4 lg:mt-0">
                <button
                    className="fixed top-24 right-4 hidden mx-4 text-gray-600 transition-colors duration-300 transform lg:block dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400 focus:outline-none"
                    aria-label="show notifications"
                >
                    <FontAwesomeIcon icon={faPlusCircle} size="3x" />
                </button>
            </div>
            */}
        </div>
    );
};

export default Dashboard;
