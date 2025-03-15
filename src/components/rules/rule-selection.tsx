import { Rule } from "@/app/types/rule";
import { useEffect, useState } from "react";
import RuleCard from "./rule-card";
import RulesDrawer from "./rule-drawer";

const RuleSelection = ({
    onComplete,
    rules,
    selectedRules,
}: {
    onComplete: (rule: Rule) => void;
    rules: Rule[];
    selectedRules: Rule[];
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [refreshCount, setRefreshCount] = useState(3);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const getRandomIndexes = (count: number): number[] => {
        const indexes = new Set<number>();
        while (indexes.size < count) {
            indexes.add(Math.floor(Math.random() * rules.length));
        }
        return Array.from(indexes);
    };

    const [ruleIndexes, setRuleIndexes] = useState(
        getRandomIndexes(isMobile ? 1 : 3)
    );

    const changeRule = () => {
        if (refreshCount > 0) {
            setRuleIndexes(getRandomIndexes(1));
            setRefreshCount(refreshCount - 1);
        }
    };

    const handleRuleSelect = (rule: Rule) => {
        onComplete(rule);
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80 p-4">
            <span className="type text-2xl font-bold mx-auto mb-8">
                You've been chosen to select a rule
            </span>
            <div className="flex flex-row space-x-12 relative">
                {ruleIndexes.map((ruleIndex, i) => (
                    <RuleCard
                        selectedRules={selectedRules}
                        rule={rules[ruleIndex]}
                        key={i}
                        ruleIndex={ruleIndex}
                        onRefresh={
                            isMobile && refreshCount > 0
                                ? changeRule
                                : undefined
                        }
                        isRefreshing={false}
                        onComplete={handleRuleSelect}
                    />
                ))}
            </div>
            {isMobile && (
                <span
                    className={`mt-4 w-fit transition-opacity ${
                        refreshCount === 0 ? "opacity-0" : "opacity-100"
                    }`}
                >
                    {refreshCount}
                </span>
            )}

            {/* <Button
                className="mt-4 w-fit animate-fadein"
                variant="secondary"
                onClick={() => handleRuleSelect({ title: "", description: "" })}
            >
                Pass <CircleX />
            </Button> */}
            <RulesDrawer rules={selectedRules} />
        </div>
    );
};

export default RuleSelection;
