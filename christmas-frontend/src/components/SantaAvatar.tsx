import { ReactNode } from 'react';

interface SantaAvatarProps {
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function SantaAvatar({ children, size = 'md', className = '' }: SantaAvatarProps) {
    const hatStyles = {
        sm: 'w-4 h-4 -top-1.5 -right-1',
        md: 'w-6 h-6 -top-2 -right-1.5',
        lg: 'w-10 h-10 -top-3 -right-2',
        xl: 'w-16 h-16 -top-5 -right-3',
    };

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
