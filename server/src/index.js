const express = require('express');
const cors = require('cors');
require('dotenv').config();
const initDB = require('./config/init-db');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/DashboardRoutes');
const batchRoutes = require('./routes/batchRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        'http://localhost:5173', //local host
        process.env.FRONTEND_URL //online deploy
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/batches', batchRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'RecruitFlow API is running!' });
});

const startServer = async () => {
    await initDB();
    app.listen(PORT, () => {
        console.log(`\n================================`);
        console.log(`  RecruitFlow API`);
        console.log(`================================`);
        console.log(` Server running on port ${PORT}`);
        console.log(`================================\n`);
    });
};

startServer();