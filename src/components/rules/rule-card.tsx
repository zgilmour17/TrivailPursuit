import { Rule } from "@/app/types/rule";
import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

const RuleCard = ({
    ruleIndex,
    onRefresh,
    isRefreshing,
    onComplete,
    rule,
    selectedRules,
}: {
    ruleIndex: number;
    onRefresh?: () => void; // <-- Made this optional
    isRefreshing: boolean;
    onComplete: (rule: Rule) => void;
    rule: Rule;
    selectedRules: Rule[];
}) => {
    return (
        <div className="flex flex-col w-full items-center relative">
            <div
                className="box animate-fadein"
                onClick={() => onComplete(rule)}
            >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <div className="content">
                    <h2 className="font-bold">{rule.title} </h2>
                    <p>
                        <a>{rule.description}</a>
                    </p>
                </div>
            </div>

            {onRefresh && ( // <-- Only render if onRefresh is defined
                <Button
                    variant="ghost"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="!bg-transparent cursor-pointer animate-fadein mt-20 disabled:opacity-0"
                >
                    <RefreshCw className="text-white !h-[35px] !w-[35px]" />
                </Button>
            )}
        </div>
    );
};

export default RuleCard;
