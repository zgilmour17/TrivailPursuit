import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface WaitingRoomProps {
	onComplete: () => void;
	onBack: () => void; // Add the back handler
	players: string[];
}

const getRandomColor = () => {
	const randomHex = () => Math.floor(Math.random() * 256);
	return `rgb(${randomHex()}, ${randomHex()}, ${randomHex()})`;
};
const TrivailWaitingRoom: React.FC<WaitingRoomProps> = ({
	onComplete,
	onBack,
	players,
}) => {
	const handleStart = async () => {
		onComplete();
	};
	const gamePin = "123456"; // Replace with dynamic PIN if needed
	const [styles, setStyles] = useState<
		Record<string, { rotation: number; color: string }>
	>({});

	useEffect(() => {
		console.log("PLAYER ADDED!!!");
		console.log(players);
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
	// TODO: remove
	// Simulate players joining
	// useEffect(() => {
	// 	const fakeNames = ["Alice", "Bob", "Charlie", "David", "Eve"];
	// 	let index = 0;

	// 	const interval = setInterval(() => {
	// 		if (index < fakeNames.length) {
	// 			setPlayers((prev) => [...prev, fakeNames[index]]);
	// 			index++;
	// 		} else {
	// 			clearInterval(interval);
	// 		}
	// 	}, 1000);

	// 	return () => clearInterval(interval);
	// }, []);

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
			<h1 className="text-4xl font-bold">Game PIN: {gamePin}</h1>
			<p className="text-lg mt-2">Join at trivail.blahblah</p>

			<div className=" text-white w-full mt-2">
				{/* <h2 className="text-2xl font-semibold mb-3">Players Joined</h2> */}
				<div className="grid grid-cols-2 gap-2 mt-2">
					{players.map((player) => (
						<div
							key={player}
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

			<Button
				className="mt-6 w-full"
				disabled={players.length < 2}
				onClick={handleStart}
				variant="secondary"
			>
				Start Game
			</Button>
		</div>
	);
};
export { TrivailWaitingRoom };
