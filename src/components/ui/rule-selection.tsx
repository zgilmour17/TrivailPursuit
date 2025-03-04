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
import { RefreshCw, CircleX } from "lucide-react"; // Import the Lucid Refresh Icon
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
            'The person who is the "Thumb Master" can point to their thumb at any time. The last person to do the same must take a drink.',
    },
    {
        title: "Never Have I Ever",
        description:
            "Say something you've never done. Anyone who has done it must drink.",
    },
    {
        title: "Rhyme Time",
        description:
            "The first person says a word, and everyone must take turns saying words that rhyme with it. If someone fails, they drink.",
    },
    {
        title: "Category",
        description:
            "Pick a category (e.g., types of fruit). Take turns naming something in that category. If someone repeats or can't think of one, they drink.",
    },
    {
        title: "Movie Quotes",
        description:
            "Say a famous line from a movie. Everyone who knows it has to drink. If no one knows it, the person who said it drinks.",
    },
];
const RuleSelection = () => {
    const [ruleOneIndex, setRuleOneIndex] = useState(0);
    const [ruleTwoIndex, setRuleTwoIndex] = useState(1);

    const [ruleOneRefresh, setRuleOneRefresh] = useState(false);
    const [ruleTwoRefresh, setRuleTwoRefresh] = useState(false);

    const changeRule = (cardIndex: number) => {
        const newIndex = Math.floor(Math.random() * rules.length);
        if (cardIndex === 1) {
            setRuleOneIndex(newIndex); // Change rule for the first card
            setRuleOneRefresh(true);
        } else {
            setRuleTwoIndex(newIndex); // Change rule for the second card
            setRuleTwoRefresh(true);
        }
    };
    return (
        <div className="flex flex-col ">
            <span
                className="type text-2xl font-bold mx-auto"
                style={
                    {
                        "--n": 30,
                    } as React.CSSProperties
                }
            >
                You've been chosen to choose a rule
            </span>

            <Card className="animate-fadein">
                <CardHeader>
                    <CardTitle>{rules[ruleOneIndex].title}</CardTitle>
                    <CardDescription>
                        {rules[ruleOneIndex].description}
                    </CardDescription>
                </CardHeader>
                {/* <CardContent></CardContent> */}
                <CardFooter className="flex justify-between w-full">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full" variant="secondary">
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
                            <DrinkingRules></DrinkingRules>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        className="w-full"
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
                {/* Refresh Icon */}
            </Card>
            <div className="flex justify-center ">
                <Button
                    variant="ghost"
                    onClick={() => changeRule(1)}
                    disabled={ruleOneRefresh}
                    className="!bg-transparent cursor-pointer "
                >
                    <RefreshCw className="text-white animate-fadein" />
                </Button>
            </div>
            {/* <h1 className="text-2xl font-bold mb-4 text-white mx-auto w-full text-center ">
                OR
            </h1> */}
            <Card className="animate-fadein">
                <CardHeader>
                    <CardTitle>{rules[ruleTwoIndex].title}</CardTitle>
                    <CardDescription>
                        {rules[ruleTwoIndex].description}
                    </CardDescription>
                </CardHeader>
                {/* <CardContent></CardContent> */}
                <CardFooter className="flex justify-between w-full">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full" variant="secondary">
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
                            <DrinkingRules></DrinkingRules>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        className="w-full"
                                        type="submit"
                                        variant="secondary"
                                    >
                                        Confirm
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>{" "}
                </CardFooter>
                {/* Refresh Icon */}
            </Card>
            <div className="flex justify-center ">
                <Button
                    variant="ghost"
                    onClick={() => changeRule(2)}
                    disabled={ruleTwoRefresh}
                    className="!bg-transparent cursor-pointer animate-fadein"
                >
                    <RefreshCw className="text-white  " />
                </Button>
            </div>
            <div className="flex justify-center ">
                <Button className="w-fit align-center" variant="secondary">
                    Pass
                    <CircleX></CircleX>
                </Button>
            </div>
            <RulesDrawer></RulesDrawer>
        </div>
    );
};

export default RuleSelection;
