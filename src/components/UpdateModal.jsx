// src/components/UpdateModal.js
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UpdateModal = ({ isOpen, onClose, onUpdate, clip }) => {
    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
            priority: '',
            type: '',
            url: '',
            released: '',
            email: '',
        },
        // Validaciones de los campos
        validationSchema: Yup.object({
            title: Yup.string().min(5, 'Debe contener al menos 5 caracteres').max(25, 'Debe contener menos de  25 caracteres').required('El título es requerido'),
            content: Yup.string().min(10, 'Debe contener al menos 10 caracteres').max(150, 'Debe contener menos de  150 caracteres').required('El contenido es requerido'),
            type: Yup.string().min(5, 'Debe contener al menos 5 caracteres').max(25, 'Debe contener menos de  25 caracteres').required('El tipo es requerido'),
            url: Yup.string().max(80, 'Debe contener menos de  80 caracteres').url('Ingrese una URL válida').nullable(),
        }),
        onSubmit: (values) => {
            onUpdate(clip.id, values);
        },
    });

    useEffect(() => {
        if (clip) {
            // Valores actuales de los campos del Form
            formik.setValues({
                title: clip.title,
                content: clip.content,
                priority: clip.priority,
                type: clip.type,
                url: clip.url,
                released: clip.released,
                email: clip.email,
            });
        }
    }, [clip]);

    if (!isOpen) return null;

    return (
        <div className="relative flex justify-center">
            <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
                        &#8203;
                    </span>

                    <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                        <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">
                            Edición de Clip
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Modifique los campos deseados y luego proceda a Actualizar.</p>

                        <form className="mt-4" onSubmit={formik.handleSubmit}>
                            <label htmlFor="title" className="text-sm text-gray-700 dark:text-gray-200">
                                Título
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                placeholder=""
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`block w-full px-4 py-3 text-sm text-gray-700 bg-white border ${
                                    formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-gray-200'
                                } rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300`}
                            />
                            {formik.touched.title && formik.errors.title ? <div className="text-red-500 text-sm">{formik.errors.title}</div> : null}

                            <label htmlFor="content" className="text-sm text-gray-700 dark:text-gray-200 mt-3">
                                Contenido
                            </label>
                            <input
                                type="text"
                                name="content"
                                id="content"
                                placeholder=""
                                value={formik.values.content}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`block w-full px-4 py-3 text-sm text-gray-700 bg-white border ${
                                    formik.touched.content && formik.errors.content ? 'border-red-500' : 'border-gray-200'
                                } rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300`}
                            />
                            {formik.touched.content && formik.errors.content ? <div className="text-red-500 text-sm">{formik.errors.content}</div> : null}

                            <label htmlFor="priority" className="text-sm text-gray-700 dark:text-gray-200 mt-3">
                                Prioridad
                            </label>
                            <input
                                type="text"
                                name="priority"
                                id="priority"
                                placeholder=""
                                value={formik.values.priority}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`block w-full px-4 py-3 text-sm text-gray-700 bg-white border ${
                                    formik.touched.priority && formik.errors.priority ? 'border-red-500' : 'border-gray-200'
                                } rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300`}
                            />
                            {formik.touched.priority && formik.errors.priority ? <div className="text-red-500 text-sm">{formik.errors.priority}</div> : null}

                            <label htmlFor="type" className="text-sm text-gray-700 dark:text-gray-200 mt-3">
                                Tipo
                            </label>
                            <input
                                type="text"
                                name="type"
                                id="type"
                                placeholder=""
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`block w-full px-4 py-3 text-sm text-gray-700 bg-white border ${
                                    formik.touched.type && formik.errors.type ? 'border-red-500' : 'border-gray-200'
                                } rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300`}
                            />
                            {formik.touched.type && formik.errors.type ? <div className="text-red-500 text-sm">{formik.errors.type}</div> : null}

                            <label htmlFor="url" className="text-sm text-gray-700 dark:text-gray-200 mt-3">
                                URL
                            </label>
                            <input
                                type="text"
                                name="url"
                                id="url"
                                placeholder=""
                                value={formik.values.url}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`block w-full px-4 py-3 text-sm text-gray-700 bg-white border ${
                                    formik.touched.url && formik.errors.url ? 'border-red-500' : 'border-gray-200'
                                } rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300`}
                            />
                            {formik.touched.url && formik.errors.url ? <div className="text-red-500 text-sm">{formik.errors.url}</div> : null}

                            <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
