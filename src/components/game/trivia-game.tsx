import { Question } from "@/app/types/question";
import { Rule } from "@/app/types/rule";
import React, { useEffect, useState } from "react";

import { Player } from "@/app/types/player";
import { toast } from "sonner";
import WaitingForUser from "../loading/waiting-for-action";
import RulesDrawer from "../rules/rule-drawer";
import RuleSelection from "../rules/rule-selection";
import { Button } from "../ui/button";
import CountdownOverlay from "./countdown";
import TriviaLeaderboard from "./leaderboard";
import SipList from "./sip-list";
import Timer from "./timer";
import TriviaOptions from "./trivia-options";
import TriviaQuestion from "./trivia-question";

interface TriviaGameProps {
    ws: WebSocket | null;
    message: string;
    host: boolean;
    playerId: string;
}

const TriviaGame: React.FC<TriviaGameProps> = ({
    ws,
    message,
    host,
    playerId,
}) => {
    const [question, setQuestion] = useState<Question | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [round, setRound] = useState(0);
    const [rules, setRules] = useState<Rule[]>([]);
    const [selectedRules, setSelectedRules] = useState<Rule[]>([]);
    const [ruleSelection, setRuleSelection] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false); // Toggle leaderboard
    const [leaderboard, setLeaderboard] = useState<Player[]>([]); // Leaderboard state
    const [losers, setLosers] = useState<
        { name: string; recentScore: number }[]
    >([]); // Track players who got the question wrong
    const [showLosers, setShowLosers] = useState<boolean>(false); // Track players who got the question wrong
    const [allowBegin, setAllowBegin] = useState<boolean>(true);
    const [showCountdown, setShowCountdown] = useState<boolean>(false);
    const [stopTimer, setStopTimer] = useState<boolean>(false);

    useEffect(() => {
        if (!message) return;

        console.log(message);
        const data = JSON.parse(message);

        // Common function to reset the game state
        const resetGameState = () => {
            setLosers([]);
            setShowLosers(false);
            setShowLeaderboard(false);
            setLoading(false);
            setStopTimer(false);
        };

        switch (data.type) {
            case "roundEnd":
                setCorrectAnswer(data.answer);
                setLoading(false);
                setLosers(data.idiots || []); // Store the losers when the round ends

                // Delay showing the SipList for 5 seconds

                setShowLosers(true);
                setAllowBegin(true);

                break;

            case "ruleSelection":
                resetGameState();
                if (data.player === playerId) {
                    setRuleSelection(true);
                    setRules(data.rules);
                } else {
                    setLoading(true);
                }
                break;

            case "startRound":
            case "ruleChosen":
                resetGameState();
                setAllowBegin(false);
                setShowCountdown(true);
                setQuestion({ question: data.question, choices: data.choices });
                setRuleSelection(false);

                if (data.type === "ruleChosen") {
                    setSelectedRules([...selectedRules, data.rule]);
                    toast(`${data.player} has added a new rule!`, {
                        icon: "🍻",
                        duration: 5000,
                        className: "neon-toast",
                        position: "top-center",
                    });
                }

                setIsAnswered(false);
                setSelectedAnswer(null);
                setRound(round + 1);
                break;

            case "leaderboard":
                resetGameState();
                setLeaderboard(data.players);
                setShowLeaderboard(true);
                break;

            case "gameOver":
                resetGameState();
                setLeaderboard(data.players);
                setShowLeaderboard(true);
                break;

            default:
                break;
        }
    }, [message]);

    const handleAnswerClick = (answer: string) => {
        if (isAnswered) return;

        setSelectedAnswer(answer);
        setStopTimer(true);
    };

    const startRound = () => {
        setLosers([]); // Store the losers when the round ends
        setShowLosers(false);
        setShowLeaderboard(false);
        setStopTimer(false);
        // setRound(0);
        ws?.send(JSON.stringify({ type: "startRound" }));
    };

    const timerExpire = (timeRemaining: number) => {
        console.log("time", timeRemaining);
        if (selectedAnswer == null) {
            setSelectedAnswer("");
        }
        setIsAnswered(true);
        ws?.send(
            JSON.stringify({
                type: "answer",
                answer: selectedAnswer,
                time: timeRemaining,
            })
        );
        setLoading(true);
    };

    const handleCountdownComplete = () => {
        console.log("Countdown finished!");
        setShowCountdown(false); // Hide overlay when countdown is done
    };

    return (
        <div>
            {showCountdown ? (
                <CountdownOverlay
                    onComplete={handleCountdownComplete}
                ></CountdownOverlay>
            ) : showLosers ? (
                <div>
                    <SipList losers={losers} />
                </div>
            ) : showLeaderboard ? (
                <TriviaLeaderboard players={leaderboard} />
            ) : ruleSelection ? (
                <RuleSelection
                    rules={rules}
                    selectedRules={selectedRules}
                    onComplete={(rule) =>
                        ws?.send(
                            JSON.stringify({
                                type: "ruleChosen",
                                rule: rule,
                                player: playerId,
                            })
                        )
                    }
                />
            ) : loading ? (
                <WaitingForUser />
            ) : question ? (
                <div className="mb-6 space-y-4">
                    <Timer
                        key={round}
                        onTimeUp={timerExpire}
                        stopTimer={stopTimer}
                    />
                    <TriviaQuestion question={question.question} />
                    <TriviaOptions
                        answers={question.choices}
                        selectedAnswer={selectedAnswer}
                        correctAnswer={correctAnswer}
                        onAnswerClick={handleAnswerClick}
                        isAnswered={isAnswered}
                    />
                </div>
            ) : !host ? (
                <p>Waiting for host to start...</p>
            ) : null}

            <div>
                {host && (
                    <Button
                        onClick={startRound}
                        className="w-full"
                        disabled={!allowBegin}
                        variant="secondary"
                    >
                        Begin Round!
                    </Button>
                )}
            </div>

            <RulesDrawer rules={selectedRules} />
        </div>
    );
};

export default TriviaGame;
