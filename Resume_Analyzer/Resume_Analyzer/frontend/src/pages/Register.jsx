import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, AlertCircle, Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from 'react-google-recaptcha';
import api from '../utils/api';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const isGoogleConfigured = googleClientId && !googleClientId.includes('your_');
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const isRecaptchaConfigured = recaptchaSiteKey && !recaptchaSiteKey.includes('your_');

const GoogleSignUpButtonInner = ({ onSuccess, onError, label }) => {
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

const GoogleSignUpButton = (props) => {
  if (!isGoogleConfigured) return null;
  return <GoogleSignUpButtonInner {...props} />;
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address (e.g., name@example.com)';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return '';
  };

  const validateConfirmPassword = (value) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return '';
  };

  const validateName = (name) => {
    if (!name) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';
    if (name === 'name') error = validateName(value);
    else if (name === 'email') error = validateEmail(value);
    else if (name === 'password') error = validatePassword(value);
    else if (name === 'confirmPassword') error = validateConfirmPassword(value);
    if (error) setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(confirmPassword);
    if (nameError || emailError || passwordError || confirmError) {
      setErrors({ name: nameError, email: emailError, password: passwordError, confirmPassword: confirmError });
      return;
    }

    if (isRecaptchaConfigured && !captchaToken) {
      setErrors({ general: 'Please complete the "I am not a robot" challenge first.' });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        ...(isRecaptchaConfigured ? { captchaToken } : {}),
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ name: res.data.name, email: res.data.email, profilePicture: res.data.profilePicture }));
      if (res.data.profilePicture) localStorage.setItem('avatarPreview', res.data.profilePicture);
      localStorage.setItem('settingsName', res.data.name);
      window.dispatchEvent(new Event('storage'));
      navigate('/analyze', { replace: true });
    } catch (err) {
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setCaptchaToken(null);
      try {
        let message = 'Registration failed. Please try again.';
        if (err.response) {
          message = err.response.data?.message || message;
          if (message.toLowerCase().includes('exists') || message.toLowerCase().includes('already')) {
            setErrors({ email: 'An account with this email address already exists. Please try logging in or use a different email.' });
            return;
          } else if (message.toLowerCase().includes('bot') || message.toLowerCase().includes('blocked')) {
            setErrors({ general: 'Bot activity detected. Please try again.' });
            return;
          } else if (message.toLowerCase().includes('email')) { setErrors({ email: message }); return; }
          else if (message.toLowerCase().includes('password')) { setErrors({ password: message }); return; }
          else if (message.toLowerCase().includes('name') || message.toLowerCase().includes('fields')) { setErrors({ name: message }); return; }
        } else if (err.request) {
          if (err.message?.includes('Network Error') || err.message?.includes('ECONNREFUSED')) {
            message = 'Unable to connect to server. Please ensure MongoDB is running and try again.';
          } else if (err.code === 'ECONNREFUSED') {
            message = 'Cannot connect to the server. Please start MongoDB and restart the backend.';
          }
        }
        setErrors({ general: message });
      } catch { setErrors({ general: 'An unexpected error occurred.' }); }
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleExpired = () => {
    setCaptchaToken(null);
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
      <div className="bg-glow top-1/4 left-1/4 bg-primary-600/20"></div>
      <div className="bg-glow bottom-1/4 right-1/3 bg-indigo-600/20"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-primary-600/20 to-indigo-600/20 w-16 h-16 rounded-2xl flex items-center justify-center border border-primary-500/30 mx-auto mb-4">
              <UserPlus className="w-7 h-7 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Get started with ResuMatch.ai for free</p>
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
              Signing up with Google...
            </div>
          ) : (
            <GoogleSignUpButton
              onSuccess={handleGoogleSuccess}
              onError={() => setErrors({ general: 'Google sign-in failed.' })}
              label="Sign up with Google"
            />
          )}
          {isGoogleConfigured && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 bg-white dark:bg-slate-900/80">
                  <User className={`w-5 h-5 transition-colors ${errors.name ? 'text-rose-500' : 'text-slate-500'}`} />
                </div>
                <input type="text" name="name" value={name} onChange={handleChange} onBlur={handleBlur} placeholder="John Doe" className={`w-full form-input form-input-with-icon ${errors.name ? 'border-rose-500 focus:ring-rose-500/50' : ''}`} />
              </div>
              {errors.name && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" />{errors.name}</p>}
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 bg-white dark:bg-slate-900/80">
                  <Mail className={`w-5 h-5 transition-colors ${errors.email ? 'text-rose-500' : 'text-slate-500'}`} />
                </div>
                <input type="email" name="email" value={email} onChange={handleChange} onBlur={handleBlur} placeholder="name@example.com" className={`w-full form-input form-input-with-icon ${errors.email ? 'border-rose-500 focus:ring-rose-500/50' : ''}`} />
              </div>
              {errors.email && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 bg-white dark:bg-slate-900/80">
                  <Lock className={`w-5 h-5 transition-colors ${errors.password ? 'text-rose-500' : 'text-slate-500'}`} />
                </div>
                <input type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={handleChange} onBlur={handleBlur} placeholder="Min. 6 characters" className={`w-full form-input form-input-with-icon pr-12 ${errors.password ? 'border-rose-500 focus:ring-rose-500/50' : ''}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:text-slate-300 transition-colors p-1" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" />{errors.password}</p>}
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-300 text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 bg-white dark:bg-slate-900/80">
                  <Lock className={`w-5 h-5 transition-colors ${errors.confirmPassword ? 'text-rose-500' : 'text-slate-500'}`} />
                </div>
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={confirmPassword} onChange={handleChange} onBlur={handleBlur} placeholder="Confirm your password" className={`w-full form-input form-input-with-icon pr-12 ${errors.confirmPassword ? 'border-rose-500 focus:ring-rose-500/50' : ''}`} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:text-slate-300 transition-colors p-1" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" />{errors.confirmPassword}</p>}
            </div>
            {isRecaptchaConfigured && (
              <div className="flex justify-center my-4">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={recaptchaSiteKey}
                  onChange={handleCaptchaChange}
                  onExpired={handleExpired}
                  theme="dark"
                />
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 mt-4 group">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Creating account...</span></> : <><Sparkles className="w-4 h-4" /><span>Create Account</span></>}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 font-medium transition-colors">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
