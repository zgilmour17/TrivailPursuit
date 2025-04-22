import { useRef, useState } from "react";
import backgroundImage from "src/lib/test3.jpg";

import "./App.css";

import { v4 as uuidv4 } from "uuid";
import Home from "./app/home/home";
import { Player } from "./app/types/player";
import { GenerateGame } from "./components/loading/generate-game";
import { SessionChoice } from "./components/session/session-choice";
import { SessionHostForm } from "./components/session/session-host";
import { SessionJoinForm } from "./components/session/session-join";
import { TrivailWaitingRoom } from "./components/session/waitingroom";
import {
    generateRules,
    generateSessionQuestions,
    writeRules,
    writeTriviaQuestions,
} from "./lib/api-service";

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
    const loadingAudioRef2 = useRef<HTMLAudioElement | null>(null); // For the loading music
    const loadingAudioRef3 = useRef<HTMLAudioElement | null>(null); // For the loading music

    // WebSocket
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [gameId, setgameId] = useState<string>("");
    const [players, setPlayers] = useState<string[]>([]);
    const [host, setHost] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [playerId, setplayerId] = useState<string>("");
    const [topics, setTopics] = useState<string[]>([""]);

    const hasRun = useRef(false); // Declare outside useEffect

    const handleWebSocketConnect = (initialMessage: string) => {
        if (hasRun.current) return; // Prevent running again in strict mode
        hasRun.current = true; // Mark effect as executed

        console.log("yo triggered!!XD");
        const WEBSOCKET_URL = "ws://trivailpursuit.fly.dev:4000";
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
                setPlayers(data.players.map((x: Player) => x.name));
                setTopics(data.topics);
                console.log(players);
            }
            if (data.type === "startGame") {
                setStep("home");
            }
            if (data.type === "gameCreated") {
                setPlayers((prev) => [...prev, data.hostName]);
                setTopics(data.topics);
                setgameId(data.gameId);
                console.log(players);
            }
            if (data.type === "gameOver") {
                setStep("choice");
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
        let id = uuidv4();
        setplayerId(id);
        const message = JSON.stringify({
            type: "host",
            name: answers.givenName,
            playerId: id,
            topic: answers.topic,
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
        let id = uuidv4();
        setplayerId(id);
        const message = JSON.stringify({
            type: "join",
            name: answers.givenName,
            gameId: answers.sessionName,
            playerId: id,
            topic: answers.topic,
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
        const audioRefs = [loadingAudioRef, loadingAudioRef2, loadingAudioRef3];

        try {
            // Generate trivia questions
            // Pick a random audio ref
            const randomIndex = Math.floor(Math.random() * audioRefs.length);
            const selectedAudio = audioRefs[randomIndex].current;

            if (selectedAudio) {
                console.log(`Playing audio: ${randomIndex + 1}`);
                await new Promise((resolve, reject) => {
                    selectedAudio.play().then(resolve).catch(reject);
                    selectedAudio.onended = resolve;
                });
            }

            console.log("generating with topics:", topics);
            const res = await generateSessionQuestions(topics, 15);
            const rulesres = await generateRules(20);
            //! Send trivia questions to save to jsonfile in backend
            const test = await writeTriviaQuestions(res);
            const test2 = await writeRules(rulesres);
            // await fetch(
            //     `${process.env.REACT_APP_APIURL}/write-trivia-questions`,
            //     {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify({ questions: res }),
            //     }
            // );

            // //! Send rules to save to jsonfile in backend
            // await fetch(`${process.env.REACT_APP_APIURL}/write-rules`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({ rules: rulesres }),
            // });

            console.log(
                "Trivia questions written to lib/trivia_questions.json"
            );
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

    return (
        <div
            className="bg-cover bg-center min-h-screen"
            style={{ backgroundImage: `url(${backgroundImage}` }}
        >
            <audio ref={loadingAudioRef} src="/audio/dontbea20.mp3" />
            <audio ref={loadingAudioRef2} src="/audio/loadingmusic.mp3" />
            <audio ref={loadingAudioRef3} src="/audio/triviamagnolia.mp3" />

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
                            gameId={gameId}
                            host={host}
                            onBack={handleBack}
                            onComplete={handleWaitingRoomComplete}
                            players={players}
                        />
                    )}
                    {step === "home" && (
                        <>
                            <Home
                                playerId={playerId}
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
