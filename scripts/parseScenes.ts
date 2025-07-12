import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';
import { Scene } from '../src/types/scene';

interface CSVRow {
  scene_id: string;
  scene_text: string;
  choiceA?: string;
  nextA?: string;
  choiceB?: string;
  nextB?: string;
  choiceC?: string;
  nextC?: string;
  choiceD?: string;
  nextD?: string;
  choiceE?: string;
  nextE?: string;
  choiceF?: string;
  nextF?: string;
  choiceG?: string;
  nextG?: string;
  choiceH?: string;
  nextH?: string;
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

      // Process up to 8 choices (A through H)
      const choiceLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      
      choiceLetters.forEach(letter => {
        const label = row[`choice${letter}` as keyof CSVRow] as string;
        const nextId = row[`next${letter}` as keyof CSVRow] as string;
        
        if (label && nextId) {
          choices.push({ label, nextId });
        }
      });

      return {
        sceneId: row.scene_id,
        sceneText: row.scene_text,
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
