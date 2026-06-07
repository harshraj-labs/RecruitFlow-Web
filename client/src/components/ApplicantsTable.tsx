import { CheckCircle, XCircle, Clock } from 'lucide-react';
import DownloadDropdown from './DownloadDropdown';
import type { Applicant } from '../types';

interface ApplicantsTableProps {
    applicants: Applicant[];
    selectedBatchId: number | null;
    selectedBatchName: string | null;
}

function ApplicantsTable({ applicants, selectedBatchId, selectedBatchName }: ApplicantsTableProps) {

    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'Eligible') {
            return (
                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium w-fit">
                    <CheckCircle size={12} />
                    Eligible
                </span>
            );
        }
        if (status === 'Not Eligible') {
            return (
                <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium w-fit">
                    <XCircle size={12} />
                    Not Eligible
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium w-fit">
                <Clock size={12} />
                Pending
            </span>
        );
    };

    if (applicants.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <p className="text-gray-400 text-sm">
                    No applicants yet. Upload a CSV to get started!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            {/* Table Header with Download Button */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Applicants
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {applicants.length} total
                    </p>
                </div>

                {/* Download Dropdown */}
                <DownloadDropdown
                    selectedBatchId={selectedBatchId}
                    selectedBatchName={selectedBatchName}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                Name
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                Email
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                College
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                Year
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                Status
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">
                                Reason
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {applicants.map((applicant) => (
                            <tr
                                key={applicant.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
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