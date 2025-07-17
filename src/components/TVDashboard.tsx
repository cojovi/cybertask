import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, Monitor, Zap, AlertTriangle, Lightbulb, CheckCircle, Maximize2 } from 'lucide-react';

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
  const [tvMode, setTvMode] = useState(false);

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
    if (tvMode) {
      // Auto-rotate through sections every 10 seconds in TV mode
      const rotateTimer = setInterval(() => {
        setActiveSection(prev => {
          if (prev === 'high') return 'medium';
          if (prev === 'medium') return 'low';
          return 'high';
        });
      }, 10000);
      return () => clearInterval(rotateTimer);
    }
  }, [tvMode]);

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
    const iconSize = tvMode ? "w-16 h-16" : "w-8 h-8";
    switch (priority) {
      case 'high': return <Zap className={iconSize} />;
      case 'medium': return <AlertTriangle className={iconSize} />;
      case 'low': return <Lightbulb className={iconSize} />;
      default: return <CheckCircle className={iconSize} />;
    }
  };

  const getActiveTasks = () => {
    return sampleTasks.filter(task => task.priority === activeSection);
  };

  // Dynamic classes based on TV mode
  const containerClass = tvMode ? "min-h-screen" : "min-h-screen";
  const headerPadding = tvMode ? "px-16 py-12" : "px-8 py-6";
  const mainPadding = tvMode ? "px-16 py-12" : "px-8 py-6";
  const logoSize = tvMode ? "text-8xl" : "text-4xl";
  const logoIconSize = tvMode ? "text-8xl" : "text-4xl";
  const timeSize = tvMode ? "text-6xl" : "text-3xl";
  const dateSize = tvMode ? "text-2xl" : "text-lg";
  const sectionTitleSize = tvMode ? "text-6xl" : "text-3xl";
  const statCardPadding = tvMode ? "p-12" : "p-6";
  const statIconSize = tvMode ? "w-20 h-20" : "w-12 h-12";
  const statNumberSize = tvMode ? "text-7xl" : "text-4xl";
  const statLabelSize = tvMode ? "text-3xl" : "text-xl";
  const taskCardPadding = tvMode ? "p-12" : "p-6";
  const taskTitleSize = tvMode ? "text-5xl" : "text-2xl";
  const taskDescSize = tvMode ? "text-3xl" : "text-lg";
  const taskStatusSize = tvMode ? "text-2xl" : "text-sm";
  const taskMetaSize = tvMode ? "text-2xl" : "text-sm";
  const indicatorSize = tvMode ? "text-5xl" : "text-2xl";
  const footerSize = tvMode ? "text-xl" : "text-base";

  return (
    <div className={`${containerClass} bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative`}>
      {/* TV Mode Toggle */}
      <button
        onClick={() => setTvMode(!tvMode)}
        className={`fixed top-4 right-4 z-50 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${tvMode ? 'text-lg' : 'text-base'}`}
      >
        <Maximize2 className="w-5 h-5" />
        {tvMode ? 'Computer Mode' : 'TV Mode (40")'}
      </button>

      {/* Scale Indicator */}
      <div className={`fixed top-4 left-4 z-50 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 ${tvMode ? 'text-xl' : 'text-base'}`}>
        <div className="text-cyan-400 font-bold">
          {tvMode ? '40" TV Scale (6-10ft viewing)' : 'Computer Scale'}
        </div>
        <div className="text-gray-300 text-sm">
          {tvMode ? 'Optimized for living room' : 'Optimized for desktop'}
        </div>
      </div>

      {/* Header */}
      <header className={`${headerPadding} bg-black/30 backdrop-blur-md`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className={`flex items-center ${tvMode ? 'space-x-6' : 'space-x-4'}`}>
              <Monitor className={`${tvMode ? 'w-20 h-20' : 'w-12 h-12'} text-cyan-400`} />
              <div>
                <h1 className={`${logoSize} font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent`}>
                  CyberTask
                </h1>
                <p className={`${tvMode ? 'text-3xl' : 'text-lg'} text-gray-300 ${tvMode ? 'mt-2' : 'mt-1'}`}>
                  {tvMode ? 'Mission Control Dashboard' : 'Task Management'}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`${timeSize} font-mono font-bold text-cyan-400`}>
              {formatTime(currentTime)}
            </div>
            <div className={`${dateSize} text-gray-300 ${tvMode ? 'mt-2' : 'mt-1'}`}>
              {formatDate(currentTime)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={mainPadding}>
        {/* Statistics Overview */}
        <section className={tvMode ? "mb-16" : "mb-8"}>
          <h2 className={`${sectionTitleSize} font-bold ${tvMode ? 'mb-12' : 'mb-6'} text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent`}>
            System Overview
          </h2>
          <div className={`grid grid-cols-4 ${tvMode ? 'gap-12' : 'gap-6'}`}>
            <div className={`bg-gradient-to-br from-red-900/30 to-red-800/30 ${statCardPadding} rounded-3xl border-4 border-red-500/50 hover:border-red-400 transition-all duration-300 backdrop-blur-sm`}>
              <div className={`flex items-center ${tvMode ? 'space-x-8' : 'space-x-4'}`}>
                <Zap className={`${statIconSize} text-red-400`} />
                <div>
                  <div className={`${statNumberSize} font-bold text-red-400`}>{stats.high}</div>
                  <div className={`${statLabelSize} text-gray-300`}>Critical</div>
                </div>
              </div>
            </div>
            <div className={`bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 ${statCardPadding} rounded-3xl border-4 border-yellow-500/50 hover:border-yellow-400 transition-all duration-300 backdrop-blur-sm`}>
              <div className={`flex items-center ${tvMode ? 'space-x-8' : 'space-x-4'}`}>
                <AlertTriangle className={`${statIconSize} text-yellow-400`} />
                <div>
                  <div className={`${statNumberSize} font-bold text-yellow-400`}>{stats.medium}</div>
                  <div className={`${statLabelSize} text-gray-300`}>Medium</div>
                </div>
              </div>
            </div>
            <div className={`bg-gradient-to-br from-green-900/30 to-green-800/30 ${statCardPadding} rounded-3xl border-4 border-green-500/50 hover:border-green-400 transition-all duration-300 backdrop-blur-sm`}>
              <div className={`flex items-center ${tvMode ? 'space-x-8' : 'space-x-4'}`}>
                <Lightbulb className={`${statIconSize} text-green-400`} />
                <div>
                  <div className={`${statNumberSize} font-bold text-green-400`}>{stats.low}</div>
                  <div className={`${statLabelSize} text-gray-300`}>Low</div>
                </div>
              </div>
            </div>
            <div className={`bg-gradient-to-br from-blue-900/30 to-blue-800/30 ${statCardPadding} rounded-3xl border-4 border-blue-500/50 hover:border-blue-400 transition-all duration-300 backdrop-blur-sm`}>
              <div className={`flex items-center ${tvMode ? 'space-x-8' : 'space-x-4'}`}>
                <CheckCircle className={`${statIconSize} text-blue-400`} />
                <div>
                  <div className={`${statNumberSize} font-bold text-blue-400`}>{stats.completed}</div>
                  <div className={`${statLabelSize} text-gray-300`}>Complete</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Section Indicator */}
        <div className={`${tvMode ? 'mb-12' : 'mb-6'} text-center`}>
          <div className={`inline-flex items-center ${tvMode ? 'space-x-6' : 'space-x-3'} bg-black/30 backdrop-blur-md rounded-full ${tvMode ? 'px-12 py-6' : 'px-6 py-3'} border-2 border-cyan-400/50`}>
            {getPriorityIcon(activeSection)}
            <div className={`${indicatorSize} font-bold capitalize text-cyan-400`}>
              {activeSection} Priority Tasks
            </div>
            <div className={`${tvMode ? 'w-4 h-4' : 'w-3 h-3'} bg-cyan-400 rounded-full animate-pulse`}></div>
          </div>
        </div>

        {/* Tasks Display */}
        <section className={`grid grid-cols-1 ${tvMode ? 'gap-8' : 'gap-4'}`}>
          {getActiveTasks().map((task, index) => (
            <div
              key={task.id}
              className={`bg-gradient-to-r ${
                task.priority === 'high' 
                  ? 'from-red-900/20 to-red-800/20 border-red-500/50' 
                  : task.priority === 'medium'
                  ? 'from-yellow-900/20 to-yellow-800/20 border-yellow-500/50'
                  : 'from-green-900/20 to-green-800/20 border-green-500/50'
              } ${taskCardPadding} rounded-3xl border-4 backdrop-blur-sm transform transition-all duration-500 hover:scale-[1.02]`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`flex items-center ${tvMode ? 'space-x-6' : 'space-x-3'} ${tvMode ? 'mb-6' : 'mb-3'}`}>
                    {getPriorityIcon(task.priority)}
                    <div>
                      <h3 className={`${taskTitleSize} font-bold text-white ${tvMode ? 'mb-2' : 'mb-1'}`}>{task.title}</h3>
                      <div className={`inline-flex items-center ${tvMode ? 'px-6 py-3' : 'px-3 py-1'} rounded-full ${taskStatusSize} font-semibold ${
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
                  <p className={`${taskDescSize} text-gray-300 leading-relaxed ${tvMode ? 'mb-6' : 'mb-3'}`}>
                    {task.description}
                  </p>
                  <div className={`flex items-center ${tvMode ? 'space-x-8' : 'space-x-4'} ${taskMetaSize} text-gray-400`}>
                    <div className="flex items-center space-x-3">
                      <div className={`${tvMode ? 'w-3 h-3' : 'w-2 h-2'} bg-cyan-400 rounded-full`}></div>
                      <span>Due: {new Date(task.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`${tvMode ? 'w-3 h-3' : 'w-2 h-2'} bg-purple-400 rounded-full`}></div>
                      <span>Priority: {task.priority.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Auto-rotate indicator (TV mode only) */}
        {tvMode && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-4 text-2xl text-gray-400">
              <div className="w-6 h-6 bg-cyan-400 rounded-full animate-spin"></div>
              <span>Auto-rotating sections every 10 seconds</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer with system info */}
      <footer className={`absolute bottom-8 left-16 right-16 flex justify-between items-center ${footerSize} text-gray-400`}>
        <div className="flex items-center space-x-6">
          <div className={`${tvMode ? 'w-4 h-4' : 'w-3 h-3'} bg-green-400 rounded-full animate-pulse`}></div>
          <span>System Online</span>
        </div>
        <div className="flex items-center space-x-6">
          <RefreshCw className={`${tvMode ? 'w-6 h-6' : 'w-4 h-4'} animate-spin`} />
          <span>Live Updates Active</span>
        </div>
      </footer>
    </div>
  );
};

export default TVDashboard;