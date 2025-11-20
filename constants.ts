import { AppData } from './types';

export const initialData: AppData = {
  projects: [
    { id: 1, title: 'QuantumLeap AI Development', status: 'In Progress', startDate: '2025-06-01', deadline: '2025-12-15', team: [1, 2], description: "Developing the next-gen AI for data analysis." },
    { id: 2, title: 'Nebula Cloud Platform', status: 'Completed', startDate: '2025-01-15', deadline: '2025-09-30', team: [3, 4], description: "Cloud infrastructure migration and optimization project." },
    { id: 3, title: 'Zenith Mobile App', status: 'On Hold', startDate: '2025-10-01', deadline: '2026-02-28', team: [5], description: "Cross-platform mobile application for productivity." },
    { id: 4, title: 'Fusion Design System', status: 'In Progress', startDate: '2025-05-20', deadline: '2025-11-20', team: [1, 3, 2], description: "Creating a new unified design system for all products." },
    { id: 5, title: 'SAAS CRM', status: 'In Progress', startDate: '2025-10-01', deadline: '2025-10-31', team: [2, 4], description: "Internal CRM development." },
  ],
  tasks: [
    // Project 1: QuantumLeap AI Development (June 1 - Dec 15)
    { id: 1, projectId: 1, title: 'User Auth Flow Design', status: 'To Do', priority: 'High', assignee: 'AV', startDate: '2025-06-05', deadline: '2025-06-20', progress: 0 },
    { id: 2, projectId: 1, title: 'API Endpoints (User Profiles)', status: 'In Progress', priority: 'High', assignee: 'JW', startDate: '2025-06-21', deadline: '2025-07-10', progress: 60 },
    { id: 6, projectId: 1, title: 'Q3 Financial Report', status: 'In Progress', priority: 'High', assignee: 'AV', startDate: '2025-07-01', deadline: '2025-07-15', progress: 90 },

    // Project 2: Nebula Cloud Platform (Jan 15 - Sep 30)
    { id: 3, projectId: 2, title: 'Setup Staging Environment', status: 'Done', priority: 'Medium', assignee: 'MC', startDate: '2025-02-01', deadline: '2025-02-28', progress: 100 },

    // Project 4: Fusion Design System (May 20 - Nov 20)
    { id: 4, projectId: 4, title: 'Create Button Components', status: 'In Progress', priority: 'Low', assignee: 'LS', startDate: '2025-06-01', deadline: '2025-06-15', progress: 75 },

    // Project 3: Zenith Mobile App (Oct 1 - Feb 28 '26)
    { id: 5, projectId: 3, title: 'Draft Initial Marketing Copy', status: 'To Do', priority: 'Medium', assignee: 'SR', startDate: '2025-10-05', deadline: '2025-10-25', progress: 10 },

    // Project 5: SAAS CRM (Oct 1 - Oct 31)
    { id: 7, projectId: 5, title: 'Define Database Schema', status: 'In Progress', priority: 'High', assignee: 'JW', startDate: '2025-10-02', deadline: '2025-10-12', progress: 50 },
    { id: 8, projectId: 5, title: 'Develop Login UI', status: 'To Do', priority: 'High', assignee: 'AV', startDate: '2025-10-13', deadline: '2025-10-20', progress: 0 },
    { id: 9, projectId: 5, title: 'Setup CI/CD Pipeline', status: 'To Do', priority: 'Medium', assignee: 'MC', startDate: '2025-10-21', deadline: '2025-10-31', progress: 0 },
  ],
  contacts: [
    { id: 1, name: 'Alia Vance', initials: 'AV', email: 'alia.v@examplecorp.com', company: 'QuantumLeap Inc.', status: 'Lead', phone: '555-0101' },
    { id: 2, name: 'John Wick', initials: 'JW', email: 'john.w@examplecorp.com', company: 'Nebula Cloud', status: 'Customer', phone: '555-0102' },
    { id: 3, name: 'Lara Croft', initials: 'LS', email: 'lara.c@examplecorp.com', company: 'Zenith Mobile', status: 'Lost', phone: '555-0103' },
    { id: 4, name: 'Marcus Cole', initials: 'MC', email: 'marcus.c@examplecorp.com', company: 'Fusion Systems', status: 'Customer', phone: '555-0104' },
    { id: 5, name: 'Sarah Connor', initials: 'SR', email: 'sarah.c@examplecorp.com', company: 'Cyberdyne', status: 'Contacted', phone: '555-0105' },
  ],
  activityLog: [],
};