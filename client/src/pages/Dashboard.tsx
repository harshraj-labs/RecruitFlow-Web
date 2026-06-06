import { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import StatCard from '../components/StatCard';
import Sidebar from '../components/SideBar';
import ApplicantsTable from '../components/ApplicantsTable';
import CreateBatchModal from '../components/CreateBatchModal';
import UploadFilesSection from '../components/UploadFilesSection';
import { dashboardService, batchService } from '../services/api';
import type { Batch, Applicant, DashboardStats } from '../types';

function Dashboard() {
    // State
    const [batches, setBatches] = useState<Batch[]>([]);
    const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        total: 0, eligible: 0, not_eligible: 0, pending: 0
    });
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Fetch batches list
    const fetchBatches = async () => {
        try {
            const data = await batchService.getAll();
            setBatches(data);
        } catch (error) {
            console.error('Failed to fetch batches:', error);
        }
    };

    // Fetch stats and applicants (changes when selectedBatchId changes)
    const fetchDashboardData = async () => {
        try {
            const [statsData, applicantsData] = await Promise.all([
                dashboardService.getStats(selectedBatchId || undefined),
                dashboardService.getApplicants(selectedBatchId || undefined)
            ]);
            setStats(statsData);
            setApplicants(applicantsData);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh everything
    const refreshAll = async () => {
        await Promise.all([fetchBatches(), fetchDashboardData()]);
    };

    // Run on first load
    useEffect(() => {
        refreshAll();
    }, []);

    // Re-fetch when selected batch changes
    useEffect(() => {
        fetchDashboardData();
    }, [selectedBatchId]);

    // Get selected batch name for display
    const selectedBatchName = selectedBatchId
        ? batches.find(b => b.id === selectedBatchId)?.name || 'Selected Batch'
        : 'All Batches';

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="flex">
                {/* Sidebar */}
                <Sidebar
                    batches={batches}
                    selectedBatchId={selectedBatchId}
                    onSelectBatch={setSelectedBatchId}
                    onNewBatch={() => setShowCreateModal(true)}
                />

                {/* Main Content */}
                <div className="flex-1 p-6 space-y-6">

                    {/* Page Title */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {selectedBatchName}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedBatchId
                                ? 'Showing results for selected batch'
                                : 'Showing combined results for all batches'
                            }
                        </p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Applicants"
                            value={stats.total}
                            color="border-blue-500"
                            icon="👥"
                        />
                        <StatCard
                            title="Eligible"
                            value={stats.eligible}
                            color="border-green-500"
                            icon="✅"
                        />
                        <StatCard
                            title="Not Eligible"
                            value={stats.not_eligible}
                            color="border-red-500"
                            icon="❌"
                        />
                        <StatCard
                            title="Pending"
                            value={stats.pending}
                            color="border-yellow-500"
                            icon="⏳"
                        />
                    </div>

                    {/* Upload Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Step 1: Info Card */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                📋 File Requirements
                            </h2>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-500 font-bold">Format:</span>
                                    <span>FirstName_LastName_FileType.ext</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">Resume:</span>
                                    <span>FirstName_LastName_Resume.pdf</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-yellow-500 font-bold">ID Card:</span>
                                    <span>FirstName_LastName_ID.jpg/.png/.jpeg</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-purple-500 font-bold">Project:</span>
                                    <span>FirstName_LastName_Project.mp4</span>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-blue-600 font-medium text-xs">
                                        💡 How to use:
                                    </p>
                                    <p className="text-blue-500 text-xs mt-1">
                                        1. Create a batch using "New Batch" button with your CSV file.
                                        Then upload applicant files using Step 2.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Upload Files */}
                        <UploadFilesSection
                            batches={batches}
                            selectedBatchId={selectedBatchId}
                            onUploadComplete={refreshAll}
                        />
                    </div>

                    {/* Applicants Table */}
                    <ApplicantsTable applicants={applicants} />
                </div>
            </div>

            {/* Create Batch Modal */}
            {showCreateModal && (
                <CreateBatchModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={refreshAll}
                />
            )}
        </div>
    );
}

export default Dashboard;