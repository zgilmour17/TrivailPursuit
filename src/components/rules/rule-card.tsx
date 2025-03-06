import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import DrinkingRules from "./drinking-rules";
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

const RuleCard = ({
    ruleIndex,
    onRefresh,
    isRefreshing,
    onComplete,
}: {
    ruleIndex: number;
    onRefresh: () => void;
    isRefreshing: boolean;
    onComplete: () => void;
}) => {
    return (
        <div className="flex flex-col w-full items-center relative">
            <Dialog>
                <DialogTrigger asChild>
                    <div className="box animate-fadein">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <div className="content">
                            <h2 className="font-bold">
                                {rules[ruleIndex].title}{" "}
                            </h2>
                            <p>
                                <a>{rules[ruleIndex].description}</a>
                            </p>
                        </div>
                    </div>
                </DialogTrigger>

                <DialogContent
                    className="sm:max-w-[425px]"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="text-white text-center">
                            Choose a rule to replace
                        </DialogTitle>

                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <DrinkingRules onComplete={onComplete} drawerMode={false} />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                className="w-full my-auto"
                                type="submit"
                                variant="secondary"
                            >
                                Go Back
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
