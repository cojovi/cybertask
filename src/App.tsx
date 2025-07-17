import React from 'react';
import TVDashboard from './components/TVDashboard';
import MobileLandscapeDashboard from './components/MobileLandscapeDashboard';

function App() {
  // For demo purposes, you can switch between components
  const isMobile = window.innerWidth <= 1024;
  
  return (
    <>
      {isMobile ? <MobileLandscapeDashboard /> : <TVDashboard />}
    </>
  );
}

export default App;
