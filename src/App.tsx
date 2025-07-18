
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Howl, Howler } from 'howler';
import { Header } from './components/Header';
import SceneDisplay from './components/SceneDisplay';
import { CasesLogModal } from './components/CasesLogModal';
import { getBackground } from './utils/getBackground';

interface Scene {
  sceneId: string;
  sceneText: string;
  choices: { id: string; label: string }[];
  sessionId: string;
}

const App = () => {
  const [scene, setScene] = useState<Scene | null>(null);

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
        
        setScene({
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
          sessionId: scene?.sessionId,
          choiceId: choiceId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to process choice');
      }
      
      const data = await response.json();
      
      // Store updated sessionId in localStorage
      localStorage.setItem('ii-session', data.sessionId);
      
      setScene({
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
      const storedSessionId = localStorage.getItem('ii-session') || scene?.sessionId;
      
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
      
      setScene({
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
        style={{ backgroundImage: `url(${getBackground(scene?.sceneId || '')})` }}
      />

      {/* FOREGROUND UI */}
      <Header muted={isMuted} toggleMute={toggleMute} openCaseLog={handleOpenCases} />
      <main className="flex flex-col items-center justify-center min-h-screen">
        {/* Loader while first fetch is in flight */}
        {!scene && (
          <div className="fixed inset-0 flex items-center justify-center text-white">
            Loading…
          </div>
        )}

        {/* Show card only when scene is ready */}
        {scene && (
          <motion.div
            key={scene.sceneId}
            initial={{ opacity: 0, y: 16 }}   // start slightly lower & transparent
            animate={{ opacity: 1, y: 0 }}    // fade in & float up
            exit={{ opacity: 0, y: -16 }}     // when changing scenes
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <SceneDisplay
              sceneId={scene.sceneId}
              sceneText={scene.sceneText}
              choices={scene.choices}
              onChoose={onChoose}
              onViewLog={() => setDrawerOpen(true)}
              isIntro={scene.sceneId === "intro"}
            />
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
