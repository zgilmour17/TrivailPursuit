import React from 'react';
import logo from './logo.svg';
import backgroundImage from 'src/lib/test3.jpg';

import './App.css';
import Home from './app/home/home';

function App() {
  return (
   
    <div className="bg-cover bg-center min-h-screen" style={{ backgroundImage: `url(${backgroundImage}` }}>
    <Home />
  </div>

  );
}

export default App;
