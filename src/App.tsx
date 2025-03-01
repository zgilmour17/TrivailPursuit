import React, { useState } from "react";
import backgroundImage from "src/lib/test3.jpg";

import "./App.css";
import Home from "./app/home/home";
import { SessionHostForm } from "./components/ui/session-host"; // Add import for host form
import { SessionJoinForm } from "./components/ui/session-join"; // Add import for join form
import { SessionChoice } from "./components/ui/session-choice";

function App() {
  const [step, setStep] = useState<"choice" | "form" | "home">("choice");
  const [formAnswers, setFormAnswers] = useState<any>(null);
  const [sessionType, setSessionType] = useState<"host" | "join" | null>(null); // Track the session type (host or join)

  // Define back handler function
  const handleBack = () => {
    if (step === "form") {
      setStep("choice");
      setSessionType(null); // Reset session type when going back to choice
    } else if (step === "home") {
      setStep("form");
    }
  };

  const handleFormComplete = (answers: any) => {
    setFormAnswers(answers);
    setStep("home");
  };

  const handleSessionTypeSelect = (type: "host" | "join") => {
    setSessionType(type);
    setStep("form");
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${backgroundImage}` }}
    >
      <div className="h-screen w-full flex items-center justify-center">
        <div className="mx-auto p-16 bg-black my-auto flex justify-center text-white shadow-lg rounded-lg max-w-[50vw] max-md:max-w-[95%] flex-col relative">
          <h1 className="mx-auto text-4xl font-extrabold tracking-tight mb-8 ">
            Trivail Pursuit
          </h1>

          {step === "choice" && (
            <SessionChoice
              onSelect={handleSessionTypeSelect} // Pass handler to handle session type selection
            />
          )}

          {step === "form" && sessionType === "host" && (
            <SessionHostForm
              onComplete={handleFormComplete}
              onBack={handleBack}
            />
          )}

          {step === "form" && sessionType === "join" && (
            <SessionJoinForm
              onComplete={handleFormComplete}
              onBack={handleBack}
            />
          )}

          {step === "home" && (
            <Home answers={formAnswers} onBack={handleBack} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
