import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

const zip = new AdmZip();
const rootDir = process.cwd();

function addDirectoryToZip(dirPath, zipPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const relativePath = path.join(zipPath, file);
    
    // Ignore node_modules, dist, .git, and the zip file itself
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === 'source-code.zip') {
      continue;
    }

    if (fs.statSync(fullPath).isDirectory()) {
      addDirectoryToZip(fullPath, relativePath);
    } else {
      zip.addLocalFile(fullPath, zipPath);
    }
  }
}

addDirectoryToZip(rootDir, '');

const outputPath = path.join(rootDir, 'public', 'source-code.zip');
zip.writeZip(outputPath);
console.log(`Successfully created ${outputPath}`);
