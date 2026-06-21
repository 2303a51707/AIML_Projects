import { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle, ChevronDown, Loader2 } from 'lucide-react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import api from '../utils/api';

const contactDetails = [
  { icon: Phone, label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: Mail, label: 'hello@resumatch.ai', href: 'mailto:hello@resumatch.ai' },
  { icon: MapPin, label: 'Lahore, Pakistan', href: null },
];

const subjectOptions = [
  'Technical Support / Account Issue',
  'Business Partnership / Recruiter Query',
  'Feature Request & Feedback',
  'General Inquiry',
];

const hasRecaptcha = !!import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// Wraps the form with reCAPTCHA only when the provider is present
const ContactFormWithRecaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const verifyRecaptcha = useCallback(async () => {
    if (!executeRecaptcha) return null;
    try { return await executeRecaptcha('contact_submit'); } catch { return null; }
  }, [executeRecaptcha]);
  return <ContactFormInner verifyRecaptcha={verifyRecaptcha} />;
};

const ContactFormStandalone = () => <ContactFormInner verifyRecaptcha={null} />;

const ContactFormInner = ({ verifyRecaptcha }) => {
  const authUser = JSON.parse(localStorage.getItem('user') || 'null');

  const [formData, setFormData] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const subjectRef = useRef(null);

  useEffect(() => {
    const syncAuth = () => {
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (currentUser) {
        setFormData((prev) => ({
          ...prev,
          name: currentUser.name || prev.name,
          email: currentUser.email || prev.email,
        }));
      }
    };
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (subjectRef.current && !subjectRef.current.contains(e.target)) {
        setSubjectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const recaptchaToken = verifyRecaptcha ? await verifyRecaptcha() : null;
      await api.post('/contact', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        recaptchaToken,
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      try {
        const msg = err.response?.data?.message || '';
        if (msg.includes('Bot')) alert('Bot activity detected. Submission blocked.');
      } catch {}
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } finally {
      setSending(false);
    }
  };

  const recaptchaIcon = (
    <div className="absolute bottom-2 right-2 text-blue-200/40 dark:text-blue-700/40 pointer-events-none">
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l2 2" />
        <path d="M12 6v-1" />
      </svg>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-slate-900 py-16 px-6 flex items-center justify-center">
      <div className="max-w-5xl w-full relative z-10">
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
          {/* Left Pane — Navy Blue Info Sidebar */}
          <div className="relative w-full md:w-[40%] bg-blue-900 p-8 md:p-10 flex flex-col overflow-hidden">
            <div className="relative z-10 flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="text-blue-100 text-sm leading-relaxed mb-10">
                We are here to help you optimize your resume, beat the ATS scanners,
                and land your dream tech role. Drop us a message and our team will get back to you shortly.
              </p>
              <div className="space-y-6">
                {contactDetails.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-blue-800/40 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium group-hover:text-blue-200 transition-colors duration-300">
                        {item.label}
                      </span>
                    </div>
                  );
                  return item.href ? <a key={item.label} href={item.href} className="block">{content}</a> : <div key={item.label}>{content}</div>;
                })}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-blue-300/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-blue-200/15 blur-xl pointer-events-none" />
          </div>

          {/* Right Pane — Contact Form */}
          <div className="relative w-full md:w-[60%] bg-white dark:bg-slate-900 p-8 md:p-10">
            {hasRecaptcha && recaptchaIcon}
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Get In Touch</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Message Sent!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Thank you for reaching out. We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-blue-800 dark:text-blue-400 mb-1.5 tracking-wide uppercase">Your Name</label>
                  <div className="relative group">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-b-2 border-blue-800 dark:border-blue-500 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-100 bg-transparent outline-none transition-colors duration-200 focus:border-blue-600 dark:focus:border-blue-400" />
                    <span className="absolute -bottom-[3px] left-0 w-2 h-2 rounded-full bg-blue-800 dark:bg-blue-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200" />
                    <span className="absolute -bottom-[3px] right-0 w-2 h-2 rounded-full bg-blue-800 dark:bg-blue-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-blue-800 dark:text-blue-400 mb-1.5 tracking-wide uppercase">Your Email</label>
                  <div className="relative group">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-b-2 border-blue-800 dark:border-blue-500 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-100 bg-transparent outline-none transition-colors duration-200 focus:border-blue-600 dark:focus:border-blue-400" />
                    <span className="absolute -bottom-[3px] left-0 w-2 h-2 rounded-full bg-blue-800 dark:bg-blue-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200" />
                    <span className="absolute -bottom-[3px] right-0 w-2 h-2 rounded-full bg-blue-800 dark:bg-blue-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>

                <div ref={subjectRef}>
                  <label className="block text-xs font-semibold text-blue-800 dark:text-blue-400 mb-1.5 tracking-wide uppercase">Your Subject</label>
                  <div className="relative group">
                    <button type="button" onClick={() => setSubjectOpen((prev) => !prev)} className="w-full border-b-2 border-blue-800 dark:border-blue-500 py-2.5 pr-8 text-sm font-bold text-left text-slate-800 dark:text-slate-100 bg-transparent outline-none transition-colors duration-200 focus:border-blue-600 dark:focus:border-blue-400 cursor-pointer">
                      {formData.subject || <span className="font-normal text-blue-400 dark:text-blue-400/60">Select a subject</span>}
                    </button>
                    <ChevronDown className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-800 dark:text-blue-400 pointer-events-none transition-transform duration-200 ${subjectOpen ? 'rotate-180' : ''}`} />
                    {subjectOpen && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
                        {subjectOptions.map((option) => (
                          <button key={option} type="button" onClick={() => { setFormData({ ...formData, subject: option }); setSubjectOpen(false); }} className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 ${formData.subject === option ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60'}`}>
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                    <span className="absolute -bottom-[3px] left-0 w-2 h-2 rounded-full bg-blue-800 dark:bg-blue-400 opacity-0 transition-opacity duration-200 pointer-events-none group-focus-within:opacity-100" />
                    <span className="absolute -bottom-[3px] right-7 w-2 h-2 rounded-full bg-blue-800 dark:bg-blue-400 opacity-0 transition-opacity duration-200 pointer-events-none group-focus-within:opacity-100" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-blue-800 dark:text-blue-400 mb-1.5 tracking-wide uppercase">Message</label>
                  <div className="relative group">
                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Write here your message..." rows={3} className="w-full border-b-2 border-blue-800 dark:border-blue-500 py-2.5 text-sm text-slate-800 dark:text-slate-100 bg-transparent outline-none transition-colors duration-200 focus:border-blue-600 dark:focus:border-blue-400 placeholder:text-blue-400/60 dark:placeholder:text-blue-400/60 placeholder:font-medium resize-none" />
                    <span className="absolute -bottom-[3px] left-0 w-2 h-2 rounded-full bg-blue-800 dark:bg-blue-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200" />
                    <span className="absolute -bottom-[3px] right-0 w-2 h-2 rounded-full bg-blue-800 dark:bg-blue-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>

                <button type="submit" disabled={sending} className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 active:scale-[0.97] text-white text-sm font-bold shadow-lg shadow-blue-800/20 hover:shadow-blue-700/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  if (hasRecaptcha) return <ContactFormWithRecaptcha />;
  return <ContactFormStandalone />;
};

export default Contact;
