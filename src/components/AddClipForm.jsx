import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
// Manipulación del Form
import { Formik, Form, Field, ErrorMessage } from 'formik';

// Manejo de esquema de validación
import * as Yup from 'yup';

// Sanitización de los contenidos del Form
import DOMPurify from 'dompurify';

const AddClipForm = ({ width, mt, mb, email, createClip }) => {
    const initialValues = {
        title: '',
        content: '',
        priority: 'Ocasional',
        type: '',
        url: '',
    };

    // Definición de las validaciones
    const validationSchema = Yup.object().shape({
        title: Yup.string().min(5, 'Debe contener al menos 5 caracteres').max(25, 'Debe contener menos de  25 caracteres').required('El título es requerido'),
        content: Yup.string().min(10, 'Debe contener al menos 10 caracteres').max(150, 'Debe contener menos de  150 caracteres').required('El contenido es requerido'),
        type: Yup.string().min(5, 'Debe contener al menos 5 caracteres').max(25, 'Debe contener menos de  25 caracteres').required('El tipo es requerido'),
        url: Yup.string().max(80, 'Debe contener menos de  80 caracteres').url('Ingrese una URL válida').nullable(),
    });

    const [expanded, setExpanded] = useState(false);

    const toggleForm = () => {
        setExpanded(!expanded);
    };

    // Envío de los datos para realizar consulta de inserción en Firebase
    const onSubmit = async (values, { resetForm }) => {
        // Antes de enviar el contenido, sanitizo el contenido usando DOMPurify
        const sanitizedContent = DOMPurify.sanitize(values.content);
        const newClip = {
            ...values,
            email,
            content: sanitizedContent,
        };

        await createClip(newClip);

        resetForm();
        // Oculto el form
        setExpanded(false);
    };

    return (
        <div className={` flex flex-col items-start ${mt} ${mb} ${width} mx-auto`}>
            <div className="w-full mb-4">
                <button onClick={toggleForm} className="w-full p-3 text-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-colors duration-300">
                    ➕ Añadir un nuevo clip ...
                </button>
            </div>
            {expanded && (
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {({ isSubmitting }) => (
                        <Form className="container flex flex-col mx-auto space-y-12">
                            <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm dark:bg-gray-50">
                                <div className="space-y-2 col-span-full lg:col-span-1">
                                    <p className="font-medium">Creación de clip</p>
                                    <p className="text-xs">Complete los campos del siguiente formulario para crear un nuevo clip</p>
                                </div>
                                <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
                                    <div className="col-span-full">
                                        <label htmlFor="title" className="text-sm">
                                            Título <span className="text-red-500">*</span>
                                        </label>
                                        <Field name="title" type="text" className="w-full rounded-md focus:border-gray-500 dark:text-gray-500  dark:border-gray-300" />
                                        <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div className="col-span-full">
                                        <label htmlFor="content" className="text-sm">
                                            Contenido <span className="text-red-500">*</span>
                                        </label>
                                        <Field name="content" as="textarea" className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500" placeholder="Ingrese la descripción aquí" />
                                        <ErrorMessage name="content" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div className="col-span-full relative">
                                        <label htmlFor="priority" className="text-sm">
                                            Prioridad <span className="text-red-500">*</span>
                                        </label>
                                        <Field
                                            name="priority"
                                            as="select"
                                            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 text-sm py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        >
                                            <option value="Ocasional">Ocasional</option>
                                            <option value="Importante">Importante</option>
                                            <option value="Urgente">Urgente</option>
                                        </Field>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <FontAwesomeIcon icon={faChevronDown} />
                                        </div>
                                    </div>
                                    <div className="col-span-full sm:col-span-3">
                                        <label htmlFor="type" className="text-sm">
                                            Tipo <span className="text-red-500">*</span>
                                        </label>
                                        <Field name="type" type="text" className="w-full rounded-md focus:border-gray-500 dark:text-gray-500 dark:border-gray-300" />
                                        <ErrorMessage name="type" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div className="col-span-full sm:col-span-3">
                                        <label htmlFor="url" className="text-sm">
                                            URL (enlace externo opcional)
                                        </label>
                                        <Field name="url" type="text" className="w-full rounded-md focus:border-gray-500 dark:text-gray-500 dark:border-gray-300" />
                                        <ErrorMessage name="url" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div className="col-span-full flex justify-between">
                                        <button type="button" onClick={toggleForm} className="w-1/2 mr-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                            Cancelar
                                        </button>
                                        <button type="submit" disabled={isSubmitting} className="w-1/2 ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                            {isSubmitting ? 'Creando clip...' : 'Crear Clip'}
                                        </button>
                                    </div>
                                </div>
                            </fieldset>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default AddClipForm;
