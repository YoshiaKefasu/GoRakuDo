<!-- Powered by BMAD™ Core -->

# User-Defined Preferred Patterns and Preferences

This document outlines the non-negotiable technology stack and architectural principles for all projects. All agents must adhere to these guidelines.

## Core Technology Stack

- **Framework:** Astro (latest stable version) for Static Site Generation (SSG).
- **UI Components:** Vue (latest stable version, using Composition API).
- **Styling:** Tailwind CSS v4.1, configured according to `tailwind.config.js`.
- **UI Library:** shadcn/ui components, sourced from the `/components/ui` directory.
- **Deployment:** GitHub Pages via Astro's SSG capabilities.

## Architectural Principles

- **Component-Based:** All UI must be built with reusable Astro or Vue components located in `/components`.
- **Design System:** All styling must adhere to the design system defined in `/styles/globals.css`, which uses a 16px base font size.
- **State Management:** For simple cases, use Vue's built-in reactivity. For complex applications, use Pinia.
- **Image Sourcing:** All placeholder or stock images should be sourced using the Unsplash API or a similar high-quality, license-appropriate source.
- **Code Quality:** All code must be clean, maintainable, and strongly typed with TypeScript.

## Quality Guarantees

- **No Placeholders:** All generated code must be complete and functional. No "TODO" comments or incomplete snippets.
- **Responsive & Accessible:** All components must be fully responsive and adhere to WCAG accessibility guidelines.
