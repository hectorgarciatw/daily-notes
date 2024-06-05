import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, query, where, addDoc, updateDoc } from 'firebase/firestore';
import ClipLoader from 'react-spinners/ClipLoader';
import Card from './Card';
import Empty from './Empty';
import AddClipForm from './AddClipForm';
import DeleteModal from './DeleteModal';
import UpdateModal from './UpdateModal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Content({ email }) {
    const [clips, setClips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clipToDelete, setClipToDelete] = useState(null);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [clipToUpdate, setClipToUpdate] = useState(null);

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
                    ...doc.data(),
                }));
                setClips(clipsData);
            } catch (error) {
                console.error('Error fetching clips: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClips();
    }, [email]);

    const openDeleteModal = (id) => {
        setClipToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setClipToDelete(null);
    };

    const openUpdateModal = (clip) => {
        setClipToUpdate(clip);
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setClipToUpdate(null);
    };

    const createClip = async (clipData) => {
        try {
            const docRef = await addDoc(collection(db, 'clips'), {
                ...clipData,
                email: clipData.email,
                released: '23-04-2024',
            });
            setClips([...clips, { id: docRef.id, ...clipData, released: false }]);
        } catch (error) {
            console.error('Error creating clip: ', error);
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
                closeDeleteModal();
            }
        }
    };

    const updateClip = async (id, updatedData) => {
        try {
            const clipRef = doc(db, 'clips', id);
            await updateDoc(clipRef, updatedData);
            setClips(clips.map((clip) => (clip.id === id ? { id, ...updatedData } : clip)));
            toast('✔️ Tarjeta actualizada con éxito');
        } catch (error) {
            console.error('Error updating clip: ', error);
            toast.error('Error al actualizar la tarjeta');
        } finally {
            closeUpdateModal();
        }
    };

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
                                <Card id={clip.id} title={clip.title} type={clip.type} content={clip.content} priority={clip.priority} url={clip.url} released={clip.released} onDelete={openDeleteModal} onUpdate={() => openUpdateModal(clip)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={confirmDelete} />
            <UpdateModal isOpen={isUpdateModalOpen} onClose={closeUpdateModal} onUpdate={updateClip} clip={clipToUpdate} />
            <ToastContainer autoClose={1500} theme="dark" />
        </section>
    );
}

export default Content;
