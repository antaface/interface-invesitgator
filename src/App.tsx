
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Howl, Howler } from 'howler';
import { Header } from './components/Header';
import SceneDisplay from './components/SceneDisplay';
import { CasesLogModal } from './components/CasesLogModal';
import CaseClosedBanner from "@/components/CaseClosedBanner";
import { getBackground } from './utils/getBackground';
import { playSfx } from "./hooks/useSfx";


interface Scene {
  sceneId: string;
  sceneText: string;
  choices: { id: string; label: string }[];
  sessionId: string;
}

const App = () => {
  const [scene, setScene] = useState<Scene | null>(null);
  const [contentReady, setReady] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [introChoices, setIntroChoices] = useState<{ id: string; label: string }[]>([]);
  const [musicMuted, setMusicMuted] = useState(false);
  const [sfxMuted, setSfxMuted] = useState(false);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  
  const bg = useRef<Howl | null>(null);

  useEffect(() => {
    // Load mute states from localStorage on component mount
    const savedMusicMute = localStorage.getItem('musicMuted') === 'true';
    const savedSfxMute = localStorage.getItem('sfxMuted') === 'true';
    setMusicMuted(savedMusicMute);
    setSfxMuted(savedSfxMute);
    
    bg.current = new Howl({
      src: ["/audio/ambient_loop.mp3"],
      loop: true,
      volume: savedMusicMute ? 0 : 0.2,
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
        setReady(false);
        queueMicrotask(() => setReady(true));
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
      
      if (data.sceneId.endsWith("_success")) {
        playSfx("success", sfxMuted);
        const solvedPrefix = data.sceneId.split(/[_\d]/)[0];
        setSolved(prev => new Set(prev).add(solvedPrefix));
      }
      if (data.sceneId.endsWith("_fail")) playSfx("fail", sfxMuted);
      setReady(false);
      queueMicrotask(() => setReady(true));
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
      
      if (data.sceneId.endsWith("_success")) {
        playSfx("success", sfxMuted);
        const solvedPrefix = data.sceneId.split(/[_\d]/)[0];
        setSolved(prev => new Set(prev).add(solvedPrefix));
      }
      if (data.sceneId.endsWith("_fail")) playSfx("fail", sfxMuted);
      setReady(false);
      queueMicrotask(() => setReady(true));
    } catch (error) {
      console.error('Error jumping to case:', error);
    }
    
    setDrawerOpen(false);
  };

  const handleOpenCases = () => {
    setDrawerOpen(true);
  };

  const toggleMusic = () => {
    const newState = !musicMuted;
    setMusicMuted(newState);
    bg.current?.volume(newState ? 0 : 0.2);
    localStorage.setItem('musicMuted', newState.toString());
  };

  const toggleSfx = () => {
    const newState = !sfxMuted;
    setSfxMuted(newState);
    localStorage.setItem('sfxMuted', newState.toString());
  };

  return (
    <div className="relative min-h-screen">
      {/* BACKGROUND */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center transition-opacity duration-700"
        style={{ backgroundImage: `url(${getBackground(scene?.sceneId || '')})` }}
      />

      {/* FOREGROUND UI */}
      <Header
        musicMuted={musicMuted}
        sfxMuted={sfxMuted}
        toggleMusic={toggleMusic}
        toggleSfx={toggleSfx}
        openCaseLog={handleOpenCases}
      />
      <main className="flex flex-col items-center justify-center min-h-screen">
        {/* Loader while first fetch is in flight */}
        {!scene && (
          <div className="fixed inset-0 flex items-center justify-center text-white">
            Loading…
          </div>
        )}

        {scene?.sceneId.endsWith("_success") && <CaseClosedBanner />}
        {/* Show card only when scene is ready */}
        {scene && contentReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
        solved={solved}
      />
    </div>
  );
};

export default App;
