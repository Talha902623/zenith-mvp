import React from 'react';
import { Task, Contact } from '../../types';

interface TaskLoadChartProps {
    tasks: Task[];
    contacts: Contact[];
}

const TaskLoadChart: React.FC<TaskLoadChartProps> = ({ tasks, contacts }) => {
    const activeTasks = tasks.filter(t => t.status !== 'Done');

    // FIX: Provide a generic to `reduce` to correctly type the accumulator, initial value, and the final result.
    // This ensures `taskCountByAssignee` is `Record<string, number>` and fixes downstream type errors.
    const taskCountByAssignee = activeTasks.reduce<Record<string, number>>((acc, task) => {
        acc[task.assignee] = (acc[task.assignee] || 0) + 1;
        return acc;
    }, {});
    
    const chartData = Object.entries(taskCountByAssignee)
        .map(([initials, count]) => {
            const contact = contacts.find(c => c.initials === initials);
            return {
                name: contact ? contact.name.split(' ')[0] : initials, // Show first name or initials
                tasks: count,
            };
        })
        .sort((a, b) => b.tasks - a.tasks);

    const maxTasks = Math.max(...chartData.map(d => d.tasks), 0);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Task Load Distribution</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Active tasks per team member.</p>
            {chartData.length > 0 ? (
                <div className="space-y-4">
                    {chartData.map(item => (
                        <div key={item.name} className="flex items-center gap-4">
                            <span className="w-20 text-sm font-medium text-gray-600 dark:text-gray-300 truncate text-right">{item.name}</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                                <div
                                    className="bg-purple-600 h-6 rounded-full flex items-center justify-end px-2"
                                    style={{ width: maxTasks > 0 ? `${(item.tasks / maxTasks) * 100}%` : '0%' }}
                                    title={`${item.tasks} active tasks`}
                                >
                                    <span className="text-xs font-bold text-white">{item.tasks}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">No active tasks to display.</p>
                </div>
            )}
        </div>
    );
};

export default TaskLoadChart;