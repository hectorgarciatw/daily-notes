import React, { useState, useEffect } from 'react';
// Configuración de Firebase
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, query, where, addDoc, updateDoc } from 'firebase/firestore';
// Spinner de carga de Clips
import ClipLoader from 'react-spinners/ClipLoader';

// Importación de componentes
import Card from './Card';
import Empty from './Empty';
import AddClipForm from './AddClipForm';
import DeleteModal from './DeleteModal';
import UpdateModal from './UpdateModal';

// Importa el hook useClips para establecer el arreglo clips de manera global
import { useClips } from './ClipsContext';

// Iconos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// Manipulación de Toasts
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Content({ email, calendarAccessToken }) {
    // Manejo de los Clips obtenidos de la DB
    const [clips, setClips] = useState([]);
    // Estado del Spinner
    const [loading, setLoading] = useState(true);
    // Estado del modal de eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clipToDelete, setClipToDelete] = useState(null);
    // Estado del modal de modificación
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [clipToUpdate, setClipToUpdate] = useState(null);

    // Manejo el estado del término de búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // Usamos el hook useClips para acceder al arreglo de clips
    const { setClips: setGlobalClips } = useClips();

    useEffect(() => {
        // Obtenemos los clips del usuario desde Firebase
        const fetchClips = async () => {
            try {
                if (!email) {
                    console.error('Error: Email is undefined');
                    return;
                }
                const clipsCollection = collection(db, 'clips');
                const q = query(clipsCollection, where('email', '==', email));
                const clipsSnapshot = await getDocs(q);
                const clipsData = clipsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setClips(clipsData);
                // Actualiza el estado global de los clips
                setGlobalClips(clipsData);
            } catch (error) {
                console.error('Error fetching clips: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClips();
    }, [email, setGlobalClips]);

    // Modal de elimanción de un Clip
    const openDeleteModal = (id) => {
        setClipToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setClipToDelete(null);
    };

    // Modal de modificación de un Clip
    const openUpdateModal = (clip) => {
        setClipToUpdate(clip);
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setClipToUpdate(null);
    };

    // Lógica de creación de un Clip
    const createClip = async (clipData) => {
        try {
            const docRef = await addDoc(collection(db, 'clips'), {
                ...clipData,
                email: clipData.email,
                released: '23-04-2024',
            });
            setClips([...clips, { id: docRef.id, ...clipData, released: false }]);
            toast('✔️ Clip creado con éxito');
        } catch (error) {
            console.error('Error creating clip: ', error);
            toast.error('Error en la creación del Clip');
        }
    };

    // Lógica de eliminación de un Clip
    const confirmDelete = async () => {
        if (clipToDelete) {
            try {
                await deleteDoc(doc(db, 'clips', clipToDelete));
                setClips(clips.filter((clip) => clip.id !== clipToDelete));
                toast('✔️ Clip eliminado con éxito');
            } catch (error) {
                console.error('Error deleting clip: ', error);
                toast.error('Error al eliminar el Clip');
            } finally {
                closeDeleteModal();
            }
        }
    };

    // Lógica de modificación de un Clip
    const updateClip = async (id, updatedData) => {
        try {
            const clipRef = doc(db, 'clips', id);
            await updateDoc(clipRef, updatedData);
            setClips(clips.map((clip) => (clip.id === id ? { id, ...updatedData } : clip)));
            toast('✔️ Clip actualizado con éxito');
        } catch (error) {
            console.error('Error updating clip: ', error);
            toast.error('Error al actualizar el Clip');
        } finally {
            closeUpdateModal();
        }
    };

    // Lista de Clips que cumplen el criterio de búsqueda
    const filteredClips = clips.filter((clip) => clip.title.toLowerCase().includes(searchTerm.toLowerCase()) || clip.type.toLowerCase().includes(searchTerm.toLowerCase()) || clip.content.toLowerCase().includes(searchTerm.toLowerCase()));

    // Spinner de la precarga de Clips en el Dashboard
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader color={'#123abc'} loading={loading} size={150} />
            </div>
        );
    }

    return (
        <section className="text-gray-600 body-font md:px-10 lg:px-30 xl:px-40">
            {clips.length === 0 ? (
                <>
                    {/* Componente del formulario para agregar un nuevo Clip */}
                    <AddClipForm mt={'mt-[1rem]'} mb={'mb-[-1rem]'} width={'w-1/2'} email={email} createClip={createClip} />
                    <Empty />
                </>
            ) : (
                <div className="container px-5 py-5 mx-auto">
                    <AddClipForm mt={'mt-[0.5rem]'} mb={'mb-5'} width={'w-full'} email={email} createClip={createClip} />
                    <div className="relative mb-8">
                        {/* Buscador de Clips */}
                        <input
                            type="text"
                            placeholder="Filtrar en los clips almacenados..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded-md"
                            style={{ paddingRight: '2.5rem' }} // Ajuste para dar espacio al ícono
                        />
                        {/* Icono de lupa dentro del input de la búsqueda/filtro */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 gap-y-12">
                        {/* Renderizando las cards correspondientes a los Clips obtenidos */}
                        {filteredClips.length > 0 ? (
                            filteredClips.map((clip) => (
                                <div key={clip.id} className="mb-8">
                                    <Card
                                        id={clip.id}
                                        title={clip.title}
                                        type={clip.type}
                                        content={clip.content}
                                        priority={clip.priority}
                                        url={clip.url}
                                        released={clip.released}
                                        color={clip.color}
                                        calendarAccessToken={calendarAccessToken}
                                        onDelete={openDeleteModal}
                                        onUpdate={() => openUpdateModal(clip)}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-white">No se encontraron clips relacionados</p>
                        )}
                    </div>
                </div>
            )}
            <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={confirmDelete} />
            <UpdateModal isOpen={isUpdateModalOpen} onClose={closeUpdateModal} onUpdate={updateClip} clip={clipToUpdate} />
            {/* Componente asociado al manejador de Toast */}
            <ToastContainer autoClose={1500} theme="dark" />
        </section>
    );
}

export default Content;
