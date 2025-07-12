
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';
import { Scene } from '../src/types/scene';

interface CSVRow {
  sceneId: string;
  sceneText: string;
  choice1Label?: string;
  choice1NextId?: string;
  choice2Label?: string;
  choice2NextId?: string;
  choice3Label?: string;
  choice3NextId?: string;
  choice4Label?: string;
  choice4NextId?: string;
}

// Zod schemas for validation
const ChoiceSchema = z.object({
  label: z.string().min(1, "Choice label cannot be empty"),
  nextId: z.string().min(1, "Choice nextId cannot be empty")
});

const SceneSchema = z.object({
  sceneId: z.string().min(1, "Scene ID cannot be empty"),
  sceneText: z.string().min(1, "Scene text cannot be empty"),
  choices: z.array(ChoiceSchema)
});

const ScenesArraySchema = z.array(SceneSchema);

function validateScenes(scenes: Scene[]): void {
  // Validate basic structure
  const validationResult = ScenesArraySchema.safeParse(scenes);
  if (!validationResult.success) {
    console.error('Scene structure validation failed:');
    validationResult.error.errors.forEach(error => {
      console.error(`- ${error.path.join('.')}: ${error.message}`);
    });
    process.exit(1);
  }

  // Check for unique sceneIds
  const sceneIds = scenes.map(scene => scene.sceneId);
  const uniqueSceneIds = new Set(sceneIds);
  
  if (sceneIds.length !== uniqueSceneIds.size) {
    const duplicates = sceneIds.filter((id, index) => sceneIds.indexOf(id) !== index);
    console.error('Duplicate scene IDs found:', [...new Set(duplicates)]);
    process.exit(1);
  }

  // Check that every choice.nextId references an existing sceneId
  const invalidReferences: string[] = [];
  
  scenes.forEach(scene => {
    scene.choices.forEach(choice => {
      if (!uniqueSceneIds.has(choice.nextId)) {
        invalidReferences.push(`Scene "${scene.sceneId}" has choice pointing to non-existent scene "${choice.nextId}"`);
      }
    });
  });

  if (invalidReferences.length > 0) {
    console.error('Invalid scene references found:');
    invalidReferences.forEach(error => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log(`✓ Validation passed: ${scenes.length} scenes with unique IDs and valid references`);
}

async function parseScenes() {
  const csvPath = path.join(__dirname, '../data/interface_investigator_scenes_v3.csv');
  const outputPath = path.join(__dirname, '../src/data/scenes.json');

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at: ${csvPath}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  
  parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }, (err, records: CSVRow[]) => {
    if (err) {
      console.error('Error parsing CSV:', err);
      process.exit(1);
    }

    const scenes: Scene[] = records.map((row) => {
      const choices: { label: string; nextId: string }[] = [];

      // Process up to 4 choices
      for (let i = 1; i <= 4; i++) {
        const label = row[`choice${i}Label` as keyof CSVRow] as string;
        const nextId = row[`choice${i}NextId` as keyof CSVRow] as string;
        
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

    // Validate the parsed scenes
    validateScenes(scenes);

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the JSON file
    fs.writeFileSync(outputPath, JSON.stringify(scenes, null, 2));
    console.log(`Successfully converted ${scenes.length} scenes to ${outputPath}`);
  });
}

parseScenes().catch(console.error);
