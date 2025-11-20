
import React, { useState, useRef } from 'react';
import { Task, Contact, Project, TaskStatus } from '../../types';
import { jsonToCsv, downloadCsv } from '../../utils/csv';
import { UploadCloudIcon, DownloadCloudIcon, FileTextIcon } from '../icons';

interface KanbanBoardProps {
  tasks: Task[];
  contacts: Contact[];
  projects: Project[];
  updateTasks: (tasks: Task[], changedTask: Task, oldStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onImport: (type: 'tasks', csvString: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, contacts, projects, updateTasks, onEditTask, onImport }) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOverTask, setDraggedOverTask] = useState<Task | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const columns: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>, targetTask: Task) => {
    e.stopPropagation();
    if (draggedTask && draggedTask.id !== targetTask.id) {
        setDraggedOverTask(targetTask);
    }
  };

  const onDragEnd = () => {
    setDraggedTask(null);
    setDraggedOverTask(null);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === newStatus) {
        onDragEnd();
        return;
    }

    const oldStatus = draggedTask.status;
    let newTasks = [...tasks];
    
    const fromIndex = newTasks.findIndex(t => t.id === draggedTask.id);
    const [taskToMove] = newTasks.splice(fromIndex, 1);
    
    taskToMove.status = newStatus;
    if (newStatus === 'Done') {
        taskToMove.progress = 100;
    } else if (oldStatus === 'Done') {
        taskToMove.progress = 75; // Or some other default when moved out of 'Done'
    }

    if (draggedOverTask && draggedOverTask.status === newStatus) {
        const toIndex = newTasks.findIndex(t => t.id === draggedOverTask.id);
        newTasks.splice(toIndex, 0, taskToMove);
    } else {
        newTasks.push(taskToMove); // simple append to the end of the list, sorting will fix position
    }

    // Sort tasks within each status column by deadline
    const sortedTasks = newTasks.sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    
    updateTasks(sortedTasks, taskToMove, oldStatus);
    onDragEnd();
  };
  
  const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleExport = () => {
    const csvString = jsonToCsv(tasks);
    downloadCsv(csvString, 'tasks.csv');
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
                  onImport('tasks', text);
              }
          };
          reader.readAsText(file);
      }
      if(fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadTemplate = () => {
    const templateData = [{
      id: 1, projectId: 1, title: 'Sample Task', status: 'To Do', priority: 'Medium',
      assignee: 'AV', startDate: '2025-01-01', deadline: '2025-01-15', progress: 0
    }];
    const csvString = jsonToCsv(templateData);
    downloadCsv(csvString, 'tasks_template.csv');
  };

  return (
    <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h3 className="text-lg font-semibold">Task Board</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Drag and drop tasks to update their status.</p>
            </div>
             <div className="flex items-center gap-2 flex-shrink-0">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                <button onClick={handleImportClick} title="Import from CSV" className="p-2 text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"><UploadCloudIcon className="w-5 h-5"/></button>
                <button onClick={handleExport} title="Export to CSV" className="p-2 text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"><DownloadCloudIcon className="w-5 h-5"/></button>
                <button onClick={handleDownloadTemplate} title="Download Template" className="p-2 text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"><FileTextIcon className="w-5 h-5"/></button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(status => (
            <div
              key={status}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 min-h-[200px]"
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, status)}
              onDragEnter={(e) => {
                  if (e.target === e.currentTarget && draggedTask && draggedTask.status !== status) {
                      setDraggedOverTask(null);
                  }
              }}
            >
              <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700 pb-2">{status} ({tasks.filter(t => t.status === status).length})</h3>
              <div className="space-y-4">
                {tasks.filter(task => task.status === status).map(task => {
                  const assigneeInfo = contacts.find(c => c.initials === task.assignee);
                  const projectInfo = projects.find(p => p.id === task.projectId);

                  return (
                  <div
                    key={task.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-all duration-200 cursor-grab hover:shadow-lg ${draggedTask && draggedTask.id === task.id ? 'opacity-50 scale-105' : ''}`}
                    draggable={true}
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnter={(e) => onDragEnter(e, task)}
                    onDragEnd={onDragEnd}
                    onClick={() => onEditTask(task)}
                  >
                    <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-200 pr-2">{task.title}</p>
                        <span className={`flex-shrink-0 h-3 w-3 rounded-full mt-1 ${getPriorityClass(task.priority)}`} title={`${task.priority} Priority`}></span>
                    </div>
                     {projectInfo && <p className="text-xs text-purple-600 dark:text-purple-400 mb-3 bg-purple-50 dark:bg-purple-900/50 px-2 py-0.5 rounded-full inline-block">{projectInfo.title}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 font-bold text-xs" title={assigneeInfo?.name}>
                        {task.assignee}
                      </div>
                       <div className="text-xs text-gray-500 dark:text-gray-400">{task.deadline}</div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default KanbanBoard;
