import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { Gift, Menu, X, LogOut, Trophy, Disc, Image, Moon, Sun, Music } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const [openAuth, setOpenAuth] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark';

        if (isDark) {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setDarkMode(false);
        }
    }, []);

    const toggleTheme = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setDarkMode(true);
        }
    };

    const navLinks = [
        { name: 'Concurso', path: '/concurso', icon: Image },
        { name: 'Fea Navidad', path: '/navidad-fea', icon: Gift },
        { name: 'Villancicos', path: '/villancicos', icon: Music },
        { name: 'Ranking', path: '/ranking', icon: Trophy },
        { name: 'Ruleta', path: '/ruleta', icon: Disc },
    ];

    return (
        <nav className="border-b border-slate-100 dark:border-zinc-800 bg-white/80 dark:bg-black/60 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white group-hover:bg-[#bf152d] transition-colors">
                            <Gift className="w-5 h-5" />
                        </div>
                        <span className="font-sans text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                            Navidad<span className="text-slate-500 dark:text-slate-400">2025</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={clsx(
                                        "px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                                        isActive
                                            ? "text-[#bf152d] bg-rose-50 dark:bg-rose-900/10 dark:text-rose-400"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-400 hover:text-yellow-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
                                <Link
                                    to="/profile"
                                    className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#bf152d] dark:hover:text-[#bf152d] transition-colors"
                                >
                                    {user?.username || 'Mi Perfil'}
                                </Link>
                                <Link
                                    to="/profile"
                                    className="p-2 text-slate-400 hover:text-[#bf152d] transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/10"
                                    title="Mi Perfil"
                                >
                                    <div className="w-5 h-5 bg-[#bf152d] rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setOpenAuth(true)}
                                className="btn-primary text-sm px-5 py-2"
                            >
                                Ingresar
                            </button>
                        )}
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-400"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="p-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <link.icon className="w-5 h-5 text-slate-400" />
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                    >
                                        <div className="w-5 h-5 bg-[#bf152d] rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                            {user?.username[0].toUpperCase()}
                                        </div>
                                        Mi Perfil ({user?.username})
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setOpenAuth(true); setMobileMenuOpen(false); }}
                                    className="w-full btn-primary"
                                >
                                    Ingresar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {openAuth && <AuthModal onClose={() => setOpenAuth(false)} />}
        </nav>
    );
}
