#!/bin/bash

# ========== ROLLBACK VERIFICATION SCRIPT ==========
# Test rollback procedures and verify system integrity

set -e

echo "🧪 TESTING ROLLBACK PROCEDURES"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0

test_result() {
    local test_name=$1
    local result=$2

    ((TOTAL_TESTS++))
    if [ "$result" -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC} - $test_name"
        ((PASSED_TESTS++))
    else
        echo -e "${RED}❌ FAIL${NC} - $test_name"
    fi
}

echo "Testing rollback script syntax..."
bash -n scripts/rollback/seo-removal-rollback.sh 2>/dev/null
test_result "Emergency rollback script syntax" $?

bash -n scripts/rollback/partial-rollback.sh 2>/dev/null
test_result "Partial rollback script syntax" $?

echo ""
echo "Testing file restoration capability..."

# Test backup directory existence
if [ -d "backup/old-seo-system" ]; then
    test_result "Backup directory exists" 0
else
    test_result "Backup directory exists" 1
fi

# Test backup file existence
BACKUP_FILES=(
    "seo-optimizer.ts"
    "metadata-loader.ts"
    "base-integration.ts"
    "fallback-system.ts"
    "metadata-input.ts"
)

if [ -d "backup/old-seo-system" ]; then
    LATEST_BACKUP=$(ls -t backup/old-seo-system 2>/dev/null | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        BACKUP_PATH="backup/old-seo-system/$LATEST_BACKUP"
        for file in "${BACKUP_FILES[@]}"; do
            if [ -f "$BACKUP_PATH/$file" ]; then
                test_result "Backup exists for $file" 0
            else
                test_result "Backup exists for $file" 1
            fi
        done
    else
        echo -e "${YELLOW}⚠️ No backup files found${NC}"
        for file in "${BACKUP_FILES[@]}"; do
            test_result "Backup exists for $file" 1
        done
    fi
fi

echo ""
echo "Testing git rollback capability..."

# Test git availability
if command -v git >/dev/null 2>&1; then
    test_result "Git is available" 0

    # Test if we're in a git repository
    if git rev-parse --git-dir >/dev/null 2>&1; then
        test_result "In git repository" 0

        # Test git status
        if git status --porcelain | grep -q .; then
            test_result "Has uncommitted changes" 0
        else
            test_result "Has uncommitted changes" 1
        fi
    else
        test_result "In git repository" 1
    fi
else
    test_result "Git is available" 1
fi

echo ""
echo "Testing build system integrity..."

# Test TypeScript compilation
echo -e "${YELLOW}Testing TypeScript compilation...${NC}"
if npx tsc --noEmit >/dev/null 2>&1; then
    test_result "TypeScript compilation" 0
else
    test_result "TypeScript compilation" 1
fi

# Test Astro build
echo -e "${YELLOW}Testing Astro build...${NC}"
if npm run build >/dev/null 2>&1; then
    test_result "Astro build" 0
else
    test_result "Astro build" 1
fi

echo ""
echo "=== ROLLBACK TEST SUMMARY ==="
echo "Total tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $((TOTAL_TESTS - PASSED_TESTS))"

if [ "$PASSED_TESTS" -eq "$TOTAL_TESTS" ]; then
    echo -e "${GREEN}🎉 All rollback tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️ Some rollback tests failed. Please review.${NC}"
    exit 1
fi
