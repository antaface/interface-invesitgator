import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import SceneDisplay from './components/SceneDisplay';
import { CasesLogModal } from './components/CasesLogModal';

interface GameState {
  sceneId: string;
  sceneText: string;
  choices: { id: string; label: string }[];
  sessionId: string;
}

const App = () => {
  const [gameState, setGameState] = useState<GameState>({
    sceneId: '',
    sceneText: '',
    choices: [],
    sessionId: ''
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [introChoices, setIntroChoices] = useState<{ id: string; label: string }[]>([]);

  // Static list of all eight cases
  const [cases] = useState([
    { id: 'nav1', title: 'Bloated Nav', status: 'open' as const },
    { id: 'tap1', title: 'Tiny Tap-Targets', status: 'open' as const },
    { id: 'popup1', title: 'Dark-Pattern Pop-Up', status: 'open' as const },
    { id: 'contrast1', title: 'Contrast Check', status: 'open' as const },
    { id: 'anim1', title: 'Seizure-Inducing Animations', status: 'open' as const },
    { id: 'form1', title: 'Misaligned Form Fields', status: 'open' as const },
    { id: 'scroll1', title: 'Infinite Scroll Loop', status: 'open' as const },
    { id: 'loader1', title: 'Misleading Loading Spinner', status: 'open' as const }
  ]);

  useEffect(() => {
    // Fetch initial scene on mount
    const initializeGame = async () => {
      try {
        const stored = localStorage.getItem('ii-session');
        const response = await fetch('https://auliwbxalriveimoweat.supabase.co/functions/v1/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bGl3YnhhbHJpdmVpbW93ZWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzQyNjYsImV4cCI6MjA2NzkxMDI2Nn0.Y322OiK3oTHYsJtqbWvy1LTHqlnaCSGOjUJJRPd3uZk`
          },
          body: JSON.stringify({ sessionId: stored })
        });
        
        if (!response.ok) {
          throw new Error('Failed to initialize game');
        }
        
        const data = await response.json();
        
        // Store sessionId in localStorage when received
        localStorage.setItem('ii-session', data.sessionId);
        
        // Store intro choices if this is the intro scene
        if (data.sceneId === 'intro') {
          setIntroChoices(data.choices);
        }
        
        setGameState({
          sceneId: data.sceneId,
          sceneText: data.sceneText,
          choices: data.choices,
          sessionId: data.sessionId
        });
      } catch (error) {
        console.error('Error initializing game:', error);
      }
    };

    initializeGame();
  }, []);

  const onChoose = async (choiceId: string) => {
    try {
      const response = await fetch('https://auliwbxalriveimoweat.supabase.co/functions/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bGl3YnhhbHJpdmVpbW93ZWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzQyNjYsImV4cCI6MjA2NzkxMDI2Nn0.Y322OiK3oTHYsJtqbWvy1LTHqlnaCSGOjUJJRPd3uZk`
        },
        body: JSON.stringify({
          sessionId: gameState.sessionId,
          choiceId: choiceId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to process choice');
      }
      
      const data = await response.json();
      
      // Store updated sessionId in localStorage
      localStorage.setItem('ii-session', data.sessionId);
      
      setGameState({
        sceneId: data.sceneId,
        sceneText: data.sceneText,
        choices: data.choices,
        sessionId: data.sessionId
      });
    } catch (error) {
      console.error('Error processing choice:', error);
    }
  };

  function handleSelectCase(choiceId: string) {
    if (!gameState || gameState.sceneId !== 'intro') return; // safety
    onChoose(choiceId); // reuse existing call that POSTs to /functions/chat
    setDrawerOpen(false); // close modal
  }

  const handleOpenCases = () => {
    // Only open modal if we're on intro scene or a success scene
    if (gameState.sceneId === 'intro' || gameState.sceneId.endsWith('_success')) {
      setDrawerOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header onOpenCases={handleOpenCases} />
      
      <main className="flex-1 flex justify-center items-center p-4">
        {gameState.sceneId && (
          <motion.div
            key={gameState.sceneId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <SceneDisplay
              sceneId={gameState.sceneId}
              sceneText={gameState.sceneText}
              choices={gameState.choices}
              onChoose={onChoose}
              onViewLog={handleOpenCases}
              isIntro={gameState.sceneId === 'intro'}
            />
          </motion.div>
        )}
      </main>
      
      <CasesLogModal 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        cases={cases}
        onSelectCase={handleSelectCase}
      />
    </div>
  );
};

export default App;
