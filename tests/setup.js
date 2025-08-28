// Jest setup file for Story 2.8 testing
// Configures testing environment and global test utilities

// Mock console methods to reduce noise during testing
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};

// Mock performance API
global.performance = {
  now: () => Date.now(),
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock CSS custom properties
const mockCSS = `
  :root {
    --clr-bg: #111111;
    --clr-text-primary: #e5e5e5;
    --clr-text-secondary: #a3a3a3;
    --clr-accent: #8b5cf6;
    --clr-accent-dark: #7b4def;
    --spacing-1: 0.25rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;
    --border-radius-card: 1rem;
    --transition-speed: 200ms;
    --shadow-lg-accent: 0 10px 30px rgba(139, 92, 246, 0.2);
    --fs-h1: clamp(2.25rem, 5vw, 3rem);
    --fs-h3: 1.25rem;
    --fs-base: 1rem;
  }
`;

// Add mock CSS to document head
const style = document.createElement("style");
style.textContent = mockCSS;
document.head.appendChild(style);

// Test utilities
global.testUtils = {
  // Create mock article data
  createMockArticle: (overrides = {}) => ({
    id: "test-article-1",
    slug: "test-article",
    data: {
      title: "Test Article",
      description: "Test description",
      tags: ["test", "article"],
      ...overrides,
    },
  }),

  // Create mock tool data
  createMockTool: (toolName = "anki") => ({
    name: toolName,
    path: `src/content/tool-articles/${toolName}`,
  }),

  // Simulate different screen sizes
  setViewport: (width, height) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: height,
    });
    window.dispatchEvent(new Event("resize"));
  },

  // Wait for next tick
  nextTick: () => new Promise((resolve) => setTimeout(resolve, 0)),
};
