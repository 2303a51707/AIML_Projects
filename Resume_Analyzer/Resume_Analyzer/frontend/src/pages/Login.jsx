import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../utils/api';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const isGoogleConfigured = googleClientId && !googleClientId.includes('your_');

const GoogleSignInButtonInner = ({ onSuccess, onError, label }) => {
  const login = useGoogleLogin({ onSuccess, onError });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 mb-4"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      {label}
    </button>
  );
};

const GoogleSignInButton = (props) => {
  if (!isGoogleConfigured) return null;
  return <GoogleSignInButtonInner {...props} />;
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address (e.g., name@example.com)';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setErrors({ ...errors, email: validateEmail(value) });
    else if (name === 'password') setErrors({ ...errors, password: validatePassword(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ name: res.data.name, email: res.data.email, profilePicture: res.data.profilePicture }));
      if (res.data.profilePicture) localStorage.setItem('avatarPreview', res.data.profilePicture);
      localStorage.setItem('settingsName', res.data.name);
      window.dispatchEvent(new Event('storage'));
      navigate('/analyze', { replace: true });
    } catch (err) {
      try {
        const data = err.response?.data;
        let message = 'Login failed. Please try again.';
        if (err.response) {
          message = data?.message || message;
          if (message.toLowerCase().includes('invalid') || message.toLowerCase().includes('credentials')) {
            setErrors({ email: 'No account found with this email address', password: 'Incorrect password' });
            return;
          } else if (message.toLowerCase().includes('not found') || message.toLowerCase().includes('email')) {
            setErrors({ email: 'No account found with this email address' });
            return;
          }
        } else if (err.request) {
          if (err.message?.includes('Network Error') || err.code === 'ECONNREFUSED') {
            message = 'Cannot connect to server. Please ensure MongoDB is running and restart the backend.';
          }
        }
        setErrors({ general: message });
      } catch { setErrors({ general: 'An unexpected error occurred. Please try again.' }); }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    setErrors({});
    try {
      const res = await api.post('/auth/google', { token: tokenResponse.access_token });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        name: res.data.name,
        email: res.data.email,
        profilePicture: res.data.profilePicture,
      }));
      if (res.data.profilePicture) localStorage.setItem('avatarPreview', res.data.profilePicture);
      localStorage.setItem('settingsName', res.data.name);
      window.dispatchEvent(new Event('storage'));
      navigate('/analyze', { replace: true });
    } catch (err) {
      try { setErrors({ general: err.response?.data?.message || 'Google sign-in failed.' }); }
      catch { setErrors({ general: 'Google sign-in failed.' }); }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-6">
      <div className="bg-glow top-1/4 left-1/3 bg-primary-600/20"></div>
      <div className="bg-glow bottom-1/3 right-1/4 bg-indigo-600/20"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-primary-600/20 to-indigo-600/20 w-16 h-16 rounded-2xl flex items-center justify-center border border-primary-500/30 mx-auto mb-4 group-hover:scale-105 transition-transform">
              <LogIn className="w-7 h-7 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Sign in to continue to ResuMatch.ai</p>
          </div>
          {errors.general && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}
          {googleLoading ? (
            <div className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-medium mb-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in with Google...
            </div>
          ) : (
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={() => setErrors({ general: 'Google sign-in failed.' })}
              label="Sign in with Google"
            />
          )}
          {isGoogleConfigured && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 bg-white dark:bg-slate-900/80">
                  <Mail className={`w-5 h-5 transition-colors ${errors.email ? 'text-rose-500' : 'text-slate-500'}`} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="name@example.com"
                  className={`w-full form-input form-input-with-icon ${errors.email ? 'border-rose-500 focus:ring-rose-500/50' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 bg-white dark:bg-slate-900/80">
                  <Lock className={`w-5 h-5 transition-colors ${errors.password ? 'text-rose-500' : 'text-slate-500'}`} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  className={`w-full form-input form-input-with-icon pr-12 ${errors.password ? 'border-rose-500 focus:ring-rose-500/50' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:text-slate-300 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 mt-2 group">
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /><span>Signing in...</span></>
              ) : (
                <><Sparkles className="w-4 h-4" /><span>Sign In</span></>
              )}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium transition-colors">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
