import { useEffect, useState, useRef, CSSProperties } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    rotation: number;
    velocity: { x: number; y: number };
    life: number;
    decay: number;
}

export default function CursorEffects() {
    const [particles, setParticles] = useState<Particle[]>([]);
    const requestRef = useRef<number>();

    const colors = ['#C41E3A', '#D4AF37', '#165B33', '#ffffff', '#FFD700', '#ff4d6d'];

    const explode = (x: number, y: number) => {
        const particleCount = 15;
        const newParticles: Particle[] = [];
        const now = Date.now();

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = 2 + Math.random() * 3;
            newParticles.push({
                id: now + i + Math.random(),
                x,
                y,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 4 + Math.random() * 4,
                rotation: Math.random() * 360,
                velocity: {
                    x: Math.cos(angle) * speed + (Math.random() - 0.5),
                    y: Math.sin(angle) * speed + (Math.random() - 0.5)
                },
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02
            });
        }

        setParticles(prev => [...prev, ...newParticles]);
    };

    const addTrail = (x: number, y: number) => {
        if (Math.random() > 0.3) return;

        const newParticle: Particle = {
            id: Date.now() + Math.random(),
            x: x + (Math.random() - 0.5) * 5,
            y: y + (Math.random() - 0.5) * 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 2 + Math.random() * 3,
            rotation: 0,
            velocity: { x: (Math.random() - 0.5), y: 1 + Math.random() },
            life: 1.0,
            decay: 0.05
        };

        setParticles(prev => [...prev, newParticle]);
    };

    const animate = (time: number) => {
        setParticles(prevParticles => {
            if (prevParticles.length === 0) return prevParticles;

            return prevParticles
                .map(p => ({
                    ...p,
                    x: p.x + p.velocity.x,
                    y: p.y + p.velocity.y,
                    life: p.life - p.decay,
                    rotation: p.rotation + 2
                }))
                .filter(p => p.life > 0);
        });

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => explode(e.clientX, e.clientY);
        const handleMove = (e: MouseEvent) => addTrail(e.clientX, e.clientY);

        window.addEventListener('click', handleClick);
        window.addEventListener('mousemove', handleMove);

        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('mousemove', handleMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden" aria-hidden="true">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: 0,
                        top: 0,
                        transform: `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg) scale(${p.life})`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        opacity: p.life,
                        boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                    }}
                />
            ))}
        </div>
    );
}
