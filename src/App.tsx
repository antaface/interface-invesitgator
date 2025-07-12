
import React, { useState, useEffect } from 'react';
import SceneDisplay from './components/SceneDisplay';

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

  useEffect(() => {
    // Fetch initial scene on mount
    const initializeGame = async () => {
      try {
        const response = await fetch('/functions/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });
        
        if (!response.ok) {
          throw new Error('Failed to initialize game');
        }
        
        const data = await response.json();
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
      const response = await fetch('/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {gameState.sceneId && (
        <SceneDisplay
          sceneId={gameState.sceneId}
          sceneText={gameState.sceneText}
          choices={gameState.choices}
          onChoose={onChoose}
        />
      )}
    </div>
  );
};

export default App;
