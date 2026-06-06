import { useState } from 'react';
import { X, FileText, CheckCircle } from 'lucide-react';
import { batchService } from '../services/api';

interface CreateBatchModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

function CreateBatchModal({ onClose, onSuccess }: CreateBatchModalProps) {
    const [batchName, setBatchName] = useState('');
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!batchName || !csvFile) {
            setError('Please provide batch name and CSV file');
            return;
        }

        setLoading(true);
        try {
            await batchService.create(batchName, csvFile);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create batch');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Modal backdrop
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Create New Batch
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Batch Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Batch Name
                        </label>
                        <input
                            type="text"
                            value={batchName}
                            onChange={(e) => setBatchName(e.target.value)}
                            placeholder="e.g. February 2026 Intake"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* CSV Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Google Forms CSV
                        </label>
                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                            {csvFile ? (
                                <div className="flex flex-col items-center">
                                    <CheckCircle className="text-green-500 mb-1" size={24} />
                                    <p className="text-sm text-green-600 font-medium">
                                        {csvFile.name}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <FileText className="text-gray-400 mb-1" size={24} />
                                    <p className="text-sm text-gray-500">
                                        Click to upload CSV
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Google Forms export (.csv)
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept=".csv"
                                onChange={(e) => e.target.files && setCsvFile(e.target.files[0])}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Batch'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateBatchModal;