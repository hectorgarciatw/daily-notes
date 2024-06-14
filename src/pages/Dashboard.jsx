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
    const { photoURL, userName, email, calendarAccessToken } = location.state || { email: undefined };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen dashboard">
            <Navbar photoURL={photoURL} userName={userName} />
            <div className="flex flex-grow">
                <header className="flex-grow p-4">
                    {/* Pasamos calendarAccessToken como prop a Content */}
                    <Content email={email} calendarAccessToken={calendarAccessToken} />
                </header>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
