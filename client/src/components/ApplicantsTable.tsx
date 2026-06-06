import { CheckCircle, XCircle, Clock } from 'lucide-react';

// TypeScript interface for one applicant
interface Applicant {
    id: number;
    name: string;
    email: string;
    college: string;
    degree: string;
    year: number;
    status: string;
    reason: string;
}

interface ApplicantsTableProps {
    applicants: Applicant[];
}

function ApplicantsTable({ applicants }: ApplicantsTableProps) {

    // Function to show the right icon and color based on status
    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'Eligible') {
            return (
                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircle size={12} />
                    Eligible
                </span>
            );
        }
        if (status === 'Not Eligible') {
            return (
                <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                    <XCircle size={12} />
                    Not Eligible
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium">
                <Clock size={12} />
                Pending
            </span>
        );
    };

    if (applicants.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <p className="text-gray-400">
                    No applicants yet. Upload a CSV to get started!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                    Applicants ({applicants.length})
                </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Name</th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Email</th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">College</th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Year</th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Reason</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {applicants.map((applicant) => (
                            <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                    {applicant.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {applicant.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {applicant.college}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    Year {applicant.year}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={applicant.status} />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {applicant.reason || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ApplicantsTable;