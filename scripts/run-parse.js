
const { exec } = require('child_process');
const path = require('path');

// Execute the parseScenes.ts script
exec('npx ts-node scripts/parseScenes.ts', { cwd: process.cwd() }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});
