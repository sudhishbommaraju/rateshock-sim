import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { SimulationDashboard } from './components/SimulationDashboard';

// Fonts
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/800.css';

type View = 'landing' | 'simulation';

export default function App() {
  const [view, setView] = useState<View>('landing');

  return (
    <>
      {view === 'landing' ? (
        <LandingPage onStart={() => setView('simulation')} />
      ) : (
        <SimulationDashboard onBack={() => setView('landing')} />
      )}
    </>
  );
}
