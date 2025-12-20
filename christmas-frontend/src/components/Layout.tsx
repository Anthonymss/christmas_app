import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

import { Toaster } from 'sonner';
import SnowEffect from './SnowEffect';

export default function Layout({ children }: LayoutProps) {
    return (

        <div className="min-h-screen bg-white dark:bg-[#09090b] transition-colors duration-300 relative">
            <SnowEffect />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {children}
            </main>

            <footer className="w-full text-center py-6 text-slate-400 text-sm relative z-10">
                <p>© 2025 Christmas App. Hecho con 🎄 y ❤️</p>
            </footer>

            <Toaster position="top-center" richColors />
        </div>
    );
}
