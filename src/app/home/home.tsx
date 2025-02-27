import React, { useState } from "react";
import "./home.css";
import { Input } from "../../components/ui/input";  
import { Button } from "../../components/ui/button"; 

// Define the Home component
const Home = () => {
  // State to hold the list of badges
  const [badges, setBadges] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

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

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Trivail</h1>
        
        <Input 
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Enter your themes here"
          className="mb-4 w-96 p-3 rounded-md bg-gray-800 text-white placeholder-gray-400"
        />
        
        <Button
          onClick={handleAddBadge}
        >
          Add Theme
        </Button>

        {/* Display the badges underneath the input */}
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <div
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
