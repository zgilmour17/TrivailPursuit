import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export function dimensions(n:number): [number, number] {
  if (n === 0) return [0,0]
  var rows = Math.floor(Math.sqrt(n));
  while(n % rows != 0) rows -= 1;
  const cols = n/rows;
  return [rows,cols];
}
export async function askAI(prompt: string): Promise<string> {
  const msg = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
      "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
      "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "deepseek/deepseek-r1-distill-llama-70b:free",
      "messages": [
        {
          "role": "user",
          "content": prompt
        }
      ]
    })
  }).then(resp => {
    return resp.json();
  }).then(resp => {
    return resp.choices[0].message.content
  });

  return msg;
}

export async function generateQuestion(topics: string[]): Promise<string> {
  const promptTemplate = `Generate a multiple choice trivia question related to these topics: ${topics.join(", ")}. 
    Generate 4 answers for it, 3 incorrect and 1 correct. Prioritise accuracy and precision over incorporating each topic into the question. Respond in the JSON format 
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