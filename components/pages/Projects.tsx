import React, { useRef } from 'react';
import { Project, Contact } from '../../types';
import { EditIcon, TrashIcon, UploadCloudIcon, DownloadCloudIcon, FileTextIcon } from '../icons';
import { jsonToCsv, downloadCsv } from '../../utils/csv';

interface ProjectsPageProps {
  projects: Project[];
  contacts: Contact[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onImport: (type: 'projects', csvString: string) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, contacts, onEdit, onDelete, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStatusClass = (status: Project['status']) => {
    switch (status) {
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'On Hold': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const getTeamMembers = (teamIds: number[]) => {
      if(!teamIds) return [];
      return teamIds.map(id => contacts.find(c => c.id === id)).filter(Boolean);
  }

  const handleExport = () => {
    const dataToExport = projects.map(p => {
        const teamMembers = p.team.map(id => contacts.find(c => c.id === id)?.name).filter(Boolean).join('; ');
        return {
            id: p.id,
            projectName: p.title,
            description: p.description,
            status: p.status,
            startDate: p.startDate,
            deadline: p.deadline,
            teamMembers,
            progress: p.progress || 0,
        };
    });
    const csvString = jsonToCsv(dataToExport);
    downloadCsv(csvString, 'projects.csv');
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
                  onImport('projects', text);
              }
          };
          reader.readAsText(file);
      }
      // Reset file input
      if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadTemplate = () => {
    const templateData = [{
      id: 1, title: 'Sample Project', description: 'A brief description', status: 'In Progress',
      startDate: '2025-01-01', deadline: '2025-12-31', team: '1,2'
    }];
    const csvString = jsonToCsv(templateData);
    downloadCsv(csvString, 'projects_template.csv');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h3 className="text-lg font-semibold">All Projects</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and manage all your ongoing and completed projects.</p>
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
                        <th scope="col" className="px-6 py-3">Project Name</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Team</th>
                        <th scope="col" className="px-6 py-3">Progress</th>
                        <th scope="col" className="px-6 py-3">Deadline</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => {
                       const teamMembers = getTeamMembers(project.team);
                       return (
                        <tr key={project.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                <p>{project.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-1 max-w-xs truncate">{project.description}</p>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(project.status)}`}>
                                    {project.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex -space-x-2">
                                    {teamMembers.map((member) => (
                                        <div key={member.id} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center bg-purple-200 text-purple-700 font-bold text-xs" title={member.name}>
                                            {member.initials}
                                        </div>
                                    ))}
                                     {project.team.length > teamMembers.length && (
                                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-xs" title="Unknown user">?</div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${project.progress || 0}%` }}></div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{project.progress || 0}%</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{project.deadline}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onEdit(project)} className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 p-1 rounded-md"><EditIcon className="w-4 h-4" /></button>
                                    <button onClick={() => onDelete(project)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-md"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                            </td>
                        </tr>
                       )}
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ProjectsPage;