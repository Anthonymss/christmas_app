import { useState } from 'react';
import { Heart, User, Maximize2 } from 'lucide-react';
import type { Drawing } from '../types/drawing';
import { voteDrawing } from '../services/votes.service';
import { toast } from 'sonner';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import ImageModal from './ImageModal';

interface Props {
    drawing: Drawing;
    onVoted: () => void;
}

export default function DrawingCard({ drawing, onVoted }: Props) {
    const [voting, setVoting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { isAuthenticated } = useAuth();

    const handleVote = async () => {
        if (!isAuthenticated) {
            toast.error('Inicia sesión para votar');
            return;
        }

        try {
            setVoting(true);
            await voteDrawing(drawing.id);
            toast.success('¡Voto registrado!');
            onVoted();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al votar');
        } finally {
            setVoting(false);
        }
    };

    return (
        <>
            <div className="group relative break-inside-avoid mb-6">
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 transition-all duration-300 hover:border-red-200 dark:hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-500/10">
                    <div
                        className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-zinc-800 relative cursor-pointer"
                        onClick={() => setShowModal(true)}
                    >
                        <img
                            src={drawing.imageUrl}
                            alt="Dibujo"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Maximize2 className="text-white w-8 h-8 drop-shadow-lg transform scale-75 group-hover:scale-100 transition-transform" />
                        </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-zinc-900 start-content">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#41495b] dark:text-zinc-300">
                                <div className="p-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 text-[#bf152d] dark:text-[#ff4d6d]">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold truncate max-w-[100px]">{drawing.userName}</span>
                            </div>

                            <button
                                onClick={handleVote}
                                disabled={voting}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm",
                                    "bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 hover:border-[#bf152d] dark:hover:border-[#ff4d6d] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-[#bf152d] dark:hover:text-[#ff4d6d] text-[#41495b] dark:text-zinc-400",
                                    voting && "opacity-50 cursor-not-allowed",
                                    drawing.votesCount > 0 && "text-[#bf152d] dark:text-[#ff4d6d]"
                                )}
                            >
                                <Heart className={clsx("w-4 h-4 transition-transform group-hover:scale-110", drawing.votesCount > 0 && "fill-current")} />
                                <span className="font-bold">{drawing.votesCount}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && <ImageModal imageUrl={drawing.imageUrl} onClose={() => setShowModal(false)} />}
        </>
    );
}
