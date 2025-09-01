/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

function getAllFiles(dir, excludeDirs = []) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (!excludeDirs.some((ex) => full.replace(/\\/g, '/').includes(ex))) {
        results.push(...getAllFiles(full, excludeDirs));
      }
    } else {
      results.push(full);
    }
  }
  return results;
}

describe('Gemini leftovers cleanup', () => {
  test('package.json should not include @google/genai', () => {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    expect(pkg.dependencies || {}).not.toHaveProperty('@google/genai');
    expect(pkg.devDependencies || {}).not.toHaveProperty('@google/genai');
  });

  test('env.example should not contain GOOGLE_API_KEY or GOOGLE_MODEL', () => {
    const env = fs.readFileSync('env.example', 'utf8');
    expect(env).not.toContain('GOOGLE_API_KEY');
    expect(env).not.toContain('GOOGLE_MODEL');
  });

  test('src (excluding monitoring) should not contain Gemini/Google GenAI references', () => {
    const searchRoot = path.join(process.cwd(), 'src');
    if (!fs.existsSync(searchRoot)) return; // pass if src missing

    const exclude = [
      'src/scripts/monitoring/', // exclude monitor by design
      'dist/'
    ];

    const files = getAllFiles(searchRoot, exclude);
    const patterns = [
      '@google/genai',
      'GoogleGenerativeAI',
      'GenerativeModel',
      'VertexAI',
      'GOOGLE_API_KEY',
      'GOOGLE_MODEL',
    ];

    const offenders = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      for (const p of patterns) {
        if (content.includes(p)) {
          offenders.push(`${file} contains: ${p}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});


