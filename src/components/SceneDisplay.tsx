
import React from 'react';
import { motion } from "framer-motion";
import { cardPos } from '@/data/cardPositions';
import { playSfx } from "@/hooks/useSfx";
import CaseClosedBanner from "@/components/CaseClosedBanner";

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
}

const SceneDisplay: React.FC<SceneDisplayProps> = ({
  sceneId,
  sceneText,
  choices,
  onChoose,
  onViewLog,
  isIntro,
}) => {
  const Wrapper = motion.div;
  const isIntroScene = isIntro;
  const isSuccessScene = sceneId.endsWith('_success');

  const prefix     = sceneId.split(/[_\d]/)[0];
  const pos        = cardPos[prefix];               // undefined if not mapped
  
  const defaultIntroPos = "top-[56px] left-1/2 -translate-x-1/2";
  const finalPos = pos ?? (prefix === "intro" ? defaultIntroPos : undefined);
  
  const wrapperCls =
    finalPos
      ? `fixed ${finalPos} max-w-[350px] mx-auto rounded-xl border border-white/20 backdrop-blur-md bg-white/10 shadow-2xl p-8 z-10 space-y-6 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)]`
      : `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[350px] mx-auto rounded-xl border border-white/20 backdrop-blur-md bg-white/10 shadow-2xl p-8 z-10 space-y-6 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)]`;

  // Debug logging
  console.log('🔍 SceneDisplay Debug:');
  console.log('  Scene ID:', sceneId);
  console.log('  Extracted prefix:', prefix);
  console.log('  Available positions:', Object.keys(cardPos));
  console.log('  Found position:', pos);
  console.log('  Final class:', wrapperCls);

  return (
    <Wrapper 
      className={wrapperCls + " min-w-[20rem]"}
      animate={
        sceneId.endsWith("_fail") 
          ? { x: [0, -6, 6, -4, 4, 0] } 
          : { x: 0 }
      }
      transition={{ duration: 0.4 }}
    >
      {sceneId.endsWith("_success") && <CaseClosedBanner />}
      <div className="space-y-4">
        <p className="prose prose-invert text-zinc-50">
          {sceneId === 'intro' 
            ? "Night has fallen on Siliconark, and the city is being overrun by the dark forces of UX mischief. You, the Interface Investigator, are called upon to investigate, fight UX felonies, and save Siliconark before another scroll‑jacked citizen vanishes into the infinite void."
            : sceneText
          }
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
        {isIntroScene ? (
          <button
            onClick={() => {
              playSfx("click");
              onViewLog();
            }}
            className="btn-3d mb-3"
          >
            Open case log
          </button>
        ) : isSuccessScene ? (
          <button
            onClick={() => {
              playSfx("click");
              onViewLog();
            }}
            className="btn-3d mb-3"
          >
            Back to case log
          </button>
        ) : (
          choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => {
                playSfx("click");
                onChoose(choice.id);
              }}
              className="btn-3d mb-3"
            >
              {choice.label}
            </button>
          ))
        )}
      </div>
    </Wrapper>
  );
};

export default SceneDisplay;
