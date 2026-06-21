import React from 'react';
import { BarChart3, TrendingUp, Target, AlertTriangle, Lightbulb, Layers } from 'lucide-react';

const SkillAnalytics = () => {
  const gapCategories = [
    { title: 'Technical Skills', color: 'text-rose-500', items: ['Python (Advanced)', 'AWS CloudFormation', 'Docker / Kubernetes', 'GraphQL APIs'] },
    { title: 'Soft Skills', color: 'text-amber-500', items: ['Cross-team Collaboration', 'Technical Presentations', 'Stakeholder Management'] },
    { title: 'Domain Knowledge', color: 'text-indigo-500', items: ['Fintech Compliance', 'Data Pipeline Architecture'] },
  ];

  const demandInsights = [
    { role: 'Full Stack Engineer', trend: 'up', demand: 'High', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'] },
    { role: 'DevOps / SRE', trend: 'up', demand: 'Very High', skills: ['Terraform', 'CI/CD', 'Kubernetes', 'Observability'] },
    { role: 'AI / ML Engineer', trend: 'up', demand: 'High', skills: ['PyTorch', 'LangChain', 'RAG Pipelines', 'Vector DBs'] },
    { role: 'Product Manager (Tech)', trend: 'stable', demand: 'Moderate', skills: ['A/B Testing', 'Roadmapping', 'Agile', 'SQL'] },
  ];

  return (
    <div className="relative min-h-screen py-12 px-6">
      <div className="bg-glow top-1/4 left-1/4 bg-primary-500"></div>
      <div className="bg-glow bottom-1/4 right-1/4 bg-violet-500"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Skill Analytics</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Identify core gaps and understand market demand</p>
          </div>
        </div>

        {/* Core Gaps Analysis */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-8" id="core-gaps">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <Target className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Core Gaps Analysis</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Common missing skills across recent scans</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {gapCategories.map((cat) => (
              <div key={cat.title} className="bg-slate-100 dark:bg-slate-900/40 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className={`w-4 h-4 ${cat.color}`} />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{cat.title}</h3>
                </div>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400/60 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">Tip:</strong> Prioritize filling gaps labelled with the highest frequency across your target roles. The Core Gaps are aggregated from all scans in your history.
            </p>
          </div>
        </div>

        {/* Market Demand Insights */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8" id="market-demand">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Market Demand Insights</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Current hiring trends and in-demand skill sets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {demandInsights.map((item) => (
              <div key={item.role} className="bg-slate-100 dark:bg-slate-900/40 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.role}</h3>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    item.demand === 'Very High'
                      ? 'bg-emerald-500/15 text-emerald-500'
                      : item.demand === 'High'
                        ? 'bg-blue-500/15 text-blue-400'
                        : 'bg-slate-700/30 text-slate-400'
                  }`}>
                    {item.demand}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {item.skills.map((skill) => (
                    <span key={skill} className="text-xs px-2 py-1 rounded-md bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-300/50 dark:border-slate-700/50">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/15 rounded-xl">
            <Layers className="w-5 h-5 text-blue-400 shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              These insights are based on aggregated industry data and your scan history. Demand levels are refreshed periodically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillAnalytics;
