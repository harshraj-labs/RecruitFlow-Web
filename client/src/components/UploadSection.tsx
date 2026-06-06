import { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface UploadSectionProps {
    onUploadComplete: () => void;
}

function UploadSection({ onUploadComplete }: UploadSectionProps) {
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [batchName, setBatchName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCsvFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!csvFile || !batchName) {
            setError('Please provide a batch name and CSV file');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('csv', csvFile);
            formData.append('batchName', batchName);

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/batches/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setSuccess(`✅ Successfully processed ${data.total} applicants!`);
            setCsvFile(null);
            setBatchName('');
            onUploadComplete(); // Refresh dashboard data

        } catch (err: any) {
            setError(err.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
                <Upload className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">
                    Upload Applications
                </h2>
            </div>

            {/* Error/Success messages */}
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
                        <div className="flex flex-col items-center">
                            {csvFile ? (
                                <>
                                    <CheckCircle className="text-green-500 mb-1" size={24} />
                                    <p className="text-sm text-green-600 font-medium">
                                        {csvFile.name}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <FileText className="text-gray-400 mb-1" size={24} />
                                    <p className="text-sm text-gray-500">
                                        Click to upload CSV file
                                    </p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleCsvChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                >
                    {loading ? 'Processing...' : 'Process Applications'}
                </button>
            </form>
        </div>
    );
}

export default UploadSection;