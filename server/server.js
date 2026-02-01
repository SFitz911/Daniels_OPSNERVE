const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_PATH = path.join(__dirname, 'data', 'leads.json');
const CLIENT_PATH = path.join(__dirname, '../client');

app.use(cors());
app.use(express.json());
app.use(express.static(CLIENT_PATH));

const readLeads = async () => {
  try {
    const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeLeads = (leads) => fs.promises.writeFile(DATA_PATH, JSON.stringify(leads, null, 2));

// Setup nodemailer transporter if SMTP env vars are provided
let mailTransporter = null;
try {
  const nodemailer = require('nodemailer');
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    mailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
} catch (err) {
  console.warn('nodemailer not available; email notifications disabled.');
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'OpsNerve Landing API', time: new Date().toISOString() });
});

app.get('/api/pulse', (_req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    statements: [
      'Deploy AI copilots alongside SRE runbooks in under two weeks.',
      'Consolidate cloud telemetry into one live command center.',
      'Ship compliance-ready software releases daily without heroics.'
    ]
  });
});

app.post('/api/interest', async (req, res) => {
  const { name, email, phone, company, focus, topic, message } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const leads = await readLeads();
    const lead = {
      id: Date.now(),
      name: name || null,
      email,
      phone: phone || null,
      company: company || null,
      focus: focus || topic || 'general',
      message: message || '',
      createdAt: new Date().toISOString()
    };
    leads.push(lead);
    await writeLeads(leads);

    // Attempt to send notification email if transporter is configured
    const notifyTo = process.env.NOTIFY_EMAIL || process.env.NOTIFICATION_EMAIL || 'dezeog234@gmail.com';
    if (mailTransporter) {
      const subject = `OpsNerve Mission Intake — ${lead.email}`;
      const text = `New mission intake:\n\nName: ${lead.name || ''}\nEmail: ${lead.email}\nPhone: ${lead.phone || ''}\nCompany: ${lead.company || ''}\nFocus: ${lead.focus}\nMessage:\n${lead.message}\n\nSaved to leads.json`;
      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: notifyTo,
          subject,
          text
        });
      } catch (mailErr) {
        console.error('Failed to send notification email:', mailErr.message || mailErr);
      }
    } else {
      console.log(`Email transporter not configured; intended notification to ${notifyTo}`);
    }

    res.status(201).json({ message: 'Thanks — your message was received. We will follow up shortly.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to save your request right now.', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`OpsNerve server live on http://localhost:${PORT}`);
});
