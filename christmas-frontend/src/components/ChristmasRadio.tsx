import { useState, useRef, useEffect } from 'react';
import { Music, Volume2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function ChristmasRadio() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const location = useLocation();

    const MUSIC_URL = "/music/navidad.mp3";

    useEffect(() => {
        const audio = new Audio(MUSIC_URL);
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;

        const handleError = (e: Event) => {
            console.error("Audio Error:", (e.target as HTMLAudioElement).error);
        };
        const handleSuccess = () => console.log("Audio loaded successfully");

        audio.addEventListener('error', handleError);
        audio.addEventListener('canplaythrough', handleSuccess);

        return () => {
            audio.pause();
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('canplaythrough', handleSuccess);
            audioRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (location.pathname === '/villancicos' && isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [location.pathname]);

    const togglePlay = async () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            try {
                if (audioRef.current.error || audioRef.current.networkState === 3) {
                    audioRef.current.load();
                }
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (e) {
                console.error("Playback failed:", e);
                alert("No se pudo reproducir. Intenta recargar la página.");
                setIsPlaying(false);
            }
        }
    };

    return (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
            <button
                onClick={togglePlay}
                className={`flex items-center gap-3 pr-4 pl-3 py-3 rounded-full shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-md group ${isPlaying
                    ? 'bg-[#165B33] text-white w-48'
                    : 'bg-white/90 dark:bg-zinc-800/90 text-[#C41E3A] hover:scale-105 w-12'
                    } overflow-hidden whitespace-nowrap`}
                title="Radio Polo Norte"
            >
                <div className={`relative flex-shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                    {isPlaying ? <Music className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    {isPlaying && <span className="absolute -top-1 -right-1 text-xs">🎵</span>}
                </div>

                <div className={`flex flex-col items-start transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 w-0'}`}>
                    <span className="text-xs font-bold text-green-100 uppercase tracking-wider">Radio Polo Norte</span>
                    <span className="text-sm font-medium truncate w-24">En Vivo 🔴</span>
                </div>

                {isPlaying && (
                    <div className="flex gap-1 items-end h-4 ml-auto">
                        <div className="w-1 bg-green-200 animate-pulse h-2" style={{ animationDelay: '0s' }} />
                        <div className="w-1 bg-green-200 animate-pulse h-4" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1 bg-green-200 animate-pulse h-3" style={{ animationDelay: '0.4s' }} />
                    </div>
                )}
            </button>
        </div>
    );
}
