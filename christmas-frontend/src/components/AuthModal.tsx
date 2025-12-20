import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { X, User, Lock } from 'lucide-react';

interface Props {
    onClose: () => void;
}

export default function AuthModal({ onClose }: Props) {
    const { login, register } = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');
        if (!username || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        setLoading(true);
        try {
            if (mode === 'login') {
                await login(username, password);
            } else {
                await register(username, password);
            }
            onClose();
        } catch (e: any) {
            setError(e.response?.data?.message || 'Error de autenticación');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-zinc-800 p-8">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {mode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
                    </h2>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm">
                        {mode === 'login' ? 'Ingresa tus credenciales para continuar.' : 'Únete a la celebración navideña.'}
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="group">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">Usuario</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-zinc-600" />
                            <input
                                className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 focus:border-[#bf152d] dark:focus:border-[#ff4d6d] rounded-xl pl-12 pr-4 py-3 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-slate-900 dark:text-white"
                                placeholder="usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-zinc-600" />
                            <input
                                type="password"
                                className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-800 focus:border-[#bf152d] dark:focus:border-[#ff4d6d] rounded-xl pl-12 pr-4 py-3 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600 text-slate-900 dark:text-white"
                                placeholder="••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 text-[#bf152d] dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/20 text-center animate-in fade-in">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full btn-primary py-3.5 mt-8 text-base shadow-lg shadow-red-500/20 dark:shadow-red-900/20"
                >
                    {loading ? 'Procesando...' : (mode === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
                </button>

                <div className="text-center mt-6">
                    <button
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                        className="text-slate-500 dark:text-zinc-500 hover:text-[#bf152d] dark:hover:text-[#ff4d6d] text-sm font-medium transition-colors"
                    >
                        {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
