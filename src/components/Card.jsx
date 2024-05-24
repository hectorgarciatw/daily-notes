import React from "react";
import { capitalizeFirstLetter } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faLink, faStar, faPen, faBrush } from "@fortawesome/free-solid-svg-icons";

function Card({ id, title, type, content, priority, url, released, onDelete }) {
    // Añadir 'id' y 'onDelete' a las props
    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case "importante":
                return "bg-red-300 dark:bg-red-400 text-white dark:text-white";
            case "ocasional":
                return "bg-blue-200 dark:bg-blue-300 text-blue-800 dark:text-blue-900";
            case "urgente":
                return "bg-red-600 dark:bg-red-500 text-white dark:text-white";
            default:
                return "bg-gray-200 dark:bg-gray-300 text-gray-800 dark:text-gray-900";
        }
    };

    return (
        <div className="w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md dark:bg-gray-800">
            <div className="flex items-center justify-between">
                <span className="text-sm font-light text-gray-800 dark:text-gray-400">{capitalizeFirstLetter(type)}</span>
                <span className={`px-3 py-1 text-xs uppercase rounded-full ${getPriorityColor(priority)}`}>{priority}</span>
            </div>

            <div>
                <h1 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">{capitalizeFirstLetter(title)}</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{capitalizeFirstLetter(content)}</p>
            </div>

            <div>
                <div className="flex items-center justify-center mt-4">
                    {/* Enlaces para acciones */}
                    <a href="#" className="text-gray-300 text-base mr-2" onClick={() => onDelete(id)}>
                        <FontAwesomeIcon icon={faTrash} className="hover:text-red-500" />
                    </a>
                    <a href={url} className="text-gray-300 text-base mr-2">
                        <FontAwesomeIcon icon={faLink} className="hover:text-red-500" />
                    </a>
                    <a href="#" className="text-gray-300 text-base mr-2">
                        <FontAwesomeIcon icon={faStar} className="hover:text-red-500" />
                    </a>
                    <a href="#" className="text-gray-300 text-base mr-2">
                        <FontAwesomeIcon icon={faBrush} className="hover:text-red-500" />
                    </a>
                    <a href="#" className="text-gray-300 text-base">
                        <FontAwesomeIcon icon={faPen} className="hover:text-red-500" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Card;
