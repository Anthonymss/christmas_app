import { useEffect, useState } from 'react';
import * as roulette from '../services/roulette.service';
import { useAuth } from '../context/AuthContext';
import { Disc, Gift, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import Countdown from '../components/Countdown';

export default function Ruleta() {
    const { isAuthenticated } = useAuth();
    const [state, setState] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [spinning, setSpinning] = useState(false);

    const targetDate = new Date('2025-12-24T00:00:00');
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const checkDate = () => {
            setIsLocked(new Date() < targetDate);
        };
        checkDate();
        const timer = setInterval(checkDate, 1000);
        return () => clearInterval(timer);
    }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await roulette.me();
            setState(data);
        } catch {
            setState(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (isAuthenticated) load(); else setLoading(false); }, [isAuthenticated]);

    const doSpin = async () => {
        if (isLocked) {
            toast.error("¡Espera a Navidad! 🎄", { description: "La ruleta se abre el 24 de Diciembre." });
            return;
        }
        if (spinning) return;
        setSpinning(true);

        await new Promise(r => setTimeout(r, 2000));

        try {
            const data = await roulette.spin();
            setState(data);
            toast.success("¡Premio ganado! 🎁", { description: `Has ganado: ${data.prize}` });
        } catch (e: any) {
            const msg = e?.response?.data?.message || 'No se puede girar';
            toast.error("Ups, hubo un problema ❄️", { description: msg });
        } finally {
            setSpinning(false);
        }
    };

    if (!isAuthenticated) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-[#bf152d]" />
            <h2 className="text-2xl font-friendly text-[#1e1219] dark:text-white">Inicia sesión para jugar</h2>
            <p className="text-[#41495b] dark:text-slate-400">Debes estar registrado para girar nuestra ruleta navideña.</p>
        </div>
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf152d]"></div>
        </div>
    );

    const hasPlayed = state?.played;
    const prize = state?.prize;

    return (
        <div className="flex flex-col items-center space-y-10 py-10">
            <div className="text-center">
                <h1 className="text-5xl font-friendly text-[#1e1219] dark:text-white mb-4 flex items-center justify-center gap-3">
                    <Disc className={clsx("w-10 h-10 text-[#bf152d]", spinning && "animate-spin")} />
                    Ruleta del 24
                </h1>
                <p className="text-[#41495b] dark:text-slate-400 text-lg font-light">¡Prueba tu suerte y gana premios exclusivos!</p>
            </div>

            <div className="relative group">
                <div className={clsx(
                    "w-72 h-72 rounded-full border-[12px] flex items-center justify-center shadow-2xl transition-all duration-1000",
                    "bg-white dark:bg-slate-800",
                    spinning
                        ? "animate-spin border-t-[#bf152d] border-r-[#c6416a] border-b-[#ebebeb] border-l-[#41495b]"
                        : hasPlayed
                            ? "border-[#bf152d] shadow-[#bf152d]/20"
                            : "border-[#ebebeb] dark:border-slate-700 shadow-slate-200 dark:shadow-slate-900"
                )}>
                    {hasPlayed ? (
                        <Gift className="w-24 h-24 text-[#bf152d] animate-bounce" />
                    ) : (
                        <div className="text-7xl animate-pulse">🎁</div>
                    )}
                </div>

                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#bf152d] text-5xl font-bold z-10 filter drop-shadow-md">▼</div>
            </div>

            <div className="text-center min-h-[100px] w-full max-w-md mx-auto">
                {hasPlayed ? (
                    <div className="animate-in fade-in zoom-in duration-300 space-y-2">
                        <p className="text-xl text-[#41495b] dark:text-slate-300 font-medium">¡Ya has jugado!</p>
                        {prize && (
                            <div className="text-4xl font-friendly text-[#bf152d] drop-shadow-sm">
                                {prize}
                            </div>
                        )}
                        {!prize && (
                            <div className="text-xl text-[#41495b] dark:text-slate-400">
                                ¡Mucha suerte para la próxima! 🍀
                            </div>
                        )}
                    </div>
                ) : isLocked ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl p-6">
                            <h3 className="text-[#bf152d] font-bold mb-2">🎄 Disponible el 24 de Diciembre</h3>
                            <div className="scale-75 origin-top">
                                <Countdown />
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={doSpin}
                        disabled={spinning}
                        className={clsx(
                            "px-10 py-4 rounded-full text-xl font-bold transition-all transform shadow-xl border-b-4",
                            spinning
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed scale-95"
                                : "bg-[#bf152d] border-[#a01226] text-white hover:bg-[#c6416a] hover:border-[#bf152d] hover:-translate-y-1 active:translate-y-0 active:border-b-0"
                        )}
                    >
                        {spinning ? 'Girando...' : '¡GIRAR AHORA!'}
                    </button>
                )}
            </div>

            <div className="text-sm text-[#41495b]/60 dark:text-slate-500 max-w-sm text-center bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-rose-50 dark:border-slate-800 shadow-sm">
                * Solo un giro por usuario. Disponible el 24 de Diciembre.
            </div>
        </div>
    );
}
