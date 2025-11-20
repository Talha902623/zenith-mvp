import React, { useState } from 'react';
import { Project, Task } from '../../types';

interface GanttChartProps {
    projects: Project[];
    tasks: Task[];
}

interface ProjectSelectorProps {
    projects: Project[];
    selectedProjectId: number | null;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ projects, selectedProjectId, onChange }) => (
    <div className="mb-6 md:mb-0">
        <label htmlFor="gantt-project-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Project</label>
        <select 
            id="gantt-project-select" 
            value={selectedProjectId || ''} 
            onChange={onChange}
            className="mt-1 block w-full md:w-auto lg:w-72 pl-3 pr-10 py-2 text-base border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
        >
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
    </div>
);

const GanttChart: React.FC<GanttChartProps> = ({ projects, tasks }) => {
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(projects[0]?.id || null);
    const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProjectId(Number(e.target.value));
    };

    const parseUTCDate = (dateString: string) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    };

    const diffDays = (date1: Date, date2: Date) => {
        const msPerDay = 1000 * 60 * 60 * 24;
        return Math.round((date2.getTime() - date1.getTime()) / msPerDay);
    };
    
    const relevantTasks = tasks.filter(t => t.projectId === selectedProjectId && t.startDate && t.deadline);

    if (!selectedProjectId || projects.length === 0) {
        return <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">No projects available.</div>
    }
    
    const renderChart = () => {
        if (relevantTasks.length === 0) {
            return (
                 <div className="text-center pt-8 border-t dark:border-gray-700 mt-6">
                    <h3 className="text-lg font-semibold">No Tasks to Display</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select a different project or add tasks with start/end dates to this one.</p>
                 </div>
            )
        }

        const sortedTasks = [...relevantTasks].sort((a,b) => parseUTCDate(a.startDate)!.getTime() - parseUTCDate(b.startDate)!.getTime());
        
        const chartStartDate = parseUTCDate(sortedTasks[0].startDate)!;
        chartStartDate.setUTCDate(chartStartDate.getUTCDate() - (viewMode === 'week' ? 3 : 10));
        
        const chartEndDate = new Date(Math.max(...sortedTasks.map(t => parseUTCDate(t.deadline)!.getTime())));
        chartEndDate.setUTCDate(chartEndDate.getUTCDate() + (viewMode === 'week' ? 3 : 10));

        const totalDays = Math.max(1, diffDays(chartStartDate, chartEndDate));
        
        const today = new Date();
        const todayPosition = (diffDays(chartStartDate, today) / totalDays) * 100;
        
        const getBarColor = (status: Task['status']) => {
            switch (status) {
              case 'In Progress': return 'bg-yellow-500';
              case 'Done': return 'bg-green-500';
              case 'To Do': return 'bg-blue-500';
              default: return 'bg-gray-500';
            }
        }

        const importantDateStrings = new Set<string>();
        sortedTasks.forEach(task => {
            if (task.startDate) importantDateStrings.add(task.startDate);
            if (task.deadline) importantDateStrings.add(task.deadline);
        });
        
        const renderTimeHeader = () => {
            if (viewMode === 'month') {
                const months: Date[] = [];
                let iteratorDate = new Date(Date.UTC(chartStartDate.getUTCFullYear(), chartStartDate.getUTCMonth(), 1));
                while (iteratorDate <= chartEndDate) {
                    months.push(new Date(iteratorDate.getTime()));
                    iteratorDate.setUTCMonth(iteratorDate.getUTCMonth() + 1);
                }
                return (
                    <div className="flex border-b-2 border-gray-200 dark:border-gray-700">
                        {months.map((month, index) => {
                            const monthStart = (index === 0 && month < chartStartDate) ? chartStartDate : month;
                            const nextMonth = (index === months.length - 1) ? chartEndDate : new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1));
                            const viewEndDate = nextMonth > chartEndDate ? chartEndDate : nextMonth;
                            const daysInView = diffDays(monthStart, viewEndDate);
                            const width = (daysInView / totalDays) * 100;
                            
                            return (
                                <div key={index} style={{ width: `${width}%`}} className="text-left pl-1 text-xs font-semibold pb-2 text-gray-500 dark:text-gray-400 border-r dark:border-gray-700/50">
                                    {month.toLocaleString('default', { month: 'short', timeZone: 'UTC' })} '{month.getUTCFullYear().toString().slice(-2)}
                                </div>
                            )
                        })}
                    </div>
                );
            } else { // Week View
                const days: Date[] = [];
                let dayIterator = new Date(chartStartDate.getTime());
                while(dayIterator <= chartEndDate) {
                    days.push(new Date(dayIterator));
                    dayIterator.setUTCDate(dayIterator.getUTCDate() + 1);
                }

                const showAllDayNumbers = totalDays < 70;

                return (
                    <div className="border-b-2 border-gray-200 dark:border-gray-700">
                        {/* Month Row */}
                        <div className="flex">
                           {days.map((day, index) => {
                               const showMonth = day.getUTCDate() === 1 || index === 0;
                               return (
                                   <div key={`month-${index}`} style={{width: `${100/totalDays}%`}} className={`text-center text-xs font-semibold pb-1 ${index % 7 === 0 ? 'border-l dark:border-gray-700/50' : ''}`}>
                                      {showMonth ? day.toLocaleString('default', { month: 'short', timeZone: 'UTC' }) : ''}
                                   </div>
                               );
                           })}
                        </div>
                         {/* Day Row */}
                         <div className="flex bg-gray-50 dark:bg-gray-700/50">
                           {days.map((day, index) => {
                                const dayString = day.toISOString().split('T')[0];
                                const isImportantDate = importantDateStrings.has(dayString);
                                const showDayNumber = showAllDayNumbers || day.getUTCDay() === 1 || isImportantDate;
                                return (
                                <div key={`day-${index}`} style={{width: `${100/totalDays}%`}} className={`text-center text-xs text-gray-500 dark:text-gray-400 py-1 ${index % 7 === 0 ? 'border-l dark:border-gray-700/50' : ''} ${(day.getUTCDay() === 0 || day.getUTCDay() === 6) ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                  {showDayNumber ? day.getUTCDate() : ''}
                                </div>
                           )})}
                        </div>
                    </div>
                );
            }
        };

        const headerHeight = viewMode === 'week' ? 46 : 26;
        const timelineHeight = sortedTasks.length * (32 + 12) - 12;

        return (
            <div className="pt-8 overflow-x-auto" style={{ minWidth: '900px' }}>
                <div className="flex">
                    <div className="w-48 flex-shrink-0">
                        <div style={{ height: `${headerHeight}px` }} className="border-b-2 border-transparent"></div>
                        <div className="relative mt-2">
                            {sortedTasks.map(task => (
                                <div key={task.id} className="h-8 mb-3 flex items-center pr-4 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm truncate font-medium">{task.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        {renderTimeHeader()}
                        <div className="relative mt-2" style={{ height: `${timelineHeight}px` }}>
                             {/* Vertical Grid Lines */}
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                               {[...Array(Math.floor(totalDays))].map((_, index) => {
                                    const dayDate = new Date(chartStartDate);
                                    dayDate.setUTCDate(dayDate.getUTCDate() + index);
                                    const isWeekStart = dayDate.getUTCDay() === 1; // Monday
                                    const isMonthStart = dayDate.getUTCDate() === 1;
                                    
                                    if ((viewMode === 'week' || isWeekStart) && !isMonthStart) {
                                        return <div key={`line-${index}`} style={{ left: `${(index / totalDays) * 100}%` }} className="absolute top-0 h-full w-px bg-gray-200 dark:bg-gray-700/50"></div>
                                    }
                                    if (viewMode === 'month' && isMonthStart) {
                                         return <div key={`line-${index}`} style={{ left: `${(index / totalDays) * 100}%` }} className="absolute top-0 h-full w-px bg-gray-300 dark:bg-gray-600"></div>
                                    }
                                    return null;
                               })}
                            </div>
                            {todayPosition >= 0 && todayPosition <= 100 && (
                                <div style={{ left: `${todayPosition}%` }} className="absolute top-0 h-full w-0.5 bg-red-500 z-10" title={`Today: ${today.toDateString()}`}>
                                    <div className="absolute -top-7 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow-lg">Today</div>
                                </div>
                            )}
                            <div className="relative">
                                {sortedTasks.map(task => {
                                    const startDate = parseUTCDate(task.startDate);
                                    const endDate = parseUTCDate(task.deadline);
                                    if (!startDate || !endDate) return null;

                                    const left = (diffDays(chartStartDate, startDate) / totalDays) * 100;
                                    const durationDays = diffDays(startDate, endDate) + 1;
                                    const width = (durationDays / totalDays) * 100;

                                    const totalDuration = diffDays(startDate, endDate) + 1;
                                    const elapsedDuration = diffDays(startDate, today);
                                    const timeElapsedPercentage = totalDuration > 0 ? Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100)) : 0;
                                    const isBehind = timeElapsedPercentage > task.progress && task.progress < 100;
                                    
                                    const progressBarColor = isBehind ? 'bg-red-500' : getBarColor(task.status);
                                    const progressBgColor = getBarColor(task.status);

                                    const tooltipText = `${task.title}\nStart: ${task.startDate}\nEnd: ${task.deadline}\nProgress: ${task.progress}%\nExpected: ${Math.round(timeElapsedPercentage)}%`;
                                    
                                    return (
                                        <div key={task.id} className="h-8 mb-3 relative group border-b border-gray-200 dark:border-gray-700">
                                            <div 
                                                style={{ left: `${left}%`, width: `${width}%` }}
                                                className="absolute h-full rounded"
                                                title={tooltipText}
                                            >
                                                <div className={`h-full rounded ${progressBgColor}/50`}>
                                                    <div 
                                                        style={{ width: `${task.progress || 0}%` }}
                                                        className={`h-full rounded ${progressBarColor} relative flex items-center justify-center overflow-hidden`}
                                                    >
                                                        <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 [text-shadow:1px_1px_1px_rgba(0,0,0,0.5)]">
                                                            {task.progress || 0}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                 <ProjectSelector projects={projects} selectedProjectId={selectedProjectId} onChange={handleProjectChange} />
                 <div className="flex-shrink-0">
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button type="button" onClick={() => setViewMode('month')} className={`px-4 py-2 text-sm font-medium ${viewMode === 'month' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'} border border-gray-200 dark:border-gray-600 rounded-l-lg focus:z-10 focus:ring-2 focus:ring-purple-500`}>
                            Month
                        </button>
                        <button type="button" onClick={() => setViewMode('week')} className={`px-4 py-2 text-sm font-medium ${viewMode === 'week' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'} border border-gray-200 dark:border-gray-600 rounded-r-md focus:z-10 focus:ring-2 focus:ring-purple-500`}>
                            Week
                        </button>
                    </div>
                 </div>
            </div>
             {renderChart()}
        </div>
    );
};
export default GanttChart;