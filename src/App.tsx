import { useEffect, useRef, useState } from "react";
import backgroundImage from "src/lib/test3.jpg";

import "./App.css";
import Home from "./app/home/home";

import { Spinner } from "./components/loading/spinner";
import RuleSelection from "./components/rules/rule-selection";
import { SessionChoice } from "./components/session/session-choice";
import { SessionHostForm } from "./components/session/session-host";
import {
	SessionFormAnswers,
	SessionJoinForm,
} from "./components/session/session-join";
import { TrivailWaitingRoom } from "./components/session/waitingroom";
import { generateSessionQuestions } from "./lib/api-service";

function App() {
	const [step, setStep] = useState<
		"choice" | "form" | "waiting" | "home" | "ruleSelection" | "spinner"
	>("choice");
	const [formAnswers, setFormAnswers] = useState<any>(null);
	const [sessionType, setSessionType] = useState<"host" | "join" | null>(
		null
	); // Track the session type (host or join)
	const loadingAudioRef = useRef<HTMLAudioElement | null>(null); // For the loading music
	// WebSocket
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [hostName, setHostName] = useState("");
	const [gameState, setGameState] = useState<any>(null);
	const [players, setPlayers] = useState<string[]>([]);

	useEffect(() => {
		const WEBSOCKET_URL = "ws://localhost:4000"; // Change this if your backend runs on a different port
		const socket = new WebSocket(WEBSOCKET_URL);

		socket.onopen = () => {
			console.log("WebSocket connected");
			setWs(socket);
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log("Received:", data);

			if (data.type === "playerJoined") {
				setGameState(data);
				setPlayers((prev) => [...prev, data.player.name]);
				console.log(players);
			}
		};
	}, []);

	// Define back handler function
	const handleBack = () => {
		if (step === "form") {
			setStep("choice");
			setSessionType(null); // Reset session type when going back to choice
		} else if (step === "waiting") {
			setStep("form");
		} else if (step === "home") {
			setStep("form");
		}
	};

	const handleFormCompleteHost = (answers: any) => {
		setFormAnswers(answers);
		if (ws) {
			console.log("Sending host message");
			ws.send(
				JSON.stringify({
					type: "host",
					name: answers.givenName, // TODO: replace with host name
				})
			);
		}
		setStep("waiting"); // Transition to waiting room after form completion
	};

	const handleFormCompletePlayer = (answers: any) => {
		setFormAnswers(answers);
		if (ws) {
			console.log("Sending player join message");
			ws.send(
				JSON.stringify({
					type: "join",
					name: answers.givenName, // TODO: replace with player name
				})
			);
		}
		setStep("waiting"); // Transition to waiting room after form completion
	};

	const handleSessionTypeSelect = (type: "host" | "join") => {
		setSessionType(type);
		setStep("form");
	};

	const handleWaitingRoomComplete = async () => {
		setStep("spinner");
		var res = await generateSessionQuestions(
			["league of legends", "soccer", "cs2"],
			15
		);

		console.log(res);
		setStep("home");
	};

	const handleRuleSelection = () => {
		setStep("home");
	};

	const handleRuleSelectionEvent = () => {
		setStep("ruleSelection");
	};
	return (
		<div
			className="bg-cover bg-center min-h-screen"
			style={{ backgroundImage: `url(${backgroundImage}` }}
		>
			<audio ref={loadingAudioRef} src="/audio/dontbea.mp3" />

			<div className="h-screen w-full flex items-center justify-center absolute z-[0]">
				<div className="mx-auto px-16 pb-8 bg-black my-auto flex justify-center text-white shadow-lg rounded-lg max-w-[50vw] max-md:max-w-[90%] flex-col relative card min-w-[25vw]">
					<img
						src="./title.png"
						alt="Title Image"
						className="w-[250px] fade-all-bottom mx-auto"
					/>

					{step === "choice" && (
						<SessionChoice
							onSelect={handleSessionTypeSelect} // Pass handler to handle session type selection
						/>
					)}

					{step === "form" && sessionType === "host" && (
						<SessionHostForm
							onComplete={handleFormCompleteHost}
							onBack={handleBack}
						/>
					)}

					{step === "form" && sessionType === "join" && (
						<SessionJoinForm
							onComplete={handleFormCompletePlayer}
							onBack={handleBack}
						/>
					)}

					{step === "waiting" && (
						<TrivailWaitingRoom
							onBack={handleBack}
							onComplete={handleWaitingRoomComplete}
							players={players}
						/>
					)}

					{step === "home" && (
						<Home
							answers={formAnswers}
							onBack={handleBack}
							onRuleSelection={handleRuleSelectionEvent}
						/>
					)}

					{step === "ruleSelection" && (
						<RuleSelection
							onComplete={handleRuleSelection}
						></RuleSelection>
					)}
					{step === "spinner" && <Spinner></Spinner>}
				</div>
			</div>
		</div>
	);
}

export default App;
