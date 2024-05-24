import React from "react";

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="modal-content bg-white p-6 rounded-md shadow-md">
                <h2 className="text-lg font-semibold mb-4">Confirmar Eliminación</h2>
                <p className="mb-4">¿Estás seguro de que deseas eliminar esta nota?</p>
                <div className="flex justify-end">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md mr-2" onClick={onConfirm}>
                        Sí, eliminar
                    </button>
                    <button className="bg-gray-300 text-black px-4 py-2 rounded-md" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
