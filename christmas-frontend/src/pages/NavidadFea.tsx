import { useEffect, useState, useMemo } from 'react';
import type { Drawing } from '../types/drawing';
import { getDrawings } from '../services/drawings.service';
import DrawingCard from '../components/DrawingCard';
import UploadDrawing from '../components/UploadDrawing';
import { useAuth } from '../context/AuthContext';
import { useSSE } from '../hooks/useSSE';
import { Plus, Loader2 } from 'lucide-react';
import debounce from 'lodash.debounce';

export default function NavidadFea() {
    const [drawings, setDrawings] = useState<Drawing[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const { isAuthenticated } = useAuth();

    const fetchDrawings = async () => {
        const data = await getDrawings('NAVIDAD_FEA');
        setDrawings(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    const debouncedRefresh = useMemo(
        () => debounce(() => {
            fetchDrawings();
        }, 2000),
        []
    );

    useEffect(() => {
        fetchDrawings();
        return () => debouncedRefresh.cancel();
    }, [debouncedRefresh]);

    useSSE(`${import.meta.env.VITE_API_URL}/events`, (evt) => {
        if (evt?.type === 'ranking_update') debouncedRefresh();
    });

    return (
        <div className="space-y-12">
            <header className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-rose-100 dark:border-rose-900/30">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl font-friendly text-[#1e1219] dark:text-white tracking-tight">
                        Navidad <span className="text-[#bf152d] dark:text-[#ff4d6d]">Fea</span>
                    </h1>
                    <p className="text-[#41495b] dark:text-slate-400 max-w-lg font-light text-lg">
                        La belleza es subjetiva... ¡el espíritu navideño no! <br />
                        <span className="text-[#c6416a] dark:text-[#ff8fa3] font-medium">Vota por el outfit más original.</span>
                    </p>
                </div>

                {isAuthenticated && !showUpload && (
                    <button
                        onClick={() => setShowUpload(true)}
                        className="btn-primary flex items-center gap-2 self-start shadow-xl shadow-red-200 dark:shadow-red-900/20"
                    >
                        <Plus className="w-5 h-5" />
                        Subir Foto
                    </button>
                )}
            </header>

            {showUpload && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl shadow-red-100 dark:shadow-red-900/10 border border-rose-100 dark:border-slate-700">
                    <button
                        onClick={() => setShowUpload(false)}
                        className="absolute top-6 right-6 text-slate-400 hover:text-[#bf152d] transition-colors rounded-full p-2 hover:bg-red-50 dark:hover:bg-slate-700"
                    >
                        ✕
                    </button>
                    <UploadDrawing category="NAVIDAD_FEA" onUploadSuccess={() => { fetchDrawings(); setShowUpload(false); }} />
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-[#bf152d] animate-spin" />
                </div>
            ) : drawings.length === 0 ? (
                <div className="text-center py-32 border-2 border-dashed border-rose-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/50">
                    <p className="text-[#41495b] dark:text-slate-400 font-light text-xl">Aún no hay fotos.</p>
                    <p className="text-[#c6416a] dark:text-[#ff8fa3] mt-2">¿Te atreves a ser el primero?</p>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-8">
                    {drawings.map((d) => (
                        <div key={d.id} className="w-full max-w-sm">
                            <DrawingCard drawing={d} onVoted={debouncedRefresh} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
