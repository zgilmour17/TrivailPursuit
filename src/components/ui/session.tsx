import React, { useState } from 'react';
import { Input } from "./input";
import { Button } from "./button";
export function SessionForm() {
  const [sessionName, setSessionName] = useState('');
  const [givenName, setGivenName] = useState('');
  const [topic, setTopic] = useState('');

  const handleJoin = () => {
    
    alert(`Joining session: ${sessionName}, as ${givenName}, on topic: ${topic}`);
    // Add your join logic here
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h1 className="text-2xl font-bold mb-4">Join Session</h1>
      <form onSubmit={handleJoin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
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

        <Button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Join
        </Button>
      </form>
    </div>
  );
}
