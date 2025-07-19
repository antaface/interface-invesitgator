
import React from "react";
import { Music2, Volume2, VolumeX, Slash, FolderKanban } from "lucide-react";

interface HeaderProps {
  musicMuted: boolean;
  sfxMuted: boolean;
  toggleMusic(): void;
  toggleSfx(): void;
  openCaseLog(): void;
}

export const Header: React.FC<HeaderProps> = ({
  musicMuted,
  sfxMuted,
  toggleMusic,
  toggleSfx,
  openCaseLog,
}) => (
  <header className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
    {/* Logo */}
    <img
      src="/logo.png"
      alt="Interface Investigator"
      className="h-10 select-none pointer-events-none"
    />

    {/* Icon buttons */}
    <div className="pointer-events-auto flex gap-3">
      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        className="relative w-10 h-10 rounded-full bg-black/40 backdrop-blur 
                   flex items-center justify-center hover:bg-black/60 text-white"
        title={musicMuted ? "Play music" : "Mute music"}
      >
        {musicMuted
          ? (
            <div className="relative">
              <Music2 size={20} />
              <Slash
                size={16}
                className="absolute inset-0 m-auto text-white"
              />
            </div>
          )
          : <Music2 size={20} />
        }
      </button>

      {/* SFX toggle */}
      <button
        onClick={toggleSfx}
        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 text-white"
        title={sfxMuted ? "Enable SFX" : "Mute SFX"}
      >
        {sfxMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Case-log drawer button */}
      <button
        onClick={openCaseLog}
        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 text-white"
        title="Open Case Log"
      >
        <FolderKanban size={20} />
      </button>
    </div>
  </header>
);
