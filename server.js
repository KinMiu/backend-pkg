const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Static file serving for uploaded assets
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'public', 'uploads'))
);

// Routes
app.use('/api/faculties', require('./routes/facultyRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/k3sp-events', require('./routes/k3spEventRoutes'));
app.use('/api/pengumuman', require('./routes/pengumumanRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/partners', require('./routes/partnerRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/hki', require('./routes/hkiRoutes'));
app.use('/api/patents', require('./routes/patentRoutes'));
app.use('/api/industrial-designs', require('./routes/industrialDesignRoutes'));
app.use('/api/rps', require('./routes/rpsRoutes'));
app.use('/api/facilities', require('./routes/facilityRoutes'));
app.use('/api/kurikulums', require('./routes/kurikulumRoutes'));
app.use('/api/greetings', require('./routes/greetingRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/statistik', require('./routes/statistikRoutes'));
app.use('/api/structurals', require('./routes/structuralRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/operators', require('./routes/operatorRoutes'));
app.use('/api/settings', require('./routes/themeRoutes'));
app.use('/api/surat', require('./routes/suratRoutes'));
app.use('/api/perangkat-ajar', require('./routes/perangkatAjarRoutes'));

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Faculty Management API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Upload error',
    });
  }
  if (err && err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});