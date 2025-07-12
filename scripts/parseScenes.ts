
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
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
