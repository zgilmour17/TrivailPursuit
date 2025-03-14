import { useRef } from "react";

interface SipListProps {
    losers: string[];
}

export default function SipList({ losers }: SipListProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

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
                className="absolute right-1/2 top-1/2 animate-exitRight  z-40"
                autoPlay
                muted
                playsInline
                ref={videoRef}
                src="/beeranimation.mp4"
            />
            <div className="w-full animate-fadeinslow text-center ">
                {/* Title (fade-in animation) */}
                <h1 className="text-4xl font-bold w-full flex justify-center items-center mb-4">
                    <div className="mr-1 scale-x-[-1]">🍺</div> Sip List
                    <div className="ml-1">🍺</div>
                </h1>
                <div className="w-full max-w-lg bg-gray-900 bg-opacity-90 p-6 rounded-lg shadow-2xl border-4 border-neon-red relative mb-4">
                    <ul className="text-center space-y-3 grid grid-cols">
                        {losers.length > 0 ? (
                            losers.map((player, index) => (
                                <li
                                    key={index}
                                    className="text-2xl font-bold text-neon-pink animate-pulse"
                                >
                                    ❌ {player}
                                </li>
                            ))
                        ) : (
                            <li className="text-xl font-semibold text-neon-green">
                                No one got it wrong! 🎉
                            </li>
                        )}
                    </ul>
                </div>
                <p className="text-lg text-neon-yellow mb-6 italic">
                    These players got the last round wrong... Sip! 🍺
                </p>
            </div>
        </div>
    );
}
