const pool = require('../config/database');
const path = require('path');

// Parse Google Forms CSV
const parseCSV = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    const applicants = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const fields = [];
        let current = '';
        let inQuotes = false;

        for (let j = 0; j < line.length; j++) {
            if (line[j] === '"') {
                inQuotes = !inQuotes;
            } else if (line[j] === ',' && !inQuotes) {
                fields.push(current.trim());
                current = '';
            } else {
                current += line[j];
            }
        }
        fields.push(current.trim());

        if (fields.length >= 7) {
            applicants.push({
                name: fields[1] || '',
                email: fields[2] || '',
                phone: fields[3] || '',
                college: fields[4] || '',
                degree: fields[5] || '',
                year: parseInt(fields[6]) || 1
            });
        }
    }

    return applicants;
};

// Validate files for one applicant
const validateApplicantFiles = (applicantName, uploadedFiles) => {
    const nameParts = applicantName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts[1] || '';
    const namePrefix = `${firstName}_${lastName}`;

    let hasResume = false;
    let hasId = false;
    let hasProject = false;
    let resumeIssue = '';
    let idIssue = '';
    let projectIssue = '';
    const issues = [];

    uploadedFiles.forEach(file => {
        const filename = file.originalname;
        const ext = path.extname(filename).toLowerCase();
        const nameWithoutExt = path.basename(filename, ext);

        // Check Resume
        if (filename === `${namePrefix}_Resume.pdf`) {
            hasResume = true;
            resumeIssue = 'OK';
        } else if (
            nameWithoutExt.toLowerCase() === `${namePrefix.toLowerCase()}_resume`
            && ext === '.pdf'
        ) {
            resumeIssue = `Wrong capitalization: should be '${namePrefix}_Resume.pdf'`;
            issues.push('Resume: wrong capitalization');
        }

        // Check ID
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            if (filename === `${namePrefix}_ID${ext}`) {
                hasId = true;
                idIssue = 'OK';
            } else if (
                nameWithoutExt.toLowerCase() === `${namePrefix.toLowerCase()}_id`
            ) {
                idIssue = `Wrong capitalization: should be '${namePrefix}_ID${ext}'`;
                issues.push('ID: wrong capitalization');
            }
        }

        // Check Project
        if (['.mp4', '.avi', '.mov'].includes(ext)) {
            if (filename === `${namePrefix}_Project${ext}`) {
                hasProject = true;
                projectIssue = 'OK';
            } else if (
                nameWithoutExt.toLowerCase() === `${namePrefix.toLowerCase()}_project`
            ) {
                projectIssue = `Wrong capitalization: should be '${namePrefix}_Project${ext}'`;
                issues.push('Project: wrong capitalization');
            }
        }
    });

    // Check missing files
    if (!hasResume && !resumeIssue) {
        resumeIssue = 'File not found';
        issues.push('Resume: missing');
    }
    if (!hasId && !idIssue) {
        idIssue = 'File not found';
        issues.push('ID: missing');
    }
    if (!hasProject && !projectIssue) {
        projectIssue = 'File not found';
        issues.push('Project: missing');
    }

    const isEligible = hasResume && hasId && hasProject && issues.length === 0;

    return {
        hasResume,
        hasId,
        hasProject,
        resumeIssue,
        idIssue,
        projectIssue,
        status: isEligible ? 'Eligible' : 'Not Eligible',
        reason: issues.length > 0
            ? issues.join('; ')
            : 'All files present and valid'
    };
};


// STEP 1: Create batch from CSV
const createBatch = async (req, res) => {
    try {
        const userId = req.userId;
        const { batchName } = req.body;
        const files = req.files || [];

        // Find CSV file
        const csvFile = files.find(f =>
            path.extname(f.originalname).toLowerCase() === '.csv'
        );

        if (!csvFile) {
            return res.status(400).json({ error: 'No CSV file provided' });
        }
        if (!batchName) {
            return res.status(400).json({ error: 'Batch name is required' });
        }

        // Parse CSV
        const csvContent = csvFile.buffer.toString('utf-8');
        const applicants = parseCSV(csvContent);

        if (applicants.length === 0) {
            return res.status(400).json({ error: 'No applicants found in CSV' });
        }

        // Create batch
        const batchResult = await pool.query(
            `INSERT INTO batches (name, created_by, total_applicants)
             VALUES ($1, $2, $3) RETURNING id`,
            [batchName, userId, applicants.length]
        );
        const batchId = batchResult.rows[0].id;

        // Insert applicants with Pending status
        for (const applicant of applicants) {
            await pool.query(`
                INSERT INTO applicants (
                    batch_id, name, email, phone,
                    college, degree, year, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [
                batchId,
                applicant.name,
                applicant.email,
                applicant.phone,
                applicant.college,
                applicant.degree,
                applicant.year,
                'Pending'
            ]);
        }

        res.json({
            message: 'Batch created successfully!',
            batchId,
            batchName,
            total: applicants.length
        });

    } catch (error) {
        console.error('Create batch error:', error);
        res.status(500).json({ error: 'Failed to create batch' });
    }
};


// STEP 2: Upload files and validate

const uploadFiles = async (req, res) => {
    try {
        const { batchId } = req.body;
        const files = req.files || [];

        if (!batchId) {
            return res.status(400).json({ error: 'Please select a batch' });
        }
        if (files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Get all applicants for this batch
        const applicantsResult = await pool.query(
            'SELECT * FROM applicants WHERE batch_id = $1',
            [batchId]
        );
        const applicants = applicantsResult.rows;

        if (applicants.length === 0) {
            return res.status(400).json({ error: 'No applicants found in this batch' });
        }

        let eligibleCount = 0;
        let notEligibleCount = 0;

        // Validate files for each applicant
        for (const applicant of applicants) {
            const validation = validateApplicantFiles(applicant.name, files);

            if (validation.status === 'Eligible') eligibleCount++;
            else notEligibleCount++;

            // Update applicant in database
            await pool.query(`
                UPDATE applicants SET
                    has_resume = $1,
                    has_id = $2,
                    has_project = $3,
                    resume_issue = $4,
                    id_issue = $5,
                    project_issue = $6,
                    status = $7,
                    reason = $8
                WHERE id = $9
            `, [
                validation.hasResume,
                validation.hasId,
                validation.hasProject,
                validation.resumeIssue,
                validation.idIssue,
                validation.projectIssue,
                validation.status,
                validation.reason,
                applicant.id
            ]);
        }

        // Update batch counts
        await pool.query(
            `UPDATE batches SET
                eligible_count = $1,
                not_eligible_count = $2
             WHERE id = $3`,
            [eligibleCount, notEligibleCount, batchId]
        );

        res.json({
            message: 'Files validated successfully!',
            total: applicants.length,
            eligible: eligibleCount,
            notEligible: notEligibleCount
        });

    } catch (error) {
        console.error('Upload files error:', error);
        res.status(500).json({ error: 'Failed to validate files' });
    }
};

// all batches for this user
const getBatches = async (req, res) => {
    try {
        const userId = req.userId;

        const result = await pool.query(
            `SELECT * FROM batches
             WHERE created_by = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error('Get batches error:', error);
        res.status(500).json({ error: 'Failed to fetch batches' });
    }
};

module.exports = { createBatch, uploadFiles, getBatches };