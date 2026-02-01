const nodemailer = require('nodemailer');

const makeTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let payload = req.body;
  // If body-parser isn't applied, parse JSON body
  if (!payload || Object.keys(payload).length === 0) {
    try {
      payload = JSON.parse(req.rawBody || '{}');
    } catch (err) {
      // fall through
    }
  }

  const { name, email, phone, company, focus, topic, message } = payload || {};
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const lead = {
    name: name || null,
    email,
    phone: phone || null,
    company: company || null,
    focus: focus || topic || 'general',
    message: message || ''
  };

  const transporter = makeTransporter();
  const notifyTo = process.env.NOTIFY_EMAIL || 'dezeog234@gmail.com';

  if (transporter) {
    const subject = `OpsNerve Mission Intake — ${lead.email}`;
    const text = `New mission intake:\n\nName: ${lead.name || ''}\nEmail: ${lead.email}\nPhone: ${lead.phone || ''}\nCompany: ${lead.company || ''}\nFocus: ${lead.focus}\nMessage:\n${lead.message}\n`;
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: notifyTo,
        subject,
        text
      });
    } catch (err) {
      console.error('email send failed', err && err.message ? err.message : err);
      // continue — still return success to the client but log server-side
    }
  } else {
    console.log('SMTP not configured; would notify:', notifyTo);
  }

  return res.status(201).json({ message: 'Thanks — your message was received. We will follow up shortly.' });
};
