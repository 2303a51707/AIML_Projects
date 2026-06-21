import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Zap, ChevronRight, ArrowRight, Shield } from 'lucide-react';

const Home = () => {
  const token = localStorage.getItem('token');
  const targetPath = token ? '/analyze' : '/login';

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 px-6">
      {/* Decorative Glows */}
      <div className="bg-glow top-1/4 left-1/4 bg-primary-600/20"></div>
      <div className="bg-glow bottom-1/4 right-1/4 bg-indigo-600/20"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center text-center">

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight text-slate-900 dark:text-white animate-fade-in-up animate-delay-100">
          Optimize Your Resume For <br className="hidden sm:inline" />
          <span className="text-gradient">ATS Success</span> Instantly
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed animate-fade-in-up animate-delay-200">
          Enter your target job title, list the required skills from the job post, and scan your resume to instantly see your eligibility score.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20 justify-center w-full sm:w-auto animate-fade-in-up animate-delay-300">
          <Link to={targetPath} className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-base shadow-xl group">
            <span>Analyze Your Resume Now</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/register" className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-base shadow-md group">
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-16 text-slate-500 dark:text-slate-400 animate-fade-in-up animate-delay-400">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Free to Start</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Instant Results</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-5xl text-left">
          <div className="glass-panel glass-panel-hover p-6 lg:p-8 rounded-2xl group">
            <div className="bg-gradient-to-br from-primary-600/20 to-primary-600/10 w-14 h-14 rounded-2xl flex items-center justify-center border border-primary-500/20 mb-5 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Instant Compatibility Match</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Receive a comprehensive match score out of 10 comparing your profile against complex job descriptions.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 lg:p-8 rounded-2xl group">
            <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-600/10 w-14 h-14 rounded-2xl flex items-center justify-center border border-indigo-500/20 mb-5 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Keyword Gap Finder</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Detect critical keywords and technical skills missing from your resume that are required by applicant tracking systems.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 lg:p-8 rounded-2xl group">
            <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-600/10 w-14 h-14 rounded-2xl flex items-center justify-center border border-emerald-500/20 mb-5 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Section-by-Section Feedback</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Get targeted insights on your experience, skills, and education sections to structure your profile professionally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
