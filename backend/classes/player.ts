export class Player {
    id: string;
    name: string;
    answers: Record<number, string>;
    score: number = 0;
    isHost: boolean;
    recentScore: number = 0;

    // Constructor that accepts id (GUID) and name, with default values for answers and score
    constructor(id: string, name: string, isHost: boolean) {
        this.id = id;
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

    getRecentScore(): number {
        return this.recentScore;
    }

    // Optional method to update an answer for a specific question number
    updateAnswer(questionNumber: number, answer: string): void {
        this.answers[questionNumber] = answer;
    }

    setRecentScore(score: number) {
        this.recentScore = score;
    }

    // Optional method to update the score
    incrementScore(time: number): void {
        const baseScore = 100; // Minimum score for a correct answer
        const maxTime = 5000; // Maximum possible time (5 seconds)
        const maxBonus = 50; // Max time-based bonus

        const bonus = (time / maxTime) * maxBonus; // Scale bonus based on time remaining
        const scoreTotal = baseScore + bonus;
        this.setRecentScore(scoreTotal);
        this.score += scoreTotal;
    }
}
