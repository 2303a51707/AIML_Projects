import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Send, Heart } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Globe, href: '#', label: 'Website' },
    { icon: MessageCircle, href: '#', label: 'Community' },
    { icon: Send, href: '#', label: 'Telegram' },
  ];

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md">
                <svg viewBox="0 0 28 28" className="w-[18px] h-[18px]" fill="none">
                  <text x="14" y="15.5" dominantBaseline="central" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="13" fill="#3B82F6" letterSpacing="-0.5">RM</text>
                </svg>
              </div>
              <span className="text-slate-900 dark:text-white font-bold text-base tracking-tight">ResuMatch.ai</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mb-5">
              AI-powered resume analysis to help you land your dream job by optimizing for ATS systems and recruiters.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-110 transition-all duration-200"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold text-sm mb-4 tracking-wide">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/analyze" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">AI Workspace</Link></li>
              <li><Link to="/history" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">Scan History</Link></li>
              <li><Link to="/skills" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">Skill Analytics</Link></li>
              <li><Link to="/templates" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">ATS Templates</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold text-sm mb-4 tracking-wide">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">About Our AI</Link></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">ATS Scanning Guides</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-semibold text-sm mb-4 tracking-wide">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">Contact Support</Link></li>
              <li><Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">FAQ Help Desk</Link></li>
              <li>
                <a href="mailto:support@resumatch.ai" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200 inline-flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  support@resumatch.ai
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800"></div>

      <div className="max-w-6xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-500 dark:text-slate-500 text-xs">&copy; 2026 ResuMatch.ai. All rights reserved.</p>
          <p className="text-slate-500 dark:text-slate-500 text-xs inline-flex items-center gap-1.5">
            Designed for Engineers
            <Heart className="w-3 h-3 text-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
