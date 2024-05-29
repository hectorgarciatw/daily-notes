import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faTrash, faClock, faClipboard, faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { signOut, getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navbar({ photoURL, userName }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const notify = () => {
        toast(`👋 Bienvenido ${userName}`);
    };

    // Implementación del logout de la app
    const handleSignOut = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            // Limpiar cualquier información de usuario almacenada localmente
            localStorage.removeItem('user');
            // Redirigir al usuario a la página de inicio de sesión
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión', error);
            toast.error('Error al cerrar sesión');
        }
    };

    // Invocación del toast de bienvenida al usuario
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Asegurarse de que el código se ejecuta en el navegador
            const isWelcomeToastShown = localStorage.getItem('isWelcomeToastShown');
            if (!isWelcomeToastShown) {
                notify();
                localStorage.setItem('isWelcomeToastShown', 'true');
            }
        }
    }, []);

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
                            isOpen ? 'block' : 'hidden'
                        } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center`}
                    >
                        <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
                            <a href="#" className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faNoteSticky} className="mr-2" />
                                Notas
                            </a>
                            <a href="#" className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faClock} className="mr-2" />
                                Recordatorios
                            </a>
                            <a href="#" className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <FontAwesomeIcon icon={faClipboard} className="mr-2" />
                                Notas archivadas
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
