<!-- Powered by BMAD™ Core -->

# Astro Story Definition of Done (DoD) Checklist

## Instructions for Astro Developer Agent (Astra)

Before marking a story as 'Review', please validate your work against every item in this checklist. This ensures adherence to Astro's performance-first principles.

---

### 1. Requirements Met

- [ ] All functional requirements specified in the story are implemented.
- [ ] All acceptance criteria defined in the story are met.

### 2. Astro Best Practices

- [ ] **Zero-JS by Default:** All new components render to static HTML with no client-side JavaScript unless explicitly required.
- [ ] **Islands Architecture:** Any client-side interactivity is opt-in and uses appropriate `client:*` directives (e.g., `client:load`, `client:idle`).
- [ ] **File-Based Routing:** All pages are created in the correct location within `src/pages/` to match the desired URL structure.
- [ ] **Relative Pathing:** All internal links (`<a>`), image sources (`<img>`), and component imports use relative or root-relative paths. No hardcoded absolute URLs to the site's own domain are present.
- [ ] **Content Collections:** Type-safe Markdown/MDX content is managed through Astro's content collections (`src/content/`).
- [ ] **Asset Handling:** Static assets (images, fonts) are correctly placed in `public/` and referenced from the root (e.g., `/image.png`).
- [ ] **Image Optimization:** Astro's built-in `<Image />` component is used for all local images to ensure optimization.
- [ ] **Scoped Styles:** CSS is scoped by default within `.astro` components to prevent global style conflicts.

### 3. Coding Standards & Project Structure

- [ ] **DRY Principle:** All new code is free of duplication. Reusable logic has been abstracted into components or utility functions.
- [ ] **KISS Principle:** The implementation is simple, clear, and avoids unnecessary complexity.
- [ ] All new/modified code strictly adheres to project coding standards and `devLoadAlwaysFiles`.
- [ ] All new files (`.astro`, `.ts`, `.mdx`) are placed in the correct directories as per the project structure.
- [ ] **TypeScript Strictness:** Code passes `astro check` with no type errors.
- [ ] No new linter errors or warnings have been introduced.

### 4. Testing

- [ ] Unit tests are implemented for any complex logic (e.g., utility functions, data transformations).
- [ ] Component tests are written for interactive components (e.g., using Testing Library with a framework component if applicable).
- [ ] All tests pass successfully (`npm run test` or `astro test`).

### 5. Functionality & Verification

- [ ] Functionality has been manually verified by running the local dev server (`astro dev`).
- [ ] The static build completes without errors (`astro build`).
- [ ] All pages are fully rendered as static HTML, verified by inspecting the page source.
- [ ] Edge cases and potential error conditions are handled gracefully.

### 6. Story Administration

- [ ] All tasks within the story file are marked as complete.
- [ ] The **File List** in the Dev Agent Record is fully updated with all created or modified files.
- [ ] Any necessary completion notes are added.

### 7. Dependencies, Build & Configuration

- [ ] Project builds successfully without errors (`astro build`).
- [ ] Any new Astro integrations or npm packages were approved and are documented in `package.json`.
- [ ] Any new environment variables are documented and handled securely via `.env`.

### 8. Documentation (If Applicable)

- [ ] JSDoc comments are added to complex TypeScript functions.
- [ ] Component props are clearly typed and documented.