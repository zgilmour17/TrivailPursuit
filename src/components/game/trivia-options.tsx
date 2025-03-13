import { Button } from "../../components/ui/button";

interface TriviaOptionsProps {
    answers: string[];
    selectedAnswer: string | null;
    correctAnswer: string | null;
    onAnswerClick: (answer: string) => void;
    isAnswered: boolean;
}

const TriviaOptions: React.FC<TriviaOptionsProps> = ({
    answers,
    selectedAnswer,
    correctAnswer,
    onAnswerClick,
    isAnswered,
}) => {
    return (
        <div className="grid grid-cols-2 gap-4 animate-fadein">
            {answers.map((answer, index) => (
                <Button
                    key={index}
                    variant="secondary"
                    onClick={() => onAnswerClick(answer)}
                    className={`mb-2 w-full rounded-md text-white
            ${
                isAnswered
                    ? answer === correctAnswer
                        ? "!bg-green-500 animate-bounce "
                        : "!bg-red-500 "
                    : "bg-gray-800 "
            } 
			${isAnswered ? "pointer-events-none" : ""}								

            ${
                selectedAnswer === answer
                    ? "border-2 border-white pointer-events-none"
                    : ""
            }`}
                >
                    {answer}
                    {isAnswered &&
                        (answer === correctAnswer ? (
                            <span className="text-white">&#10003;</span>
                        ) : answer === selectedAnswer ? (
                            <span className="text-white">X</span>
                        ) : null)}
                </Button>
            ))}
        </div>
    );
};

export default TriviaOptions;
