import { Rule } from "@/app/types/rule";
import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
// const rules = [
//     {
//         title: "Thumb Master",
//         description:
//             "The 'Thumb Master' can place their thumb down at any time. The last person to do the same must drink.",
//     },
//     {
//         title: "Never Have I Ever",
//         description:
//             "Say something you've never done. Anyone who has done it must drink.",
//     },
//     {
//         title: "Rhyme Time",
//         description:
//             "Say a word, and everyone must rhyme with it. If someone fails, they drink.",
//     },
//     {
//         title: "Category",
//         description:
//             "Pick a category (e.g., fruits). Take turns naming something in that category. If someone repeats or can't think of one, they drink.",
//     },
//     {
//         title: "Movie Quotes",
//         description:
//             "Say a famous movie line. If others recognize it, they drink. If no one knows it, the person who said it drinks.",
//     },
// ];

const RuleCard = ({
    ruleIndex,
    onRefresh,
    isRefreshing,
    onComplete,
    rule,
}: {
    ruleIndex: number;
    onRefresh: () => void;
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

            <Button
                variant="ghost"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="!bg-transparent cursor-pointer animate-fadein mt-20 disabled:opacity-0"
            >
                <RefreshCw className="text-white !h-[35px] !w-[35px]" />
            </Button>
        </div>
    );
};
export default RuleCard;
