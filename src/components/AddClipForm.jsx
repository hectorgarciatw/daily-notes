import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const AddClipForm = ({ width, mt, mb, email, createClip }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('Ocasional');
    const [type, setType] = useState('');
    const [url, setUrl] = useState('');

    const [expanded, setExpanded] = useState(false);

    // El estado del formulario (visible o no)
    const toggleForm = () => {
        setExpanded(!expanded);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title && content && priority && type && url && email) {
            const newClip = {
                title,
                content,
                priority,
                type,
                url,
                email,
            };

            console.log('Creating new clip with data:', newClip); // Log para verificar datos

            await createClip(newClip);

            setTitle('');
            setContent('');
            setPriority('');
            setType('');
            setUrl('');
            setExpanded(false);
        } else {
            console.log('Please fill all fields');
        }
    };

    return (
        <div className={`bg-gray-800 flex flex-col items-start ${mt} ${mb} ${width} mx-auto`}>
            <div className="w-full mb-4">
                <input readOnly={true} onClick={toggleForm} type="text" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors duration-300" placeholder="➕ Añadir un nuevo clip ..." />
            </div>
            {expanded && (
                <form onSubmit={handleSubmit} className="container flex flex-col mx-auto space-y-12">
                    <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-50">
                        <div className="space-y-2 col-span-full lg:col-span-1">
                            <p className="font-medium">Creación de clip</p>
                            <p className="text-xs">Complete los campos del siguiente formulario para crear un nuevo clip</p>
                        </div>
                        <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
                            <div className="col-span-full sm:col-span-3">
                                <label htmlFor="title" className="text-sm">
                                    Título
                                </label>
                                <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full rounded-md focus:border-gray-500 dark:text-gray-500  dark:border-gray-300" />
                            </div>
                            <div className="col-span-full ">
                                <label htmlFor="title" className="text-sm">
                                    Contenido
                                </label>
                                <textarea
                                    id="Contenido"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
                                    placeholder="Ingrese la descripción aquí"
                                ></textarea>
                            </div>
                            <div className="col-span-full  relative">
                                <label htmlFor="priority" className="text-sm">
                                    Prioridad
                                </label>
                                <div className="relative">
                                    <select
                                        id="priority"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 text-sm py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    >
                                        <option value="Ocasional">Ocasional</option>
                                        <option value="Importante">Importante</option>
                                        <option value="Urgente">Urgente</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <FontAwesomeIcon icon={faChevronDown} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full sm:col-span-3">
                                <label htmlFor="title" className="text-sm">
                                    Tipo
                                </label>
                                <input id="type" type="text" value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-md focus:border-gray-500 dark:text-gray-500 dark:border-gray-300" />
                            </div>
                            <div className="col-span-full sm:col-span-3">
                                <label htmlFor="title" className="text-sm">
                                    URL (enlace externo opcional)
                                </label>
                                <input id="url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-md focus:border-gray-500 dark:text-gray-500 dark:border-gray-300" />
                            </div>

                            <div className="col-span-full">
                                <button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Crear Clip
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </form>
            )}
        </div>
    );
};

export default AddClipForm;
