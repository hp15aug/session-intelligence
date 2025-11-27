'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { record } from 'rrweb';
import { v4 as uuidv4 } from 'uuid';

const FLUSH_INTERVAL = 5000; // 5 seconds

export default function SessionRecorder() {
    const pathname = usePathname();
    const eventsBuffer = useRef<any[]>([]);
    const sessionId = useRef<string>('');
    const chunkIndex = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Don't record on dashboard pages
        if (pathname.startsWith('/dashboard')) {
            return;
        }

        // Initialize session ID
        if (!sessionId.current) {
            sessionId.current = uuidv4();
        }

        // Start recording
        const stopRecording = record({
            emit(event) {
                eventsBuffer.current.push(event);
            },
        });

        // Flush function
        const flushEvents = async () => {
            if (eventsBuffer.current.length === 0) return;

            const eventsToSend = [...eventsBuffer.current];
            eventsBuffer.current = []; // Clear buffer immediately
            const currentChunkIndex = chunkIndex.current;
            chunkIndex.current += 1;

            try {
                await fetch('/api/session/record', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sessionId: sessionId.current,
                        events: eventsToSend,
                        chunkIndex: currentChunkIndex,
                        metadata: {
                            url: window.location.href,
                            userAgent: navigator.userAgent,
                            windowWidth: window.innerWidth,
                            windowHeight: window.innerHeight,
                        },
                    }),
                });
            } catch (error) {
                console.error('Failed to flush events', error);
                // Optionally put events back in buffer? For now, we risk losing them to avoid complexity.
            }
        };

        // Set up interval
        timerRef.current = setInterval(flushEvents, FLUSH_INTERVAL);

        // Handle unload
        const handleUnload = () => {
            flushEvents();
        };
        window.addEventListener('beforeunload', handleUnload);

        return () => {
            // Cleanup
            if (stopRecording) stopRecording();
            if (timerRef.current) clearInterval(timerRef.current);
            window.removeEventListener('beforeunload', handleUnload);
            flushEvents(); // Final flush
        };
    }, []);

    return null; // Renderless component
}
