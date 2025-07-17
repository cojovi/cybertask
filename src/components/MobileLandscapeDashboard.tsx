import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, Menu, X, Filter, Clock, Zap, AlertTriangle, Lightbulb, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
  database: string;
}

const MobileLandscapeDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Sample data for demonstration
  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Security Audit',
      description: 'Comprehensive security assessment of all systems',
      status: 'In Progress',
      priority: 'high',
      date: '2024-01-15',
      database: 'high'
    },
    {
      id: '2',
      title: 'API Documentation',
      description: 'Update all API endpoint documentation',
      status: 'Not Started',
      priority: 'medium',
      date: '2024-01-20',
      database: 'medium'
    },
    {
      id: '3',
      title: 'Database Optimization',
      description: 'Optimize slow database queries',
      status: 'Completed',
      priority: 'low',
      date: '2024-01-10',
      database: 'low'
    },
    {
      id: '4',
      title: 'User Interface Review',
      description: 'Review and improve user interface components',
      status: 'In Progress',
      priority: 'high',
      date: '2024-01-18',
      database: 'high'
    },
    {
      id: '5',
      title: 'Performance Testing',
      description: 'Conduct comprehensive performance testing',
      status: 'Not Started',
      priority: 'medium',
      date: '2024-01-25',
      database: 'medium'
    }
  ];

  const filteredTasks = activeFilter === 'all' 
    ? sampleTasks 
    : sampleTasks.filter(task => task.priority === activeFilter);

  const stats = {
    high: sampleTasks.filter(t => t.priority === 'high').length,
    medium: sampleTasks.filter(t => t.priority === 'medium').length,
    low: sampleTasks.filter(t => t.priority === 'low').length,
    completed: sampleTasks.filter(t => t.status === 'Completed').length
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Zap className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'low': return <Lightbulb className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden flex landscape:flex-row">
      {/* Left Sidebar - Optimized for landscape thumb reach */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-black/30 backdrop-blur-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:w-80`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                CyberTask
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-4 flex items-center space-x-3">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span className="text-lg font-mono">{formatTime(currentTime)}</span>
            </div>
          </div>

          {/* Quick Stats - Vertical in sidebar */}
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-900/30 p-4 rounded-xl border border-red-500/30">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-red-400" />
                  <div>
                    <div className="text-2xl font-bold text-red-400">{stats.high}</div>
                    <div className="text-sm text-gray-400">Critical</div>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-900/30 p-4 rounded-xl border border-yellow-500/30">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.medium}</div>
                    <div className="text-sm text-gray-400">Medium</div>
                  </div>
                </div>
              </div>
              <div className="bg-green-900/30 p-4 rounded-xl border border-green-500/30">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-2xl font-bold text-green-400">{stats.low}</div>
                    <div className="text-sm text-gray-400">Low</div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-500/30">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{stats.completed}</div>
                    <div className="text-sm text-gray-400">Done</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Controls - Thumb-friendly positioning */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Filter Tasks</h3>
            <div className="space-y-3">
              {['all', 'high', 'medium', 'low'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter as any)}
                  className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {filter === 'all' ? <Filter className="w-5 h-5" /> : getPriorityIcon(filter)}
                    <span className="capitalize font-medium">{filter === 'all' ? 'All Tasks' : `${filter} Priority`}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons - Bottom positioned for easy thumb access */}
          <div className="mt-auto p-6 border-t border-white/10">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 p-4 rounded-xl font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-200 flex items-center justify-center space-x-2">
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Tasks</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Optimized for landscape viewing */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Navigation Bar - Landscape optimized */}
        <div className="bg-black/20 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          
          {/* Search bar - Centered for landscape */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-400">{filteredTasks.length} tasks</div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Main Content - Split view for landscape */}
        <div className="flex-1 flex overflow-hidden">
          {/* Task List - Left side of main content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="space-y-4">
                {filteredTasks.map((task, index) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 cursor-pointer transition-all duration-200 hover:border-cyan-400/50 hover:bg-slate-700/50 ${
                      selectedTask?.id === task.id ? 'border-cyan-400/50 bg-slate-700/50' : ''
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.5s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-gray-300 mt-2 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>Due: {new Date(task.date).toLocaleDateString()}</span>
                        <span className="capitalize">{task.priority} Priority</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Detail Panel - Right side (landscape advantage) */}
          <div className="w-96 bg-black/20 border-l border-white/10 overflow-y-auto">
            {selectedTask ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Task Details</h2>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{selectedTask.title}</h3>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTask.status)}`}>
                        {selectedTask.status}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedTask.priority)}`}></div>
                        <span className="capitalize text-sm">{selectedTask.priority} Priority</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-300 leading-relaxed">{selectedTask.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Due Date</span>
                        <span>{new Date(selectedTask.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Priority</span>
                        <span className="capitalize">{selectedTask.priority}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Status</span>
                        <span>{selectedTask.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 p-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-200">
                      Open in Notion
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="mt-20">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Select a Task</h3>
                  <p className="text-gray-400">Choose a task from the list to view its details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MobileLandscapeDashboard;