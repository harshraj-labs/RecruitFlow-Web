-- table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Batches table (each CSV upload is a batch)
CREATE TABLE IF NOT EXISTS batches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_by INTEGER REFERENCES users(id),
    total_applicants INTEGER DEFAULT 0,
    eligible_count INTEGER DEFAULT 0,
    not_eligible_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applicants table
CREATE TABLE IF NOT EXISTS applicants (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(id),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    college VARCHAR(100),
    degree VARCHAR(100),
    year INTEGER,
    has_resume BOOLEAN DEFAULT FALSE,
    has_id BOOLEAN DEFAULT FALSE,
    has_project BOOLEAN DEFAULT FALSE,
    resume_issue VARCHAR(200),
    id_issue VARCHAR(200),
    project_issue VARCHAR(200),
    status VARCHAR(20) DEFAULT 'Pending',
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Batch files
CREATE TABLE IF NOT EXISTS batch_file_uploads (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES batches(id),
    files_uploaded BOOLEAN DEFAULT FALSE,
    files_count INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP
);