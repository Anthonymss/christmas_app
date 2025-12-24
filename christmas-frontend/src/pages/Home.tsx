import { Link } from 'react-router-dom';
import { Palette, Gift, Trophy, Disc, ArrowRight, Music } from 'lucide-react';
import clsx from 'clsx';

import Countdown from '../components/Countdown';

export default function Home() {
    const features = [
        {
            title: "Concurso",
            desc: "Arte navideño",
            path: "/concurso",
            icon: Palette,
            color: "text-[#c6416a]"
        },
        {
            title: "Fea Navidad",
            desc: "Dibujos mal hechos",
            path: "/navidad-fea",
            icon: Gift,
            color: "text-[#bf152d]"
        },
        {
            title: "Villancicos",
            desc: "Canta y gana",
            path: "/villancicos",
            icon: Music,
            color: "text-emerald-500"
        },
        {
            title: "Ranking",
            desc: "Tabla de líderes",
            path: "/ranking",
            icon: Trophy,
            color: "text-yellow-400"
        },
        {
            title: "Ruleta",
            desc: "Prueba tu suerte",
            path: "/ruleta",
            icon: Disc,
            color: "text-purple-400"
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12 py-8 animate-fade-in">
            <div className="text-center space-y-6 max-w-3xl px-4">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 text-[#bf152d] dark:text-[#ff4d6d] text-sm font-bold tracking-wider mb-4 border border-rose-100 dark:border-rose-900/30 shadow-sm animate-breathe hover:animate-wiggle cursor-default">
                    ✨ EDICIÓN 2025
                </div>

                <div className="dark:brightness-110">
                    <Countdown />
                </div>

                <h1 className="text-5xl md:text-7xl font-friendly text-[#1e1219] dark:text-white tracking-tight leading-none drop-shadow-sm">
                    Nuestra <span className="text-[#bf152d] dark:text-[#ff4d6d] inline-block hover:scale-105 transition-transform duration-300">Navidad</span>
                </h1>
                <p className="text-lg md:text-xl text-[#41495b] dark:text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                    Celebra, comparte y gana en nuestra fiesta digital.
                    <span className="block mt-2 font-medium text-[#c6416a] dark:text-[#ff8fa3]">¡Elige una categoría y participa!</span>
                </p>

                <div className="flex justify-center gap-4 pt-6">
                    <Link to="/concurso" className="btn-primary flex items-center gap-2 text-lg px-8 py-3 shadow-red-200 dark:shadow-red-900/20 group">
                        Participar Ahora
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/ranking" className="btn-secondary flex items-center gap-2 text-lg px-8 py-3 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                        Ver Ranking
                    </Link>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl px-4">
                {features.map((feature, index) => (
                    <Link
                        key={feature.path}
                        to={feature.path}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className="animate-pop-in group flex flex-col items-center p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/5 dark:hover:shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(20%-20px)] min-w-[200px]"
                    >
                        <feature.icon className={clsx("w-12 h-12 mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6", feature.color, "dark:brightness-125")} />
                        <h3 className="text-xl font-bold text-[#1e1219] dark:text-white mb-2">{feature.title}</h3>
                        <p className="text-sm text-[#41495b] dark:text-slate-400 text-center font-medium opacity-80">{feature.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
