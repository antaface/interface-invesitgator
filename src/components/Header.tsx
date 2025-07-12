
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Howler } from 'howler';

const Header = () => {
  const [isMuted, setIsMuted] = useState(false);

  // Load mute state from localStorage on component mount
  useEffect(() => {
    const savedMuteState = localStorage.getItem('audioMuted');
    const shouldMute = savedMuteState === 'true';
    setIsMuted(shouldMute);
    Howler.mute(shouldMute);
  }, []);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    Howler.mute(newMuteState);
    localStorage.setItem('audioMuted', newMuteState.toString());
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <h1 className="text-2xl font-bold text-primary">
        Interface Investigator
      </h1>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="hover:bg-accent"
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
    </header>
  );
};

export default Header;
