import { useRef, useState } from "react";
import backgroundImage from "src/lib/test3.jpg";

import "./App.css";
import Home from "./app/home/home";

import { Spinner } from "./components/loading/spinner";
import RuleSelection from "./components/rules/rule-selection";
import { SessionChoice } from "./components/session/session-choice";
import { SessionHostForm } from "./components/session/session-host";
import { SessionJoinForm } from "./components/session/session-join";
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

	const handleFormComplete = (answers: any) => {
		setFormAnswers(answers);
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
							onComplete={handleFormComplete}
							onBack={handleBack}
						/>
					)}

					{step === "form" && sessionType === "join" && (
						<SessionJoinForm
							onComplete={handleFormComplete}
							onBack={handleBack}
						/>
					)}

					{step === "waiting" && (
						<TrivailWaitingRoom
							onBack={handleBack}
							onComplete={handleWaitingRoomComplete}
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
