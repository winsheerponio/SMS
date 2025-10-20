const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Paths
const excelFilePath = path.join(__dirname, '../../mock_data/students_data_2.0.xlsx');
const jsonFilePath = path.join(__dirname, '../data/students.json');

// Read the Excel file
console.log('Reading Excel file...');
const workbook = XLSX.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0]; // Get the first sheet
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const rawData = XLSX.utils.sheet_to_json(worksheet);

console.log(`Found ${rawData.length} records in Excel file`);

// Transform data to match the application's schema
const students = rawData.map((row, index) => {
  return {
    id: uuidv4(),
    studentId: row['Student ID'] || row['studentId'] || `2024${String(index + 1).padStart(3, '0')}`,
    fullName: row['Full Name'] || row['fullName'] || row['Name'] || '',
    email: row['Email'] || row['email'] || '',
    gender: row['Gender'] || row['gender'] || '',
    yearLevel: parseInt(row['Year Level'] || row['yearLevel'] || row['Year'] || 1),
    program: row['Program'] || row['program'] || row['Course'] || '',
    university: row['University'] || row['university'] || row['School'] || '',
    createdAt: new Date().toISOString()
  };
});

// Write to JSON file
console.log('Writing to students.json...');
fs.writeFileSync(jsonFilePath, JSON.stringify(students, null, 2));

console.log(`✅ Successfully imported ${students.length} students to ${jsonFilePath}`);
console.log('\nSample of imported data:');
console.log(JSON.stringify(students.slice(0, 3), null, 2));
