import { useRef, useState, useEffect } from 'react';
import { Heart, MessageCircle, Music, Play, Lock, X } from 'lucide-react';
import ReactionsListModal from './ReactionsListModal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { votePost, commentPost, type Post as Video } from '../services/posts.service';
import clsx from 'clsx';

interface Props {
    video: Video;
    isActive: boolean;
    onUpdate: () => void;
}

export default function VideoCard({ video, isActive, onUpdate }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showReactionsModal, setShowReactionsModal] = useState(false);
    const [comment, setComment] = useState('');
    const { user, isAuthenticated } = useAuth();

    const votingDateStr = import.meta.env.VITE_VOTING_OPEN_DATE || '2025-12-24T20:00:00-05:00';
    const isVotingEnabled = new Date() >= new Date(votingDateStr);

    useEffect(() => {
        if (isActive) {
            videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            videoRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else {
            videoRef.current?.pause();
            setIsPlaying(false);
        }
    }, [isActive]);

    const togglePlay = () => {
        if (videoRef.current?.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current?.pause();
            setIsPlaying(false);
        }
    };

    const handleVote = async (type: string = 'HEART') => {
        if (!isVotingEnabled) {
            const dateObj = new Date(votingDateStr);
            const msg = dateObj.toLocaleString('es-PE', { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric', hour12: true });
            toast.error(`Las votaciones se abren el ${msg}`);
            return;
        }
        if (!isAuthenticated) return toast.error('Inicia sesión para votar');

        try {
            await votePost(video.id, type);
            onUpdate();
        } catch (error) {
            toast.error('Error al votar');
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        if (!isAuthenticated) return toast.error('Inicia sesión para comentar');

        try {
            await commentPost(video.id, comment);
            setComment('');
            onUpdate();
        } catch (error) {
            toast.error('Error al comentar');
        }
    };

    const userVote = video.reacters?.includes(user?.username || '');

    return (
        <div className="relative h-screen w-full bg-black flex items-center justify-center snap-start video-card-container">
            <div className="relative h-full w-full max-w-md mx-auto bg-black" onClick={togglePlay}>
                <video
                    ref={videoRef}
                    src={video.url}
                    className="h-full w-full object-cover"
                    loop
                    playsInline
                    muted={isMuted}
                />

                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                        <Play className="w-16 h-16 text-white/80 fill-white" />
                    </div>
                )}

                <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20">
                    <div className="flex flex-col items-center gap-1">
                        <button
                            className="bg-black/40 p-3 rounded-full relative group transition-all"
                            onClick={(e) => { e.stopPropagation(); handleVote(); }}
                        >
                            {!isVotingEnabled ? (
                                <Lock className="w-8 h-8 text-slate-400" />
                            ) : (
                                <Heart
                                    className={clsx(
                                        "w-8 h-8 transition-colors",
                                        userVote ? "fill-red-500 text-red-500" : "text-white"
                                    )}
                                />
                            )}
                        </button>
                        <span
                            className="text-white text-sm font-bold shadow-black drop-shadow-md cursor-pointer hover:underline"
                            onClick={(e) => { e.stopPropagation(); setShowReactionsModal(true); }}
                        >
                            {video.votesCount}
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <button
                            className="bg-black/40 p-3 rounded-full"
                            onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
                        >
                            <MessageCircle className="w-8 h-8 text-white fill-white/10" />
                        </button>
                        <span className="text-white text-sm font-bold shadow-black drop-shadow-md">
                            {video.comments.length}
                        </span>
                    </div>

                    <button className="bg-black/40 p-3 rounded-full animate-spin-slow">
                        <Music className="w-6 h-6 text-white" />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-10">
                    <div className="max-w-[80%]">
                        @{video.username}
                        <p className="text-white/90 text-sm mt-1 line-clamp-2">
                            {video.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-white/80 text-xs">
                            <Music className="w-3 h-3" />
                            <span className="animate-marquee whitespace-nowrap overflow-hidden">
                                Villancico Navideño Original • Sonido Original
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {showComments && (
                <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-white dark:bg-slate-900 rounded-t-3xl z-30 flex flex-col animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-between p-4 border-b dark:border-slate-800">
                        <h3 className="font-bold text-center flex-1 text-slate-900 dark:text-white">Comentarios ({video.comments.length})</h3>
                        <button
                            onClick={() => setShowComments(false)}
                            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {video.comments.map(c => (
                            <div key={c.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs uppercase">
                                    {c.user.username[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                        {c.user.username}
                                        <span className="text-xs font-normal text-slate-400 ml-2">
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </span>
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                        {c.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isAuthenticated ? (
                        <form onSubmit={handleComment} className="p-4 border-t dark:border-slate-800 flex gap-2">
                            <input
                                type="text"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                placeholder="Añadir comentario..."
                                className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#bf152d]"
                            />
                            <button
                                type="submit"
                                disabled={!comment.trim()}
                                className="text-[#bf152d] font-bold text-sm disabled:opacity-50"
                            >
                                Publicar
                            </button>
                        </form>
                    ) : (
                        <div className="p-4 text-center text-sm text-slate-500 border-t dark:border-slate-800">
                            Inicia sesión para comentar
                        </div>
                    )}
                </div>
            )}
            {showReactionsModal && (
                <ReactionsListModal
                    reacters={video.reacters || []}
                    onClose={() => setShowReactionsModal(false)}
                />
            )}
        </div>
    );
}
