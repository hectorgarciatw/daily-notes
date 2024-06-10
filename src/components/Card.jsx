import React, { useState, useEffect, useRef } from 'react';
// Funciones auxiliares
import { capitalizeFirstLetter } from '../utils/utils';
// Iconos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faLink, faStar, faPen, faBrush } from '@fortawesome/free-solid-svg-icons';
// Para cambiar de color los fondos de las Cards
import { CirclePicker } from 'react-color';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

import { motion } from 'framer-motion';

function Card({ id, title, type, content, priority, url, released, color, onDelete, onUpdate }) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState(color);
    const cardRef = useRef(null);

    // Establece el color de la prioridad según su tipo
    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'importante':
                return 'bg-red-400 text-white';
            case 'ocasional':
                return 'bg-white text-gray-800';
            case 'urgente':
                return 'bg-red-700 text-white';
            default:
                return 'bg-gray-200 dark:bg-gray-300 text-gray-800 dark:text-gray-900';
        }
    };

    // Se precarga el color seleccionado por el usuario
    const handleColorChange = async (color) => {
        setSelectedColor(color.hex);
        try {
            const docRef = doc(db, 'clips', id);
            await updateDoc(docRef, {
                color: color.hex,
            });
        } catch (error) {
            console.error('Error updating color in Firebase: ', error);
        }
    };

    // Se establece el color de fondo de la Card
    const setColor = () => {
        return { backgroundColor: selectedColor, color: 'white' };
    };

    // Maneja el clic fuera del CirclePicker o Card
    const handleClickOutside = (event) => {
        if (cardRef.current && !cardRef.current.contains(event.target)) {
            setShowColorPicker(false);
        }
    };

    // Manejo de los click's externos para ocultar selector de color de la Card
    useEffect(() => {
        if (showColorPicker) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showColorPicker]);

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
                        <FontAwesomeIcon icon={faPen} className="hover:text-green-500" />
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
                        colors={['#1F2937', '#007A2A', '#027BC0', '#EB144C', '#1A1A1A', '#8b12a3']}
                        circleSize={24}
                        circleSpacing={14}
                        styles={{
                            default: {
                                circle: {
                                    border: '2px solid white', // Cambia el color del borde según sea necesario
                                    boxShadow: '0 0 5px rgba(0,0,0,0.3)', // Añade sombra para mayor visibilidad
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
