import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, Monitor, Zap, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  date: string;
  database: string;
}

const TVDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState<'high' | 'medium' | 'low'>('high');

  // Sample data for demonstration
  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Complete Security Audit',
      description: 'Perform comprehensive security assessment of all systems and protocols',
      status: 'In Progress',
      priority: 'high',
      date: '2024-01-15',
      database: 'high'
    },
    {
      id: '2',
      title: 'Update API Documentation',
      description: 'Revise and update all API endpoint documentation for v2.0 release',
      status: 'Not Started',
      priority: 'medium',
      date: '2024-01-20',
      database: 'medium'
    },
    {
      id: '3',
      title: 'Optimize Database Queries',
      description: 'Review and optimize slow-running database queries for better performance',
      status: 'Completed',
      priority: 'low',
      date: '2024-01-10',
      database: 'low'
    }
  ];

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

  useEffect(() => {
    // Auto-rotate through sections every 10 seconds
    const rotateTimer = setInterval(() => {
      setActiveSection(prev => {
        if (prev === 'high') return 'medium';
        if (prev === 'medium') return 'low';
        return 'high';
      });
    }, 10000);
    return () => clearInterval(rotateTimer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Zap className="w-16 h-16" />;
      case 'medium': return <AlertTriangle className="w-16 h-16" />;
      case 'low': return <Lightbulb className="w-16 h-16" />;
      default: return <CheckCircle className="w-16 h-16" />;
    }
  };

  const getActiveTasks = () => {
    return sampleTasks.filter(task => task.priority === activeSection);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* TV-Optimized Header */}
      <header className="px-16 py-12 bg-black/30 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Monitor className="w-20 h-20 text-cyan-400" />
              <div>
                <h1 className="text-8xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  CyberTask
                </h1>
                <p className="text-3xl text-gray-300 mt-2">Mission Control Dashboard</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-6xl font-mono font-bold text-cyan-400">
              {formatTime(currentTime)}
            </div>
            <div className="text-2xl text-gray-300 mt-2">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-16 py-12">
        {/* Statistics Overview */}
        <section className="mb-16">
          <h2 className="text-6xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            System Overview
          </h2>
          <div className="grid grid-cols-4 gap-12">
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 p-12 rounded-3xl border-4 border-red-500/50 hover:border-red-400 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center space-x-8">
                <Zap className="w-20 h-20 text-red-400" />
                <div>
                  <div className="text-7xl font-bold text-red-400">{stats.high}</div>
                  <div className="text-3xl text-gray-300">Critical</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 p-12 rounded-3xl border-4 border-yellow-500/50 hover:border-yellow-400 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center space-x-8">
                <AlertTriangle className="w-20 h-20 text-yellow-400" />
                <div>
                  <div className="text-7xl font-bold text-yellow-400">{stats.medium}</div>
                  <div className="text-3xl text-gray-300">Medium</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-12 rounded-3xl border-4 border-green-500/50 hover:border-green-400 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center space-x-8">
                <Lightbulb className="w-20 h-20 text-green-400" />
                <div>
                  <div className="text-7xl font-bold text-green-400">{stats.low}</div>
                  <div className="text-3xl text-gray-300">Low</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-12 rounded-3xl border-4 border-blue-500/50 hover:border-blue-400 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center space-x-8">
                <CheckCircle className="w-20 h-20 text-blue-400" />
                <div>
                  <div className="text-7xl font-bold text-blue-400">{stats.completed}</div>
                  <div className="text-3xl text-gray-300">Complete</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Section Indicator */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-6 bg-black/30 backdrop-blur-md rounded-full px-12 py-6 border-2 border-cyan-400/50">
            {getPriorityIcon(activeSection)}
            <div className="text-5xl font-bold capitalize text-cyan-400">
              {activeSection} Priority Tasks
            </div>
            <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Tasks Display */}
        <section className="grid grid-cols-1 gap-8">
          {getActiveTasks().map((task, index) => (
            <div
              key={task.id}
              className={`bg-gradient-to-r ${
                task.priority === 'high' 
                  ? 'from-red-900/20 to-red-800/20 border-red-500/50' 
                  : task.priority === 'medium'
                  ? 'from-yellow-900/20 to-yellow-800/20 border-yellow-500/50'
                  : 'from-green-900/20 to-green-800/20 border-green-500/50'
              } p-12 rounded-3xl border-4 backdrop-blur-sm transform transition-all duration-500 hover:scale-[1.02]`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-6 mb-6">
                    {getPriorityIcon(task.priority)}
                    <div>
                      <h3 className="text-5xl font-bold text-white mb-2">{task.title}</h3>
                      <div className={`inline-flex items-center px-6 py-3 rounded-full text-2xl font-semibold ${
                        task.status === 'Completed' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : task.status === 'In Progress'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                          : 'bg-red-500/20 text-red-400 border border-red-500/50'
                      }`}>
                        {task.status}
                      </div>
                    </div>
                  </div>
                  <p className="text-3xl text-gray-300 leading-relaxed mb-6">
                    {task.description}
                  </p>
                  <div className="flex items-center space-x-8 text-2xl text-gray-400">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                      <span>Due: {new Date(task.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <span>Priority: {task.priority.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Auto-rotate indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 text-2xl text-gray-400">
            <div className="w-6 h-6 bg-cyan-400 rounded-full animate-spin"></div>
            <span>Auto-rotating sections every 10 seconds</span>
          </div>
        </div>
      </main>

      {/* Footer with system info */}
      <footer className="absolute bottom-8 left-16 right-16 flex justify-between items-center text-xl text-gray-400">
        <div className="flex items-center space-x-6">
          <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          <span>System Online</span>
        </div>
        <div className="flex items-center space-x-6">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Live Updates Active</span>
        </div>
      </footer>
    </div>
  );
};

export default TVDashboard;