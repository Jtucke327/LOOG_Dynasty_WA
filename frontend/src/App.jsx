import React from 'react';
import HomePage from './components/Home/HomePage';
import './index.css';

function App() {
  // Replace these with actual leagueId and rosterId from your league and user
  const leagueId = '1211169376376459264'; // Your Sleeper league ID
  const userRosterId = 1;                // Your roster ID (team ID) in the league

  return (
    <div className="App">
      <HomePage leagueId={leagueId} userRosterId={userRosterId} />
    </div>
  );
}

export default App;
