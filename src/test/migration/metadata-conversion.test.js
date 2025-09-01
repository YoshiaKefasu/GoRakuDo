/**
 * Metadata Conversion Tests
 * Tests the metadata converter script functionality
 * Follows DRY and KISS principles
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DRY principle - import from the actual converter
import {
  extractMetadata,
  convertToManualFormat,
  processAllContentFiles,
  generateMigrationReport
} from '../../scripts/migration/metadata-converter.js';

/**
 * Test helper functions (DRY principle - reusable test utilities)
 */
function createTestFile(content, filename = 'test.md') {
  const testDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  const filePath = path.join(testDir, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

function cleanupTestFiles() {
  const testDir = path.join(__dirname, 'temp');
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
}

/**
 * Test suite for metadata extraction (KISS principle - simple test cases)
 */
describe('Metadata Extraction', () => {
  afterEach(cleanupTestFiles);
  
  test('should extract basic metadata from frontmatter', () => {
    const content = `---
title: "Test Title"
description: "Test Description"
tags: ["tag1", "tag2"]
---
# Content here`;
    
    const filePath = createTestFile(content);
    const metadata = extractMetadata(filePath);
    
    expect(metadata).toBeTruthy();
    expect(metadata.title).toBe('Test Title');
    expect(metadata.description).toBe('Test Description');
    expect(metadata.tags).toEqual(['tag1', 'tag2']);
  });
  
  test('should handle files without frontmatter', () => {
    const content = `# No frontmatter here
Just content`;
    
    const filePath = createTestFile(content);
    const metadata = extractMetadata(filePath);
    
    expect(metadata).toBeNull();
  });
  
  test('should handle quoted strings and arrays correctly', () => {
    const content = `---
title: "Complex Title with : colon"
tags: ["tag1", "tag2", "tag3"]
featured: true
---
# Content`;
    
    const filePath = createTestFile(content);
    const metadata = extractMetadata(filePath);
    
    expect(metadata.title).toBe('Complex Title with : colon');
    expect(metadata.tags).toEqual(['tag1', 'tag2', 'tag3']);
    expect(metadata.featured).toBe('true');
  });
});

/**
 * Test suite for metadata conversion (KISS principle - straightforward validation)
 */
describe('Metadata Conversion', () => {
  test('should convert metadata to manual input format', () => {
    const originalMetadata = {
      title: 'Test Title',
      description: 'Test Description',
      tags: ['tag1', 'tag2'],
      featured: true
    };
    
    const converted = convertToManualFormat(originalMetadata);
    
    expect(converted.title).toBe('Test Title');
    expect(converted.description).toBe('Test Description');
    expect(converted.tags).toEqual(['tag1', 'tag2']);
    expect(converted.featured).toBe(true);
  });
  
  test('should provide default values for missing fields', () => {
    const originalMetadata = {
      title: 'Test Title'
    };
    
    const converted = convertToManualFormat(originalMetadata);
    
    expect(converted.title).toBe('Test Title');
    expect(converted.description).toBe('');
    expect(converted.tags).toEqual([]);
    expect(converted.featured).toBe(false);
    expect(converted.contentType).toBe('article');
  });
});

/**
 * Test suite for batch processing (DRY principle - test the main workflow)
 */
describe('Batch Processing', () => {
  beforeEach(() => {
    // Create test content directory structure
    const testContentDir = path.join(__dirname, 'temp-content');
    if (!fs.existsSync(testContentDir)) {
      fs.mkdirSync(testContentDir, { recursive: true });
    }
    
    // Create test files
    const files = [
      {
        name: 'file1.md',
        content: `---
title: "File 1"
category: "test"
---
# Content 1`
      },
      {
        name: 'file2.md',
        content: `---
title: "File 2"
category: "test"
---
# Content 2`
      }
    ];
    
    files.forEach(file => {
      fs.writeFileSync(path.join(testContentDir, file.name), file.content);
    });
  });
  
  afterEach(() => {
    const testContentDir = path.join(__dirname, 'temp-content');
    if (fs.existsSync(testContentDir)) {
      fs.rmSync(testContentDir, { recursive: true, force: true });
    }
  });
  
  test('should process multiple files correctly', () => {
    // Mock the content directory for testing
    const originalCwd = process.cwd();
    process.chdir(path.join(__dirname, 'temp-content'));
    
    try {
      const results = processAllContentFiles();
      
      expect(results).toHaveLength(2);
      expect(results[0].file).toBe('file1.md');
      expect(results[1].file).toBe('file2.md');
      
      results.forEach(result => {
        expect(result.originalMetadata).toBeTruthy();
        expect(result.convertedMetadata).toBeTruthy();
        expect(result.convertedMetadata.title).toMatch(/File \d/);
      });
    } finally {
      process.chdir(originalCwd);
    }
  });
});

/**
 * Test suite for report generation (KISS principle - simple output validation)
 */
describe('Report Generation', () => {
  test('should generate migration report with correct structure', () => {
    const mockResults = [
      {
        file: 'file1.md',
        convertedMetadata: { category: 'test' }
      },
      {
        file: 'file2.md',
        convertedMetadata: { category: 'test' }
      },
      {
        file: 'file3.md',
        convertedMetadata: { category: 'other' }
      }
    ];
    
    const report = generateMigrationReport(mockResults);
    
    expect(report.totalFiles).toBe(3);
    expect(report.successfulConversions).toBe(3);
    expect(report.failedConversions).toBe(0);
    expect(report.metadataSummary.test).toBe(2);
    expect(report.metadataSummary.other).toBe(1);
    expect(report.timestamp).toBeTruthy();
  });
});

/**
 * Integration test (DRY principle - test the complete workflow)
 */
describe('Integration Tests', () => {
  test('should handle real content files without errors', () => {
    // This test validates that our converter can handle actual content
    const contentDir = path.join(process.cwd(), 'src', 'content');
    
    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
      
      if (files.length > 0) {
        // Test with first file
        const firstFile = path.join(contentDir, files[0]);
        const metadata = extractMetadata(firstFile);
        
        if (metadata) {
          const converted = convertToManualFormat(metadata);
          
          // Basic validation (KISS principle - simple checks)
          expect(converted).toBeTruthy();
          expect(typeof converted.title).toBe('string');
          expect(Array.isArray(converted.tags)).toBe(true);
        }
      }
    }
  });
});
