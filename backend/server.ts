import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import fs from "fs";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { Game } from "./classes/game";
import { Player } from "./classes/player";
import drinking_rules from "./drinking_rules.json"; // Adjust the path as needed
import triviaQuestions from "./trivia_questions.json"; // Adjust the path as needed

// setup .env
dotenv.config();

const PORT = process.env.PORT || 3000;

interface AIResponse {
    choices: { message: { content: string } }[];
}

const sessionMiddleware = session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 }, // 1-hour session
});

const app = express();
app.use(cookieParser());
app.use(sessionMiddleware); // Apply session middleware
app.use(express.json()); // Still needed for REST API requests

// Enable CORS for all domains (you can specify the domain in the origin if you want)
app.use(
    cors({
        origin: "http://localhost:3000", // Allow React app (or modify for your frontend URL)
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
);

const server = http.createServer(app); // Create HTTP server for WebSocket

// Create WebSocket server and integrate with Express sessions
const wss = new WebSocketServer({ server });

// Store game state in memory
const games: Record<string, Game> = {};

const clients = new Map<
    WebSocket,
    {
        gameId: string;
        playerId: string;
        isHost: boolean;
    }
>();

// TODO: dupe player names
// TODO: test when host immediately joins after hosting
// WebSocket connection handling
wss.on("connection", async (ws, req) => {
    ws.on("message", (message) => {
        const data = JSON.parse(message.toString());
        console.log("Message received", data);

        //* Host Actions

        // Handle host creating a session (and also joining as a player)

        // Handle host creating a session
        if (data.type === "host") {
            const gameId = Math.random().toString(36).substring(2, 6); // Generates a random 4-character string
            console.log("got host", data);
            if (games[gameId]) {
                ws.send(
                    JSON.stringify({
                        type: "error",
                        message: "A host already exists for this game",
                    })
                );
                return;
            }

            const hostPlayer = new Player(data.playerId, data.name, true);
            console.log(hostPlayer, data);
            games[gameId] = new Game(gameId, hostPlayer);

            clients.set(ws, { gameId, playerId: hostPlayer.id, isHost: true });

            console.log(`Game ${gameId} started by host "${hostPlayer.name}"`);
            ws.send(
                JSON.stringify({
                    type: "gameCreated",
                    gameId,
                    hostName: hostPlayer.name,
                })
            );
        }

        // Handle host starting game
        if (data.type === "startGame") {
            const client = clients.get(ws);
            if (!client) return;

            // console.log(`${client.player.name} started the game.`);
            broadcast(client.gameId, {
                type: "startGame",
            });
        }

        // Handle host starting round
        if (data.type === "startRound") {
            const client = clients.get(ws);

            if (!client) return;
            let game = games[client.gameId];
            let round = games[client.gameId].incrementRound();
            let players = game.getPlayers();
            let randomPlayer =
                players[Math.floor(Math.random() * players.length)];

            if (round === 16) {
                broadcast(client.gameId, {
                    type: "gameOver",
                    players: game.getPlayers(),
                });
            } else if (round % 3 === 0) {
                broadcast(client.gameId, {
                    type: "ruleSelection",
                    rules: drinking_rules,
                    player: randomPlayer.id,
                });
            } else if (round === 5 || round === 10) {
                broadcast(client.gameId, {
                    type: "leaderboard",
                    players: game.getPlayers(),
                });
            } else {
                // console.log(`${client.player.name} started the round.`);
                broadcast(client.gameId, {
                    type: "startRound",
                    question:
                        triviaQuestions[games[client.gameId].getRound()]
                            .question,
                    choices:
                        triviaQuestions[games[client.gameId].getRound()]
                            .choices,
                });
            }
        }

        // Handle rule selection
        if (data.type === "ruleChosen") {
            const client = clients.get(ws);
            console.log(data);
            if (!client) return;
            games[client.gameId].addRule(data.rule);
            const player = games[client.gameId].getPlayer(data.player);
            console.log(player);
            if (player) {
                broadcast(client.gameId, {
                    type: "ruleChosen",
                    rule: data.rule,
                    player: player.name ? player?.name : "",
                    question:
                        triviaQuestions[games[client.gameId].getRound()]
                            .question,
                    choices:
                        triviaQuestions[games[client.gameId].getRound()]
                            .choices,
                });
            }
        }

        // Handle player answering a question
        if (data.type === "answer") {
            console.log(data);
            const client = clients.get(ws);
            if (!client) return;
            var game = games[client.gameId];
            let round = game.getRound();
            var correctAnswer = triviaQuestions[round].answer;

            //Set Answer for player
            game.setAnswerForPlayer(
                client.playerId,
                data.answer,
                data.time,
                data.answer === correctAnswer
            );

            //Find out if its the last answer for the round
            var allAnswered = true;
            var players = game.getPlayers();

            players.forEach((player) => {
                if (player.getAnswer(round) === "No answer found") {
                    allAnswered = false;
                }
            });
            console.log("allanswered?", allAnswered);
            if (allAnswered) {
                const idiots: { name: string; recentScore: number }[] = [];

                // Collect names of players who answered incorrectly and also their scores
                players.forEach((player) => {
                    // Push player name and recentScore to the list
                    idiots.push({
                        name: player.name,
                        recentScore: player.recentScore,
                    });
                });

                // Sort player scores in descending order by recentScore
                idiots.sort((a, b) => b.recentScore - a.recentScore);

                // Broadcast the data
                broadcast(client.gameId, {
                    type: "roundEnd",
                    answer: correctAnswer,
                    idiots: idiots, // Add the sorted player scores to the broadcast
                });
            }
        }

        // Handle host kicking a player
        // if (data.type === "kick") {
        //     const client = clients.get(ws);
        //     if (!client || !client.isHost) {
        //         ws.send(
        //             JSON.stringify({
        //                 type: "error",
        //                 message: "Unauthorized action",
        //             })
        //         );
        //         return;
        //     }

        //     const playerToKick = session.game.players.find(
        //         (p) => p.name === data.name
        //     );

        //     if (!playerToKick) {
        //         ws.send(
        //             JSON.stringify({
        //                 type: "error",
        //                 message: "Player not found",
        //             })
        //         );
        //         return;
        //     }

        //     // Remove player from session
        //     session.game.players = session.game.players.filter(
        //         (p) => p.id !== playerToKick.id
        //     );
        //     session.save();

        //     // Find and disconnect the kicked player
        //     for (const [clientWs, clientInfo] of clients.entries()) {
        //         if (clientInfo.player.id === playerToKick.id) {
        //             clientWs.send(JSON.stringify({ type: "kicked" }));
        //             clientWs.close();
        //             clients.delete(clientWs);
        //             break;
        //         }
        //     }

        //     console.log(
        //         `${playerToKick.name} was kicked by ${client.player.name}`
        //     );
        //     broadcast(client.gameId, {
        //         type: "playerKicked",
        //         player: playerToKick.name,
        //         by: client.player.name,
        //     });
        // }

        //* Player Actions
        // Handle player joining
        if (data.type === "join") {
            const gameId = data.gameId;
            const name = data.name;
            if (!games[gameId]) {
                ws.send(
                    JSON.stringify({ type: "error", message: "Game not found" })
                );
                return;
            }

            const player = new Player(data.playerId, name, false);
            games[gameId].addPlayer(player);
            const game = games[gameId];
            console.log(game.getPlayers());
            clients.set(ws, { gameId, playerId: player.id, isHost: false });

            console.log(`${player.name} joined game ${gameId}`);
            broadcast(gameId, {
                type: "playerJoined",
                players: game.getPlayers(),
            });
        }
    });

    //TODO: Fix player disconnecting
    ws.on("close", () => handleClientDisconnect(ws));

    function handleClientDisconnect(ws) {
        const client = clients.get(ws);
        if (!client) return; // Ensure client exists

        const game = games[client.gameId];
        if (game) {
            const player = game.getPlayer(client.playerId);
            if (player) {
                console.log(
                    `Player ${player.name} has left game ${client.gameId}`
                );
                broadcast(client.gameId, {
                    type: "playerLeft",
                    player: player.name,
                });
            } else {
                console.warn(
                    `Player with ID ${client.playerId} not found in game ${client.gameId}`
                );
            }
        } else {
            console.warn(`Game with ID ${client.gameId} not found`);
        }

        clients.delete(ws); // Ensure client is always removed
    }
});

async function askAI(prompt: string): Promise<string> {
    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": process.env.SITE_URL || "<YOUR_SITE_URL>",
                "X-Title": process.env.SITE_NAME || "<YOUR_SITE_NAME>",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-distill-llama-70b:free",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            }),
        }
    );
    const data = (await response.json()) as AIResponse;

    return data.choices[0].message.content;
}

