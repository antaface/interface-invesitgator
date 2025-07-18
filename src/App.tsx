
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Howl, Howler } from 'howler';
import { Header } from './components/Header';
import SceneDisplay from './components/SceneDisplay';
import { CasesLogModal } from './components/CasesLogModal';
import { getBackground } from './utils/getBackground';

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
  const [isMuted, setIsMuted] = useState(false);
  
  const bg = useRef<Howl | null>(null);

  useEffect(() => {
    // Load mute state from localStorage on component mount
    const savedMuteState = localStorage.getItem('audioMuted');
    const shouldMute = savedMuteState === 'true';
    setIsMuted(shouldMute);
    Howler.mute(shouldMute);
    
    bg.current = new Howl({
      src: ["/audio/ambient_loop.mp3"],
      loop: true,
      volume: 0.2,
    });
    bg.current.play();
    return () => {
      bg.current?.stop();
    };
  }, []);

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

  const handleSelectCase = async (prefix: string) => {
    try {
      const storedSessionId = localStorage.getItem('ii-session') || gameState.sessionId;
      
      const response = await fetch('https://auliwbxalriveimoweat.supabase.co/functions/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bGl3YnhhbHJpdmVpbW93ZWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzQyNjYsImV4cCI6MjA2NzkxMDI2Nn0.Y322OiK3oTHYsJtqbWvy1LTHqlnaCSGOjUJJRPd3uZk`
        },
        body: JSON.stringify({
          sessionId: storedSessionId,
          jumpToFirstScene: `${prefix}1`
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to jump to case');
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
      console.error('Error jumping to case:', error);
    }
    
    setDrawerOpen(false);
  };

  const handleOpenCases = () => {
    setDrawerOpen(true);
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    Howler.mute(newMuteState);
    localStorage.setItem('audioMuted', newMuteState.toString());
  };

  return (
    <div className="relative min-h-screen">
      {/* BACKGROUND */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center transition-opacity duration-700"
        style={{ backgroundImage: `url(${getBackground(gameState.sceneId)})` }}
      />

      {/* FOREGROUND UI */}
      <Header muted={isMuted} toggleMute={toggleMute} openCaseLog={handleOpenCases} />
      <main className="flex flex-col items-center justify-center min-h-screen">
        {gameState.sceneId && (
          <motion.div
            key={gameState.sceneId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {(() => {
              const prefix = gameState.sceneId.split(/[_\d]/)[0];  // e.g. "nav"
              return (
                <SceneDisplay
                  prefix={prefix}
                  sceneId={gameState.sceneId}
                  sceneText={gameState.sceneText}
                  choices={gameState.choices}
                  onChoose={onChoose}
                  onViewLog={handleOpenCases}
                  isIntro={gameState.sceneId === 'intro'}
                />
              );
            })()}
          </motion.div>
        )}
      </main>
      <CasesLogModal 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        onSelectCase={handleSelectCase}
      />
    </div>
  );
};

export default App;
