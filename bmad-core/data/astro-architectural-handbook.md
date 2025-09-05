<!-- Powered by BMAD™ Core -->

# Astro Architectural Handbook & Best Practices (In-Depth)

**Directive for Architect Agent:** This is your definitive guide to designing applications with the Astro framework. All architectural decisions MUST be justified by the principles within this handbook. Your primary goal is to produce an architecture that is performant, maintainable, and idiomatic to Astro.

---

### 1. Core Philosophy: Static-First, Performance-Obsessed

-   **Primary Goal:** Ship zero client-side JavaScript by default. Every byte of JS must justify its existence. The default state of any component or page is static HTML.
-   **Architectural Mandate:** The architecture document must explicitly categorize every feature into one of two buckets: **Static Content** or **Interactive Island**. Any feature proposed as interactive requires a rationale explaining why it cannot be achieved with static HTML.
-   **Performance Budget:** The architecture must adhere to a strict performance budget. Default targets are:
    *   **Time to Interactive (TTI):** < 2.5 seconds on a simulated mobile device (Moto G4).
    *   **Largest Contentful Paint (LCP):** < 2.5 seconds.
    *   **Initial JS Payload (Main Thread):** < 100 KB.

---

### 2. The Islands Architecture: A Decision Framework

-   **Concept:** Interactive UI components are isolated "islands" hydrated on the client, within a static, server-rendered HTML page.
-   **Architectural Decision Framework:** For every interactive component, the architecture must specify a `client:*` directive. Use the following decision tree:

    1.  **Is the component immediately visible and critical for the user experience?**
        *   **Yes:** Use `client:load`. (Example: An interactive header search bar). Use sparingly.
    2.  **Is the component below the fold or non-critical for the initial view?**
        *   **Yes:** Use `client:idle`. (Example: An image carousel further down the page). This is the preferred default for most islands.
    3.  **Is the component expensive to load and only needed when the user sees it?**
        *   **Yes:** Use `client:visible`. (Example: A heavy video player or a complex interactive chart in the footer).
    4.  **Does the component only need to hydrate on a specific media query?**
        *   **Yes:** Use `client:media={query}`. (Example: A mobile-only navigation drawer).

-   **Island Communication:** Islands are isolated. They do not share state by default. For communication between islands, the architecture MUST specify a lightweight, explicit mechanism.
    *   **Preferred Method:** Use custom browser events dispatched and listened to on `document`.
    *   **Advanced Method:** For complex global state, the architecture must mandate the use of **Nano Stores**, as it is framework-agnostic and extremely lightweight. Avoid Redux, Zustand, or other large state management libraries unless there is a compelling, documented reason.

---

### 3. Content Architecture: Collections and Assets

-   **Content Collections (The Law for Structured Content):**
    *   **Concept:** A type-safe, API-like system for local content (Markdown, MDX, JSON, YAML) that validates data against a schema at build time.
    *   **Architectural Mandate:** Any set of repeating, structured content (blog posts, authors, products, docs) **MUST** be architected as a Content Collection. The architecture document must define the Zod schemas for each collection in `src/content/config.ts`. This is a non-negotiable, foundational task.
    *   **Data Fetching:** The *only* approved method for querying collections in `.astro` pages is `getCollection()` and `getEntryBySlug()`. The architecture must not specify solutions that use generic Node.js `fs` calls for this purpose.

-   **Asset Handling Strategy:**
    *   **`public/` Directory:** For assets that must remain untouched by the build process (e.g., `robots.txt`, `favicon.ico`).
    *   **`src/assets/` Directory:** For all other assets (images, fonts, stylesheets) that should be processed and optimized by Astro's build pipeline. The architecture should always default to placing assets here.
    *   **Image Optimization:** The use of Astro's built-in `<Image />` or `<Picture />` components is **mandatory** for all local images stored in `src/assets/`. This is an architectural requirement to enforce performance best practices. The architecture should specify image formats (e.g., `avif`, `webp`) and quality settings.

---

### 4. Routing, Endpoints, and Rendering Modes

-   **File-Based Routing:** The architecture must define the site structure by mapping URLs to the file paths within `src/pages/`. This includes dynamic routes (e.g., `src/pages/blog/[slug].astro`).
-   **Rendering Mode Decision Framework:** The choice of rendering mode is a critical architectural decision.

    1.  **Default (Static Site Generation - SSG):** This is the default and preferred mode for maximum performance. The architecture should use SSG unless a feature explicitly requires server-side logic per-request.
    2.  **Server-Side Rendering (SSR):** Only to be used when content is highly dynamic or personalized per-request (e.g., an account dashboard). If SSR is chosen, the architecture MUST specify the adapter (e.g., `@astrojs/node`, `@astrojs/vercel`).
    3.  **Hybrid Rendering:** The architecture can specify per-page prerendering in an SSR project to get the best of both worlds (e.g., static marketing pages, server-rendered dashboard).

-   **API Routes:**
    *   **Purpose:** For backend functionality like handling form submissions, database queries, or authentication. They live in `src/pages/api/`.
    *   **Architectural Mandate:** Any server-side action triggered by a client must be handled by an API route. The architecture must define the endpoint, the expected request method (GET, POST), and the data contract (request body/response).

---

### 5. Layouts and Styling

-   **Layouts (`src/layouts/`):**
    *   **Concept:** Reusable `.astro` components for page structure (e.g., headers, footers, navigation).
    *   **Architectural Mandate:** The architecture must define a base layout (`Layout.astro`) that includes the `<head>`, shared metadata, and structural HTML. All pages must use a layout. Nested layouts should be used for section-specific structures (e.g., `BlogLayout.astro` that uses the base `Layout.astro`).

-   **Styling Architecture:**
    *   **Scoped by Default:** Astro scopes `<style>` tags within `.astro` components by default. The architecture should leverage this and avoid global stylesheets where possible.
    *   **Global Styles:** For global styles (e.g., fonts, CSS variables), they must be defined in a central file like `src/styles/global.css` and imported into the base layout.
    *   **CSS Variables:** The architecture must define a theme using CSS variables for colors, fonts, and spacing to ensure consistency and easier theming.
    *   **Frameworks (e.g., Tailwind):** If a CSS framework is used, the architecture must specify it and include setup in the `astro.config.mjs`.

---

### 6. Integrations

-   **Concept:** Astro's `astro add` command is the official way to add integrations for tools like Tailwind, React, Svelte, MDX, etc.
-   **Architectural Mandate:** The architecture must list all required integrations. The implementation plan should rely on the `astro add` command for setup to ensure all necessary configuration is handled correctly. Avoid manual configuration of these tools.

---

### Summary for the Architect: An Astro Decision Checklist

Before finalizing any part of the architecture, answer these questions:

1.  **Is it Static?** Can this be achieved with plain HTML and CSS? If yes, use a `.astro` component.
2.  **Is it Interactive?** Does it require client-side JavaScript? If yes, define it as a minimal **Island** and specify its loading directive.
3.  **Is it Content?** Is it a piece of structured, repeatable content? If yes, it **MUST** be a **Content Collection**.
4.  **Is it a Page?** Does it have a URL? If yes, it **MUST** live in `src/pages/`.
5.  **Is it a Server Action?** Does it need to run on the server in response to a user? If yes, it **MUST** be an **API Route**.
6.  **Is it an Image?** Is it a local, raster image? If yes, it **MUST** use the `<Image />` component.
7.  **Does it affect the whole page structure?** If yes, it belongs in a **Layout**.