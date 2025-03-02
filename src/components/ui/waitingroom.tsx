import { useState, useEffect } from "react";
import { Button } from "./button";
import { ChevronLeft } from "lucide-react";

interface WaitingRoomProps {
    onComplete: () => void;
    onBack: () => void; // Add the back handler
}
const TrivailWaitingRoom: React.FC<WaitingRoomProps> = ({
    onComplete,
    onBack,
}) => {
    const [players, setPlayers] = useState<string[]>([]);
    const gamePin = "123456"; // Replace with dynamic PIN if needed

    // Simulate players joining
    useEffect(() => {
        const fakeNames = ["Alice", "Bob", "Charlie", "David", "Eve"];
        let index = 0;

        const interval = setInterval(() => {
            if (index < fakeNames.length) {
                setPlayers((prev) => [...prev, fakeNames[index]]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center ">
            <Button
                className="absolute top-4 left-4"
                onClick={onBack}
                size="icon"
            >
                <ChevronLeft />
            </Button>
            <h1 className="text-4xl font-bold">Game PIN: {gamePin}</h1>
            <p className="text-lg mt-2">Join at trivail.blahblah</p>

            <div className=" text-white w-full mt-2">
                {/* <h2 className="text-2xl font-semibold mb-3">Players Joined</h2> */}
                <div className="grid grid-cols-2 gap-2">
                    {players.map((player, index) => (
                        <div
                            key={index}
                            className="p-2 rounded-md text-center text-blue-500 animate-pulse text-lg font-bold"
                        >
                            {player}
                        </div>
                    ))}
                </div>
            </div>

            <Button
                className="mt-6 w-full"
                disabled={players.length < 2}
                onClick={onComplete}
            >
                Start Game
            </Button>
        </div>
    );
};
export { TrivailWaitingRoom };
