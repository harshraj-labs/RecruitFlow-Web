export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Batch {
    id: number;
    name: string;
    total_applicants: number;
    eligible_count: number;
    not_eligible_count: number;
    created_at: string;
}

export interface Applicant {
    id: number;
    batch_id: number;
    batch_name?: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    degree: string;
    year: number;
    has_resume: boolean;
    has_id: boolean;
    has_project: boolean;
    resume_issue: string;
    id_issue: string;
    project_issue: string;
    status: string;
    reason: string;
    created_at: string;
}

export interface DashboardStats {
    total: number;
    eligible: number;
    not_eligible: number;
    pending: number;
}