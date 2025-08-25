# Background Animation Modularization - Brownfield Enhancement

## Epic Goal

Extract the wave animation and stars background from the homepage into separate, reusable JavaScript modules with customizable configuration, enabling each page to have different background animations while maintaining code reusability and reducing duplication.

## Epic Description

**Existing System Context:**

- Current relevant functionality: Homepage (`src/pages/index.astro`) contains inline wave animation canvas and stars background elements
- Technology stack: Astro Framework, Vue components, Tailwind CSS v4.1, deployed on GitHub Pages with Astro SSG
- Integration points: Canvas element (`#waveCanvas`), stars div container, existing script loading patterns in `index.astro`

**Enhancement Details:**

- What's being added/changed: Extract animation logic into modular JS files with configuration system
- How it integrates: Import modules in page components and initialize with page-specific configuration
- Success criteria: All pages can use different background animations, code is reusable, no performance regression

## Stories

1. **Story 01.01:** Extract wave animation to separate module with configuration system
2. **Story 01.02:** Extract stars animation to separate module with configuration system  
3. **Story 01.03:** Update homepage to use new modules and create configuration examples

## Compatibility Requirements

- [ ] Existing homepage functionality remains unchanged
- [ ] Animation performance maintains current levels
- [ ] Script loading patterns follow existing project structure
- [ ] Astro SSG deployment continues to work correctly

## Risk Mitigation

- **Primary Risk:** Breaking existing homepage animations during extraction
- **Mitigation:** Implement modules alongside existing code, test thoroughly before removal
- **Rollback Plan:** Keep original inline code as backup, can revert to original implementation if needed

## Definition of Done

- [ ] Wave animation module created and tested
- [ ] Stars animation module created and tested
- [ ] Configuration system implemented and documented
- [ ] Homepage updated to use new modules
- [ ] No regression in existing functionality
- [ ] Performance benchmarks maintained
- [ ] Documentation updated with usage examples

## Technical Specifications

### Module Structure
```
src/scripts/ui/background-animations/
├── wave-animation.js
├── stars-animation.js
├── configs/
│   ├── homepage-config.js
│   └── default-config.js
└── index.js
```

### Configuration Interface
```javascript
// Example configuration structure matching existing 4-wave system
const animationConfig = {
  wave: {
    enabled: true,
    waves: [
      {
        amplitude: 40,
        frequency: 0.01,
        speed: 0.02,
        offset: 0,
        color: "rgba(139, 93, 255, 0.08)",
        y: 0.7,
      },
      {
        amplitude: 60,
        frequency: 0.008,
        speed: -0.015,
        offset: Math.PI / 3,
        color: "rgba(139, 93, 255, 0.06)",
        y: 0.75,
      },
      {
        amplitude: 35,
        frequency: 0.012,
        speed: 0.025,
        offset: Math.PI / 2,
        color: "rgba(139, 93, 255, 0.04)",
        y: 0.8,
      },
      {
        amplitude: 45,
        frequency: 0.009,
        speed: -0.018,
        offset: Math.PI,
        color: "rgba(139, 93, 255, 0.03)",
        y: 0.85,
      },
    ],
    particles: {
      enabled: true,
      count: 8,
      opacity: 0.3,
      size: 1,
      movement: 0.01
    }
  },
  stars: {
    enabled: true,
    count: 8,
    animationDuration: '3s',
    opacity: 0.6,
    containerClass: 'stars',
    starClass: 'star'
  }
}
```

### Performance Baseline (Current Implementation)
- **FPS Target**: 60fps (measured: 58-62fps on modern devices)
- **Memory Usage**: ~2-3MB for wave animation + ~1MB for stars
- **CPU Usage**: ~3-5% on modern devices, ~8-12% on older devices
- **Canvas Size**: Full viewport (responsive to window resize)
- **Wave Count**: 4 waves + 8 particles (optimal performance)
- **Stars Count**: 8 stars with CSS animations
- **Load Time**: <100ms for animation initialization
- **First Frame**: <16ms for first animation frame

