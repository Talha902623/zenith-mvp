
import React from 'react';
import Modal from './Modal';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="text-sm text-gray-600 dark:text-gray-300">{children}</div>
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900">Cancel</button>
                <button type="button" onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900">Delete</button>
            </div>
        </Modal>
    )
};

export default ConfirmDeleteModal;
