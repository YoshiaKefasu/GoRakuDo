# Story 3.0: Core Utils Cleanup - Acceptance Criteria

## Story Overview
Clean unused variables, parameters, and imports in core utility files (ai-content-utils.ts, content-analysis.ts, mind-map-integration.ts) while ensuring no functionality is broken.

## Detailed Acceptance Criteria

### **Pre-Cleanup Verification**
- [x] `npx astro check` shows current warning count for these files
- [x] `npm run build` completes successfully
- [x] Core functionality tests pass (content processing, AI recommendations)

### **Cleanup Targets - ai-content-utils.ts**
**File:** `src/utils/ai-content/ai-content-utils.ts`

**Variables to Remove:**
- [ ] `maxTimePerDay` parameter in function signatures
- [ ] `targetLevel` parameter in function signatures
- [ ] `freshness` parameter in function signatures
- [ ] `intent` parameter in function signatures
- [ ] `features` parameter in function signatures
- [ ] `maxTime` parameter in function signatures
- [ ] `audience` parameter in function signatures
- [ ] `seriesName` parameter in function signatures
- [ ] `currentSlug` parameters (both instances)
- [ ] `level` parameter in function signatures
- [ ] `stage` parameter in function signatures

**Functions to Review:**
- [ ] `getNextLevel()` function - verify if truly unused
- [ ] `getContentByLearningStage()` - ensure logic is preserved
- [ ] `getContentByJLPTLevel()` - ensure logic is preserved
- [ ] `getContentByType()` - ensure logic is preserved

### **Cleanup Targets - content-analysis.ts**
**File:** `src/utils/ai-content/content-analysis.ts`

**Variables to Remove:**
- [ ] `targetAnalysis` parameter in function signatures
- [ ] `customizations` parameters (multiple instances)
- [ ] `MindMapUtils` import if not used

**Functions to Review:**
- [ ] `calculatePositionScore()` function - verify if truly unused
- [ ] `findOptimalSingleLinkPosition()` function - verify if truly unused
- [ ] `applyMindMapCustomizations()` function - verify if truly unused

### **Cleanup Targets - mind-map-integration.ts**
**File:** `src/utils/ai-content/mind-map-integration.ts`

**Variables to Remove:**
- [ ] `branch` variable in forEach loops
- [ ] `relevance` parameter in function signatures
- [ ] `targetAnalysis` parameters (multiple instances)
- [ ] `score` parameter in function signatures
- [ ] `customizations` parameters (multiple instances)
- [ ] `post` parameter in function signatures

**Functions to Review:**
- [ ] `customizedBranches` usage - ensure not accidentally removed
- [ ] Integration methods - verify all are still functional

### **Post-Cleanup Verification**

#### **TypeScript Compliance**
- [ ] `npx astro check` shows reduced warning count for these files
- [ ] No new TypeScript errors introduced
- [ ] No breaking changes to function signatures

#### **Functionality Testing**
- [ ] Content processing pipeline works correctly
- [ ] AI recommendations generation functions properly
- [ ] Mind map integration features intact
- [ ] Search functionality unaffected
- [ ] Build system compiles successfully

#### **Code Quality**
- [ ] Removed code doesn't affect any imports
- [ ] No unused imports remain in cleaned files
- [ ] Code formatting maintained
- [ ] Comments and documentation preserved where relevant

### **Success Metrics**
- [ ] Warning count reduced by minimum 15-20 warnings
- [ ] No runtime errors or functionality regressions
- [ ] Code is more maintainable and cleaner
- [ ] All acceptance criteria met

### **Rollback Plan**
- [ ] Git commit before cleanup for easy rollback
- [ ] Backup of original files available
- [ ] Clear documentation of what was removed

---

## Definition of Done
- [ ] All unused variables, parameters, and imports removed
- [ ] TypeScript warnings reduced for target files
- [ ] All functionality tests pass
- [ ] No breaking changes introduced
- [ ] Code is cleaner and more maintainable
- [ ] Story acceptance criteria fully met
