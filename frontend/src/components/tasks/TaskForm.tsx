import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Textarea, Select } from '../ui';
import { useUsers } from '../../hooks';
import { Priority, Status, Task } from '../../types';
import { formatDateForInput } from '../../lib/utils';

// Validation schema
const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Description must be less than 5000 characters'),
  dueDate: z
    .string()
    .min(1, 'Due date is required'),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(Status),
  assignedToId: z.string().optional().nullable(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

/**
 * Task creation/editing form component
 */
export function TaskForm({ task, onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  const { users } = useUsers();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate ? formatDateForInput(task.dueDate) : '',
      priority: task?.priority || Priority.MEDIUM,
      status: task?.status || Status.TODO,
      assignedToId: task?.assignedToId || '',
    },
  });

  const priorityOptions = [
    { value: Priority.LOW, label: 'Low' },
    { value: Priority.MEDIUM, label: 'Medium' },
    { value: Priority.HIGH, label: 'High' },
    { value: Priority.URGENT, label: 'Urgent' },
  ];

  const statusOptions = [
    { value: Status.TODO, label: 'To Do' },
    { value: Status.IN_PROGRESS, label: 'In Progress' },
    { value: Status.REVIEW, label: 'Review' },
    { value: Status.COMPLETED, label: 'Completed' },
  ];

  const userOptions = [
    { value: '', label: 'Unassigned' },
    ...users.map((user) => ({
      value: user.id,
      label: user.name,
    })),
  ];

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit({
      ...data,
      assignedToId: data.assignedToId || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Title"
        placeholder="Enter task title"
        error={errors.title?.message}
        {...register('title')}
      />

      <Textarea
        label="Description"
        placeholder="Enter task description"
        error={errors.description?.message}
        rows={4}
        {...register('description')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Due Date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />

        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select
              label="Priority"
              options={priorityOptions}
              error={errors.priority?.message}
              {...field}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              options={statusOptions}
              error={errors.status?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="assignedToId"
          control={control}
          render={({ field }) => (
            <Select
              label="Assign To"
              options={userOptions}
              error={errors.assignedToId?.message}
              {...field}
              value={field.value || ''}
            />
          )}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;
