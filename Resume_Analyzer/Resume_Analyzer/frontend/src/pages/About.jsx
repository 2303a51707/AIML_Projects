import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, CheckCircle, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="bg-glow top-1/4 left-1/4 bg-primary-500"></div>
      <div className="bg-glow bottom-1/4 right-1/4 bg-indigo-500"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white">
            About <span className="text-gradient">ResuMatch.ai</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Helping job seekers optimize their resumes for modern applicant tracking systems.
          </p>
        </div>

        <div className="glass-panel p-8 sm:p-10 rounded-2xl space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              ResuMatch.ai is an intelligent resume analysis tool built to help job seekers tailor their resumes for
              specific roles. Our AI-powered engine compares your resume against target job requirements, identifies
              critical skill gaps, and provides actionable feedback to improve your chances of passing ATS filters and
              landing interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-100 dark:bg-slate-900/40 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center">
              <Zap className="w-8 h-8 text-primary-600 dark:text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">AI-Powered Analysis</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Advanced AI models scan and evaluate your resume against job-specific criteria.
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-900/40 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Instant Feedback</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Get detailed scores, missing keywords, and revision suggestions in seconds.
              </p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-900/40 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-center">
              <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Privacy First</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Your resume data is encrypted and never shared with third parties.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link to="/analyze" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
              Try It Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
