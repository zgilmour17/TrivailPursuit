import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { ChevronLeft } from "lucide-react";
import BeerComponent from "../beer";

export interface SessionFormAnswers {
  sessionName: string;
  givenName: string;
  topic: string;
}
interface SessionJoinFormProps {
  onComplete: (answers: SessionFormAnswers) => void;
  onBack: () => void; // Add the back handler
}

const SessionJoinForm: React.FC<SessionJoinFormProps> = ({
  onComplete,
  onBack,
}) => {
  const [sessionName, setSessionName] = useState("");
  const [givenName, setGivenName] = useState("");
  const [topic, setTopic] = useState("");

  const handleJoin = () => {
    onComplete({ sessionName, givenName, topic });
    // Add your join logic here
  };

  return (
    <div>
      <Button className="absolute top-4 left-4" onClick={onBack} size="icon">
        <ChevronLeft />
      </Button>
      <h1 className="text-2xl font-bold mb-4 text-white text-center">
        Join Session
      </h1>
      <form onSubmit={handleJoin} className="space-y-4">
        <div className="flex items-start space-x-4">
          {/* Input fields */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">
                Session Name
              </label>
              <Input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter session name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">
                Given Name
              </label>
              <Input
                type="text"
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">
                Topic
              </label>
              <Input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter topic"
                required
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            <BeerComponent />
          </div>
        </div>
        <Button type="submit" className="w-full">
          Join
        </Button>
      </form>
    </div>
  );
};
export { SessionJoinForm };
