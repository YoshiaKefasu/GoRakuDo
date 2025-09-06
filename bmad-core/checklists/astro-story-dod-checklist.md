<!-- Powered by BMAD™ Core -->

# Astro Story Definition of Done (DoD) Checklist

## Instructions for Astro Developer Agent (Astra)

Before marking a story as 'Review', please validate your work against every item in this checklist. This ensures adherence to Astro's performance-first principles.

---

### 1. Requirements Met

- [ ] All functional requirements specified in the story are implemented.
- [ ] All acceptance criteria defined in the story are met.

### 2. Technical Lead Sanity Check

- [ ] **Task Analysis Performed:** Confirmed that each implementation task was analyzed against Astro best practices before coding began.
- [ ] **Idiomatic Solutions Proposed:** Confirmed that any non-idiomatic instructions in the original story were identified, and superior native solutions were proposed and approved by the user.

### 3. Astro-Native Implementation (CRITICAL)

- [ ] **Zero-JS by Default:** All new components render to static HTML with no client-side JavaScript unless explicitly required.
- [ ] **Astro APIs Used:** Confirmed that `Astro.glob()`, Content Collections, or other server-side Astro APIs were used for data fetching instead of generic Node.js solutions.
- [ ] **Built-in Components Utilized:** Astro's built-in components (e.g., `<Image />`, `<Picture />`, `<ViewTransitions />`) were used where appropriate for their intended purpose.
- [ ] **Islands Architecture Respected:** UI framework components (React, Svelte, Vue, etc.) are used *only* for client-side interactive islands and are not used to render purely static content.
- [ ] **Zero-JS by Default:** All new components render to static HTML with no client-side JavaScript unless explicitly required by the story and implemented as an island.
- [ ] **File-Based Routing:** All pages are correctly located within `src/pages/` to match the desired URL structure.
- [ ] **Content Collections:** Type-safe Markdown/MDX content is properly managed through Astro's content collections (`src/content/`).
- [ ] **Asset Handling:** Static assets are correctly placed in `public/` and referenced from the root (e.g., `/image.png`).
- [ ] **Image Optimization:** Astro's built-in `<Image />` component is used for all local images to ensure optimization.
- [ ] **Scoped Styles:** CSS is scoped by default within `.astro` components to prevent global style conflicts.

### 4. Coding Standards & Project Structure

- [ ] **DRY Principle:** All new code is free of duplication. Reusable logic has been abstracted into components or utility functions.
- [ ] **KISS Principle:** The implementation is simple, clear, and avoids unnecessary complexity.
- [ ] All new/modified code strictly adheres to project coding standards and `devLoadAlwaysFiles`.
- [ ] All new files (`.astro`, `.ts`, `.mdx`) are placed in the correct directories as per the project structure.
- [ ] **TypeScript Strictness:** Code passes `astro check` with no type errors.
- [ ] No new linter errors or warnings have been introduced.

### 5. Testing & Validation

- [ ] Unit tests are implemented for any complex logic (e.g., utility functions, data transformations).
- [ ] All tests pass successfully (`npm run test` or `astro test`).
- [ ] The static build completes without errors (`astro build`).
- [ ] All pages have been manually verified on the local dev server (`astro dev`).
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