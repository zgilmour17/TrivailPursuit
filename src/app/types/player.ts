export type Player = {
    id: string;
    name: string;
    answers: Record<number, string>;
    score: number;
    isHost: boolean;
    recentScore: number;
};