### Error Handling Requirements
- **Canvas Element Not Found**: Graceful fallback with console warning
- **getContext('2d') Failure**: Fallback to disabled state with user notification
- **Resize Errors**: Handle window resize failures gracefully
- **Animation Frame Errors**: Cancel and restart animation loop on failure
- **Memory Pressure**: Pause animation when page not visible (Page Visibility API)
- **Performance Degradation**: Auto-reduce wave count if FPS drops below 30fps
- **Module Load Failures**: Fallback to inline animation if module fails to load

### Integration Pattern
```javascript
// Page-level usage
import { initBackgroundAnimations } from '/src/scripts/ui/background-animations/index.js'
import homepageConfig from '/src/scripts/ui/background-animations/configs/homepage-config.js'

// Initialize with page-specific config
initBackgroundAnimations(homepageConfig)
```

## Success Metrics

- [ ] Code duplication reduced by extracting reusable modules
- [ ] Each page can have unique background animations
- [ ] Zero performance regression compared to current implementation
- [ ] Configuration system supports all current animation parameters
- [ ] Modules follow existing project patterns and conventions

## Testing Requirements

### Visual Regression Testing
- [ ] Wave rendering: Verify all 4 waves render correctly with proper colors and opacity
- [ ] Particle effects: Confirm 8 particles animate smoothly across the canvas
- [ ] Stars animation: Verify 8 stars twinkle with proper CSS animations
- [ ] Responsive behavior: Test canvas and stars resize on window resize
- [ ] Visual consistency: Compare with current implementation side-by-side

### Performance Testing
- [ ] FPS measurement: Maintain 58-62fps during animation
- [ ] Memory usage: Stay within 2-3MB for wave animation
- [ ] CPU usage: Maintain <5% on modern devices
- [ ] Load time: Animation initialization <100ms
- [ ] First frame: First animation frame <16ms

### Error Scenario Testing
- [ ] Canvas element not found: Graceful fallback with warning
- [ ] getContext('2d') failure: Disabled state with notification
- [ ] Window resize errors: Handle resize failures gracefully
- [ ] Animation frame errors: Cancel and restart loop
- [ ] Page visibility: Pause/resume on tab switch
- [ ] Module load failures: Fallback to inline animation

### Browser Compatibility Testing
- [ ] Chrome: Full functionality and performance
- [ ] Firefox: Complete feature support
- [ ] Safari: All animations working correctly
- [ ] Edge: Full compatibility
- [ ] Mobile browsers: Touch-optimized experience

## Additional Requirements

### Module Loading Strategy
- **ES6 Module Import**: Use ES6 `import` statements in Astro components
- **Pattern**: Import directly in `index.astro` script section
- **Compatibility**: Ensure Astro SSG deployment compatibility
- **Location**: `src/scripts/ui/background-animations/wave-animation.js`

### Migration Strategy
- **Direct Replacement**: Implement modules with 100% safe guarantee
- **No Phased Approach**: Direct replacement with comprehensive testing
- **Safety Measures**: Keep original inline code as backup
- **Rollback Procedures**: Comprehensive rollback documentation and procedures

### Configuration System
- **Runtime Configuration Changes**: Support dynamic parameter updates after initialization
- **User Modifiable Parameters**: Allow users to modify wave parameters after initialization
- **Dynamic Updates**: Real-time configuration changes without restart
- **Validation**: Proper parameter validation and error handling

### Error Recovery
- **Enhanced Rollback Procedures**: Comprehensive documentation for error scenarios
- **Backup Strategy**: Pre-implementation backup with specific procedures
- **Recovery Triggers**: Performance regression, functional regression, integration regression
- **Execution Procedures**: Immediate rollback and gradual rollback options
- **Verification Steps**: Post-rollback testing and validation procedures
