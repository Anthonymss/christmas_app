import { useEffect, useState } from 'react';

export default function Snowfall() {
    const [snowflakes, setSnowflakes] = useState<Array<{
        id: number;
        left: string;
        animationDuration: string;
        animationDelay: string;
        opacity: number;
        size: number;
    }>>([]);

    useEffect(() => {
        const flakes = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 5 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.5 + 0.3,
            size: Math.random() * 4 + 2
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute top-0 bg-white rounded-full animate-snow opacity-80"
                    style={{
                        left: flake.left,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        opacity: flake.opacity,
                        animation: `snow ${flake.animationDuration} linear infinite`,
                        animationDelay: `-${flake.animationDelay}`,
                    }}
                />
            ))}
        </div>
    );
}
