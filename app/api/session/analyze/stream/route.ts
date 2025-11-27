import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { sessionId } = await request.json();

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
        }

        // 1. Fetch Data (Same logic as before)
        const { data: files } = await supabase.storage.from('session-recordings').list(sessionId);
        if (!files) return NextResponse.json({ error: 'No recordings found' }, { status: 500 });

        const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
        const chunks = await Promise.all(sortedFiles.map(async (file) => {
            const { data } = await supabase.storage.from('session-recordings').download(`${sessionId}/${file.name}`);
            return data ? JSON.parse(await data.text()) : [];
        }));

        const allEvents = chunks.flat();
        if (allEvents.length === 0) return NextResponse.json({ error: 'Empty session' }, { status: 400 });

        // 2. Prepare Prompt
        const startTime = allEvents[0]?.timestamp;
        const endTime = allEvents[allEvents.length - 1]?.timestamp;
        const durationSeconds = (endTime - startTime) / 1000;

        const activityLog = allEvents.map((e: any) => {
            const timeOffset = ((e.timestamp - startTime) / 1000).toFixed(1);
            if (e.type === 4 && e.data?.href) return `[${timeOffset}s] Navigated to: ${e.data.href}`;
            if (e.type === 3 && e.data?.source === 5) return `[${timeOffset}s] User typed text`;
            if (e.type === 3 && e.data?.source === 2 && e.data?.type === 2) return `[${timeOffset}s] Click (x:${e.data.x}, y:${e.data.y})`;
            if (e.type === 2) return `[${timeOffset}s] DOM Loaded`;
            return null;
        }).filter(Boolean).slice(0, 50);

        const prompt = `
        Role: Senior UX Researcher.
        Task: Analyze this user session.
        
        Data:
        - Duration: ${durationSeconds.toFixed(1)}s
        - Events: ${allEvents.length}
        
        Log:
        ${activityLog.join('\n')}
        
        Provide a streaming analysis. Structure it with Markdown headers:
        ### User Flow
        ### Core Intent
        ### UX Friction
        
        Be concise and professional.
    `;

        // 3. Stream Response
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContentStream(prompt);

        // Create a ReadableStream
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    controller.enqueue(new TextEncoder().encode(chunkText));
                }
                controller.close();
            },
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (error) {
        console.error('Stream Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
