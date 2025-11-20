
import React from 'react';
import { Page } from '../../types';
import { HomeIcon, FolderKanbanIcon, ListTodoIcon, BarChart4Icon, UsersIcon, XIcon } from '../icons';

interface SidebarProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, navigateTo, sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { id: 'dashboard' as Page, icon: HomeIcon, label: 'Dashboard' },
    { id: 'projects' as Page, icon: FolderKanbanIcon, label: 'Projects' },
    { id: 'tasks' as Page, icon: ListTodoIcon, label: 'Tasks' },
    { id: 'contacts' as Page, icon: UsersIcon, label: 'Contacts' },
  ];

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400">Zenith CRM</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="py-6">
          {navItems.map(item => (
            <a
              key={item.id}
              href="#"
              onClick={(e) => { e.preventDefault(); navigateTo(item.id); }}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                currentPage === item.id
                  ? 'bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 border-r-4 border-purple-500'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>
       {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </>
  );
};

export default Sidebar;
