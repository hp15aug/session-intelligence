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
    const stopRecordingRef = useRef<(() => void) | undefined | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Flush function
    const flushEvents = async () => {
        if (eventsBuffer.current.length === 0) return;

        const eventsToSend = [...eventsBuffer.current];
        eventsBuffer.current = []; // Clear buffer immediately
        const currentChunkIndex = chunkIndex.current;
        chunkIndex.current += 1;

        try {
            // If we don't have a session ID yet (shouldn't happen if recording started), don't send
            if (!sessionId.current) return;

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
        }
    };

    useEffect(() => {
        const isDashboard = pathname.startsWith('/dashboard');

        if (isDashboard) {
            // Stop recording if it's running
            if (stopRecordingRef.current) {
                stopRecordingRef.current();
                stopRecordingRef.current = null;
                flushEvents(); // Final flush

                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }

                sessionId.current = ''; // Reset session ID
            }
        } else {
            // Start recording if it's NOT running
            if (!stopRecordingRef.current) {
                sessionId.current = uuidv4();
                chunkIndex.current = 0;

                stopRecordingRef.current = record({
                    emit(event) {
                        eventsBuffer.current.push(event);
                    },
                });

                timerRef.current = setInterval(flushEvents, FLUSH_INTERVAL);
            }
        }
    }, [pathname]);

    // Cleanup on unmount
    useEffect(() => {
        const handleUnload = () => flushEvents();
        window.addEventListener('beforeunload', handleUnload);

        return () => {
            if (stopRecordingRef.current) stopRecordingRef.current();
            if (timerRef.current) clearInterval(timerRef.current);
            window.removeEventListener('beforeunload', handleUnload);
            flushEvents();
        };
    }, []);

    return null;
}
