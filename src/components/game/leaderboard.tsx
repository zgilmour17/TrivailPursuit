import { Player } from "@/app/types/player";
import { useRef } from "react";

interface TriviaLeaderboardProps {
    players: Player[];
}

export default function TriviaLeaderboard({ players }: TriviaLeaderboardProps) {
    // Sort players by score in descending order
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Assign medals to top 3
    const medals = ["🥇", "🥈", "🥉"];

    return (
        <div className="flex flex-col items-center justify-center mb-4 relative">
            <video
                className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]  z-40 animate-fadeoutslow opacity-0"
                autoPlay
                muted
                playsInline
                ref={videoRef}
                src="/trophy.mp4"
            />
            <div className="w-full max-w-md bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg border-2 border-white animate-fadeinslow">
                <h1 className="text-4xl font-bold mb-6">🏆 Leaderboard 🏆</h1>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-white text-lg">
                            <th className="p-2">Rank</th>
                            <th className="p-2">Player</th>
                            <th className="p-2 text-right">Correct Answers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.map((player, index) => (
                            <tr
                                key={player.id}
                                className="border-b border-neon-blue hover:bg-gray-800 transition"
                            >
                                <td className="p-2 text-neon-yellow font-bold">
                                    {medals[index] || ""} {index + 1}
                                </td>
                                <td className="p-2">{player.name}</td>
                                <td className="p-2 text-right text-neon-green">
                                    {player.score}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
