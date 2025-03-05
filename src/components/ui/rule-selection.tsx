import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Button } from "./button";
import { RefreshCw, CircleX } from "lucide-react";
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
import RulesDrawer from "./rules-drawer";

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
}: {
    ruleIndex: number;
    onRefresh: () => void;
    isRefreshing: boolean;
}) => {
    return (
        <div className="flex flex-col w-full items-center relative">
            <div className="box">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <div className="content">
                    <h2>{rules[ruleIndex].title} </h2>
                    <p>
                        <a>{rules[ruleIndex].description}</a>
                    </p>
                    <Button
                        variant="ghost"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="!bg-transparent cursor-pointer animate-fadein"
                    >
                        <RefreshCw className="text-white" />
                    </Button>
                </div>
            </div>
            {/* <Card className=" !w-[350px] h-[300px]  box">
				
                <CardHeader>
                    <CardTitle>{rules[ruleIndex].title}</CardTitle>
                    <CardDescription>
                        {rules[ruleIndex].description}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between w-full align-bottom h-full">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className="w-full align-bottom"
                                variant="secondary"
                            >
                                Choose
                            </Button>
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
                            <DrinkingRules />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        className="w-full my-auto"
                                        type="submit"
                                        variant="secondary"
                                    >
                                        Confirm
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card> */}
            <Button
                variant="ghost"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="!bg-transparent cursor-pointer animate-fadein"
            >
                <RefreshCw className="text-white" />
            </Button>
        </div>
    );
};

const RuleSelection = () => {
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
                You've been chosen to choose a rule
            </span>
            <div className="flex flex-row space-x-12 relative">
                {ruleIndexes.map((ruleIndex, i) => (
                    <RuleCard
                        key={i}
                        ruleIndex={ruleIndex}
                        onRefresh={() => changeRule(i)}
                        isRefreshing={refreshStates[i]}
                    />
                ))}
            </div>
            <Button className="mt-4 w-fit" variant="secondary">
                Pass <CircleX />
            </Button>
            <RulesDrawer />
        </div>
    );
};

export default RuleSelection;
