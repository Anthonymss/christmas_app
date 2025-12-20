import { useCallback, useEffect, useState, useMemo } from 'react';
import { getRanking, type RankingRow } from '../services/votes.service';
import type { DrawingCategory } from '../types/drawing';
import { useSSE } from '../hooks/useSSE';
import { Trophy, Medal, Crown, ZoomIn } from 'lucide-react';
import clsx from 'clsx';
import debounce from 'lodash.debounce';
import ImageModal from '../components/ImageModal';

export default function Ranking() {
    const [category, setCategory] = useState<DrawingCategory>('CONCURSO');
    const [rows, setRows] = useState<RankingRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const fetchRanking = useCallback(async () => {
        const data = await getRanking(category);
        setRows(data);
        setLoading(false);
    }, [category]);

    const debouncedRefresh = useMemo(
        () => debounce(() => {
            fetchRanking();
        }, 2000),
        [fetchRanking]
    );

    useEffect(() => {
        fetchRanking();
        return () => debouncedRefresh.cancel();
    }, [category, fetchRanking, debouncedRefresh]);

    useSSE(`${import.meta.env.VITE_API_URL}/events`, (evt) => {
        if (evt?.type === 'ranking_update' || evt?.type === 'vote') debouncedRefresh();
    });

    return (
        <div className="space-y-12">
            <header className="text-center space-y-8">
                <h1 className="text-5xl font-friendly text-[#1e1219] dark:text-white">Ranking Oficial</h1>

                <div className="inline-flex bg-white dark:bg-zinc-800 p-1.5 rounded-full border border-rose-100 dark:border-zinc-700 shadow-lg shadow-red-100 dark:shadow-black/20">
                    <button
                        onClick={() => setCategory('CONCURSO')}
                        className={clsx(
                            "px-8 py-3 rounded-full text-sm font-bold transition-all duration-300",
                            category === 'CONCURSO'
                                ? "bg-[#bf152d] text-white shadow-md"
                                : "text-zinc-600 dark:text-zinc-400 hover:text-[#bf152d] dark:hover:text-[#ff4d6d] hover:bg-red-50 dark:hover:bg-zinc-700"
                        )}
                    >
                        Concurso de Arte
                    </button>
                    <button
                        onClick={() => setCategory('NAVIDAD_FEA')}
                        className={clsx(
                            "px-8 py-3 rounded-full text-sm font-bold transition-all duration-300",
                            category === 'NAVIDAD_FEA'
                                ? "bg-[#c6416a] text-white shadow-md"
                                : "text-zinc-600 dark:text-zinc-400 hover:text-[#c6416a] dark:hover:text-[#ff8fa3] hover:bg-pink-50 dark:hover:bg-zinc-700"
                        )}
                    >
                        Navidad Fea
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="text-center py-20 animate-pulse text-[#c6416a] font-medium">
                    Calculando ganadores...
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    {rows.length > 0 && (
                        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-20 pt-32 px-4 relative z-10">
                            {rows[1] && (
                                <div className="order-2 md:order-1 flex-1 flex flex-col items-center">
                                    <div
                                        className="w-24 h-24 rounded-full border-4 border-[#cbd5e1] dark:border-zinc-600 overflow-hidden mb-4 shadow-xl transform hover:scale-105 transition-transform cursor-zoom-in relative group"
                                        onClick={() => setSelectedImage(rows[1].imageUrl)}
                                    >
                                        <img src={rows[1].imageUrl} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <ZoomIn className="text-white w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="h-32 w-full bg-white dark:bg-zinc-800 rounded-t-3xl border border-slate-200 dark:border-zinc-700 flex flex-col items-center justify-start pt-6 shadow-sm">
                                        <Medal className="w-8 h-8 text-slate-400 mb-2" />
                                        <span className="text-3xl font-bold text-slate-400">#2</span>
                                        <span className="text-sm text-[#41495b] dark:text-zinc-300 font-medium mt-1">{rows[1].votes} votos</span>
                                    </div>
                                </div>
                            )}

                            {rows[0] && (
                                <div className="order-1 md:order-2 flex-1 w-full flex flex-col items-center z-10 -mt-12">
                                    <div className="relative">
                                        <Crown className="w-14 h-14 text-[#bf152d] dark:text-[#ff4d6d] absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce drop-shadow-lg" />
                                        <div
                                            className="w-36 h-36 rounded-full border-4 border-[#bf152d] dark:border-[#ff4d6d] overflow-hidden mb-6 shadow-2xl shadow-red-200 dark:shadow-red-900/30 transform hover:scale-110 transition-transform duration-500 cursor-zoom-in relative group"
                                            onClick={() => setSelectedImage(rows[0].imageUrl)}
                                        >
                                            <img src={rows[0].imageUrl} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ZoomIn className="text-white w-8 h-8" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-52 w-full bg-gradient-to-b from-[#bf152d] to-[#a01226] dark:from-[#ff4d6d] dark:to-[#bf152d] rounded-t-3xl shadow-xl flex flex-col items-center justify-start pt-8 text-white relative overflow-hidden">
                                        <div className="absolute top-0 inset-x-0 h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                        <Trophy className="w-12 h-12 text-yellow-300 mb-2 drop-shadow-md" />
                                        <span className="text-5xl font-friendly font-bold">#1</span>
                                        <span className="text-lg font-bold text-red-100 mt-1">{rows[0].votes} votos</span>
                                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full mt-4 font-bold max-w-[80%] truncate">{rows[0].username}</span>
                                    </div>
                                </div>
                            )}

                            {rows[2] && (
                                <div className="order-3 flex-1 flex flex-col items-center">
                                    <div
                                        className="w-20 h-20 rounded-full border-4 border-amber-700 overflow-hidden mb-4 shadow-xl transform hover:scale-105 transition-transform cursor-zoom-in relative group"
                                        onClick={() => setSelectedImage(rows[2].imageUrl)}
                                    >
                                        <img src={rows[2].imageUrl} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <ZoomIn className="text-white w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="h-24 w-full bg-white dark:bg-zinc-800 rounded-t-3xl border border-slate-200 dark:border-zinc-700 flex flex-col items-center justify-start pt-5 shadow-sm">
                                        <Medal className="w-6 h-6 text-amber-700 mb-1" />
                                        <span className="text-2xl font-bold text-amber-700">#3</span>
                                        <span className="text-xs text-[#41495b] dark:text-zinc-300 font-medium mt-1">{rows[2].votes} votos</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-3 px-2">
                        {rows.slice(3).map((r, idx) => (
                            <div key={r.drawingId} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-500/30 shadow-sm hover:shadow-md transition-all">
                                <span className="font-friendly text-[#c6416a] dark:text-[#ff8fa3] font-bold w-12 text-center text-xl">#{idx + 4}</span>
                                <div
                                    className="w-12 h-12 rounded-lg object-cover border border-slate-100 dark:border-zinc-700 cursor-pointer overflow-hidden relative group"
                                    onClick={() => setSelectedImage(r.imageUrl)}
                                >
                                    <img src={r.imageUrl} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <ZoomIn className="text-white w-3 h-3" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[#1e1219] dark:text-white font-bold truncate">{r.username || 'Artista'}</div>
                                    <div className="text-xs text-[#41495b]/60 dark:text-zinc-500">ID: {r.drawingId}</div>
                                </div>
                                <div className="text-[#bf152d] dark:text-[#ff4d6d] font-bold bg-red-50 dark:bg-red-900/10 px-3 py-1 rounded-lg">
                                    {r.votes} pts
                                </div>
                            </div>
                        ))}
                    </div>

                    {rows.length === 0 && (
                        <div className="text-center text-[#41495b] dark:text-zinc-500 py-12 bg-white dark:bg-zinc-900 rounded-3xl border border-rose-50 dark:border-zinc-800">
                            Aún no hay votos registrados.
                        </div>
                    )}
                </div>
            )
            }

            {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
        </div >
    );
}

