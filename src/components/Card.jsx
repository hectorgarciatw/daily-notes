import React, { useState, useEffect, useRef } from "react";
// Funciones auxiliares
import { capitalizeFirstLetter } from "../utils/utils";
// Iconos
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faLink, faStar, faPen, faPalette, faBars, faShareNodes, faEnvelope, faUser, faComment, faWifi } from "@fortawesome/free-solid-svg-icons";
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

    // Manipulación del envío de un Clip por plataforma
    const handleShare = (platform) => {
        const message = `Title: ${title}\nContent: ${content}\nType: ${type}\nPriority: ${priority}\nURL: ${url}`;
        if (platform === "whatsapp") {
            const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
            window.open(whatsappLink, "_blank");
        } else if (platform === "gmail") {
            const emailSubject = `Clip: ${title}`;
            const emailBody = message;
            const gmailLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            window.location.href = gmailLink;
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
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

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
                        whileHover={{ scale: 1.4 }}
                    >
                        <FontAwesomeIcon icon={faPalette} className="hover:text-pink-500" />
                    </motion.a>
                    <motion.a href="#" className="text-gray-300 text-base mr-2" whileHover={{ scale: 1.4 }} onClick={() => onUpdate()}>
                        <FontAwesomeIcon icon={faPen} className="hover:text-purple-500" />
                    </motion.a>
                    <motion.a href="#" className="text-gray-300 text-base mr-3" whileHover={{ scale: 1.4 }} onClick={() => onDelete(id)}>
                        <FontAwesomeIcon icon={faTrash} className="hover:text-red-500" />
                    </motion.a>
                    <div className="text-gray-300 text-base relative">
                        <motion.div whileHover={{ scale: 1.4 }}>
                            <FontAwesomeIcon icon={faBars} className="hover:text-purple-700 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)} />
                        </motion.div>
                        {showDropdown && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 ml-14 mt-2 z-50 w-56">
                                <div className="p-1 mt-1 text-sm bg-white border rounded-md shadow-md border-neutral-200/70 text-neutral-700">
                                    <a
                                        href="#_"
                                        className="relative flex justify-between w-full cursor-default select-none group items-center rounded px-2 py-1.5 hover:bg-neutral-100 hover:text-neutral-900 outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="hover:text-black mr-2" />
                                        <span onClick={() => onDelete(id)}>Eliminar Clip</span>
                                        <span className="ml-auto text-xs tracking-widest text-neutral-400 group-hover:text-neutral-600">⌘N</span>
                                    </a>
                                    <a
                                        href="#_"
                                        className="relative flex justify-between w-full cursor-default select-none group items-center rounded px-2 py-1.5 hover:bg-neutral-100 hover:text-neutral-900 outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
                                    >
                                        <FontAwesomeIcon icon={faPen} className="hover:text-black mr-2" />
                                        <span
                                            onClick={() => {
                                                onUpdate();
                                                setShowDropdown(false);
                                            }}
                                        >
                                            Editar Clip
                                        </span>
                                        <span className="ml-auto text-xs tracking-widest text-neutral-400 group-hover:text-neutral-600">⌘N</span>
                                    </a>
                                    <div
                                        className="relative flex justify-between w-full cursor-default select-none group items-center rounded px-2 py-1.5 hover:bg-neutral-100 hover:text-neutral-900 outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
                                        data-disabled
                                    >
                                        <span>Calendario (en beta)</span>
                                        <span className="ml-auto text-xs tracking-widest text-neutral-400 group-hover:text-neutral-600">⇧⌘N</span>
                                    </div>
                                    <div className="relative w-full group">
                                        <div className="flex cursor-default select-none items-center rounded px-2 hover:bg-neutral-100 py-1.5 outline-none">
                                            <FontAwesomeIcon icon={faShareNodes} className="hover:text-black mr-2" />
                                            <span>Compartir</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-auto">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </div>
                                        <div data-submenu className="absolute top-0 right-0 invisible mr-1 duration-200 ease-out translate-x-full opacity-0 group-hover:mr-0 group-hover:visible group-hover:opacity-100">
                                            <div className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md animate-in slide-in-from-left-1 w-48">
                                                <div
                                                    onClick={() => handleShare("whatsapp")}
                                                    className="relative flex cursor-default select-none items-center rounded px-2 py-1.5 hover:bg-neutral-100 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                >
                                                    <FontAwesomeIcon icon={faComment} className="hover:text-black mr-2" />
                                                    Whatsapp
                                                </div>
                                                <div
                                                    onClick={() => handleShare("gmail")}
                                                    className="relative flex cursor-default select-none items-center rounded px-2 py-1.5 hover:bg-neutral-100 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                >
                                                    <FontAwesomeIcon icon={faEnvelope} className="hover:text-black mr-2" />
                                                    Gmail
                                                </div>
                                                <div className="h-px my-1 -mx-1 bg-neutral-200"></div>
                                                <div className="relative flex cursor-default select-none items-center rounded px-2 py-1.5 hover:bg-neutral-100 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                    <FontAwesomeIcon icon={faWifi} className="hover:text-black mr-2" />
                                                    Otras redes
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px my-1 -mx-1 bg-neutral-200"></div>
                                    <div x-data="{ showBookmarks: true }" className="relative flex cursor-default select-none items-center rounded py-1.5 pl-8 pr-2 hover:bg-neutral-100 outline-none data-[disabled]:opacity-50">
                                        <span x-show="showBookmarks" className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </span>
                                        <span>Mostrar favoritos</span>
                                        <span className="ml-auto text-xs tracking-widest text-neutral-400 group-hover:text-neutral-600">⌘⇧B</span>
                                    </div>
                                    <div x-data="{ showFullUrl: false }" className="relative flex cursor-default select-none items-center rounded py-1.5 pl-8 pr-2 hover:bg-neutral-100 outline-none data-[disabled]:opacity-50">
                                        <span x-show="showFullUrl" className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </span>
                                        <span>Mostrar recordatorios</span>
                                    </div>
                                    <div className="h-px my-1 -mx-1 bg-neutral-200"></div>
                                    <a
                                        href="#_"
                                        className="relative flex justify-between w-full cursor-default select-none group items-center rounded px-2 py-1.5 hover:bg-neutral-100 hover:text-neutral-900 outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
                                    >
                                        <FontAwesomeIcon icon={faUser} className="hover:text-black mr-2" />
                                        <span>Juan Perez</span>
                                        <span className="ml-auto text-xs tracking-widest text-neutral-400 group-hover:text-neutral-600">⌘N</span>
                                    </a>
                                    <a
                                        href="#_"
                                        className="relative flex justify-between w-full cursor-default select-none group items-center rounded px-2 py-1.5 hover:bg-neutral-100 hover:text-neutral-900 outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
                                    >
                                        <FontAwesomeIcon icon={faUser} className="hover:text-black mr-2" />
                                        <span>Marcelo Gonzalez</span>
                                        <span className="ml-auto text-xs tracking-widest text-neutral-400 group-hover:text-neutral-600">⌘N</span>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showColorPicker && (
                <div
                    className="circlesColor absolute left-0 z-10 flex items-center justify-center w-full h-[50px]" // Agrega h-50px para establecer la altura
                    style={{ top: "calc(100%)" }} // Posiciona 10px por debajo de la tarjeta
                >
                    <div className="w-full h-[50px] absolute bg-gray-100 opacity-80 rounded-md"></div> {/* Fondo detrás del CirclePicker */}
                    <CirclePicker
                        color={selectedColor}
                        onChange={handleColorChange}
                        colors={["#1F2937", "#007A2A", "#027BC0", "#EB144C", "#1A1A1A", "#8b12a3"]}
                        circleSize={24}
                        circleSpacing={14}
                        styles={{
                            default: {
                                circle: {
                                    border: "2px solid white",
                                    boxShadow: "0 0 5px rgba(0,0,0,0.3)",
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
