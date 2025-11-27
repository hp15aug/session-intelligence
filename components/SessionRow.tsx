'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { Clock, Trash2, ChevronRight, Zap } from 'lucide-react';
import DeleteModal from './DeleteModal';

export default function SessionRow({ session }: { session: any }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const formattedDate = new Date(session.created_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowModal(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        const { error } = await supabase.from('sessions').delete().eq('id', session.id);

        if (!error) {
            setShowModal(false);
            router.refresh();
        } else {
            alert('Error deleting session');
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="group relative border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <Link
                    href={`/dashboard/${session.id}`}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 px-6 py-4 items-center"
                >

                    {/* 1. Full URL & Timestamp (9 Cols) */}
                    <div className="col-span-9 flex flex-col justify-center min-w-0">
                        <h3 className="text-xs font-mono font-medium text-slate-700 truncate mb-1" title={session.url}>
                            {session.url || 'Unknown URL'}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                                <Clock size={11} />
                                {formattedDate}
                            </span>
                        </div>
                    </div>

                    {/* 2. Intelligence & Actions (3 Cols) */}
                    <div className="col-span-3 flex items-center justify-end gap-3">
                        {/* Status Badge */}
                        {session.summary ? (
                            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                Analyzed
                            </span>
                        ) : (
                            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                Pending
                            </span>
                        )}

                        {/* Action Buttons (Visible on Hover) */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pl-2 border-l border-gray-200">
                            <button
                                onClick={handleDeleteClick}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                            <div className="p-1.5 text-slate-300">
                                <ChevronRight size={14} />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            <DeleteModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </>
    );
}