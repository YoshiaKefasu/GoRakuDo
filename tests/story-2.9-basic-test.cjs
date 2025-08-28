// Basic test for Story 2.9 - CommonJS version
const fs = require('fs');
const path = require('path');

console.log('🧪 Running Story 2.9 Basic Tests (CommonJS)');
console.log('='.repeat(60));

const toolsFilePath = path.join(__dirname, '..', 'src', 'pages', 'tools.astro');

let passed = 0;
let failed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`✅ ${message}`);
    return true;
  } else {
    failed++;
    console.log(`❌ ${message}`);
    return false;
  }
}

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Test 1: File exists
const fileExists = fs.existsSync(toolsFilePath);
assert(fileExists, 'Tools page file exists');

if (!fileExists) {
  console.log('❌ Cannot continue tests - tools.astro file not found');
  process.exit(1);
}

// Test 2: Read file content
let content;
try {
  content = fs.readFileSync(toolsFilePath, 'utf8');
  assert(true, 'Successfully read tools.astro file');
} catch (error) {
  assert(false, `Failed to read tools.astro file: ${error.message}`);
  process.exit(1);
}

// Test 3: Tools array exists
assert(content.includes('const tools = ['), 'Tools array declaration found');

// Test 4: Required tool IDs exist
assert(content.includes('id: "anki"'), 'Anki tool ID found');
assert(content.includes('id: "yomitan"'), 'Yomitan tool ID found (updated from yomichan)');
assert(content.includes('id: "migaku"'), 'Migaku tool ID found');

// Test 5: Old tool ID is not present
assert(!content.includes('id: "yomichan"'), 'Old yomichan ID removed');

// Test 6: New link paths exist
assert(content.includes('link: "/tools/anki"'), 'Anki link updated to new path');
assert(content.includes('link: "/tools/yomitan"'), 'Yomitan link updated to new path');
assert(content.includes('link: "/tools/migaku"'), 'Migaku link updated to new path');

// Test 7: Old link paths are not present
assert(!content.includes('link: "/docs/anki-guide"'), 'Old Anki link path removed');
assert(!content.includes('link: "/docs/yomichan-guide"'), 'Old Yomichan link path removed');
assert(!content.includes('link: "/docs/migaku-guide"'), 'Old Migaku link path removed');

// Test 8: Dynamic routing template exists
assert(content.includes('href={tool.link}'), 'Dynamic link template found');
assert(content.includes('tools.map((tool)'), 'Tools mapping function found');

// Test 9: Preload links updated
assert(content.includes('"/tools/anki"'), 'Anki preload link updated');
assert(content.includes('"/tools/yomitan"'), 'Yomitan preload link updated');
assert(content.includes('"/tools/migaku"'), 'Migaku preload link updated');

// Test 10: File size is reasonable
const stats = fs.statSync(toolsFilePath);
const fileSizeKB = stats.size / 1024;
assert(fileSizeKB < 100, `File size is reasonable (${fileSizeKB.toFixed(2)}KB < 100KB)`);

// Test 11: HTML structure preserved
assert(content.includes('class="main-content'), 'Main content structure preserved');
assert(content.includes('class="tools-grid'), 'Tools grid structure preserved');
assert(content.includes('<Navbar client:visible />'), 'Navbar component preserved');

// Generate report
const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

const report = `
╔══════════════════════════════════════════════════════════════╗
║                STORY 2.9 BASIC TEST REPORT                   ║
╠══════════════════════════════════════════════════════════════╣
║ Total Tests: ${total}                                                  ║
║ Passed: ${passed} ✅                                                    ║
║ Failed: ${failed} ${failed > 0 ? '❌' : '✅'}                                                     ║
║ Success Rate: ${successRate}%                                              ║
╚══════════════════════════════════════════════════════════════╝

🎯 STORY 2.9 VALIDATION: ${failed === 0 ? 'PASSED ✅' : 'FAILED ❌'}
`;

console.log('\n' + report);

if (failed === 0) {
  console.log('🎉 ALL TESTS PASSED! Story 2.9 validation successful.');
  process.exit(0);
} else {
  console.log(`⚠️ ${failed} tests failed. Please review the issues above.`);
  process.exit(1);
}
