export default function TriviaLeaderboard() {
    const players = [
        { rank: 1, name: "Alice", correctAnswers: 15, medal: "🥇" },
        { rank: 2, name: "Bob", correctAnswers: 12, medal: "🥈" },
        { rank: 3, name: "Charlie", correctAnswers: 10, medal: "🥉" },
        { rank: 4, name: "David", correctAnswers: 8, medal: "" },
    ];

    return (
        <div className="flex flex-col items-center justify-center mb-4">
            <h1 className="text-4xl font-bold  mb-6">🏆 Leaderboard 🏆</h1>

            <div className="w-full max-w-md bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg border-2 border-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-white text-lg">
                            <th className="p-2">Rank</th>
                            <th className="p-2">Player</th>
                            <th className="p-2 text-right">Correct Answers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => (
                            <tr
                                key={player.rank}
                                className="border-b border-neon-blue hover:bg-gray-800 transition"
                            >
                                <td className="p-2 text-neon-yellow font-bold">
                                    {player.medal} {player.rank}
                                </td>
                                <td className="p-2 ">{player.name}</td>
                                <td className="p-2 text-right text-neon-green">
                                    {player.correctAnswers}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
