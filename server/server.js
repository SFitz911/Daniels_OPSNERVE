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
  const { email, phone, topic, message } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const leads = await readLeads();
    leads.push({
      id: Date.now(),
      email,
      phone: phone || null,
      topic: topic || 'general',
      message: message || '',
      createdAt: new Date().toISOString()
    });
    await writeLeads(leads);
    res.status(201).json({ message: 'Thanks — your message was received. We will follow up shortly.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to save your request right now.', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`OpsNerve server live on http://localhost:${PORT}`);
});
