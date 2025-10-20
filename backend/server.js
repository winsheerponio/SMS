const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/students', studentRoutes);

// Serve frontend static files when available
const frontendPath = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendPath)) {
  // Define specific routes BEFORE static middleware
  // Serve landing page at root
  app.get('/', (req, res) => res.sendFile(path.join(frontendPath, 'landing.html')));
  
  // Serve main app at /app or /dashboard
  app.get(['/app', '/dashboard'], (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
  
  // Serve static files (CSS, JS, etc.) for everything else
  app.use(express.static(frontendPath));
}

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Server Error', message: err.message || 'An error occurred' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
