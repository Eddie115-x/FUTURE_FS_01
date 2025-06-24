const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Debug environment variables
console.log('Environment variables loaded:');
console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? 'Found' : 'Missing');
console.log('- SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'Found' : 'Missing');
console.log('- PORT:', process.env.PORT || '5000 (default)');

// Import Supabase client
const supabase = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debug route to check if API is working
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is working' });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const blogRoutes = require('./routes/blogRoutes');
const changelogRoutes = require('./routes/changelogRoutes');

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/changelog', changelogRoutes);

// Import database setup
const { setupDatabase } = require('./setupDatabase');

// Check Supabase connection and setup database
(async () => {
  try {
    const { error } = await supabase.from('health_check').select('*').limit(1);
    if (error) throw error;
    console.log('Supabase Connected');
    
    // Setup database tables if needed
    await setupDatabase();
  } catch (err) {
    console.log('Supabase Connection Error: ', err);
  }
})();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
