import React from "react";

function Navbar() {
    return (
        <header className="bg-red-500 text-white body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <nav className="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto">
                    <a className="mr-5 hover:text-gray-900">Notas</a>
                    <a className="mr-5 hover:text-gray-900">Recordatorios</a>
                    <a className="mr-5 hover:text-gray-900">Notas archivadas</a>
                    <a className="hover:text-gray-900">Papelera</a>
                </nav>
                <a className="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0">
                    <img src="/assets/images/logo.png" alt="Logo" className="w-16 h-16" />
                    <span className="ml-2 text-xl text-white">Daily Notes</span>
                </a>
                <div className="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0">
                    <button className="inline-flex items-center bg-green-500 border-0 py-1 px-3 focus:outline-none hover:bg-green-400 rounded text-base mt-4 md:mt-0">
                        Crear nota
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
