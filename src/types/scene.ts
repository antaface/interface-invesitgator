
export interface Scene {
  sceneId: string;
  sceneText: string;
  choices: {
    label: string;
    nextId: string;
  }[];
}
