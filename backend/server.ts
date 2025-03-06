import { parse } from "cookie";
import cookieParser from "cookie-parser";
import cors from "cors"; // <-- Add cors
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import http from "http";
import { WebSocketServer } from "ws";

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

const clients = new Map(); // Track connected players

// Function to use Express sessions inside WebSockets
const getSession = (
    req: any
): Promise<
    session.Session & {
        game?: { id: number; players: { id: number; name: string }[] };
    }
> => {
    return new Promise((resolve) => {
        sessionMiddleware(req, {} as any, () => {
            resolve(
                req.session as session.Session & {
                    game?: {
                        id: number;
                        players: { id: number; name: string }[];
                    };
                }
            );
        });
    });
};

// WebSocket connection handling
wss.on("connection", async (ws, req) => {
    const cookies = parse(req.headers.cookie || "");
    const sessionId = cookies["connect.sid"];
    const session = await getSession(req);

    // Ensure a game session exists
    if (!sessionId) {
        ws.send(JSON.stringify({ type: "error", message: "No session found" }));
        ws.close();
        return;
    }

    session.game = session.game || { id: Date.now(), players: [] };

    // Add a new player
    const player = {
        id: Date.now(),
        name: `Player${session.game.players.length + 1}`,
    };
    session.game.players.push(player);

    // Save session
    session.save();

    clients.set(ws, { session, player });

    console.log(`${player.name} joined the game!`);
    broadcast({ type: "playerJoined", player });

    ws.on("message", (message) => {
        const data = JSON.parse(message.toString());
        if (data.type === "answer") {
            console.log(`${player.name} answered: ${data.answer}`);
            broadcast({
                type: "answerReceived",
                player: player.name,
                answer: data.answer,
            });
        }
    });

    ws.on("close", () => {
        console.log(`${player.name} disconnected`);
        clients.delete(ws);
        broadcast({ type: "playerLeft", player: player.name });
    });
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
  }`;

    try {
        const question = await askAI(promptTemplate);
        console.log(question);
        const jsonString = question.match(/\[\s*\{[\s\S]*?\}\s*\]/)?.[0];
        console.log(jsonString);
        if (jsonString) {
            res.json(JSON.parse(jsonString[0]));
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

    // Add your logic here for generating rules
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
function broadcast(data: any) {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify(data));
    });
}

server.listen(PORT, () => {
    console.log("Server running on http://localhost:", PORT);
});
