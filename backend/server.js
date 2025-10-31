const express = require('express');
const cors = require('cors');

const app = express();

// Read port from env or use 4000
const PORT = process.env.PORT || 4000;

// Enable CORS - allow the frontend origin during development.
// In production, lock this down to your frontend domain(s).
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));

app.use(express.json());

// GET /api/status
app.get('/api/status', (req, res) => {
  res.json({ service: 'mavprep', status: 'ok' });
});

// GET /api/resources (mock)
app.get('/api/resources', (req, res) => {
  const resources = [
    { id: 1, title: 'Intro to Algorithms', type: 'article', link: 'https://example.com/algos' },
    { id: 2, title: 'ACM Practice Problem Set', type: 'practice', link: 'https://example.com/acm' },
    { id: 3, title: 'Interview Warmups', type: 'interview', link: 'https://example.com/interview' }
  ];
  res.json(resources);
});

app.listen(PORT, () => {
  console.log(`MavPrep backend listening on port ${PORT}`);
});