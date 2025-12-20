import { useState } from 'react';
import { Heart, User, Maximize2 } from 'lucide-react';
import type { Drawing } from '../types/drawing';
import { voteDrawing } from '../services/votes.service';
import { toast } from 'sonner';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import ImageModal from './ImageModal';
import { LoveIcon, LaughIcon, WowIcon, ChristmasIcon } from './ReactionIcons';
import ReactionsListModal from './ReactionsListModal';

interface Props {
    drawing: Drawing;
    onVoted: () => void;
}

const REACTION_TYPES = [
    { id: 'HEART', icon: LoveIcon, label: 'Me encanta' },
    { id: 'LAUGH', icon: LaughIcon, label: 'Me divierte' },
    { id: 'WOW', icon: WowIcon, label: '¡Wow!' },
    { id: 'CHRISTMAS', icon: ChristmasIcon, label: '¡Navidad!' },
];

export default function DrawingCard({ drawing, onVoted }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [showReactionsModal, setShowReactionsModal] = useState(false);
    const [isHoveringReactions, setIsHoveringReactions] = useState(false);

    const { isAuthenticated } = useAuth();

    const handleVote = async (type: string = 'HEART') => {
        if (!isAuthenticated) {
            toast.error('Inicia sesión para reaccionar');
            return;
        }

        try {
            await voteDrawing(drawing.id, type);
            onVoted();
            setIsHoveringReactions(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al reaccionar');
        }
    };

    const topReactions = REACTION_TYPES.filter(r => drawing.reactionsStats?.[r.id]).slice(0, 3);

    return (
        <>
            <div className="group relative break-inside-avoid mb-6">
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 transition-all duration-300 hover:shadow-xl">

                    <div
                        className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-zinc-800 relative cursor-pointer group/image"
                        onClick={() => setShowModal(true)}
                    >
                        <img
                            src={drawing.imageUrl}
                            alt="Dibujo"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover/image:opacity-100">
                            <Maximize2 className="text-white w-8 h-8 drop-shadow-md transform scale-90 group-hover/image:scale-100 transition-transform" />
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex flex-col gap-3">

                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200 truncate">{drawing.userName}</span>
                            </div>

                            <div className="flex items-center justify-between h-8 relative">
                                <div
                                    className="flex items-center gap-1.5 cursor-pointer group/summary"
                                    onClick={() => drawing.votesCount > 0 && setShowReactionsModal(true)}
                                >
                                    {drawing.votesCount > 0 && (
                                        <>
                                            <div className="flex -space-x-1 items-center">
                                                {topReactions.map((reaction) => (
                                                    <div key={reaction.id} className="w-5 h-5 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center p-[1px] shadow-sm z-10 first:z-30 second:z-20">
                                                        <reaction.icon className="w-full h-full" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-[13px] text-slate-500 dark:text-zinc-400 group-hover/summary:underline leading-tight">
                                                {drawing.votesCount}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div
                                    className="relative flex items-center"
                                    onMouseEnter={() => setIsHoveringReactions(true)}
                                    onMouseLeave={() => setIsHoveringReactions(false)}
                                >
                                    <div
                                        className={clsx(
                                            "absolute bottom-full right-0 h-4 w-full bg-transparent z-10",
                                            isHoveringReactions ? "block" : "hidden"
                                        )}
                                        style={{ marginBottom: "-16px" }}
                                    />

                                    <div
                                        className={clsx(
                                            "absolute bottom-full right-0 mb-3 bg-white dark:bg-zinc-800 rounded-full shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-1.5 flex items-center gap-2 transition-all duration-300 origin-bottom-right z-30",
                                            isHoveringReactions ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-75 translate-y-4 invisible"
                                        )}
                                    >
                                        {REACTION_TYPES.map((r) => (
                                            <button
                                                key={r.id}
                                                onClick={() => handleVote(r.id)}
                                                className="relative group/icon transition-transform hover:scale-125 duration-200 cursor-pointer p-0 bg-transparent border-0"
                                                title={r.label}
                                            >
                                                <r.icon className="w-9 h-9 filter drop-shadow-sm" />
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                    {r.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleVote('HEART')}
                                        className={clsx(
                                            "flex items-center gap-1.5 px-2 py-1.5 rounded-full transition-all duration-300 active:scale-95",
                                            drawing.votesCount > 0
                                                ? "text-red-500 bg-red-50 dark:bg-red-900/10"
                                                : "text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                                        )}
                                    >
                                        <Heart className={clsx("w-6 h-6", drawing.votesCount > 0 && "fill-current")} />
                                    </button>
                                </div>
                            </div>

                            {drawing.reacters && drawing.reacters.length > 0 && (
                                <div
                                    className="text-xs text-slate-500 dark:text-zinc-500 truncate mt-1 cursor-pointer hover:underline"
                                    onClick={() => setShowReactionsModal(true)}
                                >
                                    Reaccionado por: {drawing.reacters.slice(0, 2).join(', ')}
                                    {drawing.reacters.length > 2 && ` y ${drawing.reacters.length - 2} más`}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {showModal && <ImageModal imageUrl={drawing.imageUrl} onClose={() => setShowModal(false)} />}

            {showReactionsModal && (
                <ReactionsListModal
                    reacters={drawing.reacters || []}
                    onClose={() => setShowReactionsModal(false)}
                />
            )}
        </>
    );
}
