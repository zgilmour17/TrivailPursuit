import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import test from "./esports_trivia_questions.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function askAI(prompt: string): Promise<string> {
  const msg = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
      "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
      "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
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
  })
    .then((resp) => {
      return resp.json();
    })
    .then((resp) => {
      return resp.choices[0].message.content;
    });

  return msg;
}

export async function generateQuestion(topic: string): Promise<string> {
  var testv = Math.floor(Math.random() * 100) + 1;
  var item = JSON.stringify(test[testv]);
  console.log(item);
  return item;
  const promptTemplate = `respond with a multiple choice trivia question related to this topic: ${topic}. 
    Give 4 answers for it, 3 incorrect and 1 correct. Make the answers no more than 10 words each. you must respond in the JSON format 
    {
      "question": "<ANSWER>",
      "choices": [
          "<ANSWER_1>",
          "<ANSWER_2>",
          "<ANSWER_3>",
          "<ANSWER_4>"
      ],
      "answer": "<ACTUAL_ANSWER>"
    }`;
  return askAI(promptTemplate);
}

export async function generateRemark(wrong: boolean): Promise<string> {
  const promptTemplate = wrong
    ? `taking on the personality of a uk grime artist respond with a harsh single line insult for someone who just got a multiple choice trivia question wrong`
    : `taking on the personality of a uk grime artist respond with a single line compliment for someone who just got a multiple choice trivia question correct`;
  return askAI(promptTemplate);
}
