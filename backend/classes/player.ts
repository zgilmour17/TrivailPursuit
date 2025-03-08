import { v4 as uuidv4 } from "uuid";

export class Player {
    id: string;
    name: string;
    answers: Record<number, string>;
    score: number = 0;
    isHost: boolean;

    // Constructor that accepts id (GUID) and name, with default values for answers and score
    constructor(name: string, isHost: boolean) {
        this.id = uuidv4();
        this.name = name;
        this.isHost = isHost;
        this.answers = {}; // Default empty object for answers
    }

    // get answer
    getAnswer(round: number): string {
        const answer = this.answers[round];
        if (answer === undefined) {
            // Handle the case where the round doesn't exist
            return "No answer found"; // Default value
            // or you could throw an error: throw new Error(`Answer for round ${round} not found`);
        }
        return answer;
    }

    // Optional method to update an answer for a specific question number
    updateAnswer(questionNumber: number, answer: string): void {
        this.answers[questionNumber] = answer;
    }

    // Optional method to update the score
    incrementScore(): void {
        this.score += 1;
    }
}
