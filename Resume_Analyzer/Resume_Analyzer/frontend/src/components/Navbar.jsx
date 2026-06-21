import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Settings, LogOut, LogIn, UserPlus } from 'lucide-react';
import resumatchLogo from '../assets/ResuMatch logo.png';

const DefaultAvatar = () => (
  <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="16" r="6" />
    <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" />
  </svg>
);

const Navbar = ({ sidebarOpen, onToggleSidebar }) => {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [avatar, setAvatar] = useState(() => localStorage.getItem('avatarPreview'));
  const profileRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'));
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
      setAvatar(localStorage.getItem('avatarPreview'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    setProfileOpen(false);
    setAvatar(null);
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact' },
  ];

  const linkBase = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors';

  return (
    <header className="h-16 shrink-0 flex items-center px-4 border-b border-slate-200 dark:border-slate-800/60 bg-white/95 dark:bg-slate-900/95">
      <div className="flex items-center gap-3 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3 shrink-0">
          <button
            data-sidebar-toggle
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <img src={resumatchLogo} alt="ResuMatch" className="h-10 w-auto" />
            <span className="text-slate-900 dark:text-white text-sm font-bold tracking-tight hidden sm:inline">ResuMatch.ai</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1 mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${linkBase} ${
                isActive(link.path)
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md hover:shadow-lg hover:scale-105 transition-all overflow-hidden"
              aria-label="Profile"
            >
              {isAuthenticated && avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <DefaultAvatar />
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none z-[100] p-4 text-left">
                {token && user ? (
                  <>
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex w-full items-center gap-2 px-2 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-md transition-colors">
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 px-2 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <Link to="/login" onClick={() => setProfileOpen(false)} className="flex w-full items-center gap-2 px-2 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-md transition-colors">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setProfileOpen(false)} className="flex w-full items-center gap-2 px-2 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors">
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
