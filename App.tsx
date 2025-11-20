
import React, { useState, useCallback, useEffect } from 'react';
import { Page, ModalType, Project, Task, Contact } from './types';
import { useProjectData } from './hooks/useProjectData';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

import Dashboard from './components/pages/Dashboard';
import ProjectsPage from './components/pages/Projects';
import KanbanBoard from './components/pages/KanbanBoard';
import ContactsPage from './components/pages/Contacts';

import ProjectModal from './components/modals/ProjectModal';
import TaskModal from './components/modals/TaskModal';
import ContactModal from './components/modals/ContactModal';
import ConfirmDeleteModal from './components/modals/ConfirmDeleteModal';

type Theme = 'light' | 'dark';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>('');
  const [selectedItem, setSelectedItem] = useState<Project | Task | Contact | null>(null);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');

  const {
    data,
    handleSaveProject,
    handleSaveTask,
    handleSaveContact,
    handleDeleteProject,
    handleDeleteTask,
    handleDeleteContact,
    handleTaskUpdateOnDrop,
    handleImportData,
  } = useProjectData();

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const navigateTo = (pageName: Page) => {
    setPage(pageName);
    setSidebarOpen(false);
  };
  
  const handleDelete = () => {
      if (!selectedItem) return;
      if (activeModal === 'confirmDeleteProject') {
        handleDeleteProject(selectedItem as Project);
      } else if (activeModal === 'confirmDeleteContact') {
        handleDeleteContact(selectedItem as Contact);
      } else if (activeModal === 'confirmDeleteTask') {
        handleDeleteTask(selectedItem as Task);
      }
      setActiveModal('');
      setSelectedItem(null);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    switch (page) {
      case 'projects': setActiveModal('project'); break;
      case 'tasks': setActiveModal('task'); break;
      case 'contacts': setActiveModal('contact'); break;
      default: console.log(`"Add New" has no action for the ${page} page.`);
    }
  };

  const handleEdit = (item: Project | Task | Contact) => {
      setSelectedItem(item);
      switch(page) {
          case 'projects': setActiveModal('project'); break;
          case 'contacts': setActiveModal('contact'); break;
          case 'tasks': setActiveModal('task'); break;
      }
  };

  const handleDeleteClick = (item: Project | Contact) => {
      setSelectedItem(item);
      switch(page) {
          case 'projects': setActiveModal('confirmDeleteProject'); break;
          case 'contacts': setActiveModal('confirmDeleteContact'); break;
      }
  };

  const handleTaskDeleteRequest = (task: Task) => {
      setSelectedItem(task);
      setActiveModal('confirmDeleteTask');
  }
  
  const PageContent = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard 
                  stats={getDashboardStats()} 
                  navigateTo={navigateTo} 
                  projects={data.projects} 
                  tasks={data.tasks}
                  contacts={data.contacts}
                  activityLog={data.activityLog}
                />;
      case 'projects':
        return <ProjectsPage 
                  projects={data.projects} 
                  contacts={data.contacts} 
                  onEdit={handleEdit} 
                  onDelete={handleDeleteClick} 
                  onImport={handleImportData}
                />;
      case 'tasks':
        return <KanbanBoard 
                  tasks={data.tasks} 
                  contacts={data.contacts} 
                  projects={data.projects} 
                  updateTasks={handleTaskUpdateOnDrop} 
                  onEditTask={handleEdit} 
                  onImport={handleImportData}
                />;
      case 'contacts':
        return <ContactsPage 
                  contacts={data.contacts} 
                  onEdit={handleEdit} 
                  onDelete={handleDeleteClick} 
                  onImport={handleImportData}
                />;
      default:
        return <Dashboard 
                  stats={getDashboardStats()} 
                  navigateTo={navigateTo} 
                  projects={data.projects} 
                  tasks={data.tasks} 
                  contacts={data.contacts}
                  activityLog={data.activityLog}
                />;
    }
  };

  const getDashboardStats = useCallback(() => {
    const totalProjects = data.projects.length;
    const activeTasks = data.tasks.filter(t => t.status !== 'Done').length;
    const completedProjects = data.projects.filter(p => p.status === 'Completed').length;
    const totalContacts = data.contacts.length;
    return { totalProjects, activeTasks, completedProjects, totalContacts };
  }, [data]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans min-h-screen flex">
      <Sidebar currentPage={page} navigateTo={navigateTo} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-64">
        <Header 
          currentPage={page} 
          setSidebarOpen={setSidebarOpen} 
          onAddNew={handleAddNew} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <PageContent />
        </main>
      </div>
      
      <ProjectModal 
        isOpen={activeModal === 'project'} 
        onClose={() => setActiveModal('')} 
        onSave={handleSaveProject}
        project={selectedItem as Project | null}
        contacts={data.contacts}
      />
      <TaskModal
        isOpen={activeModal === 'task'}
        onClose={() => setActiveModal('')}
        onSave={handleSaveTask}
        task={selectedItem as Task | null}
        contacts={data.contacts}
        projects={data.projects}
        onDelete={handleTaskDeleteRequest}
      />
      <ContactModal
        isOpen={activeModal === 'contact'}
        onClose={() => setActiveModal('')}
        onSave={handleSaveContact}
        contact={selectedItem as Contact | null}
      />
      <ConfirmDeleteModal
        isOpen={activeModal.startsWith('confirmDelete')}
        onClose={() => setActiveModal('')}
        onConfirm={handleDelete}
        title={
            activeModal === 'confirmDeleteProject' ? 'Delete Project' :
            activeModal === 'confirmDeleteContact' ? 'Delete Contact' :
            'Delete Task'
        }
      >
        {activeModal === 'confirmDeleteProject' ? (
            <p>Are you sure you want to delete this project? <strong className="font-semibold">All associated tasks will also be deleted.</strong> This action cannot be undone.</p>
        ) : (
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        )}
      </ConfirmDeleteModal>
    </div>
  );
}
