import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import SessionDetailClient from '@/components/SessionDetailClient';

export const revalidate = 0;

interface PageProps {
    params: Promise<{
        sessionId: string;
    }>;
}

export default async function SessionDetailPage({ params }: PageProps) {
    const { sessionId } = await params;

    // 1. Fetch Metadata
    const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

    if (sessionError || !session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-xl font-semibold text-gray-900">Session not found</h1>
                    <Link href="/dashboard" className="text-blue-600 hover:underline mt-2 inline-block">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // 2. Fetch Recording Chunks
    const { data: files } = await supabase.storage
        .from('session-recordings')
        .list(sessionId);

    let allEvents: any[] = [];

    if (files && files.length > 0) {
        const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));

        const downloadPromises = sortedFiles.map(async (file) => {
            const { data } = await supabase.storage
                .from('session-recordings')
                .download(`${sessionId}/${file.name}`);

            if (data) {
                const text = await data.text();
                try { return JSON.parse(text); } catch (e) { return []; }
            }
            return [];
        });

        const chunks = await Promise.all(downloadPromises);
        allEvents = chunks.flat();
    }

    return <SessionDetailClient session={session} allEvents={allEvents} />;
}