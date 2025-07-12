
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

  const handleSelectCase = (caseId: string) => {
    console.log('Selected case:', caseId);
    
    // Find the matching intro choice by looking for the choice that leads to this case
    const matchingChoice = introChoices.find(choice => choice.id === caseId);
    
    if (matchingChoice) {
      onChoose(matchingChoice.id);
    }
    
    setDrawerOpen(false);
  };

  const handleOpenCases = () => {
    // Only open modal if we're on intro scene or a success scene
    if (gameState.sceneId === 'intro' || gameState.sceneId.endsWith('_success')) {
      setDrawerOpen(true);
    }
  };

  // Convert introChoices to cases format
  const cases = introChoices.map(choice => ({
    id: choice.id,
    title: choice.label,
    status: 'open' as const // All cases are open for now
  }));

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
