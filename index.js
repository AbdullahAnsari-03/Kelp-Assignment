require('dotenv').config();
const express = require('express');
const { processCsvAndUpload } = require('./services/csvUploader');
const { printAgeDistribution } = require('./utils/ageDistribution');

const app = express();
const PORT = process.env.PORT || 3000;
const CSV_PATH = process.env.CSV_PATH;
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '1000', 10);

app.get('/run', async (req, res) => {
  try {
    await processCsvAndUpload(CSV_PATH, BATCH_SIZE);
    await printAgeDistribution();
    res.json({ message: 'Data uploaded and distribution printed in console!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}/run`));
