const https = require('https');
const Contact = require('../models/Contact');

const verifyRecaptcha = (token) => {
  return new Promise((resolve, reject) => {
    const data = `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
    const req = https.request(
      {
        hostname: 'www.google.com',
        path: '/recaptcha/api/siteverify',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error('Failed to parse reCAPTCHA response'));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

// @desc    Submit a contact form message (with reCAPTCHA)
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  const { name, email, subject, message, recaptchaToken } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Skip reCAPTCHA in dev mode if secret key is not configured
  const isDev = process.env.NODE_ENV === 'development';
  const recaptchaConfigured = process.env.RECAPTCHA_SECRET_KEY && !process.env.RECAPTCHA_SECRET_KEY.includes('your_');

  if (isDev && !recaptchaConfigured) {
    // Skip captcha in dev mode
  } else {
    if (!recaptchaToken) {
      return res.status(400).json({ message: 'reCAPTCHA verification is required' });
    }

    const recaptchaResult = await verifyRecaptcha(recaptchaToken);

    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      return res.status(403).json({ message: 'Bot activity detected. Submission blocked.' });
    }
  }

  try {
    const newResponse = new Contact({ name, email, subject, message });
    const saved = await newResponse.save();

    res.status(201).json({
      message: 'Your message has been received. We\'ll get back to you shortly.',
      data: {
        id: saved._id,
        name: saved.name,
        email: saved.email,
        subject: saved.subject,
        createdAt: saved.createdAt,
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to submit your message. Please try again.' });
  }
};

module.exports = { submitContact };
