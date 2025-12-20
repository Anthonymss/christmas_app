import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Props {
    reacters: string[];
    onClose: () => void;
}

export default function ReactionsListModal({ reacters, onClose }: Props) {
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800">
                    <h3 className="font-bold text-slate-800 dark:text-zinc-100">Reacciones</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {reacters.map((name, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 flex items-center justify-center text-red-500 font-bold text-sm">
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-700 dark:text-zinc-200">{name}</span>
                        </div>
                    ))}

                    {reacters.length === 0 && (
                        <div className="p-8 text-center text-slate-400">
                            No hay reacciones todavía
                        </div>
                    )}
                </div>
            </div>

            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>,
        document.body
    );
}
