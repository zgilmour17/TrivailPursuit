import { ChevronLeft } from "lucide-react";
import React from "react";
import TriviaGame from "../../components/game/trivia-game";
import { Button } from "../../components/ui/button";
export interface HomeProps {
    answers: any;
    onBack: () => void;
    host: boolean;
    ws: WebSocket | null;
    message: string;
    playerId: string;
}
const Home: React.FC<HomeProps> = ({ onBack, ws, message, host, playerId }) => {
    return (
        <div>
            <Button
                onClick={onBack}
                className="absolute top-4 left-4"
                size="icon"
                variant="secondary"
            >
                <ChevronLeft />
            </Button>
            <TriviaGame
                ws={ws}
                message={message}
                host={host}
                playerId={playerId}
            />
        </div>
    );
};

export default Home;
