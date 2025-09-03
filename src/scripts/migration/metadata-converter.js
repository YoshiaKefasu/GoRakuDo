/**
 * Metadata Converter Script
 * Converts existing metadata to manual input system format
 * Follows DRY and KISS principles
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract metadata from markdown file (DRY principle - reusable function)
 */
function extractMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontMatterMatch) {
      return null;
    }

    const frontMatter = frontMatterMatch[1];
    const metadata = {};

    // Simple parsing (KISS principle - straightforward approach)
    frontMatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        // Handle quoted strings and arrays
        if (value.startsWith('"') && value.endsWith('"')) {
          metadata[key.trim()] = value.slice(1, -1);
        } else if (value.startsWith('[') && value.endsWith(']')) {
          metadata[key.trim()] = value
            .slice(1, -1)
            .split(',')
            .map(s => s.trim().replace(/"/g, ''));
        } else {
          metadata[key.trim()] = value;
        }
      }
    });

    return metadata;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Convert metadata to manual input format (DRY principle - reusable function)
 */
function convertToManualFormat(metadata) {
  // KISS principle - simple conversion without over-engineering
  return {
    title: metadata.title || '',
    description: metadata.description || '',
    publishedDate: metadata.publishedDate || '',
    readTime: metadata.readTime || 0,
    author: metadata.author || '',
    emoji: metadata.emoji || '',
    difficulty: metadata.difficulty || '',
    category: metadata.category || '',
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    featured: metadata.featured || false,
    contentType: metadata.contentType || 'article',
  };
}

/**
 * Process all content files (DRY principle - batch processing)
 */
function processAllContentFiles() {
  const contentDir = path.join(process.cwd(), 'src', 'content');
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

  const results = [];

  files.forEach(file => {
    const filePath = path.join(contentDir, file);
    const metadata = extractMetadata(filePath);

    if (metadata) {
      const converted = convertToManualFormat(metadata);
      results.push({
        file,
        originalMetadata: metadata,
        convertedMetadata: converted,
      });
    }
  });

  return results;
}

/**
 * Generate migration report (DRY principle - reusable reporting)
 */
function generateMigrationReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: results.length,
    successfulConversions: results.length,
    failedConversions: 0,
    metadataSummary: {},
  };

  // Simple summary (KISS principle)
  results.forEach(result => {
    const category = result.convertedMetadata.category || 'uncategorized';
    report.metadataSummary[category] =
      (report.metadataSummary[category] || 0) + 1;
  });

  return report;
}

/**
 * Main execution function (DRY principle - single entry point)
 */
function main() {
  console.log('Starting metadata conversion...');

  try {
    const results = processAllContentFiles();
    const report = generateMigrationReport(results);

    // Save report (DRY principle - consistent file handling)
    const reportPath = path.join(
      process.cwd(),
      'backups',
      `migration-report-${Date.now()}.json`
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`Conversion completed: ${results.length} files processed`);
    console.log(`Report saved to: ${reportPath}`);

    return results;
  } catch (error) {
    console.error('Migration failed:', error.message);
    return null;
  }
}

// Export for testing (DRY principle - reusable modules)
export {
  extractMetadata,
  convertToManualFormat,
  processAllContentFiles,
  generateMigrationReport,
  main,
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
