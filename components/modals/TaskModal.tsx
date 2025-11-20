import React, { useState, useEffect } from 'react';
import { Task, Contact, Project } from '../../types';
import Modal from './Modal';
import { TrashIcon } from '../icons';

type TaskFormData = Omit<Task, 'id' | 'status'> & { id?: number };

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (taskData: TaskFormData) => void;
    task: Task | null;
    contacts: Contact[];
    projects: Project[];
    onDelete: (task: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task, contacts, projects, onDelete }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Task['priority']>('Medium');
    const [assignee, setAssignee] = useState('');
    const [projectId, setProjectId] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [deadline, setDeadline] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // This effect should only run when the modal is opened for a specific task (or a new one).
        // It initializes the form state. We disable exhaustive-deps because `projects` and `contacts`
        // are only needed for initialization and their changing references cause unwanted resets.
        if (isOpen) {
            const availableProjects = projects.filter(p => p.status !== 'Completed');
            if(task) {
                setTitle(task.title);
                setPriority(task.priority);
                setAssignee(task.assignee);
                setProjectId(String(task.projectId) || '');
                setStartDate(task.startDate || '');
                setDeadline(task.deadline || '');
                setProgress(task.progress || 0);
            } else {
                setTitle('');
                setPriority('Medium');
                setAssignee(contacts[0]?.initials || '');
                setProjectId(String(availableProjects[0]?.id) || '');
                setStartDate('');
                setDeadline('');
                setProgress(0);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task, isOpen]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title || !projectId || !startDate || !deadline) return;
        onSave({ ...task, title, priority, assignee, projectId: Number(projectId), startDate, deadline, progress: Number(progress) });
        onClose();
    };

    const availableProjects = projects.filter(p => p.status !== 'Completed');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={task ? "Edit Task" : "Add New Task"}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label htmlFor="t-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
                        <input type="text" id="t-title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="e.g., Deploy to production"/>
                    </div>
                    <div>
                        <label htmlFor="t-project" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
                        <select id="t-project" value={projectId} onChange={(e) => setProjectId(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                            <option value="" disabled>Select a project</option>
                            {availableProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="t-startdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                           <input type="date" id="t-startdate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                        </div>
                        <div>
                           <label htmlFor="t-deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                           <input type="date" id="t-deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                      <label htmlFor="t-progress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Progress ({progress}%)</label>
                      <input type="range" id="t-progress" value={progress} min="0" max="100" onChange={(e) => setProgress(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="t-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                            <select id="t-priority" value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="t-assignee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignee</label>
                             <select id="t-assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                                {contacts.map(c => <option key={c.id} value={c.initials}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                 <div className="mt-6 flex justify-between items-center pt-4 border-t dark:border-gray-700">
                    {task ? (
                        <button
                            type="button"
                            onClick={() => onDelete(task)}
                            className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 font-medium px-4 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/50"
                            title="Delete Task"
                        >
                            <div className="flex items-center gap-2">
                                <TrashIcon className="w-4 h-4" />
                                <span>Delete</span>
                            </div>
                        </button>
                    ) : <div></div>}
                    <div className="flex gap-3 ml-auto">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900">Save Task</button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
export default TaskModal;