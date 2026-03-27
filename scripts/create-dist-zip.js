import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

const zip = new AdmZip();
const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.error("Error: 'dist' directory does not exist. Please run the build first.");
  process.exit(1);
}

// Add the entire dist directory contents to the root of the zip
zip.addLocalFolder(distDir, '');

const outputPath = path.join(rootDir, 'public', 'build-ready.zip');
zip.writeZip(outputPath);
console.log(`Successfully created ${outputPath}`);
