import React from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  tag: {
    color: string;
    label: string;
  };
  dueDate: string;
  assignees: number;
  progress: {
    completed: number;
    total: number;
  };
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange }) => {
  const getTagColor = (color: string) => {
    const colors: { [key: string]: string } = {
      purple: 'bg-gray-100 text-gray-800',
      blue: 'bg-gray-200 text-gray-900',
      green: 'bg-gray-300 text-gray-900',
      yellow: 'bg-gray-400 text-white',
      red: 'bg-gray-500 text-white',
    };
    return colors[color] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{task.title}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${getTagColor(task.tag.color)}`}>
          {task.tag.label}
        </span>
      </div>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{task.dueDate}</span>
        <div className="flex items-center gap-1">
          <span>{task.assignees} pessoas</span>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Progresso</span>
          <span>{task.progress.completed}/{task.progress.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-black h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(task.progress.completed / task.progress.total) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
