import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTasks } from '../hooks';
import { TaskList, TaskFiltersBar } from '../components/tasks';
import { Button } from '../components/ui';
import { TaskFilters, Task } from '../types';
import { Plus, ChevronLeft, ChevronRight, ListTodo, Sparkles } from 'lucide-react';

/**
 * Tasks list page component
 */
export function TasksPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Parse initial filters from URL
  const [filters, setFilters] = useState<TaskFilters>(() => ({
    status: searchParams.get('status') as any,
    priority: searchParams.get('priority') as any,
    sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 12,
  }));

  const { tasks, total, page, totalPages, isLoading } = useTasks(filters);

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.status) params.set('status', newFilters.status);
    if (newFilters.priority) params.set('priority', newFilters.priority);
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
    if (newFilters.sortOrder) params.set('sortOrder', newFilters.sortOrder);
    if (newFilters.page && newFilters.page > 1) params.set('page', String(newFilters.page));
    navigate({ search: params.toString() }, { replace: true });
  };

  const handlePageChange = (newPage: number) => {
    handleFilterChange({ ...filters, page: newPage });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <ListTodo className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">All Tasks</h1>
              <p className="mt-1 text-gray-300">
                Manage and track all your tasks in one place
              </p>
            </div>
          </div>
          <Link
            to="/tasks/new"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg shadow-black/20 group"
          >
            <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            New Task
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <TaskFiltersBar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Task Count */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-500" />
            <span className="text-sm font-medium text-gray-600">
              {total} {total === 1 ? 'task' : 'tasks'} found
            </span>
          </div>
        </div>
      )}

      {/* Task List */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        emptyMessage="No tasks found. Try adjusting your filters or create a new task."
        onTaskClick={(task: Task) => navigate(`/tasks/${task.id}`)}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-5 py-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="secondary"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Showing{' '}
                <span className="font-semibold text-gray-900">{(page - 1) * (filters.limit || 12) + 1}</span>
                {' '}-{' '}
                <span className="font-semibold text-gray-900">
                  {Math.min(page * (filters.limit || 12), total)}
                </span>
                {' '}of{' '}
                <span className="font-semibold text-gray-900">{total}</span> results
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="!rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        page === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="!rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksPage;
