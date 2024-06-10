import React, { useState, useEffect, useRef } from "react";
// Funciones auxiliares
import { capitalizeFirstLetter } from "../utils/utils";
// Iconos

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faLink, faStar, faPen, faBrush, faShareNodes } from "@fortawesome/free-solid-svg-icons";

// Para cambiar de color los fondos de las Cards
import { CirclePicker } from "react-color";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// Animación de los iconos de los Clips
import { motion } from "framer-motion";

function Card({ id, title, type, content, priority, url, released, color, onDelete, onUpdate }) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState(color);
    // Estado del dropdown para compartir clips
    const [showDropdown, setShowDropdown] = useState(false);

    const cardRef = useRef(null);

    // Manipulación del envío de un Clip por plataforma
    const handleShare = (platform) => {
        if (platform === "whatsapp") {
            // Lógica para compartir en WhatsApp
            const message = `Title: ${title}\nContent: ${content}\nType: ${type}\nPriority: ${priority}\nURL: ${url}`;
            const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
            window.open(whatsappLink, "_blank");
        } else if (platform === "gmail") {
            // Lógica para compartir por correo electrónico (Gmail)
            const emailSubject = `Clip: ${title}`;
            const emailBody = `Content: ${content}\nType: ${type}\nPriority: ${priority}\nURL: ${url}`;
            const gmailLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            window.location.href = gmailLink;
        }
    };

    // Establece el color de la prioridad según su tipo
    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case "importante":
                return "bg-red-400 text-white";
            case "ocasional":
                return "bg-white text-gray-800";
            case "urgente":
                return "bg-red-700 text-white";
            default:
                return "bg-gray-200 dark:bg-gray-300 text-gray-800 dark:text-gray-900";
        }
    };

    // Se precarga el color seleccionado por el usuario
    const handleColorChange = async (color) => {
        setSelectedColor(color.hex);
        try {
            const docRef = doc(db, "clips", id);
            await updateDoc(docRef, {
                color: color.hex,
            });
        } catch (error) {
            console.error("Error updating color in Firebase: ", error);
        }
    };

    // Se establece el color de fondo de la Card
    const setColor = () => {
        return { backgroundColor: selectedColor, color: "white" };
    };

    // Maneja el clic fuera del CirclePicker o Card
    const handleClickOutside = (event) => {
        if (cardRef.current && !cardRef.current.contains(event.target)) {
            setShowColorPicker(false);
        }
    };

    // Maneja el clic fuera del dropdown
    const handleClickOutsideDropdown = (event) => {
        if (showDropdown && cardRef.current && !cardRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };

    // Manejo de los click's externos para ocultar selector de color de la Card
    useEffect(() => {
        if (showColorPicker) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showColorPicker]);

    // Manejo del clic externo para cerrar el dropdown
    useEffect(() => {
        document.addEventListener("click", handleClickOutsideDropdown);

        return () => {
            document.removeEventListener("click", handleClickOutsideDropdown);
        };
    });

    return (
        <div ref={cardRef} className="relative w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md dark:bg-gray-800" style={setColor()}>
            <div className="flex items-center justify-between">
                <span className="text-sm italic font-light text-white">{capitalizeFirstLetter(type)}</span>
                <span className={`px-3 py-1 text-xs uppercase rounded-full ${getPriorityColor(priority)}`}>{priority}</span>
            </div>

            <div>
                <h1 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">{capitalizeFirstLetter(title)}</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{capitalizeFirstLetter(content)}</p>
            </div>

            <div>
                <div className="flex items-center justify-center mt-4">
                    {/* Enlaces para acciones */}
                    <div className="text-gray-300 text-base mr-2 relative">
                        <motion.div whileHover={{ scale: 1.4 }}>
                            <FontAwesomeIcon icon={faShareNodes} className="hover:text-green-400 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)} />
                        </motion.div>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg" style={{ zIndex: showDropdown ? "10" : "-1" }}>
                                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleShare("whatsapp")}>
                                    Compartir en WhatsApp
                                </button>
                                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => handleShare("gmail")}>
                                    Compartir por correo electrónico (Gmail)
                                </button>
                            </div>
                        )}
                    </div>

                    <motion.a href={url} className="text-gray-300 text-base mr-2" whileHover={{ scale: 1.4 }}>
                        <FontAwesomeIcon icon={faLink} className="hover:text-gray-400" />
                    </motion.a>
                    <motion.a href="#" className="text-gray-300 text-base mr-2" whileHover={{ scale: 1.4 }}>
                        <FontAwesomeIcon icon={faStar} className="hover:text-yellow-500" />
                    </motion.a>
                    <motion.a
                        href="#"
                        className="text-gray-300 text-base mr-2"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowColorPicker(!showColorPicker);
                        }}
                        whileHover={{ scale: 1.4 }} // Ejemplo de animación: escala al pasar el ratón
                    >
                        <FontAwesomeIcon icon={faBrush} className="hover:text-pink-500" />
                    </motion.a>
                    <motion.a href="#" className="text-gray-300 text-base mr-2" whileHover={{ scale: 1.4 }} onClick={() => onUpdate()}>
                        <FontAwesomeIcon icon={faPen} className="hover:text-purple-500" />
                    </motion.a>
                    <motion.a href="#" className="text-gray-300 text-base" whileHover={{ scale: 1.4 }} onClick={() => onDelete(id)}>
                        <FontAwesomeIcon icon={faTrash} className="hover:text-red-500" />
                    </motion.a>
                </div>
            </div>
            {showColorPicker && (
                <div className="inset-0 flex items-center justify-center z-10">
                    {/* Selector de color de fondo de la Card */}
                    <CirclePicker
                        className="mt-8"
                        color={selectedColor}
                        onChange={handleColorChange}
                        colors={["#1F2937", "#007A2A", "#027BC0", "#EB144C", "#1A1A1A", "#8b12a3"]}
                        circleSize={24}
                        circleSpacing={14}
                        styles={{
                            default: {
                                circle: {
                                    border: "2px solid white", // Cambia el color del borde según sea necesario
                                    boxShadow: "0 0 5px rgba(0,0,0,0.3)", // Añade sombra para mayor visibilidad
                                },
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default Card;
