import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';

export default function loadJson5(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON5.parse(fileContents);
}
