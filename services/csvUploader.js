const fs = require('fs');
const path = require('path');
const pool = require('../db/connection');
const { parseCSVLine, buildNestedObject } = require('../utils/csvParser');
const { mapToDbRow } = require('../utils/dataMapper');

const CSV_PATH = './data/users.csv'; 
const BATCH_SIZE = process.env.BATCH_SIZE ? parseInt(process.env.BATCH_SIZE) : 500; // batch size

// Insert batch of users into PostgreSQL
async function insertUsersBatch(client, users) {
  if (users.length === 0) return;

  const values = [];
  const placeholders = users.map((u, i) => {
    const idx = i * 4; // 4 fields: name, age, address, additional_info
    values.push(
      u.name,
      u.age,
      u.address ? JSON.stringify(u.address) : null,
      u.additional_info ? JSON.stringify(u.additional_info) : null
    );
    return `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`;
  }).join(',');

  const query = `INSERT INTO users(name, age, address, additional_info) VALUES ${placeholders}`;
  await client.query(query, values);
}

async function processCsvAndUpload() {
  console.log('Reading CSV from:', CSV_PATH);

  const data = fs.readFileSync(path.resolve(CSV_PATH), 'utf-8');
  const lines = data.split(/\r?\n/).filter(l => l.trim() !== '');

  const headers = parseCSVLine(lines[0]);
  if (!headers.includes('name.firstName') || !headers.includes('name.lastName') || !headers.includes('age')) {
    throw new Error('CSV must contain name.firstName, name.lastName, and age columns.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let batch = [];

    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      const nested = buildNestedObject(headers, row);
      const dbRow = mapToDbRow(nested);

      // Skip rows without essential data
      if (!dbRow.name || dbRow.age === null) {
        console.log(`Skipping row ${i + 1} (missing name or age).`);
        continue;
      }

      batch.push(dbRow);

      // Insert batch if it reaches BATCH_SIZE
      if (batch.length >= BATCH_SIZE) {
        await insertUsersBatch(client, batch);
        batch = [];
      }
    }

    // Insert remaining rows
    if (batch.length > 0) {
      await insertUsersBatch(client, batch);
    }

    await client.query('COMMIT');
    console.log('✅ CSV data uploaded successfully in batches.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error uploading CSV:', err);
  } finally {
    client.release();
  }
}

module.exports = { processCsvAndUpload };
