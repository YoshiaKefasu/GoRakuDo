# Validate Story Draft

## Purpose
Validate a story draft to ensure it meets quality standards and is ready for implementation.

## Input
- Story file path (e.g., `docs/stories/01.02.stars-animation-module.md`)

## Process

### 1. Load Core Configuration
```bash
# Load core configuration
source .bmad-core/core-config.yaml
```

### 2. Template Completeness Validation
- [ ] Check if story follows template structure
- [ ] Verify all required sections are present
- [ ] Ensure no unfilled placeholders remain
- [ ] Validate formatting and markdown syntax

### 3. File Structure and Source Tree Validation
- [ ] Verify file paths are clear and accurate
- [ ] Check source tree relevance to project structure
- [ ] Ensure directory structure is properly located
- [ ] Validate file naming conventions

### 4. Technical Specification Validation
- [ ] Review technical requirements for clarity
- [ ] Check implementation feasibility
- [ ] Verify technology stack compatibility
- [ ] Assess performance considerations

### 5. Acceptance Criteria Validation
- [ ] Ensure criteria are specific and measurable
- [ ] Verify criteria cover all functional requirements
- [ ] Check for non-functional requirements
- [ ] Validate testability of criteria

### 6. Risk Assessment Validation
- [ ] Review identified risks and mitigation strategies
- [ ] Check rollback procedures completeness
- [ ] Verify error handling approaches
- [ ] Assess security considerations

### 7. Dependencies Validation
- [ ] Identify and validate story dependencies
- [ ] Check prerequisite stories completion
- [ ] Verify integration points
- [ ] Assess impact on existing functionality

### 8. Implementation Readiness Assessment
- [ ] Evaluate story complexity
- [ ] Check resource requirements
- [ ] Assess timeline feasibility
- [ ] Verify team capability

## Output
- Validation report with findings
- Recommendations for improvements
- Go/No-Go decision for implementation
- Next steps and action items

## Validation Checklist

### ✅ Template Compliance
- [ ] Status section present and accurate
- [ ] Story description clear and complete
- [ ] Acceptance criteria specific and measurable
- [ ] Tasks/subtasks well-defined
- [ ] Dev notes comprehensive
- [ ] Change log maintained
- [ ] QA results documented

### ✅ Technical Feasibility
- [ ] Requirements are implementable
- [ ] Technology stack compatible
- [ ] Performance requirements realistic
- [ ] Security considerations addressed
- [ ] Accessibility requirements included

### ✅ Risk Management
- [ ] Risks identified and assessed
- [ ] Mitigation strategies defined
- [ ] Rollback procedures documented
- [ ] Error handling approaches clear
- [ ] Testing strategies outlined

### ✅ Dependencies
- [ ] Prerequisite stories identified
- [ ] Integration points defined
- [ ] Impact on existing code assessed
- [ ] Resource requirements clear

## Commands

### Validate Story Draft
```bash
validate-story-draft {story-file-path}
```

### Example Usage
```bash
validate-story-draft docs/stories/01.02.stars-animation-module.md
```

## Success Criteria
- Story passes all validation checks
- No critical issues identified
- Implementation plan is clear
- Team is ready to proceed
- Risks are manageable

## Error Handling
- If validation fails, provide specific feedback
- Suggest improvements and alternatives
- Escalate to stakeholders if needed
- Document lessons learned

## Notes
- Validation should be thorough but efficient
- Focus on implementation readiness
- Consider team capacity and timeline
- Maintain quality standards
