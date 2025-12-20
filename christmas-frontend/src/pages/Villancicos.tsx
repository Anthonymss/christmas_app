import { useRef, useState, useEffect, useCallback } from 'react';
import VideoCard from '../components/VideoCard';
import { getPosts, uploadPost, type Post as Video } from '../services/posts.service';
import { useSSE } from '../hooks/useSSE';
import { useAuth } from '../context/AuthContext';
import { Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Villancicos() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useAuth();
    const [isUploading, setIsUploading] = useState(false);

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

    // Handle Scroll for snapping
    const handleScroll = () => {
        if (!containerRef.current) return;
        const index = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
        if (index !== activeIndex) setActiveIndex(index);
    };

    useSSE(`${import.meta.env.VITE_API_URL}/events`, (evt) => {
        if (evt?.type === 'ranking_update') {
            fetchVideos(); // Refresh feed
        }
    });

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            return toast.error('El video debe pesar menos de 50MB');
        }

        setIsUploading(true);
        const toastId = toast.loading('Subiendo villancico...');

        try {
            await uploadPost(file, 'VILLANCICOS', 'VIDEO', 'Mi Villancico Navideño 🎄');
            toast.success('¡Villancico subido con éxito!', { id: toastId });
            // SSE will trigger refresh
        } catch (error) {
            toast.error('Error al subir video', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] w-full bg-black relative">
            {/* Upload Button */}
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

            {/* Video Feed */}
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
