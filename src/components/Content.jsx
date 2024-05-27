// src/components/Content.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";
import Card from "./Card";
import DeleteModal from "./DeleteModal";

function Content() {
    // Lista de clips obtenidos de Firebase
    const [clips, setClips] = useState([]);
    // Estado del spinner asociado a la carga de los clips
    const [loading, setLoading] = useState(true);
    // Estado para controlar la visibilidad del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para identificar el clip a eliminar
    const [clipToDelete, setClipToDelete] = useState(null);

    useEffect(() => {
        const fetchClips = async () => {
            try {
                const clipsCollection = collection(db, "clips");
                const clipsSnapshot = await getDocs(clipsCollection);
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
                console.error("Error fetching clips: ", error);
            } finally {
                // Desactivo el spinnner luego de obtener los clips
                setLoading(false);
            }
        };

        fetchClips();
    }, []);

    const openModal = (id) => {
        setClipToDelete(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setClipToDelete(null);
    };

    const confirmDelete = async () => {
        if (clipToDelete) {
            try {
                await deleteDoc(doc(db, "clips", clipToDelete));
                setClips(clips.filter((clip) => clip.id !== clipToDelete));
            } catch (error) {
                console.error("Error deleting clip: ", error);
            } finally {
                closeModal();
            }
        }
    };

    // Spinner asociado a la carga de los clips desde Firebase
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader color={"#123abc"} loading={loading} size={150} />
            </div>
        );
    }

    return (
        <section className="text-gray-600 body-font md:px-10 lg:px-30 xl:px-40">
            <div className="container px-5 py-24 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {clips.map((clip) => (
                        <div key={clip.id} className="mb-8">
                            <Card id={clip.id} title={clip.title} type={clip.type} content={clip.content} priority={clip.priority} url={clip.url} released={clip.released} onDelete={openModal} />
                        </div>
                    ))}
                </div>
            </div>
            <DeleteModal isOpen={isModalOpen} onClose={closeModal} onConfirm={confirmDelete} />
        </section>
    );
}

export default Content;
