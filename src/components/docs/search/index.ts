// Search Components Index
// Google Engineering Team 2025: Modular Search Component Exports

// Export the main SearchWidget component
export { default as SearchWidget } from "./SearchWidget.astro";

// Export the search engine and types
export {
  IndonesianDocsSearch,
  searchEngine,
  type SearchResult,
  type SearchResponse,
  type SearchData,
  type MatchInfo,
} from "./SearchEngine";

// Export search styles
export const searchStyles = "./SearchStyles.css";

// Re-export for convenience
export default {
  SearchWidget: "./SearchWidget.astro",
  SearchEngine: "./SearchEngine",
  SearchStyles: "./SearchStyles.css",
};
