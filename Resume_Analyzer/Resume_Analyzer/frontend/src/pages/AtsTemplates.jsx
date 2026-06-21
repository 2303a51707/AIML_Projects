import React from 'react';
import { FolderOpen, Download, Eye, Clock, Star, FileText } from 'lucide-react';

const templates = [
  {
    id: 'modern-1',
    name: 'Clean Minimal',
    category: 'Modern Layouts',
    description: 'A streamlined single-column layout with ample white space, ideal for tech and creative roles.',
    downloads: '12.4k',
    rating: 4.8,
    tags: ['ATS-Friendly', 'Single Column', 'Minimal'],
  },
  {
    id: 'modern-2',
    name: 'Split Impact',
    category: 'Modern Layouts',
    description: 'Two-column design that highlights skills on the left and experience on the right.',
    downloads: '8.9k',
    rating: 4.6,
    tags: ['Two Column', 'Skill-Focused', 'Modern'],
  },
  {
    id: 'modern-3',
    name: 'Timeline Pro',
    category: 'Modern Layouts',
    description: 'Visual career timeline layout perfect for senior roles with progressive responsibility.',
    downloads: '6.2k',
    rating: 4.7,
    tags: ['Timeline', 'Senior Level', 'Visual'],
  },
  {
    id: 'executive-1',
    name: 'Boardroom',
    category: 'Executive Frameworks',
    description: 'Premium dark-accent template designed for C-suite and executive-level applications.',
    downloads: '4.1k',
    rating: 4.9,
    tags: ['Executive', 'Dark Accent', 'Premium'],
  },
  {
    id: 'executive-2',
    name: 'Leadership Brief',
    category: 'Executive Frameworks',
    description: 'Focuses on strategic achievements, board experience, and leadership metrics.',
    downloads: '3.7k',
    rating: 4.8,
    tags: ['Leadership', 'Metrics-Focused', 'Strategic'],
  },
  {
    id: 'executive-3',
    name: 'Portfolio Suite',
    category: 'Executive Frameworks',
    description: 'Combines a traditional resume with a portfolio section for speaking engagements and publications.',
    downloads: '2.8k',
    rating: 4.7,
    tags: ['Portfolio', 'Publications', 'Comprehensive'],
  },
];

const modernTemplates = templates.filter((t) => t.category === 'Modern Layouts');
const executiveTemplates = templates.filter((t) => t.category === 'Executive Frameworks');

const TemplateCard = ({ t }) => (
  <div className="bg-slate-100 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
        <FileText className="w-5 h-5 text-blue-400" />
      </div>
      <div className="flex items-center gap-1 text-amber-400">
        <Star className="w-3.5 h-3.5 fill-current" />
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t.rating}</span>
      </div>
    </div>

    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{t.name}</h3>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{t.description}</p>

    <div className="flex flex-wrap gap-1.5 mb-4">
      {t.tags.map((tag) => (
        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-300/50 dark:border-slate-700/50">
          {tag}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
        <Download className="w-3.5 h-3.5" />
        {t.downloads}
      </div>
      <button className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
        <Eye className="w-3.5 h-3.5" />
        Preview
      </button>
    </div>
  </div>
);

const AtsTemplates = () => {
  return (
    <div className="relative min-h-screen py-12 px-6">
      <div className="bg-glow top-1/4 right-1/4 bg-primary-500"></div>
      <div className="bg-glow bottom-1/4 left-1/4 bg-indigo-500"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">ATS Templates</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Professionally designed resume frameworks</p>
          </div>
        </div>

        {/* Modern Layouts */}
        <div className="mb-12" id="modern-layouts">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Modern Layouts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {modernTemplates.map((t) => (
              <TemplateCard key={t.id} t={t} />
            ))}
          </div>
        </div>

        {/* Executive Frameworks */}
        <div id="executive-frameworks">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Executive Frameworks</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {executiveTemplates.map((t) => (
              <TemplateCard key={t.id} t={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtsTemplates;
