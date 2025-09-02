#!/bin/bash

# ========== SEO SYSTEM REMOVAL ROLLBACK SCRIPT ==========
# Emergency rollback procedure for Story 2: Old SEO System Complete Removal
# This script restores the old SEO system files and reverts dependency changes

set -e  # Exit on any error

echo "🚨 EMERGENCY ROLLBACK INITIATED"
echo "Restoring Old SEO System Files..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to restore a file
restore_file() {
    local backup_file=$1
    local target_file=$2

    if [ -f "$backup_file" ]; then
        echo -e "${GREEN}✅ Restoring${NC} $target_file"
        cp "$backup_file" "$target_file"
    else
        echo -e "${RED}❌ Backup not found${NC} $backup_file"
        return 1
    fi
}

# Function to revert git changes
revert_git_changes() {
    local file=$1
    echo -e "${YELLOW}🔄 Reverting git changes${NC} for $file"

    # Check if file has uncommitted changes
    if git diff --quiet "$file" 2>/dev/null; then
        echo "No uncommitted changes for $file"
    else
        git checkout HEAD~1 -- "$file" 2>/dev/null || echo "Could not revert $file"
    fi
}

# Check if backup directory exists
BACKUP_DIR="backup/old-seo-system"
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}❌ Backup directory not found: $BACKUP_DIR${NC}"
    echo "Cannot proceed with rollback. Manual restoration required."
    exit 1
fi

# Find the latest backup
LATEST_BACKUP=$(ls -t "$BACKUP_DIR" | head -1)
if [ -z "$LATEST_BACKUP" ]; then
    echo -e "${RED}❌ No backup files found in $BACKUP_DIR${NC}"
    exit 1
fi

BACKUP_PATH="$BACKUP_DIR/$LATEST_BACKUP"
echo "Using backup: $BACKUP_PATH"

# Step 1: Restore old SEO system files
echo ""
echo "📁 Step 1: Restoring Old SEO System Files"

# Restore seo-optimizer.ts
restore_file "$BACKUP_PATH/seo-optimizer.ts" "src/utils/ai/seo-optimizer.ts"

# Restore metadata-loader.ts
restore_file "$BACKUP_PATH/metadata-loader.ts" "src/utils/metadata-loader.ts"

# Restore base-integration.ts
restore_file "$BACKUP_PATH/base-integration.ts" "src/types/base-integration.ts"

# Restore fallback-system.ts
restore_file "$BACKUP_PATH/fallback-system.ts" "src/types/fallback-system.ts"

# Restore metadata-input.ts
restore_file "$BACKUP_PATH/metadata-input.ts" "src/types/metadata-input.ts"

# Step 2: Revert dependency changes
echo ""
echo "🔄 Step 2: Reverting Dependency Changes"

# Revert seo-connector.ts
revert_git_changes "src/utils/base-integration/seo-connector.ts"

# Revert data-flow-builder.ts
revert_git_changes "src/utils/base-integration/data-flow-builder.ts"

# Revert ai-system.ts
revert_git_changes "src/utils/ai/ai-system.ts"

# Revert ai/index.ts (remove SEOOptimizer export)
revert_git_changes "src/utils/ai/index.ts"

# Revert docs/[slug].astro
revert_git_changes "src/pages/docs/[slug].astro"

# Step 3: Clean up new files
echo ""
echo "🧹 Step 3: Cleaning Up New Files"

# Remove new metadata-loader (keep the old one)
if [ -f "src/utils/new-seo-system/metadata-loader.ts" ]; then
    echo -e "${YELLOW}🗑️ Removing${NC} new metadata-loader.ts"
    rm "src/utils/new-seo-system/metadata-loader.ts"
fi

# Step 4: Verification
echo ""
echo "🔍 Step 4: Verification"

echo "Checking restored files..."
for file in \
    "src/utils/ai/seo-optimizer.ts" \
    "src/utils/metadata-loader.ts" \
    "src/types/base-integration.ts" \
    "src/types/fallback-system.ts" \
    "src/types/metadata-input.ts"
do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ Found${NC} $file"
    else
        echo -e "${RED}❌ Missing${NC} $file"
    fi
done

# Step 5: Build verification
echo ""
echo "🔨 Step 5: Build Verification"

echo "Running TypeScript check..."
if npx tsc --noEmit 2>/dev/null; then
    echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
else
    echo -e "${RED}❌ TypeScript compilation failed${NC}"
fi

echo "Running Astro build..."
if npm run build 2>/dev/null; then
    echo -e "${GREEN}✅ Astro build successful${NC}"
else
    echo -e "${RED}❌ Astro build failed${NC}"
fi

echo ""
echo -e "${GREEN}🎉 ROLLBACK COMPLETED${NC}"
echo "The old SEO system has been restored."
echo "Please verify the application functionality before proceeding."
