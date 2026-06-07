import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, CheckCircle, XCircle, Users } from 'lucide-react';

interface DownloadDropdownProps {
    selectedBatchId: number | null;
    selectedBatchName: string | null;
}

function DownloadDropdown({ selectedBatchId, selectedBatchName }: DownloadDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scope, setScope] = useState<'batch' | 'all'>(
        selectedBatchId ? 'batch' : 'all'
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update scope when batch selection changes
    useEffect(() => {
        setScope(selectedBatchId ? 'batch' : 'all');
    }, [selectedBatchId]);

    const handleDownload = async (type: 'eligible' | 'not-eligible' | 'all') => {
        try {
            // Build URL
            let url = `http://localhost:5000/api/dashboard/download?type=${type}`;

            // Add batchId if scope is batch AND a batch is selected
            if (scope === 'batch' && selectedBatchId) {
                url += `&batchId=${selectedBatchId}`;
            }

            const token = localStorage.getItem('token');

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Download failed');

            // Convert to blob and trigger download
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download =
                type === 'eligible' ? 'eligible_applicants.csv' :
                type === 'not-eligible' ? 'rejected_applicants.csv' :
                'all_applicants.csv';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            setIsOpen(false);

        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download. Please try again.');
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
                <Download size={16} />
                Download
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">

                    {/* Scope Selector */}
                    <div className="p-3 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Download Scope
                        </p>
                        <div className="space-y-1">

                            {/* Current Batch Option */}
                            <label className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-colors ${
                                scope === 'batch'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            } ${!selectedBatchId ? 'opacity-40 cursor-not-allowed' : ''}`}>
                                <input
                                    type="radio"
                                    name="scope"
                                    value="batch"
                                    checked={scope === 'batch'}
                                    onChange={() => setScope('batch')}
                                    disabled={!selectedBatchId}
                                    className="accent-blue-600"
                                />
                                <span className="truncate">
                                    {selectedBatchId
                                        ? `Current: ${selectedBatchName}`
                                        : 'Current batch (select one first)'
                                    }
                                </span>
                            </label>

                            {/* All Batches Option */}
                            <label className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-colors ${
                                scope === 'all'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}>
                                <input
                                    type="radio"
                                    name="scope"
                                    value="all"
                                    checked={scope === 'all'}
                                    onChange={() => setScope('all')}
                                    className="accent-blue-600"
                                />
                                All Batches
                            </label>
                        </div>
                    </div>

                    {/* Download Options */}
                    <div className="p-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-1">
                            Export As
                        </p>

                        {/* Eligible */}
                        <button
                            onClick={() => handleDownload('eligible')}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        >
                            <CheckCircle size={16} className="text-green-500 shrink-0" />
                            <div className="text-left">
                                <p className="font-medium">Eligible Applicants</p>
                                <p className="text-xs text-gray-400">
                                    All approved candidates
                                </p>
                            </div>
                        </button>

                        {/* Rejected */}
                        <button
                            onClick={() => handleDownload('not-eligible')}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                            <XCircle size={16} className="text-red-500 shrink-0" />
                            <div className="text-left">
                                <p className="font-medium">Rejected Applicants</p>
                                <p className="text-xs text-gray-400">
                                    With rejection reasons
                                </p>
                            </div>
                        </button>

                        {/* All */}
                        <button
                            onClick={() => handleDownload('all')}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                            <Users size={16} className="text-blue-500 shrink-0" />
                            <div className="text-left">
                                <p className="font-medium">All Applicants</p>
                                <p className="text-xs text-gray-400">
                                    Complete list with status
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DownloadDropdown;