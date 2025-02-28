import React, { useState } from "react";
import "./home.css";
import { Input } from "../../components/ui/input";  
import { Button } from "../../components/ui/button"; 
import { Badge } from "../../components/ui/badge"; 
import Items from 'src/lib/esports_trivia_questions.json';

// Define the Home component
const Home = () => {
  // State to hold the list of badges
  const [badges, setBadges] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  // State for the trivia question and its answers
  const [triviaQuestion, setTriviaQuestion] = useState<string | null>(null);
  const [triviaAnswers, setTriviaAnswers] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<string>("");

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Handle adding a badge
  const handleAddBadge = () => {
    if (inputValue.trim() && !badges.includes(inputValue)) {
      setBadges((prevBadges) => [...prevBadges, inputValue]);
      setInputValue("");  // Reset input field
    }
  };

  // Handle removing a badge
  const handleRemoveBadge = (badge: string) => {
    setBadges(badges.filter((b) => b !== badge));
  };

  // Handle adding a badge on pressing 'Enter'
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddBadge();
    }
  };

  // Handle generating a trivia question
  const handleGenerateQuestion = async () => { 
    setShowQuestion(true); // Show the trivia question

    try {
      // Fetch the JSON file (adjust the path as necessary if hosted locally or remotely)
      const data = Items;
      // Pick a random question from the list
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomQuestion = data[randomIndex];

      // Set the selected question and its answers
      setTriviaQuestion(randomQuestion.question);
      setTriviaAnswers(randomQuestion.choices);
      setCorrectAnswer(randomQuestion.answer);
      setSelectedAnswer(null);  // Reset selected answer
      setAnswerState("");  // Reset answer state
    } catch (error) {
      console.error("Error fetching the trivia questions:", error);
      setTriviaQuestion("Error loading question...");
      setTriviaAnswers(["Please try again later"]);
    }
  };

  // Handle answer selection
  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === correctAnswer) {
      setAnswerState("correct");
    } else {
      setAnswerState("incorrect");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="mx-auto p-16 bg-black my-auto flex items-center justify-center text-white shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">Trivail</h1>

          {/* Trivia question display */}
          {showQuestion && triviaQuestion && (
            <div className="mb-6">
              <div className="question-text animate-typewriter">{triviaQuestion}</div>
              <div className="mt-4">
                {triviaAnswers.map((answer, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerClick(answer)}
                    className={`mb-2 w-full rounded-md text-white 
                      ${selectedAnswer
                        ? answer === correctAnswer
                          ? 'bg-green-500'
                          : 'bg-red-500'
                        : 'bg-gray-800'
                    } transition-all duration-300`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{answer}</span>
                      {selectedAnswer && (
                        answer === correctAnswer ? (
                          <span className="text-white">&#10003;</span>  // Tick
                        ) : answer === selectedAnswer ? (
                          <span className="text-white">&#10007;</span>  // Cross
                        ) : null
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input and badges section */}
          <div className="flex flex-row space-x-4">
            <Input 
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Enter your themes here"
              className="mb-4 w-96 p-3 rounded-md bg-gray-800 text-white placeholder-gray-400"
            />
            
            <Button onClick={handleGenerateQuestion}>
              Generate Question
            </Button>
          </div>

          {/* Display the badges underneath the input */}
          <div className="flex flex-wrap gap-2 ">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                className="bg-gray-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
              >
                {badge}
                <button
                  onClick={() => handleRemoveBadge(badge)}
                  className="text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