app.post("/write-trivia-questions", (req, res) => {
    const questions = req.body.questions;
    fs.writeFileSync(
        "trivia_questions.json",
        JSON.stringify(questions, null, 2),
        "utf8"
    );
    res.send({ message: "Trivia questions saved to file!" });
});

app.post("/generate-question", async (req, res) => {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const promptTemplate = `respond with a multiple choice trivia question related to this topic: ${topic}.
  Give 4 answers for it, 3 incorrect and 1 correct. Make the answers no more than 10 words each.
  Respond in JSON format:
  {
    "question": "<QUESTION>",
    "choices": ["<ANSWER_1>", "<ANSWER_2>", "<ANSWER_3>", "<ANSWER_4>"],
    "answer": "<CORRECT_ANSWER>"
  }`;

    try {
        const question = await askAI(promptTemplate);
        const jsonString = question.match(/{[\s\S]*}/);
        if (jsonString) {
            res.json(JSON.parse(jsonString[0]));
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to generate question" });
    }
});

app.post("/generate-questions", async (req, res) => {
    const { topics, amount } = req.body;
    if (!topics) return res.status(400).json({ error: "Topic is required" });
    console.log(topics, amount);
    const promptTemplate = `respond with ${amount} multiple choice trivia question related to these topics: ${topics}. 
	For each question generated choose a single topic from that list.
  Give 4 answers for it, 3 incorrect and 1 correct. Make the answers no more than 10 words each.
  Respond in JSON list format:
  {
    "question": "<QUESTION>",
    "choices": ["<ANSWER_1>", "<ANSWER_2>", "<ANSWER_3>", "<ANSWER_4>"],
    "answer": "<CORRECT_ANSWER>"
  }. Do not include your thoughts, only include the json list.`;

    try {
        const question = await askAI(promptTemplate);
        const jsonString = question
            .replace("`", "")
            .match(/\[\s*\{[\s\S]*?\}\s*\]/)?.[0];
        if (jsonString) {
            res.json(JSON.parse(jsonString.replace(/[\x00-\x1F\x7F]/g, "")));
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to generate questions" });
    }
});

app.post("/generate-rule", async (req, res) => {
    const { numRules } = req.body;
    if (!numRules)
        return res.status(400).json({ error: "numRules is required" });
});
app.post("/generate-rules", async (req, res) => {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "amount is required" });
    console.log(amount);
    const promptTemplate = `respond with ${amount} drinking rules for a trivia game where players are 
	playing concurrently and the host begins each round for all players where a timer starts and you must choose between 4 choices. 
	It is played on the user's phone and each round shows who got it right or wrong. respond with a json list with each object formatted like the one below. 
	Please make the punishment be sip amounts.
	{
	"title": "<TITLE>",
	"description": "<DESCRIPTION",
	}. Do not include your thoughts, only include the json list.`;

    try {
        const rules = await askAI(promptTemplate);
        const jsonString = rules
            .replace("`", "")
            .match(/\[\s*\{[\s\S]*?\}\s*\]/)?.[0];
        if (jsonString) {
            res.json(JSON.parse(jsonString.replace(/[\x00-\x1F\x7F]/g, "")));
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to generate questions" });
    }
});
app.post("/write-rules", (req, res) => {
    const rules = req.body.rules;
    fs.writeFileSync(
        "drinking_rules.json",
        JSON.stringify(rules, null, 2),
        "utf8"
    );
    res.send({ message: "Rules saved to file!" });
});

app.post("/generate-remark", async (req, res) => {
    const { wrong } = req.body;
    if (wrong === undefined)
        return res.status(400).json({ error: "Missing 'wrong' parameter" });

    const promptTemplate = wrong
        ? `taking on the personality of a UK grime artist, respond with a harsh single-line insult for someone who just got a multiple-choice trivia question wrong.`
        : `taking on the personality of a UK grime artist, respond with a single-line compliment for someone who just got a multiple-choice trivia question correct.`;

    try {
        const remark = await askAI(promptTemplate);
        res.json({ remark });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate remark" });
    }
});

// Broadcast a message to all connected players
function broadcast(gameId: string, message: any) {
    for (const [ws, client] of clients.entries()) {
        if (client.gameId === gameId) {
            ws.send(JSON.stringify(message));
        }
    }
}

server.listen(PORT, () => {
    console.log("Server running on http://localhost:", PORT);
});
