import React, { useState } from "react";

import { CircleX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import RuleCard from "./rule-card";
import RulesDrawer from "./rule-drawer";

const rules = [
    {
        title: "Thumb Master",
        description:
            "The 'Thumb Master' can place their thumb down at any time. The last person to do the same must drink.",
    },
    {
        title: "Never Have I Ever",
        description:
            "Say something you've never done. Anyone who has done it must drink.",
    },
    {
        title: "Rhyme Time",
        description:
            "Say a word, and everyone must rhyme with it. If someone fails, they drink.",
    },
    {
        title: "Category",
        description:
            "Pick a category (e.g., fruits). Take turns naming something in that category. If someone repeats or can't think of one, they drink.",
    },
    {
        title: "Movie Quotes",
        description:
            "Say a famous movie line. If others recognize it, they drink. If no one knows it, the person who said it drinks.",
    },
];

const RuleSelection = ({ onComplete }: { onComplete: () => void }) => {
    const [ruleIndexes, setRuleIndexes] = useState([0, 1, 2]);
    const [refreshStates, setRefreshStates] = useState([false, false, false]);

    const changeRule = (index: number) => {
        const newRuleIndex = Math.floor(Math.random() * rules.length);
        setRuleIndexes((prev) =>
            prev.map((rule, i) => (i === index ? newRuleIndex : rule))
        );
        setRefreshStates((prev) =>
            prev.map((state, i) => (i === index ? true : state))
        );
    };

    const handleRuleSelect = (rule: string) => {
        toast("Rule 3: blah blah has been replaced by a new rule.");
        onComplete();
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80 p-4">
            <span
                className="type text-2xl font-bold mx-auto mb-8"
                style={
                    {
                        "--n": 30,
                    } as React.CSSProperties
                }
            >
                You've been chosen to select a rule
            </span>
            <div className="flex flex-row space-x-12 relative">
                {ruleIndexes.map((ruleIndex, i) => (
                    <RuleCard
                        key={i}
                        ruleIndex={ruleIndex}
                        onRefresh={() => changeRule(i)}
                        isRefreshing={refreshStates[i]}
                        onComplete={() => handleRuleSelect("")}
                    />
                ))}
            </div>
            <Button
                className="mt-4 w-fit animate-fadein"
                variant="secondary"
                onClick={() => handleRuleSelect("")}
            >
                Pass <CircleX />
            </Button>
            <RulesDrawer />
        </div>
    );
};

export default RuleSelection;
