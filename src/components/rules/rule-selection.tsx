import React, { useState } from "react";

import { Rule } from "@/app/types/rule";
import { CircleX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import RuleCard from "./rule-card";
import RulesDrawer from "./rule-drawer";

const RuleSelection = ({
    onComplete,
    rules,
}: {
    onComplete: (rule: Rule) => void;
    rules: Rule[];
}) => {
    const getRandomIndexes = (): number[] => {
        const indexes = new Set<number>();
        while (indexes.size < 3) {
            indexes.add(Math.floor(Math.random() * 20) + 1);
        }
        return Array.from(indexes);
    };
    const [ruleIndexes, setRuleIndexes] = useState(getRandomIndexes());
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

    const handleRuleSelect = (rule: Rule) => {
        toast(`${rule} Selected`);
        onComplete(rule);
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
                        rule={rules[ruleIndex]}
                        key={i}
                        ruleIndex={ruleIndex}
                        onRefresh={() => changeRule(i)}
                        isRefreshing={refreshStates[i]}
                        onComplete={() => handleRuleSelect(rules[ruleIndex])}
                    />
                ))}
            </div>
            <Button
                className="mt-4 w-fit animate-fadein"
                variant="secondary"
                onClick={() => handleRuleSelect({ title: "", description: "" })}
            >
                Pass <CircleX />
            </Button>
            <RulesDrawer />
        </div>
    );
};

export default RuleSelection;
