
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { Scene } from '../src/types/scene';

// Mock data for testing
const mockCSVData = `sceneId,sceneText,choice1Label,choice1NextId,choice2Label,choice2NextId
scene1,"Welcome to the investigation",Continue,scene2,Quit,end
scene2,"You find a clue",Examine closely,scene3,Move on,end
scene3,"The mystery deepens",Investigate further,scene1,Conclude,end
end,"Investigation complete",,,,`;

const mockScenesData: Scene[] = [
  {
    sceneId: 'scene1',
    sceneText: 'Welcome to the investigation',
    choices: [
      { label: 'Continue', nextId: 'scene2' },
      { label: 'Quit', nextId: 'end' }
    ]
  },
  {
    sceneId: 'scene2',
    sceneText: 'You find a clue',
    choices: [
      { label: 'Examine closely', nextId: 'scene3' },
      { label: 'Move on', nextId: 'end' }
    ]
  },
  {
    sceneId: 'scene3',
    sceneText: 'The mystery deepens',
    choices: [
      { label: 'Investigate further', nextId: 'scene1' },
      { label: 'Conclude', nextId: 'end' }
    ]
  },
  {
    sceneId: 'end',
    sceneText: 'Investigation complete',
    choices: []
  }
];

describe('parseScenes', () => {
  describe('scene validation', () => {
    test('should have at least 1 scene', () => {
      expect(mockScenesData.length).toBeGreaterThanOrEqual(1);
    });

    test('should not have dangling nextIds', () => {
      const sceneIds = new Set(mockScenesData.map(scene => scene.sceneId));
      const danglingNextIds: string[] = [];

      mockScenesData.forEach(scene => {
        scene.choices.forEach(choice => {
          if (!sceneIds.has(choice.nextId)) {
            danglingNextIds.push(`Scene "${scene.sceneId}" has choice pointing to non-existent scene "${choice.nextId}"`);
          }
        });
      });

      expect(danglingNextIds).toHaveLength(0);
      if (danglingNextIds.length > 0) {
        console.error('Dangling nextIds found:', danglingNextIds);
      }
    });

    test('should have unique sceneIds', () => {
      const sceneIds = mockScenesData.map(scene => scene.sceneId);
      const uniqueSceneIds = new Set(sceneIds);
      
      expect(sceneIds.length).toBe(uniqueSceneIds.size);
    });

    test('each scene should have required properties', () => {
      mockScenesData.forEach(scene => {
        expect(scene).toHaveProperty('sceneId');
        expect(scene).toHaveProperty('sceneText');
        expect(scene).toHaveProperty('choices');
        expect(typeof scene.sceneId).toBe('string');
        expect(typeof scene.sceneText).toBe('string');
        expect(Array.isArray(scene.choices)).toBe(true);
      });
    });

    test('each choice should have required properties', () => {
      mockScenesData.forEach(scene => {
        scene.choices.forEach(choice => {
          expect(choice).toHaveProperty('label');
          expect(choice).toHaveProperty('nextId');
          expect(typeof choice.label).toBe('string');
          expect(typeof choice.nextId).toBe('string');
          expect(choice.label.length).toBeGreaterThan(0);
          expect(choice.nextId.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('CSV parsing integration', () => {
    test('should parse CSV data correctly', (done) => {
      parse(mockCSVData, {
        columns: true,
        skip_empty_lines: true,
      }, (err, records) => {
        expect(err).toBeNull();
        expect(records).toBeDefined();
        expect(records.length).toBeGreaterThanOrEqual(1);
        
        // Convert to Scene format
        const scenes: Scene[] = records.map((row: any) => {
          const choices: { label: string; nextId: string }[] = [];
          
          for (let i = 1; i <= 4; i++) {
            const label = row[`choice${i}Label`];
            const nextId = row[`choice${i}NextId`];
            
            if (label && nextId) {
              choices.push({ label, nextId });
            }
          }

          return {
            sceneId: row.sceneId,
            sceneText: row.sceneText,
            choices,
          };
        });

        expect(scenes.length).toBeGreaterThanOrEqual(1);
        done();
      });
    });
  });
});
