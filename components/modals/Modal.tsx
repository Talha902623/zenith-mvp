
import React from 'react';
import { XIcon } from '../icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 pb-3 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
