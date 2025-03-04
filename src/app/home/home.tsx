import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import { Progress } from "../../components/ui/progress";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import { generateQuestion } from "src/lib/utils";

import { SessionFormAnswers } from "../../components/ui/session-join";
import { ChevronLeft } from "lucide-react";

interface HomeProps {
    answers: SessionFormAnswers;
    onBack: () => void; // Add the back handler
}
// Define the Home component
const Home: React.FC<HomeProps> = ({ answers, onBack }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null); // For the correct answer music
    const loadingAudioRef = useRef<HTMLAudioElement | null>(null); // For the loading music

    // State to hold the list of badges
    const [badges, setBadges] = useState<string[]>([]);

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
    const [progress, setProgress] = React.useState(13);

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
                        console.log(isAnswered, answerState);
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

    useEffect(() => {
        if (isAnswered) {
            resolveRound();
        }
    }, [isAnswered]);

    // Handle generating a trivia question
    const handleGenerateQuestion = async () => {
        //setRemark(null);
        setShowQuestion(true); // Show the trivia question
        setLoading(true); // Set loading to true to show spinner
        setBouncingAnswer(null);
        audioRef.current?.pause();
        loadingAudioRef.current?.play(); // Play loading music
        setIsAnswered(false); // Reset answer state

        try {
            // Pick a random question from the list
            const randomBadge =
                badges[Math.floor(Math.random() * badges.length)];
            const response = await generateQuestion(randomBadge);
            const jsonString = response.match(/{[\s\S]*}/);

            if (jsonString) {
                const randomQuestion = JSON.parse(jsonString[0]);
                // Set the selected question and its answers
                setTriviaQuestion(randomQuestion.question);
                setTriviaAnswers(randomQuestion.choices);
                setCorrectAnswer(randomQuestion.answer);
                setSelectedAnswer(null); // Reset selected answer
                setAnswerState(""); // Reset answer state
                startTimer();
            } else {
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

    // Handle answer selection
    const handleAnswerClick = (answer: string) => {
        console.log(answer);
        setSelectedAnswer(answer);
        console.log(isAnswered);
    };

    const resolveRound = () => {
        console.log(selectedAnswer);
        if (selectedAnswer === correctAnswer) {
            setBouncingAnswer(selectedAnswer); // Trigger bouncing for the correct answer
            //var remark = await generateRemark(false);
            // setRemark(remark); // Generate remark for correct answer
            setAnswerState("correct");
        } else if (selectedAnswer !== "") {
            setAnswerState("incorrect");
            // var remark = await generateRemark(true);
            // setRemark(remark); // Generate remark for correct answer
        } else {
            setAnswerState("incorrect");

            setSelectedAnswer("");
        }

        setIsAnswered(true); // Mark as answered};
    };
    useEffect(() => {
        if (answers.topic && !badges.includes(answers.topic)) {
            setBadges((prevBadges) => {
                if (!prevBadges.includes(answers.topic)) {
                    return [...prevBadges, answers.topic];
                }
                return prevBadges;
            });
        }
    }, [answerState]);

    return (
        <div>
            <Button
                className="absolute top-4 left-4"
                onClick={onBack}
                size="icon"
            >
                <ChevronLeft />
            </Button>

            {/* <SessionForm></SessionForm> */}
            <audio ref={loadingAudioRef} src="/audio/loadingmusic.mp3" />
            <audio ref={audioRef} src="/audio/aiAyHey.mp3" />
            <div className="">
                {/* Trivia question display */}
                {showQuestion && loading ? (
                    <div className="flex justify-center items-center h-[360px] mb-8">
                        <Spinner /> {/* Show the Spinner while loading */}
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

                <Button
                    onClick={handleGenerateQuestion}
                    className="w-full"
                    disabled={!isAnswered}
                >
                    Begin Round!
                </Button>
            </div>
        </div>
    );
};

export default Home;
