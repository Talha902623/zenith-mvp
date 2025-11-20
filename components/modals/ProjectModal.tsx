import React, { useState, useEffect } from 'react';
import { Project, Contact, ProjectStatus } from '../../types';
import Modal from './Modal';

type ProjectFormData = Omit<Project, 'id'> & { id?: number; tasks?: string };

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: ProjectFormData) => void;
  project: Project | null;
  contacts: Contact[];
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, project, contacts }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [taskInput, setTaskInput] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number[]>([]);

  useEffect(() => {
    // This effect initializes the form state when the modal is opened for a specific project.
    // We disable exhaustive-deps because we only want this to run when the `project` or `isOpen` props change,
    // not when parent re-renders pass new array references for `contacts`.
    if (isOpen) {
        if (project) {
          setTitle(project.title);
          setDescription(project.description);
          setStartDate(project.startDate);
          setDeadline(project.deadline);
          setStatus(project.status);
          setSelectedTeam(project.team || []);
          setTaskInput('');
        } else {
          setTitle('');
          setDescription('');
          setStartDate('');
          setDeadline('');
          setStatus('In Progress');
          setTaskInput('');
          setSelectedTeam([]);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, isOpen]);
  
  const handleTeamSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const value: number[] = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(Number(options[i].value));
      }
    }
    setSelectedTeam(value);
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !startDate || !deadline) return;
    onSave({ 
        ...project, 
        title, 
        description, 
        startDate,
        deadline, 
        status, 
        team: selectedTeam,
        tasks: taskInput 
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? 'Edit Project' : 'Add New Project'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label htmlFor="p-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title</label>
            <input type="text" id="p-title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="p-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea id="p-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"></textarea>
          </div>
          <div>
             <label htmlFor="p-team" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Team</label>
             <select id="p-team" multiple value={selectedTeam.map(String)} onChange={handleTeamSelect} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm h-24">
                 {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
             </select>
          </div>
          {!project && (
            <div>
              <label htmlFor="p-tasks" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Tasks</label>
              <textarea id="p-tasks" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="Enter tasks one per line."></textarea>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="p-startdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input type="date" id="p-startdate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="p-deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
              <input type="date" id="p-deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
            </div>
          </div>
         
          {project && (
             <div>
                <label htmlFor="p-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select id="p-status" value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                    <option>In Progress</option>
                    <option>On Hold</option>
                    <option>Completed</option>
                </select>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900">Cancel</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900">Save Project</button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;