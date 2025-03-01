import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Spinner } from "../../components/ui/spinner";
import Items from "src/lib/esports_trivia_questions.json";
import { generateQuestion, generateRemark } from "src/lib/utils";
import BeerComponent from "../../components/beer";
import DrinkingRules from "../../components/ui/drinkingrules";
import { SessionFormAnswers } from "../../components/ui/session-join";
import { ChevronLeft } from "lucide-react";

interface HomeProps {
  answers: SessionFormAnswers;
  onBack: () => void; // Add the back handler
}
// Define the Home component
const Home: React.FC<HomeProps> = ({ answers, onBack }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null); // For the correct answer music
  const loadingAudioRef = useRef<HTMLAudioElement | null>(null); // For the loading music

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
  const [bouncingAnswer, setBouncingAnswer] = useState<string | null>(null); // State to track the bouncing answer
  const [loading, setLoading] = useState<boolean>(false); // Loading state for the spinner
  const [isAnswered, setIsAnswered] = useState(false); // Track if an answer has been selected
  const [remark, setRemark] = useState<string | null>(null);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Handle adding a badge
  const handleAddBadge = () => {
    if (inputValue.trim() && !badges.includes(inputValue)) {
      setBadges((prevBadges) => [...prevBadges, inputValue]);
      setInputValue(""); // Reset input field
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
    setRemark(null);
    setShowQuestion(true); // Show the trivia question
    setLoading(true); // Set loading to true to show spinner
    audioRef.current?.pause();
    loadingAudioRef.current?.play(); // Play loading music
    setIsAnswered(false); // Reset answer state

    try {
      // Pick a random question from the list
      const randomBadge = badges[Math.floor(Math.random() * badges.length)];
      const response = await generateQuestion(randomBadge);
      const jsonString = response.match(/{[\s\S]*}/);

      console.log(response);
      console.log(jsonString);

      if (jsonString) {
        const randomQuestion = JSON.parse(jsonString[0]);
        // Set the selected question and its answers
        setTriviaQuestion(randomQuestion.question);
        setTriviaAnswers(randomQuestion.choices);
        setCorrectAnswer(randomQuestion.answer);
        setSelectedAnswer(null); // Reset selected answer
        setAnswerState(""); // Reset answer state
      } else {
        setTriviaQuestion("Error loading question...");
        return;
      }
    } catch (error) {
      console.error("Error fetching the trivia questions:", error);
      setTriviaQuestion("Error loading question...");
      setTriviaAnswers(["Please try again later"]);
    } finally {
      setLoading(false); // Set loading to false once the question has been set
    }
  };

  // Handle answer selection
  const handleAnswerClick = async (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === correctAnswer) {
      setAnswerState("correct");
      setBouncingAnswer(answer); // Trigger bouncing for the correct answer
      setIsAnswered(true); // Mark as answered
      var remark = await generateRemark(false);
      setRemark(remark); // Generate remark for correct answer

      if (audioRef.current) {
        loadingAudioRef.current?.pause(); // Play loading music
        audioRef.current.play(); // Play the audio when the answer is correct
      }
    } else {
      setAnswerState("incorrect");
      setIsAnswered(true); // Mark as answered
      var remark = await generateRemark(true);
      setRemark(remark); // Generate remark for correct answer
    }
  };

  useEffect(() => {
    if (answers.topic && !badges.includes(answers.topic)) {
      setBadges((prevBadges) => {
        if (!prevBadges.includes(answers.topic)) {
          return [...prevBadges, answers.topic];
        }
        return prevBadges;
      });
    }
  }, [answerState]);

  return (
    <div>
      <Button className="absolute top-4 left-4" onClick={onBack} size="icon">
        <ChevronLeft />
      </Button>
      <div className="text-white absolute top-4 left-1/2 transform -translate-x-1/2">
        Session: 1234
      </div>
      {/* Audio elements for loading music and correct answer music */}

      {/* <div className="mx-auto p-16 bg-black my-auto flex items-center justify-center text-white shadow-lg rounded-lg max-w-[20vw] absolute right-[10%]">
        <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold tracking-tight  mb-8">Rules</h1>

      <DrinkingRules></DrinkingRules>
      <
      
      </div>
      </div> */}
      {/* <SessionForm></SessionForm> */}
      <audio ref={loadingAudioRef} src="/audio/loadingmusic.mp3" />
      <audio ref={audioRef} src="/audio/aiAyHey.mp3" />
      <div className="">
        {/* <p>Your answers: {JSON.stringify(answers)}</p> */}

        {/* Trivia question display */}
        {showQuestion && loading ? (
          <div className="flex justify-center items-center h-[360px] mb-8">
            <Spinner /> {/* Show the Spinner while loading */}
          </div>
        ) : (
          triviaQuestion && (
            <div className="mb-6">
              <div className="animate-typing overflow-hidden whitespace-nowrap">
                {triviaQuestion}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 max-md:grid-cols-1">
                {triviaAnswers.map((answer, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerClick(answer)}
                    className={`mb-2 w-full rounded-md text-white
                    ${
                      selectedAnswer
                        ? answer === correctAnswer
                          ? "bg-green-500"
                          : "bg-red-500"
                        : "bg-gray-800"
                    } 
                    ${bouncingAnswer === answer ? "!animate-bounce " : ""}
                    ${isAnswered ? "pointer-events-none" : ""}
                    animate-fadein`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="mr-2">{answer}</span>
                      {selectedAnswer &&
                        (answer === correctAnswer ? (
                          <span className="text-white">&#10003;</span> // Tick
                        ) : answer === selectedAnswer ? (
                          <span className="text-white">X</span> // Cross
                        ) : null)}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )
        )}

        {/* Input and badges section */}
        {/* <div className="flex flex-row md:space-x-4 max-md:flex-col">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Enter your themes here"
            className="mb-4 w-full p-3 rounded-md bg-gray-800 text-white placeholder-gray-400"
          />

        </div> */}

        {/* Display the badges underneath the input */}
        {/* <div className="flex flex-wrap gap-2">
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
        </div> */}
        <Button onClick={handleGenerateQuestion} className="w-full">
          Generate Question
        </Button>
        {/* Display the remark below the button */}
        {remark && answerState !== "" && (
          <div className="animate-typing overflow-hidden whitespace-nowrap text-white mt-4">
            {remark}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
