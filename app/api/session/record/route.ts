import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sessionId, events, metadata, chunkIndex } = body;

        if (!sessionId || !events) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Upload the chunk to Supabase Storage
        const fileName = `${sessionId}/${Date.now()}_${chunkIndex}.json`;
        const { error: storageError } = await supabase.storage
            .from('session-recordings')
            .upload(fileName, JSON.stringify(events), {
                contentType: 'application/json',
                upsert: true,
            });

        if (storageError) {
            console.error('Storage Error:', storageError);
            return NextResponse.json({ error: 'Failed to upload chunk' }, { status: 500 });
        }

        // 2. Update the session metadata in the Database
        // We use upsert to create the session if it doesn't exist, or update it if it does.
        const { error: dbError } = await supabase
            .from('sessions')
            .upsert({
                id: sessionId,
                url: metadata.url,
                user_agent: metadata.userAgent,
                window_width: metadata.windowWidth,
                window_height: metadata.windowHeight,
                // We can't easily sum duration/event_count atomically here without a stored procedure,
                // but for a prototype, we can just update the "last active" or trust the client's running total if sent.
                // For now, let's just ensure the session exists.
                // Ideally, we'd increment event_count.
            }, { onConflict: 'id' })
            .select();

        if (dbError) {
            console.error('DB Error:', dbError);
            // We don't fail the request just because DB update failed, as long as storage worked.
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
