const fs = require('fs');
const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.log('GEMINI_API_KEY not set, skipping injection');
  process.exit(0);
}
const path = 'src/environments/environment.prod.ts';
const content = fs.readFileSync(path, 'utf8')
  .replace('YOUR_GEMINI_API_KEY', key);
fs.writeFileSync(path, content);
console.log('Injected GEMINI_API_KEY into environment.prod.ts');
