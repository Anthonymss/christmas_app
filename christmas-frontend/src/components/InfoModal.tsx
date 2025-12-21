import { createPortal } from 'react-dom';
import { X, Info } from 'lucide-react';

interface Props {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function InfoModal({ title, isOpen, onClose, children }: Props) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-zinc-800">
                <div className="h-2 bg-gradient-to-r from-[#bf152d] via-[#c6416a] to-[#bf152d]" />

                <div className="p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <Info className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {title}
                        </h2>
                    </div>

                    <div className="space-y-4 text-slate-600 dark:text-zinc-400 leading-relaxed">
                        {children}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-8 py-3 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold rounded-2xl transition-all"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
