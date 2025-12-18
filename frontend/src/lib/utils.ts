import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for conditional class names
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format a date string for display
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a date string with time
 * @param dateString - ISO date string
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format a date for input fields (YYYY-MM-DD)
 * @param dateString - ISO date string
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

/**
 * Check if a date is in the past
 * @param dateString - ISO date string
 * @returns Boolean indicating if date is in the past
 */
export function isOverdue(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.round(diffMs / (1000 * 60));
      if (diffMinutes === 0) return 'Just now';
      if (diffMinutes > 0) return `in ${diffMinutes} minutes`;
      return `${Math.abs(diffMinutes)} minutes ago`;
    }
    if (diffHours > 0) return `in ${diffHours} hours`;
    return `${Math.abs(diffHours)} hours ago`;
  }

  if (diffDays > 0) {
    if (diffDays === 1) return 'Tomorrow';
    return `in ${diffDays} days`;
  }

  if (diffDays === -1) return 'Yesterday';
  return `${Math.abs(diffDays)} days ago`;
}

/**
 * Get priority badge class
 * @param priority - Task priority
 * @returns CSS class string
 */
export function getPriorityClass(priority: string): string {
  const classes: Record<string, string> = {
    LOW: 'priority-low',
    MEDIUM: 'priority-medium',
    HIGH: 'priority-high',
    URGENT: 'priority-urgent',
  };
  return classes[priority] || 'priority-medium';
}

/**
 * Get status badge class
 * @param status - Task status
 * @returns CSS class string
 */
export function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    TODO: 'status-todo',
    IN_PROGRESS: 'status-in-progress',
    REVIEW: 'status-review',
    COMPLETED: 'status-completed',
  };
  return classes[status] || 'status-todo';
}

/**
 * Get human-readable status label
 * @param status - Task status
 * @returns Human-readable status
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    REVIEW: 'Review',
    COMPLETED: 'Completed',
  };
  return labels[status] || status;
}

/**
 * Get human-readable priority label
 * @param priority - Task priority
 * @returns Human-readable priority
 */
export function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
  };
  return labels[priority] || priority;
}

/**
 * Truncate text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Get initials from a name
 * @param name - Full name
 * @returns Initials (e.g., "JD" for "John Doe")
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
