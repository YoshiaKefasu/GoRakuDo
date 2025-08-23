# Developer and AI Notes

## Critical Implementation Guidelines

### Project Context:
- **Framework**: Astro with Vue components and Tailwind v4
- **Deployment**: GitHub Pages
- **Design System**: Modern, clean aesthetic with generous spacing
- **Performance**: Optimized for localhost development and production builds

### Code Quality Standards:
1. **Comprehensive Explanations**: Every code change must include detailed reasoning
2. **Component Isolation**: Create modular, reusable components
3. **Accessibility First**: WCAG 2.1 AA compliance minimum
4. **Performance Optimization**: Use modern CSS features for better rendering
5. **Progressive Enhancement**: Work on all devices, enhance for modern browsers

### Tailwind v4 Integration Notes:
- Use CSS custom properties defined in `src\styles\global.css`
- Leverage `color-mix()` function for sophisticated color manipulation
- Implement logical properties for better internationalization
- Use backdrop filters and modern CSS features where supported

### Mind Map Integration:
- Components must support dynamic color and icon systems
- Graceful fallbacks required for missing mind map data
- SEO structured data generation for breadcrumb navigation
- Responsive design that works with varying content lengths

### Error Handling Philosophy:
- Always provide fallback states
- Log warnings for debugging but never break user experience
- Use try-catch blocks for external data dependencies
- Implement progressive loading states

### Animation and Interaction Guidelines:
- Respect `prefers-reduced-motion` settings
- Use hardware-accelerated transforms
- Implement staggered animations for list items
- Provide clear hover and focus states

### Mobile-First Approach:
- Start with mobile constraints, enhance for desktop
- Use container queries where beneficial
- Implement touch-friendly interaction targets
- Optimize for thumb navigation patterns

## Team Standards (Google 2025 Engineering/UI-UX):
- **Design Tokens**: Use consistent spacing, typography, and color systems
- **Component Architecture**: Atomic design principles
- **Performance Budget**: <75ms interaction responses, <2.5s load times
- **Accessibility**: Screen reader tested, keyboard navigable
- **Browser Support**: Last 2 versions of major browsers, graceful degradation

## Implementation Checklist:
- [ ] TypeScript interfaces properly defined
- [ ] Error boundaries implemented
- [ ] Accessibility tested
- [ ] Performance optimized
- [ ] Responsive design verified
- [ ] Dark mode support included
- [ ] Print styles considered
- [ ] SEO optimization implemented