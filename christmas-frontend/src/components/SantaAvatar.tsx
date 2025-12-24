import { ReactNode } from 'react';

interface SantaAvatarProps {
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function SantaAvatar({ children, size = 'md', className = '' }: SantaAvatarProps) {

    return (
        <div className={`relative inline-block ${className}`}>
            {children}
            <span className={`absolute z-20 pointer-events-none select-none transform -rotate-12 ${size === 'sm' ? '-top-3 -right-2 text-lg' :
                size === 'md' ? '-top-4 -right-2 text-2xl' :
                    size === 'lg' ? '-top-5 -right-3 text-4xl' : '-top-6 -right-4 text-5xl'
                }`}>
                🎅
            </span>
        </div>
    );
}
