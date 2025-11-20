export interface Contact {
  id: number;
  name: string;
  initials: string;
  email: string;
  company: string;
  status: 'Lead' | 'Contacted' | 'Customer' | 'Lost';
  phone?: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: number;
  projectId: number;
  title: string;
  status: TaskStatus;
  priority: 'High' | 'Medium' | 'Low';
  assignee: string; // Initials
  startDate: string;
  deadline: string;
  progress: number;
}

export type ProjectStatus = 'In Progress' | 'Completed' | 'On Hold';

export interface Project {
  id: number;
  title: string;
  status: ProjectStatus;
  startDate: string;
  deadline: string;
  team: number[]; // Array of contact IDs
  description: string;
  progress?: number; // Calculated property
}

export type ActivityType = 'CREATE' | 'COMPLETE' | 'DELETE' | 'UPDATE';

export interface ActivityLogItem {
  id: number;
  type: ActivityType;
  entity: 'project' | 'task' | 'contact';
  description: string;
  timestamp: string; // ISO string
}

export interface AppData {
  projects: Project[];
  tasks: Task[];
  contacts: Contact[];
  activityLog: ActivityLogItem[];
}

export type Page = 'dashboard' | 'projects' | 'tasks' | 'contacts';
export type ModalType = '' | 'project' | 'task' | 'contact' | 'confirmDeleteProject' | 'confirmDeleteTask' | 'confirmDeleteContact';