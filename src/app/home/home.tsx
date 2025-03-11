import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import "./home.css";

import { ChevronLeft } from "lucide-react";

import { SessionFormAnswers } from "@/components/session/session-join";
import WaitingForUser from "../../components/loading/waiting-for-action";
import RulesDrawer from "../../components/rules/rule-drawer";
interface HomeProps {
    answers: SessionFormAnswers;
    onBack: () => void; // Add the back handler
    host: boolean;
    ws: WebSocket | null;
    message: string;
}
// Define the Home component
const Home: React.FC<HomeProps> = ({ answers, onBack, host, ws, message }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null); // For the correct answer music
    const loadingAudioRef = useRef<HTMLAudioElement | null>(null); // For the loading music

    // State to hold the list of badges

    // State for the trivia question and its answers
    const [triviaQuestion, setTriviaQuestion] = useState<string | null>(null);
    const [triviaAnswers, setTriviaAnswers] = useState<string[]>([]);
    const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
    const [showQuestion, setShowQuestion] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [answerState, setAnswerState] = useState<string>("");
    const [bouncingAnswer, setBouncingAnswer] = useState<string | null>(null); // State to track the bouncing answer
    const [loading, setLoading] = useState<boolean>(false); // Loading state for the spinner
    const [isAnswered, setIsAnswered] = useState(true); // Track if an answer has been selected
    const [progress, setProgress] = useState(0);
    const [questionNumber, setQuestionNumber] = useState(0);

    const startTimer = () => {
        setProgress(100);
        const duration = 2000; // 15 seconds
        const interval = 100; // Update every 100ms
        const step = 100 / (duration / interval); // Calculate decrement step
        setTimeout(() => {
            const timer = setInterval(() => {
                setProgress((prev) => {
                    const nextProgress = Math.max(prev - step, 0);
                    if (nextProgress <= 0) {
                        setProgress(0);
                        console.log("isanswered:", isAnswered);
                        setIsAnswered((prevIsAnswered) => {
                            if (!prevIsAnswered) {
                                return true; // Update state correctly
                            }
                            return prevIsAnswered; // Keep existing state
                        });
                        clearInterval(timer);
                    }
                    return nextProgress;
                });
            }, interval);
            return () => clearInterval(timer);
        }, 1000);
    };

    const handleRoundEnd = useCallback(() => {
        setIsAnswered(true);

        if (selectedAnswer === correctAnswer) {
            setBouncingAnswer(selectedAnswer);
            setAnswerState("correct");
        } else {
            setAnswerState("incorrect");
        }

        resolveRound();
    }, [correctAnswer, selectedAnswer]);
    useEffect(() => {
        if (message) {
            const data = JSON.parse(message);
            if (data.type === "roundEnd") {
                setCorrectAnswer(data.answer);
                setLoading(false);
                handleRoundEnd();
            }
        }
    }, [message, handleRoundEnd]);
    // Handle generating a trivia question
    const handleGenerateQuestion = async () => {
        setShowQuestion(true); // Show the trivia question
        setLoading(true); // Set loading to true to show spinner
        setBouncingAnswer(null);
        // audioRef.current?.pause();
        //loadingAudioRef.current?.play(); // Play loading music
        setIsAnswered(false); // Reset answer state

        try {
            //TODO Pick random question from list
            const response = {
                question:
                    "Which company developed the popular game League of Legends?",
                choices: ["Riot Games", "Valve", "Blizzard", "Epic Games"],
                answer: "Riot Games",
            };

            if (response) {
                const randomQuestion = response;
                // Set the selected question and its answers
                setTriviaQuestion(randomQuestion.question);
                setTriviaAnswers(randomQuestion.choices);
                setQuestionNumber(questionNumber + 1);
                setCorrectAnswer(randomQuestion.answer);
                setSelectedAnswer(null); // Reset selected answer
                setAnswerState(""); // Reset answer state
                startTimer();
            } else {
                resolveRound();
                setProgress(0);
                setTriviaQuestion("Error loading question...");
                return;
            }
        } catch (error) {
            console.error("Error fetching the trivia questions:", error);
            setTriviaQuestion("Error loading question...");
            setTriviaAnswers(["Please try again later"]);
        } finally {
            setLoading(false); // Set loading to false once the question has been set
        }
    };

    // const onRuleSelection = () => {};
    // useEffect(() => {
    //     if (questionNumber > 0 && questionNumber % 3 === 0) {
    //         onRuleSelection();
    //     }
    // }, [questionNumber, onRuleSelection]);

    // Handle answer selection
    const handleAnswerClick = (answer: string) => {
        console.log(answer);
        setSelectedAnswer(answer);
        console.log(isAnswered);
    };

    const resolveRound = () => {
        console.log(selectedAnswer);
        ws?.send(
            JSON.stringify({
                type: "answer",
                answer: selectedAnswer,
            })
        );
        setLoading(true);
    };

    return (
        <div>
            <Button
                className="absolute top-4 left-4"
                onClick={onBack}
                size="icon"
                variant="secondary"
            >
                <ChevronLeft />
            </Button>

            {/* <SessionForm></SessionForm> */}
            <audio ref={loadingAudioRef} src="/audio/dontbea20.mp3" />
            <audio ref={audioRef} src="/audio/aiAyHey.mp3" />
            <div className="">
                {/* Trivia question display */}

                {loading ? (
                    <WaitingForUser></WaitingForUser>
                ) : !host && !triviaQuestion ? (
                    <div className="flex justify-center items-center mb-8">
                        Waiting for host to begin round...
                    </div>
                ) : (
                    triviaQuestion && (
                        <div className="mb-6">
                            <Progress value={progress} />

                            <span
                                className="type font-medium"
                                style={
                                    {
                                        "--n": triviaQuestion.length,
                                    } as React.CSSProperties
                                }
                            >
                                {triviaQuestion}
                            </span>
                            <div className="mt-4 grid grid-cols-2 gap-4 max-md:grid-cols-1">
                                {triviaAnswers.map((answer, index) => (
                                    <Button
                                        key={index}
                                        variant="secondary"
                                        onClick={() =>
                                            handleAnswerClick(answer)
                                        }
                                        className={`mb-2 w-full rounded-md text-white animate-fadein 
										${
                                            isAnswered
                                                ? answer === correctAnswer
                                                    ? "!bg-green-500"
                                                    : "!bg-red-500"
                                                : "bg-gray-800"
                                        } 
										${selectedAnswer === answer ? "border-2 border-white pointer-events-none" : ""} 
										${bouncingAnswer === answer ? "!animate-bounce" : ""} 
										${isAnswered ? "pointer-events-none" : ""}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="mr-2">
                                                {answer}
                                            </span>
                                            {isAnswered &&
                                                (answer === correctAnswer ? (
                                                    <span className="text-white">
                                                        &#10003;
                                                    </span> // ✅ Tick
                                                ) : answer ===
                                                  selectedAnswer ? (
                                                    <span className="text-white">
                                                        X
                                                    </span> // ❌ Cross
                                                ) : null)}
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )
                )}
                {host && (
                    <div>
                        <Button
                            onClick={handleGenerateQuestion}
                            className="w-full "
                            disabled={!isAnswered}
                            variant="secondary"
                        >
                            Begin Round!
                        </Button>
                    </div>
                )}

                <RulesDrawer></RulesDrawer>
            </div>
        </div>
    );
};

export default Home;
