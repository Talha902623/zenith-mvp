import React, { useState, useEffect } from 'react';
import { Contact } from '../../types';
import Modal from './Modal';

type ContactFormData = Omit<Contact, 'id' | 'initials'> & { id?: number };

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (contactData: ContactFormData) => void;
    contact: Contact | null;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, contact }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<Contact['status']>('Lead');

    useEffect(() => {
        if(contact) {
            setName(contact.name);
            setEmail(contact.email);
            setCompany(contact.company);
            setPhone(contact.phone || '');
            setStatus(contact.status);
        } else {
            setName(''); setEmail(''); setCompany(''); setPhone(''); setStatus('Lead');
        }
    }, [contact, isOpen]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !email) return;
        onSave({ ...contact, name, email, company, phone, status });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={contact ? 'Edit Contact' : 'Add New Contact'}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="c-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input type="text" id="c-name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="c-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input type="email" id="c-email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="c-company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                        <input type="text" id="c-company" value={company} onChange={(e) => setCompany(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="c-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                        <input type="tel" id="c-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"/>
                    </div>
                     <div>
                        <label htmlFor="c-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select id="c-status" value={status} onChange={(e) => setStatus(e.target.value as Contact['status'])} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                            <option>Lead</option>
                            <option>Contacted</option>
                            <option>Customer</option>
                            <option>Lost</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900">Save Contact</button>
                </div>
            </form>
        </Modal>
    );
};

export default ContactModal;