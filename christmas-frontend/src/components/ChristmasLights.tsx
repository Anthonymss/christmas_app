export default function ChristmasLights() {
    return (
        <div className="fixed top-0 left-0 w-full h-8 z-50 pointer-events-none overflow-hidden" aria-hidden="true">
            <ul className="flex justify-between w-[120%] -ml-[10%] list-none m-0 p-0 pointer-events-none">
                {Array.from({ length: 40 }).map((_, i) => (
                    <li
                        key={i}
                        className="relative inline-block w-3 h-3 rounded-full mx-2 mt-[-5px] animate-twinkle bg-christmas-red even:bg-christmas-green odd:bg-christmas-gold child:w-full child:h-full child:rounded-full child:animate-glow"
                        style={{
                            animationDelay: `${Math.random() * 2}s`,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div
                            className="absolute top-0 left-0 w-full h-full rounded-full opacity-40 animate-pulse"
                            style={{ animationDuration: `${Math.random() * 1 + 1}s` }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
