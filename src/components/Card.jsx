import React, { useState, useEffect, useRef } from 'react';
// Funciones auxiliares
import { capitalizeFirstLetter } from '../utils/utils';
// Iconos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faLink, faPen, faPalette, faCircleDown, faCalendarDays, faShareNodes, faEnvelope, faUser, faComment } from '@fortawesome/free-solid-svg-icons';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faXTwitter, faFacebook, faLinkedin, faTelegram, faSlack } from '@fortawesome/free-brands-svg-icons';
// Para cambiar de color los fondos de las Cards
import { CirclePicker } from 'react-color';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
// Animación de los iconos de los Clips
import { motion } from 'framer-motion';

// Selector de fecha para la selección en Google Calendar
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Card({ id, title, type, content, favorite, priority, url, released, color, calendarAccessToken, onDelete, onUpdate }) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState(color);
    // Estado del dropdown para compartir clips
    const [showDropdown, setShowDropdown] = useState(false);
    // Estado del selector de fechas para el Calendar
    const [eventDate, setEventDate] = useState(null);
    // Estado para ver si el clip es o no favorito
    const [isFavorite, setIsFavorite] = useState(favorite);

    const cardRef = useRef(null);

    const toggleFavorite = async () => {
        // Cambia el estado local de favorito
        setIsFavorite(!isFavorite);

        // Actualiza el campo 'favorite' en Firebase
        try {
            const docRef = doc(db, 'clips', id);
            await updateDoc(docRef, {
                favorite: !isFavorite,
            });
        } catch (error) {
            console.error('Error updating favorite in Firebase: ', error);
        }
    };

    const handleDateChange = (date) => {
        setEventDate(date);
    };

    // Agregar info del Clip en Calendar
    const addCalendar = async () => {
        console.log(`TOKEN: ${calendarAccessToken}`);
        if (!eventDate) {
            alert('Por favor, selecciona una fecha y hora para el evento.');
            return;
        }

        // Construye la descripción del evento
        let description = `Tipo: ${capitalizeFirstLetter(type)}\n`;
        description += `Prioridad: ${capitalizeFirstLetter(priority)}\n`;
        description += `Contenido: ${capitalizeFirstLetter(content)}\n`;
        description += `URL: ${url}`;

        // Construye el objeto de evento con la fecha y hora seleccionadas
        const event = {
            summary: capitalizeFirstLetter(title),
            description: description,
            start: {
                dateTime: eventDate.toISOString(),
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: eventDate.toISOString(),
                timeZone: 'America/Los_Angeles',
            },
            reminders: {
                useDefault: false,
                overrides: [{ method: 'popup', minutes: 30 }],
            },
        };

        try {
            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${calendarAccessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });

            if (!response.ok) {
                throw new Error('Error al agregar evento a Google Calendar');
            }

            console.log('Evento agregado correctamente a Google Calendar');
        } catch (error) {
            console.error('Error al agregar evento a Google Calendar:', error);
        }
    };

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

    // Compartir Clip por redes sociales
    const handleShare = (platform) => {
        let message = 'Clip reenviado a través de QuickClips:\n';
        if (title) {
            message += `Título: ${capitalizeFirstLetter(title)}\n`;
        }
        if (content) {
            message += `Contenido: ${capitalizeFirstLetter(content)}\n`;
        }
        if (type) {
            message += `Tipo: ${capitalizeFirstLetter(type)}\n`;
        }
        if (priority) {
            message += `Prioridad: ${capitalizeFirstLetter(priority)}\n`;
        }
        if (url) {
            message += `URL: ${url}`;
        }

        if (platform === 'whatsapp') {
            const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
            window.open(whatsappLink, '_blank');
        } else if (platform === 'gmail') {
            console.log('GMAIL');
        } else if (platform === 'facebook') {
            const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
            window.open(facebookLink, '_blank');
        } else if (platform === 'twitter') {
            const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
            window.open(twitterLink, '_blank');
        } else if (platform === 'linkedin') {
            const linkedinLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(message)}`;
            window.open(linkedinLink, '_blank');
        } else if (platform === 'telegram') {
            const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
            window.open(telegramLink, '_blank');
        } else if (platform === 'slack') {
            const slackLink = `https://slack.com/intl/en-in/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
            window.open(slackLink, '_blank');
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
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div ref={cardRef} className="relative w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md dark:bg-gray-800" style={setColor()}>
            <div className="flex items-center justify-between">
                <span className="text-sm italic font-light text-white ml-8">{capitalizeFirstLetter(type)}</span>
                <span className={`px-3  py-1 text-xs uppercase rounded-full ${getPriorityColor(priority)}`}>{priority}</span>
            </div>
            <div>
                <h1 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">{capitalizeFirstLetter(title)}</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{capitalizeFirstLetter(content)}</p>
            </div>
            <div>
                <div className="flex items-center justify-center mt-4">
                    <div className="text-gray-300 left-4 top-3.5 text-base absolute">
                        <motion.div
                            whileHover={{ scale: 1.3 }}
                            whileTap={{
                                scale: 1.3,
                                rotate: -90,
                                borderRadius: '100%',
                            }}
                        >
                            <FontAwesomeIcon icon={faCircleDown} style={{ fontSize: '21px' }} className="cursor-pointer mr-2" onClick={() => setShowDropdown(!showDropdown)} />
                        </motion.div>
                        {showDropdown && (
                            <div className="absolute left-0 top-full mt-2 z-50 w-56">
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
                                    <div className="relative flex justify-between w-full cursor-default select-none group items-center rounded px-2 py-1.5 hover:bg-neutral-100 hover:text-neutral-900 outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none">
                                        <FontAwesomeIcon icon={faCalendarDays} className="hover:text-black mr-2" />
                                        <span onClick={() => addCalendar()}>Añadir a calendario</span>
                                        <span className="ml-auto text-xs tracking-widest text-neutral-400 group-hover:text-neutral-600">⇧⌘N</span>
                                    </div>
                                    <div className="mt-4">
                                        <DatePicker selected={eventDate} onChange={handleDateChange} showTimeSelect timeIntervals={15} timeFormat="HH:mm" dateFormat="MMMM d, yyyy h:mm aa" placeholderText="Selecciona fecha y hora del evento" />
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
                                                    onClick={() => handleShare('whatsapp')}
                                                    className="relative flex cursor-default select-none items-center rounded px-2 py-1.5 hover:bg-neutral-100 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                >
                                                    <FontAwesomeIcon icon={faComment} className="hover:text-black mr-2" />
                                                    Whatsapp
                                                </div>
                                                <div
                                                    onClick={() => handleShare('gmail')}
                                                    className="relative flex cursor-default select-none items-center rounded px-2 py-1.5 hover:bg-neutral-100 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                >
                                                    <FontAwesomeIcon icon={faEnvelope} className="hover:text-black mr-2" />
                                                    Gmail
                                                </div>
                                                <div
                                                    onClick={() => handleShare('xtwitter')}
                                                    className="relative flex cursor-default select-none items-center rounded px-2 py-1.5 hover:bg-neutral-100 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                >
                                                    <FontAwesomeIcon icon={faXTwitter} className="hover:text-black mr-2" />
                                                    Xtwitter
                                                </div>
                                                <div
                                                    onClick={() => handleShare('facebook')}
                                                    className="relative flex cursor-default select-none items-center rounded px-2 py-1.5 hover:bg-neutral-100 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                >
                                                    <FontAwesomeIcon icon={faFacebook} className="hover:text-black mr-2" />
                                                    Facebook
                                                </div>
                                                <div
                                                    onClick={() => handleShare('linkedin')}
                                                    className="relative flex cursor-default select-none items-center rounded px-2 py-1.5 hover:bg-neutral-100 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                >
                                                    <FontAwesomeIcon icon={faLinkedin} className="hover:text-black mr-2" />
                                                    Linkedin
                                                </div>
                                                <div
                                                    onClick={() => handleShare('telegram')}
                                                    className="relative flex cursor-default select-none items-center rounded px-2 py-1.5 hover:bg-neutral-100 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                >
                                                    <FontAwesomeIcon icon={faTelegram} className="hover:text-black mr-2" />
                                                    Telegram
                                                </div>
                                                <div
                                                    onClick={() => handleShare('slack')}
                                                    className="relative flex cursor-default select-none items-center rounded px-2 py-1.5 hover:bg-neutral-100 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                >
                                                    <FontAwesomeIcon icon={faSlack} className="hover:text-black mr-2" />
                                                    Salck
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-px my-1 -mx-1 bg-neutral-200"></div>

                                    <div x-data="{ showFullUrl: false }" className="relative flex cursor-default select-none items-center rounded py-1.5 pl-8 pr-2 hover:bg-neutral-100 outline-none data-[disabled]:opacity-50">
                                        <span x-show="showFullUrl" className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </span>
                                        <span className="data-disabled">Mostrar recordatorios</span>
                                    </div>
                                    <div className="h-px my-1 -mx-1 bg-neutral-200"></div>
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
                    <motion.a
                        href={url}
                        target="_blank"
                        className="text-gray-300 text-base mr-2"
                        whileHover={{ scale: 1.3 }}
                        whileTap={{
                            scale: 1.3,
                            rotate: -90,
                            borderRadius: '100%',
                        }}
                    >
                        <FontAwesomeIcon icon={faLink} className="hover:text-gray-400" />
                    </motion.a>
                    <motion.a
                        href="#"
                        className="text-gray-300 text-base mr-2"
                        whileHover={{ scale: 1.3 }}
                        whileTap={{
                            scale: 1.3,
                            rotate: -90,
                            borderRadius: '100%',
                        }}
                        onClick={toggleFavorite}
                    >
                        <FontAwesomeIcon icon={isFavorite ? solidStar : regularStar} className="text-yellow-400" />
                    </motion.a>
                    <motion.a
                        href="#"
                        className="text-gray-300 text-base mr-2"
                        onClick={(e) => {
                            e.preventDefault();
                            setShowColorPicker(!showColorPicker);
                        }}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{
                            scale: 1.3,
                            rotate: -90,
                            borderRadius: '100%',
                        }}
                    >
                        <FontAwesomeIcon icon={faPalette} />
                    </motion.a>
                    <motion.a
                        href="#"
                        className="text-gray-300 text-base mr-2"
                        whileHover={{ scale: 1.3 }}
                        whileTap={{
                            scale: 1.3,
                            rotate: -90,
                            borderRadius: '100%',
                        }}
                        onClick={() => onUpdate()}
                    >
                        <FontAwesomeIcon icon={faPen} />
                    </motion.a>
                    <motion.a
                        href="#"
                        className="text-gray-300 text-base mr-2"
                        whileHover={{ scale: 1.3 }}
                        whileTap={{
                            scale: 1.3,
                            rotate: -90,
                            borderRadius: '100%',
                        }}
                        onClick={() => onDelete(id)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </motion.a>
                </div>
            </div>
            {showColorPicker && (
                <div
                    className="circlesColor absolute left-0 z-10 flex items-center justify-center w-full h-[50px]" // Agrega h-50px para establecer la altura
                    style={{ top: 'calc(100%)' }} // Posiciona 10px por debajo de la tarjeta
                >
                    <div className="w-full h-[50px] absolute bg-gray-100 opacity-80 rounded-md"></div> {/* Fondo detrás del CirclePicker */}
                    <CirclePicker
                        color={selectedColor}
                        onChange={handleColorChange}
                        colors={['#1F2937', '#056827', '#0B4667', '#CF1142', '#1A1A1A', '#8b12a3']}
                        circleSize={24}
                        circleSpacing={14}
                        styles={{
                            default: {
                                circle: {
                                    border: '2px solid white',
                                    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
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
