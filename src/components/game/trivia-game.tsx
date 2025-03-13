import { Question } from "@/app/types/question";
import { Rule } from "@/app/types/rule";
import React, { useEffect, useState } from "react";

import { Player } from "@/app/types/player";
import WaitingForUser from "../loading/waiting-for-action";
import RulesDrawer from "../rules/rule-drawer";
import RuleSelection from "../rules/rule-selection";
import { Button } from "../ui/button";
import TriviaLeaderboard from "./leaderboard";
import SipList from "./sip-list";
import Timer from "./timer";
import TriviaOptions from "./trivia-options";
import TriviaQuestion from "./trivia-question";

interface TriviaGameProps {
    ws: WebSocket | null;
    message: string;
    host: boolean;
}

const TriviaGame: React.FC<TriviaGameProps> = ({ ws, message, host }) => {
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
    const [losers, setLosers] = useState<string[]>([]); // Track players who got the question wrong
    const [showLosers, setShowLosers] = useState<boolean>(false); // Track players who got the question wrong
    const [allowBegin, setAllowBegin] = useState<boolean>(true);

    useEffect(() => {
        if (message) {
            console.log(message);
            const data = JSON.parse(message);
            if (data.type === "roundEnd") {
                setCorrectAnswer(data.answer);
                setLoading(false);
                setLosers(data.idiots || []); // Store the losers when the round ends
                // Delay showing the SipList for 5 seconds
                setTimeout(() => {
                    setShowLosers(true);
                    setAllowBegin(true);
                }, 5000);
            }
            if (data.type === "ruleSelection") {
                setRuleSelection(true);
                setRules(data.rules);
            }
            if (data.type === "startRound" || data.type === "ruleChosen") {
                setAllowBegin(false);

                setQuestion({ question: data.question, choices: data.choices });
                setRuleSelection(false);
                if (data.type === "ruleChosen") {
                    setSelectedRules([...selectedRules, data.rule]);
                }
                setIsAnswered(false);
                setSelectedAnswer(null);
                setRound(round + 1);
            }
            if (data.type === "leaderboard") {
                setLeaderboard(data.players);
                setShowLeaderboard(true);
            }
        }
    }, [message]);

    const handleAnswerClick = (answer: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        // setIsAnswered(true);
        ws?.send(JSON.stringify({ type: "answer", answer }));
    };

    const startRound = () => {
        setLosers([]); // Store the losers when the round ends
        setShowLosers(false);
        setShowLeaderboard(false);
        // setRound(0);
        ws?.send(JSON.stringify({ type: "startRound" }));
    };

    const timerExpire = () => {
        if (selectedAnswer == null) {
            handleAnswerClick("");
        }
        setIsAnswered(true);
    };

    return (
        <div>
            {showLosers ? (
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
                        ws?.send(JSON.stringify({ type: "ruleChosen", rule }))
                    }
                />
            ) : loading ? (
                <WaitingForUser />
            ) : question ? (
                <div className="mb-6 space-y-4">
                    <Timer key={round} onTimeUp={() => timerExpire()} />
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
                <Button
                    onClick={startRound}
                    className="w-full"
                    disabled={!allowBegin}
                    variant="secondary"
                >
                    Begin Round!
                </Button>
            </div>

            <RulesDrawer rules={selectedRules} />
        </div>
    );
};

export default TriviaGame;
