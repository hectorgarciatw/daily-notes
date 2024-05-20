import React, { useState, useEffect } from 'react';
import Card from './Card';
import { db } from '../firebase';

function Content() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const notesCollection = await db.collection('nota').get();
                const notesData = notesCollection.docs.map((doc) => ({
                    id: doc.id,
                    title: doc.data().title,
                    // Agrega aquí más campos según tu estructura de datos
                }));
                setNotes(notesData);
            } catch (error) {
                console.error('Error fetching notes: ', error);
            }
        };

        fetchNotes();
    }, []);

    return (
        <section className="text-gray-600 body-font md:px-10 lg:px-30 xl:px-40">
            <div className="container px-5 py-24 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    {notes.map((note) => (
                        <div key={note.id} className="mb-8">
                            <Card title={note.title} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Content;
