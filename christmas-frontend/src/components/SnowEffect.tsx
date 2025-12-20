import { useEffect, useState } from 'react';

export default function SnowEffect() {
    const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: string; animationDuration: string; delay: string; opacity: number; size: number }>>([]);

    useEffect(() => {
        const flakes = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 10}s`,
            delay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.5 + 0.3,
            size: Math.random() * 10 + 5
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden" aria-hidden="true">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute top-[-20px] bg-white rounded-full opacity-80 animate-fall"
                    style={{
                        left: flake.left,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        animationDuration: flake.animationDuration,
                        animationDelay: flake.delay,
                        opacity: flake.opacity
                    }}
                ></div>
            ))}
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-20px) translateX(0px) rotate(0deg); }
                    100% { transform: translateY(100vh) translateX(20px) rotate(360deg); }
                }
                .animate-fall {
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
            `}</style>
        </div>
    );
}
