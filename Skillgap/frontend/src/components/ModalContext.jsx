import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [modal, setModal] = useState({ isOpen: false, content: null });

    const openModal = (content) => setModal({ isOpen: true, content });
    const closeModal = () => setModal({ isOpen: false, content: null });

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {modal.isOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>&times;</button>
                        {modal.content}
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}

export const useModal = () => useContext(ModalContext);
