import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBoltLightning, faStar, faClock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { signOut, getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importa el hook useClips para leer los Clips de la variable global
import { useClips } from './ClipsContext';

// Compatibilidad con archivos de Excel
import * as XLSX from 'xlsx';

function Navbar({ photoURL, userName }) {
    const { clips } = useClips();
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
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión', error);
            toast.error('Error al cerrar sesión');
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!isToastShown) {
                notify();
                localStorage.setItem('isWelcomeToastShown', 'true');
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.dropdown-menu')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Función auxiliar para convertir texto a array buffer (para la descarga del xlsx)
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xff;
        }
        return buf;
    };

    // Función para realizar backups de los Clips en diferentes formátos
    const downloadClips = (fileType) => {
        let blob = null;

        try {
            if (fileType === 'json') {
                const json = JSON.stringify(clips, null, 2);
                blob = new Blob([json], { type: 'application/json' });
            }
            if (fileType === 'csv') {
                const csv = [
                    Object.keys(clips[0]).join(','), // Encabezados
                    ...clips.map((clip) => Object.values(clip).join(',')),
                ].join('\n');

                // Crear un Blob de tipo text/csv
                blob = new Blob([csv], { type: 'text/csv' });
            }
            if (fileType === 'xlsx') {
                // Crear un libro de trabajo (workbook)
                const wb = XLSX.utils.book_new();
                // Convertir los datos a una hoja de cálculo (worksheet)
                const ws = XLSX.utils.json_to_sheet(clips);
                // Agregar la hoja de cálculo al libro de trabajo
                XLSX.utils.book_append_sheet(wb, ws, 'Clips');
                // Generar un archivo binario XLSX
                const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
                // Convertir el archivo binario a Blob
                blob = new Blob([s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            }

            if (blob) {
                // Crea una URL para el Blob
                const url = URL.createObjectURL(blob);
                // Crea un elemento de enlace
                const link = document.createElement('a');
                link.href = url;
                // Nombre del archivo con la extensión correspondiente que se descargará
                link.download = 'clips.' + fileType;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                // Libera la URL del Blob
                URL.revokeObjectURL(url);
            } else {
                throw new Error('No se pudo crear el Blob para descargar el archivo.');
            }
        } catch (error) {
            console.error('Error al descargar el archivo:', error);
            toast.error('Error al descargar el archivo');
        }
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
                            isOpen ? 'block' : 'hidden'
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
                                        <a href="#" onClick={() => downloadClips('json')} className="text-center block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                                            Descargar JSON
                                        </a>
                                        <a href="#" onClick={() => downloadClips('csv')} className="text-center block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
                                            Descargar CSV
                                        </a>
                                        <a href="#" onClick={() => downloadClips('xlsx')} className="text-center block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">
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
                                <FontAwesomeIcon icon={faStar} className="mr-2" />
                                Favoritos
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
