'use client';

import { useEffect, useRef } from 'react';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

interface SessionPlayerProps {
    events: any[];
}

export default function SessionPlayer({ events }: SessionPlayerProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // We need to wait for the wrapper to have a width
        if (wrapperRef.current && playerContainerRef.current && events.length > 1) {

            // Clean up previous instance
            playerContainerRef.current.innerHTML = '';

            const width = wrapperRef.current.clientWidth;
            // Calculate a 16:9 height, or you can read it from the first event's meta if available
            const height = (width * 9) / 16;

            try {
                new rrwebPlayer({
                    target: playerContainerRef.current,
                    props: {
                        events,
                        width: width,
                        height: height,
                        autoPlay: true,
                        showController: true,
                    },
                });
            } catch (e) {
                console.error("Error initializing player:", e);
            }
        }
    }, [events]);

    if (!events || events.length < 2) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-400">
                Not enough data to replay.
            </div>
        );
    }

    return (
        <div ref={wrapperRef} className="w-full">
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-900">
                <div ref={playerContainerRef} />
            </div>
        </div>
    );
}