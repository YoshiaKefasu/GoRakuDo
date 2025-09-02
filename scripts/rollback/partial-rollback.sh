#!/bin/bash

# ========== PARTIAL ROLLBACK SCRIPT ==========
# Rollback specific components if only certain parts need restoration

set -e

echo "🔄 PARTIAL ROLLBACK INITIATED"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to rollback specific file
rollback_file() {
    local component=$1
    local backup_file=$2
    local target_file=$3

    echo -e "${YELLOW}🔄 Rolling back${NC} $component..."

    # Check backup
    BACKUP_DIR="backup/old-seo-system"
    if [ ! -d "$BACKUP_DIR" ]; then
        echo -e "${RED}❌ Backup directory not found${NC}"
        return 1
    fi

    LATEST_BACKUP=$(ls -t "$BACKUP_DIR" | head -1)
    BACKUP_PATH="$BACKUP_DIR/$LATEST_BACKUP/$backup_file"

    if [ -f "$BACKUP_PATH" ]; then
        cp "$BACKUP_PATH" "$target_file"
        echo -e "${GREEN}✅ Restored${NC} $target_file"
    else
        echo -e "${RED}❌ Backup not found${NC} $BACKUP_PATH"
        return 1
    fi

    # Revert git changes
    git checkout HEAD~1 -- "$target_file" 2>/dev/null || echo "Could not revert git changes"
}

# Usage examples
case "$1" in
    "seo-optimizer")
        rollback_file "SEO Optimizer" "seo-optimizer.ts" "src/utils/ai/seo-optimizer.ts"
        ;;
    "metadata-loader")
        rollback_file "Metadata Loader" "metadata-loader.ts" "src/utils/metadata-loader.ts"
        ;;
    "base-integration")
        rollback_file "Base Integration Types" "base-integration.ts" "src/types/base-integration.ts"
        ;;
    "fallback-system")
        rollback_file "Fallback System Types" "fallback-system.ts" "src/types/fallback-system.ts"
        ;;
    "metadata-input")
        rollback_file "Metadata Input Types" "metadata-input.ts" "src/types/metadata-input.ts"
        ;;
    "seo-connector")
        git checkout HEAD~1 -- "src/utils/base-integration/seo-connector.ts"
        echo -e "${GREEN}✅ Reverted${NC} seo-connector.ts"
        ;;
    "data-flow-builder")
        git checkout HEAD~1 -- "src/utils/base-integration/data-flow-builder.ts"
        echo -e "${GREEN}✅ Reverted${NC} data-flow-builder.ts"
        ;;
    "ai-system")
        git checkout HEAD~1 -- "src/utils/ai/ai-system.ts"
        echo -e "${GREEN}✅ Reverted${NC} ai-system.ts"
        ;;
    *)
        echo "Usage: $0 {seo-optimizer|metadata-loader|base-integration|fallback-system|metadata-input|seo-connector|data-flow-builder|ai-system}"
        echo ""
        echo "Available rollback options:"
        echo "  seo-optimizer     - Rollback SEO optimizer component"
        echo "  metadata-loader    - Rollback metadata loader component"
        echo "  base-integration  - Rollback base integration types"
        echo "  fallback-system   - Rollback fallback system types"
        echo "  metadata-input    - Rollback metadata input types"
        echo "  seo-connector     - Revert seo-connector changes"
        echo "  data-flow-builder - Revert data-flow-builder changes"
        echo "  ai-system         - Revert ai-system changes"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 PARTIAL ROLLBACK COMPLETED${NC}"
