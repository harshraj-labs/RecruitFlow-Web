const pool = require('../config/database');

// Get stats - supports filtering by batchId
const getStats = async (req, res) => {
    try {
        const userId = req.userId;
        const { batchId } = req.query; // Optional filter

        let query;
        let params;

        if (batchId) {
            // Stats for specific batch
            query = `
                SELECT
                    COUNT(*) as total,
                    COUNT(CASE WHEN status = 'Eligible' THEN 1 END) as eligible,
                    COUNT(CASE WHEN status = 'Not Eligible' THEN 1 END) as not_eligible,
                    COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending
                FROM applicants a
                JOIN batches b ON a.batch_id = b.id
                WHERE b.created_by = $1 AND b.id = $2
            `;
            params = [userId, batchId];
        } else {
            // Stats for ALL batches
            query = `
                SELECT
                    COUNT(*) as total,
                    COUNT(CASE WHEN status = 'Eligible' THEN 1 END) as eligible,
                    COUNT(CASE WHEN status = 'Not Eligible' THEN 1 END) as not_eligible,
                    COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending
                FROM applicants a
                JOIN batches b ON a.batch_id = b.id
                WHERE b.created_by = $1
            `;
            params = [userId];
        }

        const result = await pool.query(query, params);
        const stats = result.rows[0];

        res.json({
            total: parseInt(stats.total),
            eligible: parseInt(stats.eligible),
            not_eligible: parseInt(stats.not_eligible),
            pending: parseInt(stats.pending)
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

// Get applicants - supports filtering by batchId
const getApplicants = async (req, res) => {
    try {
        const userId = req.userId;
        const { batchId } = req.query;

        let query;
        let params;

        if (batchId) {
            query = `
                SELECT a.*
                FROM applicants a
                JOIN batches b ON a.batch_id = b.id
                WHERE b.created_by = $1 AND b.id = $2
                ORDER BY a.created_at DESC
            `;
            params = [userId, batchId];
        } else {
            query = `
                SELECT a.*, b.name as batch_name
                FROM applicants a
                JOIN batches b ON a.batch_id = b.id
                WHERE b.created_by = $1
                ORDER BY a.created_at DESC
            `;
            params = [userId];
        }

        const result = await pool.query(query, params);
        res.json(result.rows);

    } catch (error) {
        console.error('Applicants error:', error);
        res.status(500).json({ error: 'Failed to fetch applicants' });
    }
};

module.exports = { getStats, getApplicants };