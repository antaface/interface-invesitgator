
import React from 'react';
import { cardPos } from '@/data/cardPositions';

interface SceneDisplayProps {
  sceneId: string;
  sceneText: string;
  choices: {
    id: string;
    label: string;
  }[];
  onChoose: (id: string) => void;
  onViewLog: () => void;
  isIntro: boolean;
  prefix?: string;
}

const SceneDisplay: React.FC<SceneDisplayProps> = ({
  sceneId,
  sceneText,
  choices,
  onChoose,
  onViewLog,
  isIntro,
  prefix,
}) => {
  const isIntroScene = isIntro;
  const isSuccessScene = sceneId.endsWith('_success');

  return (
    <div className={`absolute ${prefix ? cardPos[prefix] : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'} backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl md:rounded-[0_0_32px_32px] shadow-2xl p-8 max-w-[200px] mx-auto relative before:content-[''] before:absolute before:inset-0 before:rounded-inherit before:border before:border-white/10 before:pointer-events-none space-y-6`}>
      <div className="space-y-4">
        <p className="text-left text-zinc-400">
          Night has fallen on Siliconark, and the city is being overrun by the dark forces of UX mischief. You, the Interface Investigator, are called upon to investigate, fight UX felonies, and save Siliconark before another scroll‑jacked citizen vanishes into the infinite void.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
        {isIntroScene ? (
          <button
            onClick={onViewLog}
            className="btn-3d mb-3"
          >
            Open case log
          </button>
        ) : isSuccessScene ? (
          <>
            <div className="text-green-600 font-semibold text-center mb-2">
              ✅ Case Closed
            </div>
            <button
              onClick={onViewLog}
              className="btn-3d mb-3"
            >
              Back to case log
            </button>
          </>
        ) : (
          choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoose(choice.id)}
              className="btn-3d mb-3"
            >
              {choice.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default SceneDisplay;
