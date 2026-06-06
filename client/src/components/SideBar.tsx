import { useState } from 'react';
import { Plus, Layers, ChevronRight, Menu, X } from 'lucide-react';
import type { Batch } from '../types';

interface SidebarProps {
    batches: Batch[];
    selectedBatchId: number | null;
    onSelectBatch: (batchId: number | null) => void;
    onNewBatch: () => void;
}

function Sidebar({ batches, selectedBatchId, onSelectBatch, onNewBatch }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`bg-white shadow-sm min-h-screen flex flex-col transition-all duration-300 ${
            collapsed ? 'w-14' : 'w-64'
        }`}>

            {/* Header with Hamburger Button */}
            <div className={`p-4 border-b border-gray-100 flex items-center ${
                collapsed ? 'justify-center' : 'justify-between'
            }`}>
                {/* Title - hidden when collapsed */}
                {!collapsed && (
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Batches
                    </h2>
                )}

                {/* Hamburger / Close Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1 rounded-lg transition-colors"
                >
                    {collapsed ? <Menu size={20} /> : <X size={20} />}
                </button>
            </div>

            {/* Content */}
            <div className="p-2 space-y-1">

                {/* All Batches */}
                <button
                    onClick={() => onSelectBatch(null)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedBatchId === null
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <Layers size={16} className="shrink-0" />

                    {/* Hide text when collapsed */}
                    {!collapsed && (
                        <>
                            <span>All Batches</span>
                            {selectedBatchId === null && (
                                <ChevronRight size={14} className="ml-auto" />
                            )}
                        </>
                    )}
                </button>

                {/* New Batch Button */}
                <button
                    onClick={onNewBatch}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors ${
                        collapsed ? 'justify-center' : ''
                    }`}
                >
                    <Plus size={16} className="shrink-0" />
                    {!collapsed && <span>New Batch</span>}
                </button>

                {/* Divider */}
                {!collapsed && (
                    <div className="border-t border-gray-100 my-2" />
                )}

                {/* Batch List */}
                {batches.map(batch => (
                    <button
                        key={batch.id}
                        onClick={() => onSelectBatch(batch.id)}
                        className={`w-full flex flex-col px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                            selectedBatchId === batch.id
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {collapsed ? (
                            // Show only first letter when collapsed
                            <span className="font-bold text-center w-full">
                                {batch.name.charAt(0).toUpperCase()}
                            </span>
                        ) : (
                            // Show full info when expanded
                            <>
                                <span className="font-medium truncate">
                                    {batch.name}
                                </span>
                                <span className="text-xs text-gray-400 mt-0.5">
                                    {batch.total_applicants} applicants •{' '}
                                    {batch.eligible_count} eligible
                                </span>
                            </>
                        )}
                    </button>
                ))}

                {/* Empty state - only show when expanded */}
                {batches.length === 0 && !collapsed && (
                    <p className="text-xs text-gray-400 px-3 py-2">
                        No batches yet. Create one!
                    </p>
                )}
            </div>
        </div>
    );
}

export default Sidebar;