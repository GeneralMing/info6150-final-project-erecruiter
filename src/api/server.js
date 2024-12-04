const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust for your frontend URL
app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/resume', express.static(path.join(__dirname, 'uploads/resume')));


// Routes
app.use('/user', userRoutes);
app.use('/jobs', jobRoutes);
app.use('/candidates', candidateRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
