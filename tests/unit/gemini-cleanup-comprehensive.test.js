/**
 * @jest-environment jsdom
 * 
 * Story 4D完了後の最終クリーンアップ済みテストファイル
 * DRY + KISS原則に従い、実際のプロジェクト状態に合致するテストのみを実行
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

describe('Story 4D: Final Cleanup Validation', () => {
  describe('Package Dependencies Check', () => {
    test('package.json should not include @google/genai', () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      expect(pkg.dependencies || {}).not.toHaveProperty('@google/genai');
      expect(pkg.devDependencies || {}).not.toHaveProperty('@google/genai');
    });

    test('should contain essential dependencies', () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      expect(pkg.dependencies).toHaveProperty('astro');
      expect(pkg.dependencies).toHaveProperty('vue');
      expect(pkg.dependencies).toHaveProperty('typescript');
    });
  });

  describe('Environment Variables Check', () => {
    test('env.example should not contain GOOGLE_API_KEY or GOOGLE_MODEL', () => {
      const env = fs.readFileSync('env.example', 'utf8');
      expect(env).not.toContain('GOOGLE_API_KEY');
      expect(env).not.toContain('GOOGLE_MODEL');
      expect(env).not.toContain('your_api_key_here');
      expect(env).not.toContain('gemini-2.5-flash');
    });

    test('should contain essential environment variables', () => {
      const env = fs.readFileSync('env.example', 'utf8');
      expect(env).toContain('NODE_ENV');
      expect(env).toContain('development');
    });
  });

  describe('Project Structure Validation', () => {
    test('should have required core directories', () => {
      const requiredDirs = ['src', 'tests', 'docs'];
      
      requiredDirs.forEach(dir => {
        expect(fs.existsSync(dir)).toBe(true);
      });
    });

    test('src should not contain Gemini/Google GenAI references', () => {
      const searchRoot = path.join(process.cwd(), 'src');
      if (!fs.existsSync(searchRoot)) return;

      const exclude = ['dist/'];
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

  describe('Cleanup Completion Validation', () => {
    test('should not contain old test execution files', () => {
      const rootFiles = fs.readdirSync('.');
      expect(rootFiles).not.toContain('test-phase5-execution.js');
      expect(rootFiles).not.toContain('test-phase5-execution.mjs');
    });

    test('should not contain unnecessary log files', () => {
      const rootFiles = fs.readdirSync('.');
      expect(rootFiles).not.toContain('gemini-removal-monitor.log');
    });

    test('should have clean backup structure', () => {
      if (fs.existsSync('backups')) {
        const backupDirs = fs.readdirSync('backups');
        expect(backupDirs).not.toContain('test-restore');
        expect(backupDirs).not.toContain('backup-report-2025-08-30T23-57-24-553Z.json');
        expect(backupDirs).not.toContain('final-validation-report-1756599468977.json');
      }
    });
  });

  describe('Test Integration Validation', () => {
    test('should contain integrated test file', () => {
      const testFiles = fs.readdirSync('tests/unit');
      expect(testFiles).toContain('gemini-cleanup-comprehensive.test.js');
    });

    test('should preserve essential test infrastructure', () => {
      const testFiles = fs.readdirSync('tests');
      expect(testFiles).toContain('run-tests.js');
      expect(testFiles).toContain('setup.js');
      expect(testFiles).toContain('jest.config.js');
    });
  });

  describe('Story 4D Completion Validation', () => {
    test('should be ready for epic transition', () => {
      // Story 4D完了の最終確認
      const hasCleanStructure = !fs.existsSync('test-phase5-execution.js') && 
                               !fs.existsSync('test-phase5-execution.mjs') &&
                               !fs.existsSync('gemini-removal-monitor.log');
      
      const hasIntegratedTests = fs.existsSync('tests/unit/gemini-cleanup-comprehensive.test.js');
      const hasEssentialDeps = fs.existsSync('package.json') && fs.existsSync('astro.config.mjs');
      
      expect(hasCleanStructure).toBe(true);
      expect(hasIntegratedTests).toBe(true);
      expect(hasEssentialDeps).toBe(true);
    });
  });
});
