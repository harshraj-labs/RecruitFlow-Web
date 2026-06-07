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

const downloadCSV = async (req, res) => {
    try {
        const userId = req.userId;
        const { type, batchId } = req.query;
        // type = 'eligible' | 'not-eligible' | 'all'
        // batchId = optional batch filter

        // Build status filter
        let statusCondition = '';
        if (type === 'eligible') {
            statusCondition = "AND a.status = 'Eligible'";
        } else if (type === 'not-eligible') {
            statusCondition = "AND a.status = 'Not Eligible'";
        }

        // Build batch filter
        let batchCondition = '';
        let params = [userId];

        if (batchId) {
            batchCondition = `AND b.id = $2`;
            params.push(batchId);
        }

        // full query
        const query = `
            SELECT 
                a.name,
                a.email,
                a.college,
                a.degree,
                a.year,
                a.status,
                a.reason,
                a.has_resume,
                a.has_id,
                a.has_project,
                b.name as batch_name
            FROM applicants a
            JOIN batches b ON a.batch_id = b.id
            WHERE b.created_by = $1
            ${batchCondition}
            ${statusCondition}
            ORDER BY a.status ASC, a.name ASC
        `;

        const result = await pool.query(query, params);
        const applicants = result.rows;

        // CSV content
        let csvContent = 'Name,Email,College,Degree,Year,Status,Batch,Files Found,Reason\n';

        applicants.forEach(a => {
            // files found string
            const files = [];
            if (a.has_resume) files.push('Resume');
            if (a.has_id) files.push('ID');
            if (a.has_project) files.push('Project');
            const filesFound = files.join(', ') || 'None';

            // Escape commas in fields
            const reason = (a.reason || '').replace(/"/g, '""');
            const college = (a.college || '').replace(/"/g, '""');
            const degree = (a.degree || '').replace(/"/g, '""');

            csvContent += `${a.name},${a.email},"${college}","${degree}",${a.year},${a.status},${a.batch_name},"${filesFound}","${reason}"\n`;
        });

        // Set filename based on type
        const filename =
            type === 'eligible' ? 'eligible_applicants.csv' :
            type === 'not-eligible' ? 'rejected_applicants.csv' :
            'all_applicants.csv';

        // Trigger file download in browser
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvContent);

    } catch (error) {
        console.error('Download CSV error:', error);
        res.status(500).json({ error: 'Failed to generate CSV' });
    }
};

module.exports = { getStats, getApplicants, downloadCSV };
