// Main server file:
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'RecruitFlow API is running!',
        version: '1.0.0'
    });
});

// Starting server
app.listen(PORT, () => {
    console.log(`\n================================`);
    console.log(`  RecruitFlow API`);
    console.log(`================================`);
    console.log(`Server running on port ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`================================\n`);
});