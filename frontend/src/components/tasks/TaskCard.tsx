import { Link } from 'react-router-dom';
import { Task } from '../../types';
import {
  formatDate,
  isOverdue,
  getRelativeTime,
  getPriorityClass,
  getStatusClass,
  getStatusLabel,
  getPriorityLabel,
  getInitials,
  truncate,
} from '../../lib/utils';
import { Calendar, User, ChevronRight, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

/**
 * Task card component for displaying task summary
 */
export function TaskCard({ task, onClick }: TaskCardProps) {
  const overdue = task.status !== 'COMPLETED' && isOverdue(task.dueDate);

  const priorityStyles: Record<string, { bg: string; border: string; dot: string }> = {
    HIGH: { bg: 'bg-red-50', border: 'border-l-red-500', dot: 'bg-red-500' },
    MEDIUM: { bg: 'bg-amber-50', border: 'border-l-amber-500', dot: 'bg-amber-500' },
    LOW: { bg: 'bg-emerald-50', border: 'border-l-emerald-500', dot: 'bg-emerald-500' },
  };

  const style = priorityStyles[task.priority] || priorityStyles.LOW;

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 border-l-4 ${style.border} overflow-hidden`}
      onClick={onClick}
    >
      {/* Hover accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50/0 via-primary-50/0 to-primary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-4">
            <Link
              to={`/tasks/${task.id}`}
              className="text-base font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1 flex items-center gap-2 group/link"
              onClick={(e) => e.stopPropagation()}
            >
              {task.title}
              <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200 text-primary-500" />
            </Link>
            {task.description && (
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                {truncate(task.description, 100)}
              </p>
            )}
          </div>
          
          {/* Priority Badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getPriorityClass(task.priority)}`}>
              {getPriorityLabel(task.priority)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Assignee */}
            {task.assignedTo ? (
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center ring-2 ring-white shadow-sm">
                  <span className="text-xs font-semibold text-white">
                    {getInitials(task.assignedTo.name)}
                  </span>
                </div>
                <span className="text-sm text-gray-600 hidden sm:inline font-medium">{task.assignedTo.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm hidden sm:inline">Unassigned</span>
              </div>
            )}

            {/* Due date */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
              overdue 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{formatDate(task.dueDate)}</span>
              <span className="sm:hidden">{getRelativeTime(task.dueDate)}</span>
            </div>
          </div>

          {/* Status */}
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusClass(task.status)}`}>
            {getStatusLabel(task.status)}
          </span>
        </div>

        {/* Overdue warning */}
        {overdue && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border border-red-100">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-700 text-xs font-medium">
              Overdue by {Math.abs(Math.round((new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
