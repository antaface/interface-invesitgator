
import React from 'react';

interface SceneDisplayProps {
  sceneId: string;
  sceneText: string;
  choices: {
    id: string;
    label: string;
  }[];
  onChoose: (id: string) => void;
}

const SceneDisplay: React.FC<SceneDisplayProps> = ({
  sceneId,
  sceneText,
  choices,
  onChoose,
}) => {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl space-y-6">
      <div className="space-y-4">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
          {sceneText}
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => onChoose(choice.id)}
            className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SceneDisplay;
