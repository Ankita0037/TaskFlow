import { Select, Button } from '../ui';
import { Priority, Status, TaskFilters } from '../../types';
import { X, Filter, SortAsc } from 'lucide-react';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
}

/**
 * Task filters component
 */
export function TaskFiltersBar({ filters, onFilterChange }: TaskFiltersProps) {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: Status.TODO, label: 'To Do' },
    { value: Status.IN_PROGRESS, label: 'In Progress' },
    { value: Status.REVIEW, label: 'Review' },
    { value: Status.COMPLETED, label: 'Completed' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: Priority.LOW, label: 'Low' },
    { value: Priority.MEDIUM, label: 'Medium' },
    { value: Priority.HIGH, label: 'High' },
    { value: Priority.URGENT, label: 'Urgent' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' },
  ];

  const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
  ];

  const handleChange = (key: keyof TaskFilters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined,
      page: 1, // Reset to first page on filter change
    });
  };

  const clearFilters = () => {
    onFilterChange({
      page: 1,
      limit: filters.limit,
    });
  };

  const hasActiveFilters = filters.status || filters.priority;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
        {hasActiveFilters && (
          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
            Active
          </span>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status Filter */}
        <div className="flex-1 min-w-0">
          <Select
            options={statusOptions}
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            placeholder="Filter by Status"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex-1 min-w-0">
          <Select
            options={priorityOptions}
            value={filters.priority || ''}
            onChange={(e) => handleChange('priority', e.target.value)}
            placeholder="Filter by Priority"
          />
        </div>

        <div className="hidden sm:block w-px bg-gray-200"></div>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <SortAsc className="h-4 w-4" />
        </div>

        {/* Sort By */}
        <div className="flex-1 min-w-0">
          <Select
            options={sortOptions}
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => handleChange('sortBy', e.target.value)}
          />
        </div>

        {/* Sort Order */}
        <div className="flex-1 min-w-0">
          <Select
            options={sortOrderOptions}
            value={filters.sortOrder || 'desc'}
            onChange={(e) => handleChange('sortOrder', e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="whitespace-nowrap text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

export default TaskFiltersBar;
