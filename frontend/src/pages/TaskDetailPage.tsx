import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTask, useTaskMutations } from '../hooks';
import { TaskForm } from '../components/tasks';
import { Card, CardHeader, CardBody, Button, Badge, Modal } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import {
  formatDateTime,
  formatDate,
  isOverdue,
  getPriorityClass,
  getStatusClass,
  getStatusLabel,
  getPriorityLabel,
  getInitials,
} from '../lib/utils';
import {
  Calendar,
  User,
  Clock,
  Edit,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  History,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { taskApi } from '../lib/api';
import { AuditLog } from '../types';

/**
 * Task detail page component
 */
export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { task, isLoading, mutate } = useTask(id || null);
  const { updateTask, deleteTask } = useTaskMutations();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardBody>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardBody className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Task Not Found</h2>
            <p className="text-gray-500 mb-4">
              The task you're looking for doesn't exist or has been deleted.
            </p>
            <Link to="/tasks">
              <Button>Back to Tasks</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  const overdue = task.status !== 'COMPLETED' && isOverdue(task.dueDate);
  const isCreator = task.creatorId === user?.id;

  const handleUpdate = async (data: any) => {
    try {
      await updateTask(task.id, data);
      toast.success('Task updated successfully!');
      setIsEditing(false);
      mutate();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update task';
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success('Task deleted successfully!');
      navigate('/tasks');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete task';
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const loadAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const response = await taskApi.getAuditLogs(task.id);
      setAuditLogs(response.data.data.logs);
      setShowAuditModal(true);
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoadingAudit(false);
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-xl font-semibold text-gray-900">Edit Task</h1>
          </CardHeader>
          <CardBody>
            <TaskForm
              task={task}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      {/* Back Button */}
      <Link
        to="/tasks"
        className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Tasks
      </Link>

      {/* Task Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>
        <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            {overdue && (
              <Badge variant="danger">
                <Clock className="h-3 w-3 mr-1" />
                Overdue
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadAuditLogs}
              disabled={loadingAudit}
            >
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            {isCreator && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Priority */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-4 py-1.5 rounded-xl text-sm font-semibold ${getStatusClass(task.status)}`}>
              {getStatusLabel(task.status)}
            </span>
            <span className={`px-4 py-1.5 rounded-xl text-sm font-semibold ${getPriorityClass(task.priority)}`}>
              {getPriorityLabel(task.priority)} Priority
            </span>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{task.description}</p>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Due Date</h3>
              <div className={`flex items-center text-lg font-medium ${overdue ? 'text-red-600' : 'text-gray-900'}`}>
                <Calendar className="h-5 w-5 mr-2" />
                {formatDate(task.dueDate)}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Assigned To</h3>
              {task.assignedTo ? (
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mr-3 shadow-md">
                    <span className="text-sm font-bold text-white">
                      {getInitials(task.assignedTo.name)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{task.assignedTo.name}</p>
                    <p className="text-sm text-gray-500">{task.assignedTo.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center text-gray-500">
                  <User className="h-5 w-5 mr-2" />
                  Unassigned
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Created By</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center mr-3 shadow-md">
                  <span className="text-sm font-bold text-white">
                    {getInitials(task.creator.name)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{task.creator.name}</p>
                  <p className="text-sm text-gray-500">{task.creator.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">Created At</h3>
              <p className="text-lg font-medium text-gray-900">{formatDateTime(task.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Audit Log Modal */}
      <Modal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        title="Task History"
        size="lg"
      >
        <div className="max-h-96 overflow-y-auto">
          {auditLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No history available</p>
          ) : (
            <div className="space-y-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="border-l-2 border-gray-200 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {log.action === 'CREATE' && 'Task created'}
                      {log.action === 'UPDATE' && `Updated ${log.field}`}
                      {log.action === 'STATUS_CHANGE' && `Status changed`}
                      {log.action === 'ASSIGN' && 'Task assigned'}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(log.createdAt)}
                    </span>
                  </div>
                  {log.oldValue && log.newValue && (
                    <p className="text-sm text-gray-600 mt-1">
                      {log.oldValue} → {log.newValue}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">by {log.user.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default TaskDetailPage;
