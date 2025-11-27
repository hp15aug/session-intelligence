'use client';

import { useState } from 'react';
import { ArrowLeft, Clock, Globe, Hash, MousePointer, Sparkles } from 'lucide-react';
import Link from 'next/link';
import SessionPlayer from '@/components/SessionPlayer';
import InsightPanel from '@/components/InsightPanel';

interface SessionDetailClientProps {
    session: any;
    allEvents: any[];
}

export default function SessionDetailClient({ session, allEvents }: SessionDetailClientProps) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="p-2 -ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                    {session.id.slice(0, 8)}...
                                </span>
                                <span>/</span>
                                <span className="text-gray-900 font-medium">Session Replay</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500 font-mono hidden sm:block">
                            {new Date(session.created_at).toLocaleString(undefined, {
                                dateStyle: 'medium', timeStyle: 'short'
                            })}
                        </div>

                        {/* AI Insight Toggle Button */}
                        <button
                            onClick={() => setIsPanelOpen(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${session.summary
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100'
                                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow'
                                }`}
                        >
                            {session.summary ? 'View Analysis' : 'Analyze Session'}
                        </button>
                    </div>
                </div>
            </header>

            <main className={`max-w-7xl mx-auto px-6 py-8 transition-all duration-300 ${isPanelOpen ? 'mr-[480px]' : ''}`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Player (Takes up full width or adjusts) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-1">
                            {/* Toolbar style header for player */}
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50 rounded-t-lg">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="ml-4 text-xs text-gray-400 font-mono flex-1 text-center truncate">
                                    {session.url}
                                </div>
                            </div>

                            {/* The Player Component */}
                            <div className="bg-gray-900 rounded-b-lg">
                                <SessionPlayer events={allEvents} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar Info */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Technical Details Card */}
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Technical Details
                            </div>
                            <div className="divide-y divide-gray-50">
                                <div className="p-4 flex items-start gap-3">
                                    <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 mb-0.5">URL Path</p>
                                        <p className="text-sm text-gray-900 truncate font-medium" title={session.url}>
                                            {session.url}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 flex items-start gap-3">
                                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-0.5">Duration</p>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {session.duration ? `${session.duration} seconds` : 'Active'}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 flex items-start gap-3">
                                    <MousePointer className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-0.5">Interaction Events</p>
                                        <p className="text-sm text-gray-900 font-medium font-mono">
                                            {allEvents.length.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 flex items-start gap-3">
                                    <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 mb-0.5">Session ID</p>
                                        <p className="text-xs text-gray-600 font-mono break-all bg-gray-50 p-1.5 rounded">
                                            {session.id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Sliding Panel */}
            <InsightPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                sessionId={session.id}
                initialSummary={session.summary}
            />
        </div>
    );
}
