import { Rule } from "../types/rule";
import { Player } from "./player";

export class Game {
    private id: string;
    private players: Map<string, Player> = new Map<string, Player>(); // You can change `string[]` to a more detailed Player type if necessary
    private roundNumber: number = 0;
    private rules: Rule[] = [];
    private topics: string[] = [];
    constructor(gameId: string, hostPlayer: Player) {
        this.id = gameId;
        this.players = this.players.set(hostPlayer.id, hostPlayer); // Initialize with the host player
    }

    // Method to add a player
    addPlayer(player: Player): void {
        this.players.set(player.id, player);
    }

    removePlayer(player: Player): void {
        this.players.delete(player.id);
    }
    addTopic(topic: string): void {
        this.topics.push(topic);
    }

    getTopics(): string[] {
        return this.topics;
    }

    // Method to start a new round
    incrementRound(): number {
        this.roundNumber += 1;
        return this.roundNumber;
    }

    getRound(): number {
        return this.roundNumber;
    }

    getPlayers(): Player[] {
        return Array.from(this.players.values());
    }

    addRule(rule: Rule) {
        this.rules.push(rule);
    }

    getRules(): Rule[] {
        return this.rules;
    }

    getPlayer(playerId: string): Player | undefined {
        return this.players.get(playerId);
    }

    // Method to set an answer for a player in the current round
    setAnswerForPlayer(
        playerId: string,
        answer: string,
        time: number,
        correct: boolean
    ): void {
        const player = this.players.get(playerId); // Fetch player
        if (player) {
            player.answers[this.roundNumber] = answer;
            if (correct) {
                player.incrementScore(time);
            } else {
                player.setRecentScore(0);
            }
        } else {
            console.error(`Player with ID ${playerId} not found.`);
        }
    }
    // // Optional method to remove a player
    // removePlayer(player: string): void {
    //     this.players = this.players.filter((p) => p !== player);
    // }
}
