import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks';
import { StatCardSkeleton } from '../components/ui';
import { TaskList } from '../components/tasks';
import { useAuth } from '../contexts/AuthContext';
import {
  ClipboardList,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Plus,
  TrendingUp,
  Calendar,
  Sparkles,
} from 'lucide-react';

/**
 * Dashboard page component
 */
export function DashboardPage() {
  const { user } = useAuth();
  const { stats, assignedTasks, createdTasks, overdueTasks, isLoading } = useDashboard();

  const statCards = [
    {
      label: 'Assigned to Me',
      value: stats?.assigned || 0,
      icon: UserCheck,
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50',
      iconBg: 'bg-blue-500/10',
      textColor: 'text-blue-700',
    },
    {
      label: 'Created by Me',
      value: stats?.created || 0,
      icon: ClipboardList,
      gradient: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50',
      iconBg: 'bg-emerald-500/10',
      textColor: 'text-emerald-700',
    },
    {
      label: 'Overdue',
      value: stats?.overdue || 0,
      icon: AlertTriangle,
      gradient: 'from-red-500 to-rose-600',
      lightBg: 'bg-red-50',
      iconBg: 'bg-red-500/10',
      textColor: 'text-red-700',
    },
    {
      label: 'In Progress',
      value: stats?.inProgress || 0,
      icon: PlayCircle,
      gradient: 'from-amber-500 to-orange-500',
      lightBg: 'bg-amber-50',
      iconBg: 'bg-amber-500/10',
      textColor: 'text-amber-700',
    },
    {
      label: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCircle,
      gradient: 'from-violet-500 to-purple-600',
      lightBg: 'bg-violet-50',
      iconBg: 'bg-violet-500/10',
      textColor: 'text-violet-700',
    },
  ];

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 rounded-2xl p-8 text-white">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {greeting}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-white/80 text-lg">
              Here's what's happening with your tasks today
            </p>
          </div>
          <Link
            to="/tasks/new"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-700 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg shadow-black/10 group"
          >
            <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Create New Task
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((stat) => (
              <div
                key={stat.label}
                className={`relative overflow-hidden ${stat.lightBg} rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 group`}
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}></div>
                
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 flex flex-wrap items-center justify-center gap-8 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Productivity</p>
            <p className="text-lg font-bold text-gray-900">
              {stats?.completed && stats?.assigned 
                ? Math.round((stats.completed / (stats.assigned || 1)) * 100) 
                : 0}%
            </p>
          </div>
        </div>
        <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Completion Rate</p>
            <p className="text-lg font-bold text-gray-900">
              {stats?.completed || 0} / {(stats?.assigned || 0) + (stats?.completed || 0)}
            </p>
          </div>
        </div>
        <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Sparkles className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Active Tasks</p>
            <p className="text-lg font-bold text-gray-900">{stats?.inProgress || 0}</p>
          </div>
        </div>
      </div>

      {/* Overdue Tasks */}
      {(isLoading || overdueTasks.length > 0) && (
        <section className="bg-red-50/50 rounded-xl p-6 border border-red-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              Overdue Tasks
              {overdueTasks.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {overdueTasks.length}
                </span>
              )}
            </h2>
            <Link
              to="/tasks?overdue=true"
              className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
            >
              View all →
            </Link>
          </div>
          <TaskList
            tasks={overdueTasks.slice(0, 3)}
            isLoading={isLoading}
            emptyMessage="No overdue tasks"
          />
        </section>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Assigned Tasks */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-transparent">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              Assigned to Me
            </h2>
            <Link
              to="/tasks?assignedToMe=true"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="p-5">
            <TaskList
              tasks={assignedTasks.slice(0, 4)}
              isLoading={isLoading}
              emptyMessage="No tasks assigned to you"
            />
          </div>
        </section>

        {/* Created Tasks */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-transparent">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                <ClipboardList className="h-5 w-5 text-emerald-600" />
              </div>
              Created by Me
            </h2>
            <Link
              to="/tasks?createdByMe=true"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="p-5">
            <TaskList
              tasks={createdTasks.slice(0, 4)}
              isLoading={isLoading}
              emptyMessage="You haven't created any tasks yet"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
