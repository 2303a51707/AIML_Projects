import React, { useState, useRef } from 'react';
import { 
  UploadCloud, File, Trash2, Play, CheckCircle2, 
  AlertTriangle, AlertCircle, Loader2, Sparkles,
  ArrowRight, FileText, Check, ListChecks
} from 'lucide-react';
import api from '../utils/api';

const Analyze = () => {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true);
    else if (e.type === 'dragleave') setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const f = e.dataTransfer.files[0];
      if (f.type === 'application/pdf') { setFile(f); setError(''); }
      else setError('Only PDF files are supported.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      if (f.type === 'application/pdf') { setFile(f); setError(''); }
      else setError('Only PDF files are supported.');
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const skillCount = requiredSkills.trim()
    ? requiredSkills.split(',').filter(s => s.trim()).length
    : 0;
  const skillsOverLimit = skillCount > 12;

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please upload your resume PDF');
    if (!jobTitle.trim()) return setError('Please enter the target job title');
    if (!requiredSkills.trim()) return setError('Please enter the required skills');
    if (skillsOverLimit) return setError('Maximum 12 skills allowed for analysis');

    setLoading(true);
    setError('');
    setResult(null);

    const steps = [
      'Reading resume file...',
      'Extracting text content...',
      'Matching keywords with job requirements...',
      'Generating score and recruiter insights...',
      'Finalizing analysis report...',
    ];
    let cur = 0;
    setStatusText(steps[0]);
    const interval = setInterval(() => {
      if (cur < steps.length - 1) { cur++; setStatusText(steps[cur]); }
    }, 8000);

    // Timeout guard — shows "still working" after 60s
    const timeoutGuard = setTimeout(() => {
      setStatusText('AI provider switch in progress — this may take a moment...');
    }, 60000);

    try {
      const fd = new FormData();
      fd.append('resume', file);
      fd.append('jobTitle', jobTitle);
      fd.append('requiredSkills', requiredSkills);
      const res = await api.post('/analyze', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 180000,
      });
      setResult(res.data);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Analysis is taking longer than expected. The server may be switching AI providers. Please try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to complete analysis. Please try again.');
      }
    } finally {
      clearInterval(interval);
      clearTimeout(timeoutGuard);
      setLoading(false);
    }
  };

  const getScoreConfig = (score) => {
    if (score <= 4) return { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-950/30', border: 'border-rose-500/30', label: 'Low Match' };
    if (score <= 7) return { text: 'text-amber-400', bg: 'bg-amber-950/30', border: 'border-amber-500/30', label: 'Moderate Match' };
    return { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-500/30', label: 'Strong Match' };
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-12 px-6">
      <div className="bg-glow top-1/4 left-1/4 bg-primary-500"></div>
      <div className="bg-glow bottom-1/4 right-1/4 bg-indigo-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white">
            AI Resume <span className="text-gradient">Workspace</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Upload your resume in PDF format and paste the job description to run an advanced comparison check.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-3.5 rounded-2xl flex items-center gap-2.5 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="max-w-xl mx-auto glass-panel p-10 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center my-12">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 animate-spin"></div>
              <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400 absolute top-5 left-5 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Analyzing Compatibility</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-mono h-6">{statusText}</p>
            <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-1.5 mt-6 max-w-xs overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-indigo-500 h-1.5 rounded-full" style={{ width: '75%', transition: 'width 2s ease' }}></div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        {!loading && !result && (
          <form onSubmit={handleAnalyze} className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* PDF Upload */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <span className="bg-primary-500/20 text-primary-600 dark:text-primary-400 p-1.5 rounded-lg border border-primary-500/10 text-xs font-bold">1</span>
                Upload Resume PDF
              </h2>

              <div
                onDragEnter={handleDrag} onDragOver={handleDrag}
                onDragLeave={handleDrag} onDrop={handleDrop}
                onClick={!file ? () => fileInputRef.current.click() : undefined}
                className={`flex-1 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-600/5'
                    : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 hover:border-slate-600 bg-slate-100 dark:bg-slate-900/30'
                } ${!file ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />

                {!file ? (
                  <>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-full border border-slate-200 dark:border-slate-800 mb-4 hover:scale-105 transition-transform">
                      <UploadCloud className="w-8 h-8 text-primary-500" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 font-semibold mb-1">Drag & drop your PDF here</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">or click to browse from device</p>
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Only PDF files • Max 5MB</span>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-left overflow-hidden">
                      <div className="bg-primary-950/60 p-2.5 rounded-lg border border-primary-500/20 shrink-0">
                        <File className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold truncate max-w-[200px] sm:max-w-[280px]">{file.name}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button type="button" onClick={removeFile} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Job Title & Skills */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <span className="bg-primary-500/20 text-primary-600 dark:text-primary-400 p-1.5 rounded-lg border border-primary-500/10 text-xs font-bold">2</span>
                Job Details
              </h2>

              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Target Job Title</label>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Full Stack Developer"
                className="form-input mb-4 text-sm"
                required
              />

              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Required Skills from the Job Post</label>
                <span className={`text-xs font-mono ${skillsOverLimit ? 'text-rose-500' : 'text-slate-400'}`}>
                  {skillCount}/12
                </span>
              </div>
              <textarea
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                placeholder="e.g., React.js, Node.js, MongoDB (comma separated)"
                className="flex-1 form-input min-h-[180px] resize-none text-sm leading-relaxed"
                required
              />
              {skillsOverLimit && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Maximum 12 skills allowed for analysis
                </p>
              )}
              <button type="submit" disabled={!file || !jobTitle.trim() || !requiredSkills.trim() || skillsOverLimit} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-6 shadow-xl">
                <Play className="w-4 h-4 fill-current" />
                Analyze Compatibility
              </button>
            </div>
          </form>
        )}

        {/* Results */}
        {!loading && result && (
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 tracking-wider uppercase">Analysis Report</span>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Match Results</h2>
              </div>
              <button onClick={() => setResult(null)} className="btn-secondary flex items-center gap-2 py-2.5 px-4 text-sm">
                Run Another Scan <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Score banner */}
            {(() => {
              const cfg = getScoreConfig(result.score);
              return (
                <div className={`glass-panel p-6 sm:p-8 rounded-2xl border ${cfg.border} flex flex-col md:flex-row gap-6 items-center`}>
                  <div className={`shrink-0 w-32 h-32 rounded-2xl flex flex-col items-center justify-center ${cfg.bg} border ${cfg.border}`}>
                    <span className={`text-5xl font-extrabold ${cfg.text}`}>{result.score}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">/ 10</span>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Overall Role Compatibility</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${cfg.text} ${cfg.border} ${cfg.bg}`}>{cfg.label}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{result.summary}</p>
                    <span className="text-slate-500 dark:text-slate-400 text-xs block mt-2 font-mono">
                      Analyzed: {new Date(result.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Keywords + Strengths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Missing Keywords */}
              <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col">
                <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" /> Missing Keywords
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">Add these skills to your resume to pass ATS screening.</p>
                {result.missingKeywords?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold px-3 py-1.5 rounded-xl">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-100 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Check className="w-8 h-8 text-emerald-500 mb-2" />
                    <p className="text-slate-600 dark:text-slate-300 font-semibold text-sm">All Keywords Matched!</p>
                  </div>
                )}
              </div>

              {/* Strengths */}
              <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col">
                <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" /> Key Strengths
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">These areas align well with the job requirements.</p>
                {result.strengths?.length > 0 ? (
                  <ul className="space-y-3">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">No specific strengths identified.</p>
                )}
              </div>
            </div>

            {/* Recommended Revisions */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl">
              <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400 mb-2 flex items-center gap-2">
                <ListChecks className="w-5 h-5 shrink-0" /> Recommended Revisions
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">Follow these to boost your resume score.</p>
              {(() => {
                const revs = result.recommendedRevisions;
                if (Array.isArray(revs) && revs.length > 0) {
                  return (
                    <ol className="space-y-4">
                      {revs.map((rev, i) => (
                        <li key={i} className="flex gap-4 items-start text-sm text-slate-600 dark:text-slate-300">
                          <span className="shrink-0 w-7 h-7 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-primary-500/20">
                            {i + 1}
                          </span>
                          <span className="mt-0.5 leading-relaxed">{rev}</span>
                        </li>
                      ))}
                    </ol>
                  );
                }
                if (typeof revs === 'string' && revs.trim()) {
                  return (
                    <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-slate-100 dark:bg-slate-900/30 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
                      {revs}
                    </div>
                  );
                }
                return (
                  <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-100 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                    <ListChecks className="w-8 h-8 text-slate-600 mb-2" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No revisions generated yet.</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Submit your resume for analysis to receive tailored suggestions.</p>
                  </div>
                );
              })()}
            </div>

            {/* Section Feedback */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" /> Section-Specific Feedback
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Skills Alignment', key: 'skills' },
                  { label: 'Experience Alignment', key: 'experience' },
                  { label: 'Education & Credentials', key: 'education' },
                ].map(({ label, key }) => (
                  <div key={key} className="bg-slate-100 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-sm">{label}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                      {result.section_feedback?.[key] || 'No feedback provided.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;
