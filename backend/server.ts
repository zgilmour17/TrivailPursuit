import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

interface AIResponse {
	choices: { message: { content: string } }[];
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

	const data = (await response.json()) as AIResponse; // Type assertion

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
		res.json(JSON.parse(question));
	} catch (error) {
		res.status(500).json({ error: "Failed to generate question" });
	}
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

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
