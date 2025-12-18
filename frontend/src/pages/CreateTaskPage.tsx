import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TaskForm } from '../components/tasks';
import { useTaskMutations } from '../hooks';
import { Plus, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Create task page component
 */
export function CreateTaskPage() {
  const navigate = useNavigate();
  const { createTask } = useTaskMutations();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await createTask(data);
      toast.success('Task created successfully!');
      navigate('/tasks');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create task';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-8">
      {/* Back Link */}
      <Link 
        to="/tasks"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Tasks
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl shadow-lg shadow-primary-500/25">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Task</h1>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <Sparkles className="h-4 w-4 text-primary-500" />
              Fill in the details below to create a new task
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>
        <div className="p-6 md:p-8">
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateTaskPage;
