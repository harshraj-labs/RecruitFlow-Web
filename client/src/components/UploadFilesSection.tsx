import { useState } from 'react';
import { Upload, CheckCircle, FolderOpen } from 'lucide-react';
import type { Batch } from '../types';
import { batchService } from '../services/api';

interface UploadFilesSectionProps {
    batches: Batch[];
    selectedBatchId: number | null;
    onUploadComplete: () => void;
}

function UploadFilesSection({ batches, selectedBatchId, onUploadComplete }: UploadFilesSectionProps) {
    const [batchId, setBatchId] = useState<number>(selectedBatchId || 0);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!batchId) {
            setError('Please select a batch');
            return;
        }
        if (files.length === 0) {
            setError('Please select files to upload');
            return;
        }

        setLoading(true);
        try {
            const result = await batchService.uploadFiles(batchId, files);
            setSuccess(
                `✅ Validated ${result.total} applicants: ${result.eligible} eligible, ${result.notEligible} not eligible`
            );
            setFiles([]);
            onUploadComplete();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
                <Upload className="text-green-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">
                    Step 2: Upload Applicant Files
                </h2>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Batch Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Batch
                    </label>
                    <select
                        value={batchId}
                        onChange={(e) => setBatchId(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value={0}>-- Select a batch --</option>
                        {batches.map(batch => (
                            <option key={batch.id} value={batch.id}>
                                {batch.name} ({batch.total_applicants} applicants)
                            </option>
                        ))}
                    </select>
                </div>

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Applicant Files (Resume, ID, Project)
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors">
                        {files.length > 0 ? (
                            <div className="flex flex-col items-center">
                                <CheckCircle className="text-green-500 mb-1" size={24} />
                                <p className="text-sm text-green-600 font-medium">
                                    {files.length} files selected
                                </p>
                                <p className="text-xs text-gray-400">
                                    Click to change selection
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <FolderOpen className="text-gray-400 mb-1" size={24} />
                                <p className="text-sm text-gray-500">
                                    Click to select all applicant files
                                </p>
                                <p className="text-xs text-gray-400">
                                    Select ALL files at once (Resume, ID, Project)
                                </p>
                            </div>
                        )}
                        <input
                            type="file"
                            multiple
                            onChange={handleFilesChange}
                            className="hidden"
                        />
                    </label>

                    {/* Show selected files */}
                    {files.length > 0 && (
                        <div className="mt-2 max-h-24 overflow-y-auto">
                            {files.map((file, index) => (
                                <p key={index} className="text-xs text-gray-500 truncate">
                                    📄 {file.name}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                >
                    {loading ? 'Validating...' : 'Validate Files'}
                </button>
            </form>
        </div>
    );
}

export default UploadFilesSection;