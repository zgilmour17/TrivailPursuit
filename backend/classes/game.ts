import { Player } from "./player";

export class Game {
    private id: string;
    private players: Map<string, Player> = new Map<string, Player>(); // You can change `string[]` to a more detailed Player type if necessary
    private roundNumber: number = 0;

    constructor(gameId: string, hostPlayer: Player) {
        this.id = gameId;
        this.players = this.players.set(hostPlayer.id, hostPlayer); // Initialize with the host player
    }

    // Method to add a player
    addPlayer(player: Player): void {
        this.players.set(player.id, player);
    }

    //
    removePlayer(player: Player): void {
        this.players.delete(player.id);
    }
    // Method to start a new round
    incrementRound(): number {
        this.roundNumber += 1;
        return this.roundNumber;
    }

    getRound(): number {
        return this.roundNumber;
    }

    getPlayers(): Map<string, Player> {
        return this.players;
    }

    getPlayer(playerId: string): Player {
        return this.players[playerId];
    }

    // Method to set an answer for a player in the current round
    setAnswerForPlayer(
        playerId: string,
        answer: string,
        correct: boolean
    ): void {
        const player = this.players.get(playerId); // Fetch player
        if (player) {
            player.answers[this.roundNumber] = answer;
            if (correct) {
                player.incrementScore();
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
