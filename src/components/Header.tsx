
import { Volume2, VolumeX, FolderKanban } from "lucide-react";

export function Header({
  muted,
  toggleMute,
  openCaseLog,
}: {
  muted: boolean;
  toggleMute: () => void;
  openCaseLog: () => void;
}) {
  return (
    <header className="fixed top-4 left-4 right-4 z-20 flex items-center justify-between bg-transparent">
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Interface Investigator"
        className="h-10 select-none pointer-events-none"
      />

      {/* Icon buttons */}
      <div className="flex gap-3">
        {/* Case Log */}
        <button
          onClick={openCaseLog}
          className="bg-white/10 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/20 shadow-md transition"
        >
          <FolderKanban className="h-5 w-5" strokeWidth={1.5} />
        </button>

        {/* Mute / Unmute */}
        <button
          onClick={toggleMute}
          className="bg-white/10 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/20 shadow-md transition"
        >
          {muted ? (
            <VolumeX className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <Volume2 className="h-5 w-5" strokeWidth={1.5} />
          )}
        </button>
      </div>
    </header>
  );
}
