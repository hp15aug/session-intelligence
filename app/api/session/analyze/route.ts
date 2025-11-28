import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Use standard flash model (change to 2.0-flash-exp if you have access)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const sessionId = url.searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
        }

        // 1. Fetch and Combine Chunks
        const { data: files } = await supabase.storage.from('session-recordings').list(sessionId);

        if (!files) return NextResponse.json({ error: 'No recordings found' }, { status: 500 });

        const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
        const chunks = await Promise.all(sortedFiles.map(async (file) => {
            const { data } = await supabase.storage.from('session-recordings').download(`${sessionId}/${file.name}`);
            return data ? JSON.parse(await data.text()) : [];
        }));

        const allEvents = chunks.flat();
        if (allEvents.length === 0) return NextResponse.json({ error: 'Empty session' }, { status: 400 });

        // 2. Calculate Metrics
        const startTime = allEvents[0]?.timestamp;
        const endTime = allEvents[allEvents.length - 1]?.timestamp;
        const durationSeconds = (endTime - startTime) / 1000;

        // 3. Construct Chronological Activity Log
        // rrweb event types: 2=Load, 3=Incremental (Mouse/Input), 4=Meta/Nav
        const activityLog = allEvents.map((e: any) => {
            const timeOffset = ((e.timestamp - startTime) / 1000).toFixed(1);

            if (e.type === 4 && e.data?.href) {
                return `[${timeOffset}s] Navigated to: ${e.data.href}`;
            }
            if (e.type === 3 && e.data?.source === 5) { // Input
                return `[${timeOffset}s] User typed text`;
            }
            if (e.type === 3 && e.data?.source === 2 && e.data?.type === 2) { // Mouse Up (Click)
                return `[${timeOffset}s] Click detected (x:${e.data.x}, y:${e.data.y})`;
            }
            if (e.type === 2) { // DOM Load
                return `[${timeOffset}s] Page DOM Loaded`;
            }
            return null;
        }).filter(Boolean).slice(0, 50); // Limit to first 50 major actions to save tokens

        // 4. Enhanced Prompt
        const prompt = `
            You are a Senior Product Analyst conducting a technical audit of a user session. 
            Analyze the provided metadata and event log to generate a structured report.

            **Session Data:**
            - Duration: ${durationSeconds.toFixed(1)}s
            - Total Events: ${allEvents.length}
            
            **Event Log Snippet:**
            ${activityLog.join('\n')}

            **Directives:**
            1. **Format:** Use strictly bullet points and Markdown headers.
            2. **Tone:** Clinical, objective, and professional. Avoid speculative words like "likely," "probably," or "seems."
            3. **Content:** Focus on observable actions and technical implications.

            **Required Output Format:**

            ### **Session Synopsis**
            * **Status:** [Active / Bounced / Completed]
            * **Engagement:** [High / Moderate / Low] based on event density (${allEvents.length} events in ${durationSeconds.toFixed(1)}s).

            ### **Behavioral Patterns**
            * [Bullet point describing specific action, e.g., "Initiated navigation to /pricing but aborted."]
            * [Bullet point describing interaction, e.g., "Rapid cursor movement detected without click interaction."]
            * [Bullet point describing outcome, e.g., "Session terminated on Homepage without conversion."]

            ### **UX Assessment**
            * **Intent:** [Classify as: Exploratory / Transactional / Accidental]
            * **Friction:** [Identify specific barriers or state "None observed"]
        `;

        // 5. Call Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const summary = result.response.text();

        // 6. Save and Redirect
        await supabase.from('sessions').update({ summary }).eq('id', sessionId);

        return NextResponse.redirect(new URL(`/dashboard/${sessionId}`, request.url));

    } catch (error) {
        console.error('Analysis Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}