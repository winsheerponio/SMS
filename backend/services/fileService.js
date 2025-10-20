const fs = require('fs').promises;
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'students.json');

const readStudents = async () => {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      // If file doesn't exist, return empty array
      return [];
    }
    throw err;
  }
};

const writeStudents = async (students) => {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(students, null, 2), 'utf8');
};

module.exports = { readStudents, writeStudents };
