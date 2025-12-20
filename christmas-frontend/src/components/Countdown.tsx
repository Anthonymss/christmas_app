import { useState, useEffect } from 'react';

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        const targetDate = new Date('2025-12-25T00:00:00');

        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();
            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return null;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!timeLeft) return null;

    return (
        <div className="flex justify-center gap-4 py-6 animate-in fade-in slide-in-from-top-4 duration-700">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center bg-white/50 backdrop-blur-sm border border-rose-100 rounded-xl p-3 min-w-[80px] shadow-sm">
                    <span className="text-3xl font-bold text-[#bf152d] font-friendly tabular-nums">
                        {String(value).padStart(2, '0')}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-[#41495b] font-medium border-t border-rose-200 mt-1 pt-1 w-full text-center">
                        {unit === 'days' ? 'Días' : unit === 'hours' ? 'Hrs' : unit === 'minutes' ? 'Min' : 'Seg'}
                    </span>
                </div>
            ))}
        </div>
    );
}
