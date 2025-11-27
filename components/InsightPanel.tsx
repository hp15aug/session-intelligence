'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface InsightPanelProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: string;
    initialSummary?: string;
}

export default function InsightPanel({ isOpen, onClose, sessionId, initialSummary }: InsightPanelProps) {
    const [content, setContent] = useState(initialSummary || '');
    const [isLoading, setIsLoading] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(!!initialSummary);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [content]);

    const generateInsight = async () => {
        setIsLoading(true);
        setContent('');
        setHasGenerated(true);

        try {
            const response = await fetch('/api/session/analyze/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId }),
            });

            if (!response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                setContent((prev) => prev + chunkValue);
            }
        } catch (error) {
            console.error('Error generating insight:', error);
            setContent('Failed to generate insight. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                    </div>
                    <h2 className="font-semibold text-gray-900">AI Assistant</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-white" ref={scrollRef}>
                {!hasGenerated ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 p-8">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
                        </div>
                        <div className="max-w-xs space-y-2">
                            <h3 className="font-semibold text-gray-900 text-lg">Generate UX Report</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Create a detailed heuristic evaluation of this session, identifying user intent and friction points.
                            </p>
                        </div>
                        <button
                            onClick={generateInsight}
                            className="px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
                        >
                            Start Analysis
                        </button>
                    </div>
                ) : (
                    <div className="p-8">
                        <div className="prose prose-slate prose-sm max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-li:marker:text-gray-400">
                            {content ? (
                                <ReactMarkdown>{content}</ReactMarkdown>
                            ) : (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer - Removed Chat Input, added Status/Actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
                <span>
                    {isLoading ? 'Generating report...' : 'Report generated by Gemini 2.5 Flash'}
                </span>
                {content && !isLoading && (
                    <button
                        onClick={() => navigator.clipboard.writeText(content)}
                        className="hover:text-gray-900 cursor-pointer transition-colors font-medium"
                    >
                        Copy to Clipboard
                    </button>
                )}
            </div>
        </div>
    );
}
