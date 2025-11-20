
import React from 'react';
import { Page } from '../../types';
import { MenuIcon, PlusIcon, SunIcon, MoonIcon } from '../icons';

interface HeaderProps {
    currentPage: Page;
    setSidebarOpen: (open: boolean) => void;
    onAddNew: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setSidebarOpen, onAddNew, theme, toggleTheme }) => {
  const pageTitles: Record<Page, string> = {
    dashboard: 'Dashboard Overview',
    projects: 'Projects',
    tasks: 'Tasks Board',
    contacts: 'Contact Management',
  };
  
  const isActionPage = currentPage === 'projects' || currentPage === 'tasks' || currentPage === 'contacts';

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <MenuIcon className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold capitalize">{pageTitles[currentPage] || 'Dashboard'}</h2>
        </div>
        <div className="flex items-center gap-4">
          {isActionPage && (
            <button onClick={onAddNew} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900">
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Add New</span>
            </button>
          )}
           <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-purple-500"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <MoonIcon className="h-5 w-5 text-gray-700" /> : <SunIcon className="h-5 w-5 text-yellow-400" />}
            </button>
           <img src={`https://picsum.photos/seed/aliavance/40/40`} alt="User Avatar" className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;
