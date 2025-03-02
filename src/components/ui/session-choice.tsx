import React from "react";
import { Button } from "../../components/ui/button";

interface SessionChoiceProps {
    onSelect: (type: "host" | "join") => void;
}

export const SessionChoice: React.FC<SessionChoiceProps> = ({ onSelect }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Choose Session Type</h2>
            <div className="flex gap-4">
                <Button onClick={() => onSelect("join")}>Join Session</Button>
                <Button onClick={() => onSelect("host")}>Host Session</Button>
            </div>
        </div>
    );
};
