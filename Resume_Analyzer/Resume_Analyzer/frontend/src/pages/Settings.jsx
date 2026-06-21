import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Upload, Save, Pencil, Trash2, Settings as SettingsIcon, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const DefaultAvatar = () => (
  <svg viewBox="0 0 40 40" className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="20" cy="16" r="6" />
    <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" />
  </svg>
);

const Settings = () => {
  const authUser = JSON.parse(localStorage.getItem('user') || 'null');

  const [name, setName] = useState(authUser?.name || '');
  const [email, setEmail] = useState(authUser?.email || '');
  const [nameEditable, setNameEditable] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveError, setSaveError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const [savedAvatar, setSavedAvatar] = useState(() => localStorage.getItem('avatarPreview'));
  const [stagedAvatar, setStagedAvatar] = useState(undefined);

  const displayAvatar = stagedAvatar !== undefined ? stagedAvatar : savedAvatar;

  useEffect(() => {
    const syncAuth = () => {
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (currentUser) {
        setName(currentUser.name || '');
        setEmail(currentUser.email || '');
      }
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setUploadError('Only JPEG and PNG files are supported.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File size must be under 5MB.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setStagedAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setStagedAvatar(null);
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setSaveError('');

    try {
      const token = localStorage.getItem('token');
      let updatedProfilePic = undefined;
      if (token) {
        const payload = { name };
        if (stagedAvatar !== undefined) {
          payload.profilePicture = stagedAvatar;
        }
        const res = await api.put('/auth/profile', payload);
        updatedProfilePic = res.data.profilePicture;
      }

      if (stagedAvatar !== undefined) {
        if (stagedAvatar === null) {
          localStorage.removeItem('avatarPreview');
        } else {
          localStorage.setItem('avatarPreview', stagedAvatar);
        }
        setSavedAvatar(stagedAvatar);
        setStagedAvatar(undefined);
      }

      localStorage.setItem('settingsName', name);
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (storedUser) {
        storedUser.name = name;
        if (updatedProfilePic !== undefined) {
          storedUser.profilePicture = updatedProfilePic;
        }
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
      window.dispatchEvent(new Event('storage'));

      setNameEditable(false);
      setSaveStatus('saved');
      setToast('Profile updated successfully!');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save changes. Please try again.');
      setSaveStatus('idle');
    }
  };

  const saveLabel = saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes';

  return (
    <div className="relative min-h-screen py-12 px-6">
      <div className="bg-glow top-1/4 right-1/4 bg-primary-500"></div>
      <div className="bg-glow bottom-1/4 left-1/4 bg-indigo-500"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-8">
          <Link to="/" className="hover:text-blue-400 text-slate-500 dark:text-slate-400 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="text-slate-500 dark:text-slate-300">Settings</span>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          <span className="text-blue-500 dark:text-blue-400">Profile</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage your profile settings</p>
            </div>
          </div>
        </div>

        {toast && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-5 py-3.5 rounded-xl flex items-center gap-2.5 text-sm font-medium shadow-sm">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-none">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Basic info</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Tell us your basic info details</p>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full name</label>
                  <button
                    type="button"
                    onClick={() => setNameEditable((prev) => !prev)}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${
                      nameEditable
                        ? 'text-blue-500 bg-blue-50 dark:bg-blue-500/10'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    aria-label={nameEditable ? 'Lock name' : 'Edit name'}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!nameEditable}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 ${
                    nameEditable
                      ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  tabIndex={-1}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-500 text-sm cursor-not-allowed select-all"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 mb-8"></div>

          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Profile picture</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">We support only JPEGs or PNGs under 5MB</p>

            {uploadError && (
              <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 border-2 border-slate-200 dark:border-slate-600 overflow-hidden">
                {displayAvatar ? (
                  <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <DefaultAvatar />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/5 cursor-pointer transition-all duration-200">
                    <Upload className="w-4 h-4" />
                    Upload
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {displayAvatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Minimum 300x300px recommended</p>
              </div>

              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  saveStatus === 'saved'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                    : saveStatus === 'saving'
                      ? 'bg-blue-400 dark:bg-blue-400 text-white cursor-wait'
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-blue-500/20 hover:shadow-blue-500/30'
                }`}
              >
                {saveStatus === 'saving' ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : saveStatus === 'saved' ? null : (
                  <Save className="w-4 h-4" />
                )}
                {saveLabel}
              </button>
            </div>

            {saveError && (
              <div className="mt-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
