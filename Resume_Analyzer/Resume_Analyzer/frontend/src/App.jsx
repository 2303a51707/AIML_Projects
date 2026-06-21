import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Analyze from './pages/Analyze';
import History from './pages/History';
import About from './pages/About';
import Contact from './pages/Contact';
import SkillAnalytics from './pages/SkillAnalytics';
import AtsTemplates from './pages/AtsTemplates';
import Settings from './pages/Settings';
import api from './utils/api';
import { Home as HomeIcon, LayoutDashboard, BarChart3, History as HistoryIcon, FolderOpen, Settings as SettingsIcon, LogOut, LogIn, UserPlus } from 'lucide-react';

const sidebarNav = [
  { path: '/', label: 'Dashboard', icon: HomeIcon },
  { path: '/analyze', label: 'AI Workspace', icon: LayoutDashboard },
  { path: '/history', label: 'Scan History', icon: HistoryIcon, badgeKey: 'scanCount' },
  { path: '/skills', label: 'Skill Analytics', icon: BarChart3 },
  { path: '/templates', label: 'ATS Templates', icon: FolderOpen },
];

const SidebarContent = ({ scanCount, onClose }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const avatar = localStorage.getItem('avatarPreview');

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const renderLink = (item) => {
    const active = isActive(item.path);
    const badge = item.badgeKey === 'scanCount' ? scanCount : undefined;
    const Icon = item.icon;

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
          active
            ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
        }`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
        <span className="flex-1">{item.label}</span>
        {badge !== undefined && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            active
              ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            {badge}
          </span>
        )}
        {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-r-full"></span>}
      </Link>
    );
  };

  return (
    <div className="h-full bg-white/95 dark:bg-slate-900/95 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
      <nav className="px-3 pt-5 space-y-1.5">
        {sidebarNav.map(renderLink)}
      </nav>

      <div className="px-3 pb-3 space-y-1.5">
        <div className="border-t border-slate-200 dark:border-slate-800/60 pt-3">
          {renderLink({ path: '/settings', label: 'Settings', icon: SettingsIcon })}
        </div>

        {token && user ? (
          <div className="border-t border-slate-200 dark:border-slate-800/60 pt-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                {avatar ? (
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" aria-label="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-slate-200 dark:border-slate-800/60 px-1 pt-3 flex items-center gap-2">
            <Link to="/login" onClick={onClose} className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
              <LogIn className="w-4 h-4 inline mr-1.5" />
              Login
            </Link>
            <Link to="/register" onClick={onClose} className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-colors">
              <UserPlus className="w-4 h-4 inline mr-1.5" />
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      api.get('/analyze/history')
        .then(res => setScanCount(Array.isArray(res.data) ? res.data.length : 0))
        .catch(() => {});
    }
  }, [token]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-white dark:bg-slate-950">
      <Navbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
      />

      <div className="flex flex-1 overflow-hidden">
        <aside
          className="shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out h-full"
          style={{ width: sidebarOpen ? 288 : 0 }}
        >
          <SidebarContent
            scanCount={scanCount}
            onClose={() => setSidebarOpen(false)}
          />
        </aside>

        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={token ? <Navigate to="/analyze" replace /> : <Login />} />
              <Route path="/register" element={token ? <Navigate to="/analyze" replace /> : <Register />} />
              <Route path="/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/skills" element={<SkillAnalytics />} />
              <Route path="/templates" element={<AtsTemplates />} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
