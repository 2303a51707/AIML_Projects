import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import './index.css'
import App from './App.jsx'

const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const isGoogleConfigured = googleClientId && !googleClientId.includes('your_');
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

let app = <App />;

if (recaptchaSiteKey) {
  app = (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      {app}
    </GoogleReCaptchaProvider>
  );
}

if (isGoogleConfigured) {
  app = (
    <GoogleOAuthProvider clientId={googleClientId}>
      {app}
    </GoogleOAuthProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>{app}</StrictMode>,
)
