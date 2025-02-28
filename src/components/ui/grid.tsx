import React, { useEffect, useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable'
interface Badge {
    name: string;
    id: number;
  }
interface ResizableGridProps {
  rows: number;
  cols: number;
  badges: Badge[];
  onBadgeSelected?: (badge: string) => void; // Callback to notify parent of selected badge
}

const ResizableGrid: React.FC<ResizableGridProps> = ({ rows, cols, badges, onBadgeSelected }) => {
  const [grid, setGrid] = useState<React.ReactNode[]>([]);
  const [panelPercentages, setPanelPercentages] = useState<number[]>([]); // Store panel percentages

  useEffect(() => {
    handleGridProcessing();
   
  }, [rows, cols, badges]);


  const handleGridProcessing = () => {
    calcPercentages();

    const newGrid = [];
    let index = 0;
    // Loop through rows and columns to build the grid and calculate percentage areas
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const colsArray = [];

      for (let colIndex = 0; colIndex < cols; colIndex++) {
        if (colIndex !== 0) {
          colsArray.push(<ResizableHandle key={`handle-${rowIndex}-${colIndex}`} onDragEnd={handleBadgeProcessing}/>);
        }
        colsArray.push(
          <ResizablePanel key={`panel-${rowIndex}-${colIndex}`} id={String(badges[index].id)}>
            <div className="flex h-full items-center justify-center p-6 bg-gray-800 rounded-md flex-col">
              <span className="font-semibold text-white">
                {badges[index].name}
              </span>
              <div className="text-xs text-gray-400">
                Panel Chance: {panelPercentages[index]?.toFixed(2)}%
              </div>
            </div>
          </ResizablePanel>
        );

        // Calculate panel area percentage
      
        index++;
      }

      if (rowIndex !== 0) {
        newGrid.push(<ResizableHandle key={`handle-${rowIndex}`} onDragEnd={handleBadgeProcessing}/>);
      }

      newGrid.push(
        <ResizablePanel key={`row-${rowIndex}`}>
          <ResizablePanelGroup direction="horizontal">
            {colsArray}
          </ResizablePanelGroup>
        </ResizablePanel>
      );
    }
    //handleBadgeProcessing();
    setGrid(newGrid); // Update the grid structure
  }
  const calcPercentages = () => {
    const newPanelPercentages = Array(badges.length).fill((1 / badges.length) * 100);
    setPanelPercentages(newPanelPercentages);
  }

  const handleBadgeProcessing = () => {
    const newPanelPercentages = [];
    console.log('triggered a drag')
    // Loop through each badge and compare its ID to ID 0
    for (let x of badges) {
      const element = document.getElementById(x.id.toString()); // Get element by id (assuming id is numeric)
      console.log('ele', element)

        // Otherwise calculate panel percentage or other logic
        if (element){
          const panelPercentage = calculatePanelPercentage(element);
          newPanelPercentages.push(panelPercentage);
        }
        
      
    }
    setPanelPercentages(newPanelPercentages);
    handleGridProcessing();

  };
  
  // Function to calculate panel percentage
  const calculatePanelPercentage = (element: HTMLElement) => {
    const parent = document.getElementById("0"); // Get element by id (assuming id is numeric)
    if (parent){

      const parentA = parent.clientHeight * parent.clientWidth;

      const elementA = element.clientHeight * element.clientWidth
      
      const totalBadges = badges.length;  // Total number of badges

      return totalBadges > 0 ? (elementA / parentA) * 100 : 0;

    }
    
    return  0;
  };
  
  

  // Method to return a random badge based on the weighted percentages
  const getRandomBadge = () => {
    const totalPercentage = panelPercentages.reduce((acc, percentage) => acc + percentage, 0);
    let randomNum = Math.random() * totalPercentage;

    for (let i = 0; i < panelPercentages.length; i++) {
      randomNum -= panelPercentages[i];
      if (randomNum <= 0) {
        const selectedBadge = badges[i];
        if (onBadgeSelected) {
          onBadgeSelected(selectedBadge.name); // Notify parent
        }
        return selectedBadge; // Return selected badge
      }
    }

    // Fallback if no badge is selected (should not happen)
    return badges[0];
  };

  return (
    <div>
      {/* Render grid */}
      <ResizablePanelGroup direction="vertical" className="rounded-lg border !h-[30vh] !w-[30vw] mx-auto" id="0">
        {grid}
      </ResizablePanelGroup>

      {/* Button to trigger random badge selection */}
      <button onClick={getRandomBadge} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Select Random Badge
      </button>
    </div>
  );
};

export { ResizableGrid };
