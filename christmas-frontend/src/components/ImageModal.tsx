import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface Props {
    imageUrl: string;
    onClose: () => void;
}

export default function ImageModal({ imageUrl, onClose }: Props) {
    if (!imageUrl) return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            >
                <X className="w-8 h-8" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center" onClick={onClose}>
                <img
                    src={imageUrl}
                    alt="Full size"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm font-medium">
                Click fuera para cerrar
            </div>
        </div>,
        document.body
    );
}
