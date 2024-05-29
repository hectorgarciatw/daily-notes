// src/components/Content.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, query, where, addDoc } from 'firebase/firestore';
import ClipLoader from 'react-spinners/ClipLoader';
import Card from './Card';
import Empty from './Empty';
import AddClipForm from './AddClipForm';
import DeleteModal from './DeleteModal';

function Content({ email }) {
    // Lista de clips obtenidos de Firebase
    const [clips, setClips] = useState([]);
    // Estado del spinner asociado a la carga de los clips
    const [loading, setLoading] = useState(true);
    // Estado para controlar la visibilidad del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para identificar el clip a eliminar
    const [clipToDelete, setClipToDelete] = useState(null);

    const [userEmail, setUserEmail] = useState(email);

    useEffect(() => {
        // Configura el estado userEmail cuando se renderiza el componente por primera vez
        setUserEmail(email);
    }, [email]); // El efecto se activa cuando cambia el email recibido

    useEffect(() => {
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
                    type: doc.data().type,
                    title: doc.data().title,
                    content: doc.data().content,
                    priority: doc.data().priority,
                    url: doc.data().url,
                    released: doc.data().released,
                }));
                setClips(clipsData);
            } catch (error) {
                console.error('Error fetching clips: ', error);
            } finally {
                // Desactivo el spinnner luego de obtener los clips
                setLoading(false);
            }
        };

        fetchClips();
    }, [userEmail]);

    const openModal = (id) => {
        setClipToDelete(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setClipToDelete(null);
    };

    const handleEmailChange = (newEmail) => {
        setUserEmail(newEmail);
    };

    const createClip = async (clipData) => {
        try {
            const docRef = await addDoc(collection(db, 'clips'), {
                title: clipData.title,
                content: clipData.content,
                priority: clipData.priority,
                type: clipData.type,
                url: clipData.url,
                email: clipData.email,
                released: '23-04-2024',
            });
            setClips([...clips, { id: docRef.id, ...clipData, released: false }]);
        } catch (error) {
            console.error('Error creating clip: ', error);
            console.log('Error creating clip: ' + error.message);
        }
    };

    const confirmDelete = async () => {
        if (clipToDelete) {
            try {
                await deleteDoc(doc(db, 'clips', clipToDelete));
                setClips(clips.filter((clip) => clip.id !== clipToDelete));
            } catch (error) {
                console.error('Error deleting clip: ', error);
            } finally {
                closeModal();
            }
        }
    };

    // Spinner asociado a la carga de los clips desde Firebase
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
                    <AddClipForm mt={'mt-[1rem]'} mb={'mb-[-1rem]'} width={'w-1/2'} email={email} createClip={createClip} />
                    <Empty />
                </>
            ) : (
                <div className="container px-5 py-5 mx-auto">
                    <AddClipForm mt={'mt-[0.5rem]'} mb={'mb-5'} width={'w-full'} email={email} createClip={createClip} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {clips.map((clip) => (
                            <div key={clip.id} className="mb-8">
                                <Card id={clip.id} title={clip.title} type={clip.type} content={clip.content} priority={clip.priority} url={clip.url} released={clip.released} onDelete={openModal} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <DeleteModal isOpen={isModalOpen} onClose={closeModal} onConfirm={confirmDelete} />
        </section>
    );
}

export default Content;
