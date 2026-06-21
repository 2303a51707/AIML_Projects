import React, { useState, useEffect } from 'react';
import {
  History, Calendar, ChevronDown, ChevronUp, Clock,
  FileText, AlertTriangle, CheckCircle2, ListChecks,
  Loader2, AlertCircle, Trash2
} from 'lucide-react';
import api from '../utils/api';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/analyze/history');
      setHistory(res.data);
    } catch (err) {
      setError('Failed to fetch analysis history. Please reload.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scan record permanently?')) return;
    try {
      await api.delete(`/analyze/${id}`);
      setHistory(prev => prev.filter(item => item._id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      setError('Failed to delete analysis record.');
    }
  };

  const getScoreCfg = (score) => {
    if (score <= 4) return { text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-950/20', label: 'Low' };
    if (score <= 7) return { text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-950/20', label: 'Moderate' };
    return { text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-950/20', label: 'Strong' };
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="bg-glow top-1/3 right-1/4 bg-primary-500"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600/20 p-2.5 rounded-xl border border-primary-500/20">
              <History className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Scan History</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">View your previously analyzed resumes.</p>
            </div>
          </div>
          <span className="bg-slate-200 dark:bg-slate-900 text-slate-500 dark:text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-200 dark:border-slate-800 px-3 py-1 rounded-xl text-xs font-semibold">
            {history.length} Scan{history.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-sm mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" /><span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Retrieving your scanning history...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && history.length === 0 && (
          <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center max-w-lg mx-auto">
            <History className="w-12 h-12 text-slate-500 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No scans found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-6">
              You haven't analyzed any resumes yet. Start your first evaluation now!
            </p>
            <a href="/analyze" className="btn-primary py-2.5 px-6 text-sm">Start First Analysis</a>
          </div>
        )}

        {/* List */}
        {!loading && history.length > 0 && (
          <div className="space-y-4">
            {history.map((item) => {
              const isExpanded = expandedId === item._id;
              const cfg = getScoreCfg(item.score);
              const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
              const timeStr = new Date(item.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={item._id}
                  className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'border-primary-500/30 shadow-lg shadow-primary-500/5' : ''
                  }`}
                >
                  {/* Row header */}
                  <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
                    <div onClick={() => toggleExpand(item._id)} className="flex items-center gap-4 min-w-0 flex-1 cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors -m-5 sm:-m-6 p-5 sm:p-6">
                      <div className={`w-12 h-12 rounded-xl border shrink-0 flex flex-col items-center justify-center font-bold text-lg ${cfg.text} ${cfg.border} ${cfg.bg}`}>
                        {item.score}
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold truncate leading-snug">
                          {item.summary ? item.summary.substring(0, 100) + '...' : 'Resume Analysis'}
                        </p>
                        <div className="flex items-center gap-3 text-slate-500 text-xs mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{dateStr}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700 inline-block"></span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{timeStr}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => toggleExpand(item._id)} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-800 transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 p-6 sm:p-8 space-y-6">
                      {/* Summary */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Recruiter Summary</h4>
                        <p className="text-slate-500 dark:text-slate-300 text-sm leading-relaxed">{item.summary}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Missing Keywords */}
                        <div className="bg-slate-100 dark:bg-slate-900/60 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Missing Keywords
                          </h4>
                          {item.missingKeywords?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {item.missingKeywords.map((kw, i) => (
                                <span key={i} className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-lg">{kw}</span>
                              ))}
                            </div>
                          ) : <p className="text-slate-500 dark:text-slate-400 text-xs">All keywords matched.</p>}
                        </div>

                        {/* Strengths */}
                        <div className="bg-slate-100 dark:bg-slate-900/60 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Key Strengths
                          </h4>
                          {item.strengths?.length > 0 ? (
                            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-300">
                              {item.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" /><span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          ) : <p className="text-slate-500 dark:text-slate-400 text-xs">No strengths identified.</p>}
                        </div>
                      </div>

                      {/* Recommended Revisions */}
                      <div className="bg-slate-100 dark:bg-slate-900/60 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-3 flex items-center gap-2">
                          <ListChecks className="w-4 h-4" /> Recommended Revisions
                        </h4>
                        {(() => {
                          const revs = item.recommendedRevisions;
                          if (Array.isArray(revs) && revs.length > 0) {
                            return (
                              <ol className="space-y-2.5 text-xs text-slate-500 dark:text-slate-300">
                                {revs.map((rev, i) => (
                                  <li key={i} className="flex gap-2.5 items-start">
                                    <span className="shrink-0 w-5 h-5 rounded bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm shadow-primary-500/20">{i + 1}</span>
                                    <span className="mt-0.5 leading-relaxed">{rev}</span>
                                  </li>
                                ))}
                              </ol>
                            );
                          }
                          if (typeof revs === 'string' && revs.trim()) {
                            return (
                              <div className="text-xs text-slate-500 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                                {revs}
                              </div>
                            );
                          }
                          return <p className="text-slate-500 dark:text-slate-400 text-xs">No revisions listed.</p>;
                        })()}
                      </div>

                      {/* Section feedback */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Section Evaluations
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {[
                            { label: 'Skills', key: 'skills' },
                            { label: 'Experience', key: 'experience' },
                            { label: 'Education', key: 'education' },
                          ].map(({ label, key }) => (
                            <div key={key} className="bg-slate-100 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                              <span className="font-semibold text-slate-500 dark:text-slate-300 block mb-1">{label}</span>
                              <span className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.section_feedback?.[key] || 'N/A'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
