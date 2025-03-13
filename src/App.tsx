import { useRef, useState } from "react";
import backgroundImage from "src/lib/test3.jpg";

import "./App.css";

import Home from "./app/home/home";
import { GenerateGame } from "./components/loading/generate-game";
import { SessionChoice } from "./components/session/session-choice";
import { SessionHostForm } from "./components/session/session-host";
import { SessionJoinForm } from "./components/session/session-join";
import { TrivailWaitingRoom } from "./components/session/waitingroom";

function App() {
    const [step, setStep] = useState<
        | "choice"
        | "form"
        | "waiting"
        | "home"
        | "ruleSelection"
        | "GenerateGame"
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
    const [host, setHost] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const hasRun = useRef(false); // Declare outside useEffect

    const handleWebSocketConnect = (initialMessage: string) => {
        if (hasRun.current) return; // Prevent running again in strict mode
        hasRun.current = true; // Mark effect as executed

        console.log("yo triggered!!XD");
        const WEBSOCKET_URL = "ws://localhost:4000";
        const socket = new WebSocket(WEBSOCKET_URL);

        socket.onopen = () => {
            console.log("WebSocket connected");
            setWs(socket);

            console.log("send", initialMessage);
            socket.send(initialMessage);
        };

        socket.onmessage = (event) => {
            setMessage(event.data);
            const data = JSON.parse(event.data);

            console.log("Received:", data);
            if (data.type === "playerJoined") {
                setPlayers((prev) => [...prev, data.player.name]);
                console.log(players);
            }
            if (data.type === "startGame") {
                setStep("home");
            }
            if (data.type === "gameCreated") {
                setPlayers((prev) => [...prev, data.hostName]);
                console.log(players);
            }
        };
    };
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
        setHost(true);
        const message = JSON.stringify({
            type: "host",
            name: answers.givenName,
        });
        if (ws) {
            ws.send(message);
        } else {
            console.log("new", message);
            handleWebSocketConnect(message);
        }

        setStep("waiting"); // Transition to waiting room after form completion
    };

    const handleFormCompletePlayer = (answers: any) => {
        setFormAnswers(answers);
        setHost(false);
        const message = JSON.stringify({
            type: "join",
            name: answers.givenName, // TODO: replace with player name
        });
        if (ws) {
            ws.send(message);
        } else {
            handleWebSocketConnect(message);
        }

        setStep("waiting"); // Transition to waiting room after form completion
    };

    const handleSessionTypeSelect = (type: "host" | "join") => {
        setSessionType(type);
        setStep("form");
    };

    const handleWaitingRoomComplete = async () => {
        setStep("GenerateGame");
        try {
            // // Generate trivia questions
            // const res = await generateSessionQuestions(
            //     ["league of legends", "soccer", "cs2"],
            //     15
            // );
            // const rulesres = await generateRules(20);
            // //! Send trivia questions to save to jsonfile in backend
            // await fetch("http://localhost:4000/write-trivia-questions", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({ questions: res }),
            // });

            // //! Send rules to save to jsonfile in backend
            // await fetch("http://localhost:4000/write-rules", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({ rules: rulesres }),
            // });

            // console.log(
            //     "Trivia questions written to lib/trivia_questions.json"
            // );
            if (ws) {
                console.log("Starting game");
                ws.send(
                    JSON.stringify({
                        type: "startGame",
                    })
                );
            }
            setStep("home");
        } catch (err) {
            console.error("Error generating or writing trivia questions:", err);
        }
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
                            host={host}
                            onBack={handleBack}
                            onComplete={handleWaitingRoomComplete}
                            players={players}
                        />
                    )}
                    {step === "home" && (
                        <>
                            <Home
                                host={host}
                                answers={formAnswers}
                                onBack={handleBack}
                                ws={ws}
                                message={message}
                            />
                        </>
                    )}
                    {/* {step === "ruleSelection" && (
                        <RuleSelection
                            onComplete={handleRuleSelection}
                        ></RuleSelection>
                    )} */}
                    {step === "GenerateGame" && <GenerateGame></GenerateGame>}

                    {/* //? waiting for rule component
					//  <WaitingForAction></WaitingForAction> 
					//? leaderboard component
					//  <TriviaLeaderboard></TriviaLeaderboard>*/}
                </div>
            </div>
        </div>
    );
}

export default App;
