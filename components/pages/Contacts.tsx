import React, { useRef } from 'react';
import { Contact } from '../../types';
import { EditIcon, TrashIcon, UploadCloudIcon, DownloadCloudIcon, FileTextIcon } from '../icons';
import { jsonToCsv, downloadCsv } from '../../utils/csv';

interface ContactsPageProps {
    contacts: Contact[];
    onEdit: (contact: Contact) => void;
    onDelete: (contact: Contact) => void;
    onImport: (type: 'contacts', csvString: string) => void;
}

const ContactsPage: React.FC<ContactsPageProps> = ({ contacts, onEdit, onDelete, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getStatusClass = (status: Contact['status']) => {
        switch (status) {
          case 'Customer': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
          case 'Lead': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
          case 'Contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
          case 'Lost': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };
    
    const handleExport = () => {
        const csvString = jsonToCsv(contacts);
        downloadCsv(csvString, 'contacts.csv');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    onImport('contacts', text);
                }
            };
            reader.readAsText(file);
        }
        // Reset file input value to allow re-uploading the same file
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDownloadTemplate = () => {
        const templateData = [{
            id: 1, name: 'John Doe', initials: 'JD', email: 'john.doe@example.com',
            company: 'Example Inc.', status: 'Lead', phone: '555-0199'
        }];
        const csvString = jsonToCsv(templateData);
        downloadCsv(csvString, 'contacts_template.csv');
    };

  return (
     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h3 className="text-lg font-semibold">Contacts</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your customer relationships and leads.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                <button onClick={handleImportClick} title="Import from CSV" className="p-2 text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"><UploadCloudIcon className="w-5 h-5"/></button>
                <button onClick={handleExport} title="Export to CSV" className="p-2 text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"><DownloadCloudIcon className="w-5 h-5"/></button>
                <button onClick={handleDownloadTemplate} title="Download Template" className="p-2 text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"><FileTextIcon className="w-5 h-5"/></button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Company</th>
                        <th scope="col" className="px-6 py-3">Phone</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => (
                        <tr key={contact.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-200 text-blue-700 font-bold text-sm">
                                        {contact.initials}
                                     </div>
                                    <div>
                                        <div className="font-semibold">{contact.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{contact.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{contact.company}</td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{contact.phone}</td>
                             <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(contact.status)}`}>
                                    {contact.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onEdit(contact)} className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 p-1 rounded-md"><EditIcon className="w-4 h-4" /></button>
                                    <button onClick={() => onDelete(contact)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-md"><TrashIcon className="w-4 h-4" /></button>

                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
export default ContactsPage;