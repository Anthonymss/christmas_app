export default function ChristmasSpinner({ className = "w-8 h-8", color = "text-[#bf152d]" }: { className?: string, color?: string }) {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`animate-spin-slow ${color} w-full h-full`}
                style={{ animationDuration: '3s' }}
            >
                <path d="M2.05 2.05h2l2 7 2-7h2" stroke="none" />
                <path d="M12 2v20" />
                <path d="M2 12h20" />
                <path d="m4.93 4.93 14.14 14.14" />
                <path d="m19.07 4.93-14.14 14.14" />
                <path d="M12 2 10 4" /><path d="M12 2 14 4" />
                <path d="M12 22 10 20" /><path d="M12 22 14 20" />
                <path d="M2 12 4 10" /><path d="M2 12 4 14" />
                <path d="M22 12 20 10" /><path d="M22 12 20 14" />
            </svg>
            <div className="absolute w-[20%] h-[20%] bg-amber-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
        </div>
    );
}
