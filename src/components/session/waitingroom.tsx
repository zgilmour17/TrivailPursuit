import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface WaitingRoomProps {
    onComplete: () => void;
    onBack: () => void; // Add the back handler
    host: boolean;
    players: string[];
    gameId: string;
}

const getRandomColor = () => {
    const randomHex = () => Math.floor(Math.random() * 256);
    return `rgb(${randomHex()}, ${randomHex()}, ${randomHex()})`;
};
const TrivailWaitingRoom: React.FC<WaitingRoomProps> = ({
    onComplete,
    onBack,
    players,
    host,
    gameId,
}) => {
    const handleStart = async () => {
        onComplete();
    };
    // const [gameId, setgameId] = useState<string>("");
    const [styles, setStyles] = useState<
        Record<string, { rotation: number; color: string }>
    >({});

    useEffect(() => {
        setStyles((prevStyles) => {
            const newStyles = { ...prevStyles };
            players.forEach((player) => {
                console.log(player);
                if (!(player in newStyles)) {
                    newStyles[player] = {
                        rotation: Math.random() * 20 - 10,
                        color: getRandomColor(),
                    };
                }
            });

            return newStyles;
        });
    }, [players]);

    return (
        <div className="flex flex-col items-center justify-center ">
            <Button
                className="absolute top-4 left-4"
                onClick={onBack}
                size="icon"
                variant="secondary"
            >
                <ChevronLeft />
            </Button>
            <h1 className="text-4xl font-bold">Game PIN: {gameId}</h1>
            {/* <p className="text-lg mt-2">Join at trivail.blahblah</p> */}

            <div className=" text-white w-full mt-2">
                {/* <h2 className="text-2xl font-semibold mb-3">Players Joined</h2> */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {players.map((player, index) => (
                        <div
                            key={index}
                            className="name animate-fadein"
                            style={{
                                transform: `rotate(${styles[player]?.rotation}deg)`,
                                textShadow: `0 0 0.05em #fff, 0 0 0.2em ${styles[player]?.color}, 0 0 0.3em ${styles[player]?.color}`,
                            }}
                        >
                            {player}
                        </div>
                    ))}
                </div>
            </div>

            {host && (
                <Button
                    className="mt-6 w-full"
                    onClick={handleStart}
                    variant="secondary"
                >
                    Start Game
                </Button>
            )}
            {!host && <p className="mt-8">Waiting for host to start game...</p>}
        </div>
    );
};
export { TrivailWaitingRoom };
