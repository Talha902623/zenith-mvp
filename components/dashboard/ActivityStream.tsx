
import React from 'react';
import { ActivityLogItem } from '../../types';
import { timeAgo } from '../../utils/time';
import { PlusCircleIcon, CheckCircleIcon, TrashIcon, EditIcon, FolderKanbanIcon, ListTodoIcon, UsersIcon } from '../icons';

interface ActivityStreamProps {
    activityLog: ActivityLogItem[];
}

const ActivityStream: React.FC<ActivityStreamProps> = ({ activityLog }) => {
    
    const getActivityIcon = (item: ActivityLogItem) => {
        const iconClass = "w-5 h-5";
        switch (item.type) {
            case 'CREATE': return <PlusCircleIcon className={`${iconClass} text-green-500`} />;
            case 'COMPLETE': return <CheckCircleIcon className={`${iconClass} text-purple-500`} />;
            case 'DELETE': return <TrashIcon className={`${iconClass} text-red-500`} />;
            case 'UPDATE': return <EditIcon className={`${iconClass} text-yellow-500`} />;
            default: return <ListTodoIcon className={iconClass} />;
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Activity</h3>
            {activityLog.length > 0 ? (
                 <ul className="space-y-4">
                    {activityLog.map(item => (
                        <li key={item.id} className="flex items-start gap-3">
                           <div className="flex-shrink-0 mt-1 bg-gray-100 dark:bg-gray-700 rounded-full p-1.5">
                                {getActivityIcon(item)}
                           </div>
                           <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(item.timestamp)}</p>
                           </div>
                        </li>
                    ))}
                 </ul>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-gray-400">No recent activity.</p>
                </div>
            )}
        </div>
    );
};

export default ActivityStream;
