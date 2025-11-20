import React from 'react';
import { Page, Project, Task, Contact, ActivityLogItem } from '../../types';
import { FolderKanbanIcon, ListTodoIcon, HomeIcon, UsersIcon } from '../icons';
import TaskLoadChart from '../dashboard/TaskLoadChart';
import ActivityStream from '../dashboard/ActivityStream';
import GanttChart from '../dashboard/GanttChart';


interface DashboardStats {
    totalProjects: number;
    activeTasks: number;
    completedProjects: number;
    totalContacts: number;
}

interface DashboardProps {
    stats: DashboardStats;
    navigateTo: (page: Page) => void;
    projects: Project[];
    tasks: Task[];
    contacts: Contact[];
    activityLog: ActivityLogItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, navigateTo, projects, tasks, contacts, activityLog }) => {
  const statCards = [
    { title: 'Total Projects', value: stats.totalProjects, icon: FolderKanbanIcon, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/50', link: 'projects' as Page },
    { title: 'Active Tasks', value: stats.activeTasks, icon: ListTodoIcon, color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/50', link: 'tasks' as Page },
    { title: 'Completed Projects', value: stats.completedProjects, icon: HomeIcon, color: 'text-green-500 bg-green-100 dark:bg-green-900/50', link: 'projects' as Page },
    { title: 'Total Contacts', value: stats.totalContacts, icon: UsersIcon, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/50', link: 'contacts' as Page },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(card => (
          <button 
            key={card.title} 
            onClick={() => navigateTo(card.link)} 
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-between text-left w-full hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{card.value}</p>
            </div>
            <div className={`p-3 rounded-full ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </button>
        ))}
      </div>

      <GanttChart projects={projects} tasks={tasks} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TaskLoadChart tasks={tasks} contacts={contacts} />
          </div>
          <div className="lg:col-span-1">
            <ActivityStream activityLog={activityLog} />
          </div>
      </div>

    </div>
  );
};

export default Dashboard;