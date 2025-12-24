import { useRef, useState, useEffect, useCallback } from 'react';
import VideoCard from '../components/VideoCard';
import { getPosts, uploadPost, type Post as Video } from '../services/posts.service';
import { useSSE } from '../hooks/useSSE';
import { useAuth } from '../context/AuthContext';
import { Upload, Plus, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import InfoModal from '../components/InfoModal';

export default function Villancicos() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [showRules, setShowRules] = useState(false);

    const fetchVideos = useCallback(async () => {
        try {
            const data = await getPosts('VILLANCICOS');
            setVideos(data);
        } catch (error) {
            console.error('Failed to load videos', error);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const index = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
        if (index !== activeIndex) setActiveIndex(index);
    };

    useSSE(`${import.meta.env.VITE_API_URL}/events`, (evt) => {
        if (evt?.type === 'ranking_update') {
            fetchVideos();
        }
    });

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 100 * 1024 * 1024) {
            return toast.error('El video debe pesar menos de 100MB');
        }

        setIsUploading(true);
        const toastId = toast.loading('Subiendo villancico...');

        try {
            await uploadPost(file, 'VILLANCICOS', 'VIDEO', 'Mi Villancico Navideño 🎄');
            toast.success('¡Villancico subido con éxito!', { id: toastId });
            fetchVideos();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al subir video';
            toast.error(message, { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] w-full bg-black relative">
            <div className="absolute top-4 left-4 z-50">
                <button
                    onClick={() => setShowRules(true)}
                    className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                    title="Reglas"
                >
                    <HelpCircle className="w-6 h-6" />
                </button>
            </div>

            {isAuthenticated && (
                <div className="absolute top-4 right-4 z-50">
                    <label className={`
                        flex items-center gap-2 bg-[#bf152d] text-white px-4 py-2 rounded-full font-bold shadow-lg cursor-pointer transform hover:scale-105 transition-all
                        ${isUploading ? 'opacity-50 pointer-events-none' : ''}
                    `}>
                        {isUploading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Plus className="w-5 h-5" />
                        )}
                        <span>Subir</span>
                        <input
                            type="file"
                            className="hidden"
                            accept="video/*"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />
                    </label>
                </div>
            )}

            <InfoModal
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Reglas: Villancicos"
            >
                <div className="space-y-4 text-slate-600 dark:text-slate-300">
                    <p>¡Demuestra tu espíritu navideño cantando!</p>
                    <ul className="space-y-3">
                        <li className="flex gap-2">
                            <span className="text-[#bf152d] font-bold">•</span>
                            <span>Sube un video corto cantando tu villancico favorito.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-[#bf152d] font-bold">•</span>
                            <span>Puede ser solo, en grupo o con tu mascota.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-[#bf152d] font-bold">•</span>
                            <span>Se valorará la creatividad y la energía festiva.</span>
                        </li>
                    </ul>
                </div>
            </InfoModal>

            <div
                ref={containerRef}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                onScroll={handleScroll}
            >
                {videos.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white space-y-4">
                        <Upload className="w-16 h-16 text-slate-600" />
                        <h2 className="text-xl font-bold">No hay villancicos aún</h2>
                        <p className="text-slate-400">¡Sé el primero en subir uno!</p>
                    </div>
                ) : (
                    videos.map((video, idx) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            isActive={idx === activeIndex}
                            onUpdate={fetchVideos}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
