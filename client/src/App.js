import React from 'react';
import BugTracker from './pages/BugTracker';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <BugTracker />
      </div>
    </ErrorBoundary>
  );
}

export default App;