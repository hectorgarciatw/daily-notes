import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBoltLightning, faTrash, faClock, faClipboard, faNoteSticky, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar({ photoURL, userName }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isToastShown, setIsToastShown] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();

    const notify = () => {
        if (!isToastShown) {
            toast(`👋 Bienvenido ${userName}`);
            setIsToastShown(true);
        }
    };

    const handleSignOut = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            localStorage.removeItem("user");
            navigate("/login");
        } catch (error) {
            console.error("Error al cerrar sesión", error);
            toast.error("Error al cerrar sesión");
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!isToastShown) {
                notify();
                localStorage.setItem("isWelcomeToastShown", "true");
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest(".dropdown-menu")) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <nav className="relative bg-white shadow dark:bg-gray-800">
            <div className="container px-6 py-4 mx-auto">
                <div className="lg:flex lg:items-center lg:justify-between">
                    <div className="flex items-center justify-between">
                        <div className="center-vertical">
                            <span className="text-4xl">📌</span>
                            <span className="slogan text-2xl text-white font-semibold">QuickClips</span>
                        </div>

                        <div className="flex lg:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                                aria-label="toggle menu"
                            >
                                {isOpen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div
                        className={`${
                            isOpen ? "block" : "hidden"
                        } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center`}
                    >
                        <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
                            <div className="relative">
                                <a
                                    href="#"
                                    className="flex items-center px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={toggleDropdown}
                                >
                                    <FontAwesomeIcon icon={faBoltLightning} className="mr-2" />
                                    Descargar Clips
                                </a>
                                {showDropdown && (
                                    <div className="absolute right-0 z-20 w-48 py-2 mt-2 bg-white rounded-md shadow-xl dark:bg-gray-800 dropdown-menu">
                                        <a href="#" className="text-center block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                                            Descargar JSON
                                        </a>
                                        <a href="#" className="text-center block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                                            Descargar CSV
                                        </a>
                                        <a href="#" className="text-center block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                                            Descargar XLSX
                                        </a>
                                    </div>
                                )}
                            </div>
                            <a href="#" className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faClock} className="mr-2" />
                                Recordatorios
                            </a>

                            <a href="#" className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                Papelera
                            </a>
                            <a href="#" onClick={handleSignOut} className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                Salir
                            </a>
                            <ToastContainer autoClose={1500} theme="dark" />
                        </div>

                        <div className="flex items-center mt-4 lg:mt-0">
                            <button type="button" className="flex items-center focus:outline-none" aria-label="toggle profile dropdown">
                                <div className="w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full">{photoURL && <img src={photoURL} className="object-cover w-full h-full" alt="avatar" />}</div>
                                <h3 className="mx-2 text-gray-700 dark:text-gray-200 lg:hidden">{userName}</h3>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
