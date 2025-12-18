import { Link } from 'react-router-dom';
import { useNotifications, useNotificationMutations } from '../hooks';
import { Button, Skeleton } from '../components/ui';
import { getRelativeTime } from '../lib/utils';
import { Bell, Check, CheckCheck, ExternalLink, Sparkles, BellOff } from 'lucide-react';

/**
 * Notifications page component
 */
export function NotificationsPage() {
  const { notifications, isLoading, mutate } = useNotifications();
  const { markAsRead, markAllAsRead } = useNotificationMutations();

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    mutate();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    mutate();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Bell className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
              <p className="text-white/80 mt-1 flex items-center gap-2">
                {unreadCount > 0 ? (
                  <>
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-white/20 rounded-full text-sm font-bold">
                      {unreadCount}
                    </span>
                    unread notification{unreadCount > 1 ? 's' : ''}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    All caught up!
                  </>
                )}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="secondary" 
              onClick={handleMarkAllAsRead}
              className="!bg-white !text-indigo-600 hover:!bg-gray-100 !shadow-lg"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-5 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <BellOff className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              When you receive notifications about task updates, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`p-5 flex items-start justify-between transition-all duration-300 hover:bg-gray-50 ${
                  !notification.read ? 'bg-gradient-to-r from-indigo-50/50 to-transparent border-l-4 border-l-indigo-500' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2.5 rounded-xl transition-colors ${
                      notification.read 
                        ? 'bg-gray-100' 
                        : 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/25'
                    }`}
                  >
                    <Bell
                      className={`h-4 w-4 ${
                        notification.read ? 'text-gray-500' : 'text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5">
                      {getRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {notification.taskId && (
                    <Link
                      to={`/tasks/${notification.taskId}`}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View task"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
