// backend/scripts/fetch_session.js
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const OPENF1_BASE = process.env.OPENF1_BASE || 'https://api.openf1.org/v1';
const OUTPUT_FILE = path.join(__dirname, '../raceData.json');

async function fetchSessionData(sessionKey) {
  if (!sessionKey) {
    console.error('Error: SESSION_KEY is required. Usage: node scripts/fetch_session.js <session_key>');
    process.exit(1);
  }

  console.log(`Fetching data for session key: ${sessionKey} from ${OPENF1_BASE}`);

  const endpoints = {
    laps: `/laps?session_key=${sessionKey}`,
    stints: `/stints?session_key=${sessionKey}`,
    drivers: `/drivers?session_key=${sessionKey}`,
    position: `/position?session_key=${sessionKey}`,
    location: `/location?session_key=${sessionKey}`,
    pit: `/pit?session_key=${sessionKey}`,
    session: `/sessions?session_key=${sessionKey}`,
  };

  const data = {};
  for (const [key, endpoint] of Object.entries(endpoints)) {
    try {
      console.log(`  Fetching ${key}...`);
      const response = await fetch(`${OPENF1_BASE}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for ${endpoint}`);
      }
      const result = await response.json();
      data[key] = Array.isArray(result) ? result : [result];
      console.log(`  ✓ Fetched ${data[key].length} records for ${key}.`);
      if (data[key].length === 0) {
        console.log(`    ⚠ Warning: No data available for ${key} in this session.`);
      }
    } catch (error) {
      console.error(`  ✗ Failed to fetch ${key}:`, error.message);
      data[key] = [];
    }
  }

  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
    console.log(`Successfully saved session data to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Failed to write raceData.json:', error.message);
    process.exit(1);
  }
}

// Allow running from command line with a session key argument
if (require.main === module) {
  const sessionKey = process.argv[2];
  fetchSessionData(sessionKey);
} else {
  module.exports = fetchSessionData;
}