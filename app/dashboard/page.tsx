import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Inbox } from 'lucide-react';
import SessionRow from '@/components/SessionRow';

export const revalidate = 0;

export default async function DashboardPage() {
    const { data: sessions, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-red-200 rounded-lg shadow-sm text-red-600">
                    <ShieldAlert size={18} />
                    <span className="text-sm font-medium">System Error: {error.message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
            {/* Top Navigation Bar */}
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Header Section */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Session Monitor
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Live telemetry and interaction logs.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm">
                        <span className="text-xs font-semibold text-slate-700">
                            {sessions?.length || 0}
                        </span>
                        <span className="text-xs text-slate-400">Total Entries</span>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Column Headers - Grid Updated to 9/3 split */}
                    <div className="hidden md:grid grid-cols-12 gap-6 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-9">Full Target URL & Timestamp</div>
                        <div className="col-span-3 text-right mr-16">Intelligence</div>
                    </div>

                    {/* Rows Container */}
                    <div className="divide-y divide-gray-100">
                        {sessions?.map((session) => (
                            <SessionRow key={session.id} session={session} />
                        ))}
                    </div>

                    {/* Empty State - Professional Iconography */}
                    {sessions?.length === 0 && (
                        <div className="py-32 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Inbox className="text-gray-300" size={24} />
                            </div>
                            <h3 className="text-sm font-medium text-slate-900">No active sessions</h3>
                            <p className="text-sm text-slate-500 mt-1 max-w-xs">
                                Waiting for incoming traffic. Records will appear here automatically.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}