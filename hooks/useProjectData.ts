
import { useState, useEffect } from 'react';
// FIX: Import 'TaskStatus' to resolve type error.
import { AppData, Project, Task, Contact, ActivityType, ActivityLogItem, TaskStatus } from '../types';
import { initialData } from '../constants';
import { csvToJson } from '../utils/csv';

type ProjectFormData = Omit<Project, 'id'> & { id?: number; tasks?: string };
type TaskFormData = Omit<Task, 'id' | 'status'> & { id?: number };
type ContactFormData = Omit<Contact, 'id' | 'initials'> & { id?: number };


export const useProjectData = () => {
  const [data, setData] = useState<AppData>(() => {
    try {
        const storedData = localStorage.getItem('zenithCrmData');
        return storedData ? JSON.parse(storedData) : initialData;
    } catch (error) {
        console.error("Error parsing data from localStorage", error);
        return initialData;
    }
  });

  useEffect(() => {
      localStorage.setItem('zenithCrmData', JSON.stringify(data));
  }, [data]);

  // --- Automated Project Progress & Status Sync ---
  useEffect(() => {
    const updatedProjects = data.projects.map(p => {
        const relatedTasks = data.tasks.filter(t => t.projectId === p.id);
        if (relatedTasks.length === 0) {
            return { ...p, progress: p.status === 'Completed' ? 100 : 0 };
        }

        // Calculate average progress
        const totalProgress = relatedTasks.reduce((sum, task) => sum + (task.progress || 0), 0);
        const averageProgress = Math.round(totalProgress / relatedTasks.length);

        // Determine status
        const allTasksDone = relatedTasks.every(t => t.status === 'Done');
        let newStatus = p.status;
        if (p.status !== 'On Hold') {
           if (allTasksDone) {
               newStatus = 'Completed';
           } else if (p.status === 'Completed' && !allTasksDone) {
               newStatus = 'In Progress';
           }
        }
        
        return { ...p, progress: averageProgress, status: newStatus };
    });
    
    // Avoid infinite loop by checking if an update is actually needed
    if (JSON.stringify(updatedProjects) !== JSON.stringify(data.projects)) {
        setData(currentData => ({ ...currentData, projects: updatedProjects }));
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.tasks]); // Only re-run when tasks change
  
  const addActivity = (type: ActivityType, entity: ActivityLogItem['entity'], description: string) => {
      const newActivity: ActivityLogItem = {
          id: Date.now(),
          type,
          entity,
          description,
          timestamp: new Date().toISOString()
      };
      setData(currentData => ({
          ...currentData,
          activityLog: [newActivity, ...currentData.activityLog].slice(0, 50) // Keep last 50 activities
      }));
  }

  const handleSaveProject = (projectData: ProjectFormData) => {
    setData(currentData => {
        let newTasks: Task[] = [];
        let newProjects = [...currentData.projects];

        if (projectData.id) { // Update existing project
            newProjects = currentData.projects.map(proj => proj.id === projectData.id ? {...proj, ...projectData} : proj);
            addActivity('UPDATE', 'project', `Project '${projectData.title}' was updated.`);
        } else { // Create new project and its tasks
            const newProjectId = Date.now();
            const newProject: Project = {
                id: newProjectId,
                title: projectData.title,
                description: projectData.description,
                startDate: projectData.startDate,
                deadline: projectData.deadline,
                status: projectData.status,
                team: projectData.team
            };
            newProjects.push(newProject);
            addActivity('CREATE', 'project', `New project '${projectData.title}' was created.`);
            
            if (projectData.tasks) {
                const taskTitles = projectData.tasks.split('\n').filter(t => t.trim() !== '');
                const firstAssignee = currentData.contacts.find(c => c.id === projectData.team[0]);

                newTasks = taskTitles.map((title, index) => ({
                    id: Date.now() + index,
                    projectId: newProjectId,
                    title: title.trim(),
                    status: 'To Do',
                    priority: 'Medium',
                    assignee: firstAssignee ? firstAssignee.initials : 'N/A',
                    progress: 0,
                    startDate: projectData.startDate,
                    deadline: projectData.deadline
                }));
            }
        }

        return {
            ...currentData,
            projects: newProjects,
            tasks: [...currentData.tasks, ...newTasks]
        };
    });
  };

  const handleSaveTask = (taskData: TaskFormData) => {
    if (taskData.id) { // Update
        setData(p => ({...p, tasks: p.tasks.map(t => t.id === taskData.id ? { ...t, ...taskData } : t)}));
        addActivity('UPDATE', 'task', `Task '${taskData.title}' was updated.`);
    } else { // Create
        const newTask: Task = { ...taskData, id: Date.now(), status: 'To Do' };
        setData(p => ({ ...p, tasks: [...p.tasks, newTask] }));
        addActivity('CREATE', 'task', `A new task '${taskData.title}' was created.`);
    }
  };
  
  const handleSaveContact = (contactData: ContactFormData) => {
    const initials = contactData.name.split(' ').map(n => n[0]).join('').toUpperCase();
    if (contactData.id) { // Update
        setData(p => ({...p, contacts: p.contacts.map(c => c.id === contactData.id ? { ...c, ...contactData, initials } : c)}));
        addActivity('UPDATE', 'contact', `Contact '${contactData.name}' was updated.`);
    } else { // Create
        const newContact: Contact = { ...contactData, id: Date.now(), initials };
        setData(p => ({ ...p, contacts: [...p.contacts, newContact] }));
        addActivity('CREATE', 'contact', `A new lead '${contactData.name}' was added.`);
    }
  };

  const handleDeleteProject = (project: Project) => {
    setData(p => ({
        ...p, 
        projects: p.projects.filter(proj => proj.id !== project.id),
        tasks: p.tasks.filter(task => task.projectId !== project.id)
    }));
    addActivity('DELETE', 'project', `Project '${project.title}' was deleted.`);
  };

  const handleDeleteTask = (task: Task) => {
    setData(p => ({...p, tasks: p.tasks.filter(t => t.id !== task.id)}));
    addActivity('DELETE', 'task', `Task '${task.title}' was deleted.`);
  };
  
  const handleDeleteContact = (contact: Contact) => {
    setData(p => ({...p, contacts: p.contacts.filter(c => c.id !== contact.id)}));
    addActivity('DELETE', 'contact', `Contact '${contact.name}' was deleted.`);
  };

  const handleTaskUpdateOnDrop = (updatedTasks: Task[], changedTask: Task, oldStatus: TaskStatus) => {
      setData(prevData => ({ ...prevData, tasks: updatedTasks }));
      if (changedTask.status === 'Done' && oldStatus !== 'Done') {
          const assigneeName = data.contacts.find(c => c.initials === changedTask.assignee)?.name || changedTask.assignee;
          addActivity('COMPLETE', 'task', `${assigneeName} completed the task '${changedTask.title}'.`);
      }
  };
  
  const handleImportData = (type: 'contacts' | 'projects' | 'tasks', csvString: string) => {
      try {
        const importedJson = csvToJson(csvString);
        setData(currentData => {
            const currentIds = new Set(currentData[type].map((item: any) => item.id));
            const newItems = importedJson.map((item: any) => {
                // Basic type conversion and validation
                const newItem = { ...item };
                newItem.id = Number(item.id);
                if (type === 'projects') {
                   newItem.team = item.team ? String(item.team).split(',').map(Number) : [];
                }
                if (type === 'tasks') {
                    newItem.projectId = Number(item.projectId);
                    newItem.progress = Number(item.progress);
                }
                
                // Avoid ID conflicts
                if (currentIds.has(newItem.id)) {
                    newItem.id = Date.now() + Math.random();
                }
                return newItem;
            });

            return {
                ...currentData,
                [type]: [...currentData[type], ...newItems],
            };
        });
        alert(`Successfully imported ${importedJson.length} items!`);
      } catch (error) {
          console.error("Failed to import data:", error);
          alert(`Error importing data. Please check the file format and console for details.`);
      }
  };
  
  return {
    data,
    handleSaveProject,
    handleSaveTask,
    handleSaveContact,
    handleDeleteProject,
    handleDeleteTask,
    handleDeleteContact,
    handleTaskUpdateOnDrop,
    handleImportData,
  };
};