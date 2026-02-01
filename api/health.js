module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed' });
  }
  res.status(200).json({ status: 'ok', service: 'OpsNerve Vercel API', time: new Date().toISOString() });
};
