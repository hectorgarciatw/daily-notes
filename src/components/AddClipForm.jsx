import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AddClipForm = ({ width, mt, mb }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleForm = () => {
        setExpanded(!expanded);
    };

    return (
        <div className={`flex flex-col items-start ${mt} ${mb} ${width} mx-auto`}>
            <div className="w-full mb-4">
                <input readOnly={true} onClick={toggleForm} type="text" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors duration-300" placeholder="➕ Añadir un nuevo clip ..." />
            </div>
            {expanded && (
                <form className="w-full p-4 border border-gray-300 rounded-md">
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-1 font-semibold text-gray-700">
                            Título
                        </label>
                        <input type="text" id="title" name="title" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors duration-300" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block mb-1 font-semibold text-gray-700">
                            Contenido
                        </label>
                        <textarea id="content" name="content" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors duration-300" rows="3"></textarea>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition-colors duration-300">
                        Guardar
                    </button>
                </form>
            )}
        </div>
    );
};

export default AddClipForm;
