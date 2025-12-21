import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import * as roulette from '../services/roulette.service';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Disc, Gift, Snowflake } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import Countdown from '../components/Countdown';
import confetti from 'canvas-confetti';

const COLORS = [
    '#e63946',
    '#1d3557',
    '#457b9d',
    '#2a9d8f',
    '#e9c46a',
    '#f4a261',
];

export default function Ruleta() {
    const { isAuthenticated } = useAuth();
    const [state, setState] = useState<any>(null);
    const [prizes, setPrizes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const targetDate = new Date(import.meta.env.VITE_VOTING_OPEN_DATE || '2025-12-24T00:00:00');
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const checkDate = () => setIsLocked(new Date() < targetDate);
        checkDate();
        const timer = setInterval(checkDate, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const load = async () => {
        setLoading(true);
        try {
            const [meData, prizesData] = await Promise.all([
                roulette.me().catch(() => null),
                roulette.prizes().catch(() => [])
            ]);
            setState(meData);
            setPrizes(prizesData || []);
        } catch {
            setState(null);
            setPrizes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) load();
        else setLoading(false);
    }, [isAuthenticated]);

    const fireConfetti = () => {
        const duration = 5000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 100 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 80 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 } });
            if (Math.random() > 0.7) {
                confetti({ ...defaults, particleCount: 30, origin: { x: 0.5, y: 0.5 }, spread: 100, scalar: 1.2 });
            }
        }, 200);
    };

    const handleSpinClick = async () => {
        if (isLocked) {
            toast.error("¡Espera a Navidad! 🎄", { description: "La ruleta se abre el 24 de Diciembre." });
            return;
        }
        if (mustSpin) return;

        try {
            const data = await roulette.spin();
            const winningIndex = prizes.findIndex(p => p.name === data.result);
            const safeIndex = winningIndex === -1 ? 0 : winningIndex;

            setPrizeNumber(safeIndex);
            setMustSpin(true);

        } catch (e: any) {
            const msg = e?.response?.data?.message || 'No se puede girar';
            toast.error("Ups", { description: msg });
            setMustSpin(false);
        }
    };

    const handleSpinStop = () => {
        setMustSpin(false);
        fireConfetti();
        load();
        const wonPrize = prizes[prizeNumber];
        toast.success("¡FELICIDADES! 🎁", { description: `Ganaste: ${wonPrize?.name}` });
    };

    const wheelData = prizes.map((p, i) => ({
        option: p.name,
        style: { backgroundColor: COLORS[i % COLORS.length], textColor: 'white' }
    }));


    if (!isAuthenticated) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-full">
                <AlertCircle className="w-12 h-12 text-[#bf152d]" />
            </div>
            <h2 className="text-2xl font-friendly text-[#1e1219] dark:text-white">Inicia sesión para jugar</h2>
        </div>
    );

    if (loading && prizes.length === 0) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin text-[#bf152d]"><Disc size={40} /></div>
        </div>
    );

    if (!loading && prizes.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full grayscale opacity-50">
                <Gift className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400">¡Se acabaron los premios!</h2>
            <p className="text-slate-400">Todo ha sido canjeado. Gracias por participar.</p>
        </div>
    );

    const hasPlayed = state?.played || state?.result;
    const prizeWinner = state?.result;

    return (
        <div className="flex flex-col items-center py-10 relative overflow-hidden min-h-[80vh]">
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-10 left-10 text-red-500 animate-pulse"><Snowflake size={40} /></div>
                <div className="absolute bottom-20 right-20 text-green-500 animate-bounce" style={{ animationDuration: '3s' }}><Gift size={50} /></div>
            </div>

            <div className="z-10 text-center mb-6">
                <h1 className="text-5xl font-friendly text-[#1a1a1a] dark:text-white drop-shadow-sm flex items-center justify-center gap-3">
                    <span className="text-[#bf152d]">Ruleta</span> Navideña
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">¡Prueba tu suerte!</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto px-4">
                    {prizes.map((p, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-300">
                            {p.name}
                            <span className={clsx("ml-1 px-1.5 rounded-full text-[10px]", p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                                {p.stock}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {hasPlayed && !mustSpin ? (
                <div className="z-20 text-center animate-in zoom-in duration-500 mt-10 p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full mx-4">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white mb-6 shadow-lg animate-bounce">
                        <Gift size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">¡Resultado!</h2>
                    <p className="text-xl text-[#bf152d] font-bold mb-6">{prizeWinner}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Gracias por participar. ¡Feliz Navidad! 🎄
                    </p>
                </div>
            ) : (
                <div className="relative z-20 flex flex-col items-center">
                    <div className="scale-90 md:scale-100 transform transition-transform">
                        {wheelData.length > 0 && (
                            <Wheel
                                mustStartSpinning={mustSpin}
                                prizeNumber={prizeNumber}
                                data={wheelData}
                                onStopSpinning={handleSpinStop}

                                outerBorderColor="transparent"
                                outerBorderWidth={0}
                                innerBorderColor="#f1faee"
                                innerBorderWidth={0}
                                radiusLineColor="rgba(255,255,255,0.4)"
                                radiusLineWidth={1}
                                fontSize={15}
                                fontWeight={700}
                                textDistance={55}
                                backgroundColors={COLORS}
                                textColors={['#ffffff']}
                            />
                        )}
                    </div>
                    {!isLocked ? (
                        <button
                            onClick={handleSpinClick}
                            disabled={mustSpin}
                            className={clsx(
                                "mt-8 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-xl px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 relative z-30",
                                mustSpin && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {mustSpin ? 'Girando...' : '¡GIRAR AHORA!'}
                        </button>
                    ) : (
                        <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex items-center gap-4 animate-pulse">
                            <AlertCircle className="text-amber-500" />
                            <div>
                                <h3 className="font-bold text-amber-700 dark:text-amber-400 text-sm">Próximamente</h3>
                                <Countdown />
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="z-10 mt-6 text-xs text-slate-400 max-w-xs text-center">
                * Las imágenes son referenciales. Premios sujetos a stock.
            </div>
        </div>
    );
}
