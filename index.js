const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { enqueueIngestion } = require('./queue.js'); // your implementation file

const app = express();
app.use(express.json());

app.post('/ingest', (req, res) => {
  const { ids, priority } = req.body;

  if (!Array.isArray(ids) || ids.some(id => typeof id !== 'number')) {
    return res.status(400).json({ error: 'Invalid ids array' });
  }

  if (!['HIGH', 'MEDIUM', 'LOW'].includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }

  try {
    const ingestionId = uuidv4();
    enqueueIngestion(ids, priority, ingestionId);
    res.json({ ingestion_id: ingestionId });
  } catch (error) {
    console.error('Error in /ingest:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/status/:ingestion_id', (req, res) => {
  console.log('GET /status called');
  const ingestionId = req.params.ingestion_id;
  res.json({ ingestion_id: ingestionId, status: 'yet_to_start', batches: [] });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
