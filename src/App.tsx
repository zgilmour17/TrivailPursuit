import React, { useState } from "react";
import backgroundImage from "src/lib/test3.jpg";

import "./App.css";
import Home from "./app/home/home";
import { SessionHostForm } from "./components/ui/session-host"; // Add import for host form
import { SessionJoinForm } from "./components/ui/session-join"; // Add import for join form
import { SessionChoice } from "./components/ui/session-choice";
import { TrivailWaitingRoom } from "./components/ui/waitingroom"; // Add import for waiting room component

function App() {
    const [step, setStep] = useState<"choice" | "form" | "waiting" | "home">(
        "choice"
    );
    const [formAnswers, setFormAnswers] = useState<any>(null);
    const [sessionType, setSessionType] = useState<"host" | "join" | null>(
        null
    ); // Track the session type (host or join)

    // Define back handler function
    const handleBack = () => {
        if (step === "form") {
            setStep("choice");
            setSessionType(null); // Reset session type when going back to choice
        } else if (step === "waiting") {
            setStep("form");
        } else if (step === "home") {
            setStep("form");
        }
    };

    const handleFormComplete = (answers: any) => {
        setFormAnswers(answers);
        setStep("waiting"); // Transition to waiting room after form completion
    };

    const handleSessionTypeSelect = (type: "host" | "join") => {
        setSessionType(type);
        setStep("form");
    };

    const handleWaitingRoomComplete = () => {
        setStep("home");
    };

    return (
        <div
            className="bg-cover bg-center min-h-screen"
            style={{ backgroundImage: `url(${backgroundImage}` }}
        >
            <div className="h-screen w-full flex items-center justify-center">
                <div className="mx-auto px-16 pb-8 bg-black my-auto flex justify-center text-white shadow-lg rounded-lg max-w-[50vw] max-md:max-w-[95%] flex-col relative">
                    <h1 className="mx-auto text-4xl font-extrabold tracking-tight mb-8 ">
                        <img
                            src="./title.png"
                            alt="Title Image"
                            className="w-[250px]"
                        />
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

                    {step === "waiting" && (
                        <TrivailWaitingRoom
                            onBack={handleBack}
                            onComplete={handleWaitingRoomComplete}
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
