import React, { useState } from "react";
import { Button } from "./button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const DrinkingRules = () => {
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

    return (
        <div className="flex flex-col">
            {rules.map((rule, index) => (
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Button variant="link" className="text-white">
                            {index + 1}. {rule.title}
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 ">
                        <div className="flex flex-col">
                            <span className="italics underline">
                                {rule.title}{" "}
                            </span>
                            <span>{rule.description}</span>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            ))}
        </div>
    );
};

export default DrinkingRules;
