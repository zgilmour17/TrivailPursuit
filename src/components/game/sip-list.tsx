import { useRef } from "react";

interface SipListProps {
    losers: { name: string; recentScore: number }[];
}

export default function SipList({ losers }: SipListProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const neonColors = [
        "text-neon-blue",
        "text-neon-pink",
        "text-neon-yellow",
        "text-neon-red",
    ];

    return (
        <div className="flex flex-col items-center relative overflow-hidden">
            {/* Left Video (Starting from the center) */}
            <video
                className="scale-x-[-1] absolute left-1/2 top-1/2 animate-exitLeft z-40"
                autoPlay
                muted
                playsInline
                ref={videoRef}
                src="/beeranimation.mp4"
            />

            {/* Right Video (Starting from the center) */}
            <video
                className="absolute right-1/2 top-1/2 animate-exitRight z-40"
                autoPlay
                muted
                playsInline
                ref={videoRef}
                src="/beeranimation.mp4"
            />
            <div className="w-full animate-fadeinslow text-center">
                {/* Title (fade-in animation) */}
                <h1 className="text-4xl font-bold w-full flex justify-center items-center mb-4 ">
                    <div className="mr-1 scale-x-[-1]">🍺</div>
                    <span className="neon-glow">Sip List</span>
                    <div className="ml-1">🍺</div>
                </h1>
                <div className="w-full max-w-lg bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-2xl border-4 border-neon-red relative mb-4">
                    {losers.map((x) => x.recentScore).includes(0) && (
                        <p className="text-lg text-neon-yellow mb-6 italic ">
                            Some idiots got the last round wrong... Sip! 🍺
                        </p>
                    )}
                    {!losers.map((x) => x.recentScore).includes(0) && (
                        <p className="text-lg text-neon-yellow mb-6 italic ">
                            You're all geniuses enjoy the round off...
                        </p>
                    )}
                    <ul className="text-center grid grid-cols-1">
                        {losers.length > 0 ? (
                            losers.map((player, index) => (
                                <li key={index}>
                                    <span
                                        className={`text-2xl  ${
                                            neonColors[
                                                index % neonColors.length
                                            ]
                                        } neon-glow `}
                                    >
                                        {index + 1}. {player.name}
                                    </span>{" "}
                                    {player.recentScore === 0 && (
                                        <span className=""> ❌ </span>
                                    )}
                                    {player.recentScore !== 0 && (
                                        <span className=""> ✅ </span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="text-xl font-semibold text-neon-green neon-glow">
                                No one got it wrong! 🎉
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
