<template>
  <div class="search-container" role="search">
    <!-- Search Input -->
    <div class="search-input-group">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Cari dokumentasi..."
        @input="handleSearch"
        @keydown.enter="handleSearch"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="search-clear-btn"
        aria-label="Clear search"
      >
        ✕
      </button>
    </div>

    <!-- Search Filters -->
    <div class="search-filters">
      <button
        v-for="filter in filters"
        :key="filter.key"
        @click="handleFilter(filter.key)"
        class="filter-btn"
        :class="{ active: activeFilter === filter.key }"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Results Count -->
    <div v-if="resultCount !== totalCount" class="results-count">
      {{ resultCount }} dari {{ totalCount }} hasil
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore Vue import resolved by Astro
import { ref, computed, onMounted } from 'vue';
import { SimpleSearch } from '../../utils/search/simple-search';
import type { SearchPost } from '../../utils/search/types';

const props = defineProps<{
  posts: SearchPost[];
}>();

const emit = defineEmits<{
  results: [posts: SearchPost[]];
}>();

// Reactive state
const searchQuery = ref('');
const activeFilter = ref('all');
const searchInstance = ref<SimpleSearch | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);
// Computed
const filters = computed(() => [
  { key: 'all', label: 'Semua' },
  { key: 'beginner', label: 'Pemula' },
  { key: 'tools', label: 'Tools' },
  { key: 'guide', label: 'Panduan' }
]);

const resultCount = ref(props.posts?.length || 0);
const totalCount = ref(props.posts?.length || 0);

// Methods
function initializeSearch() {
  searchInstance.value = new SimpleSearch(props.posts);
  console.log('🔍 Search initialized with', props.posts.length, 'posts');
}

function handleSearch() {
  if (!searchInstance.value) return;
  
  const result = searchInstance.value.search(searchQuery.value);
  resultCount.value = result.filteredCount;
  emit('results', result.posts);
}

function handleFilter(filterKey: string) {
  activeFilter.value = filterKey;
  if (!searchInstance.value) return;
  
  const filters = getFiltersFromKey(filterKey);
  const result = searchInstance.value.filter(filters);
  resultCount.value = result.filteredCount;
  emit('results', result.posts);
}

function clearSearch() {
  searchQuery.value = '';
  resultCount.value = totalCount.value;
  emit('results', props.posts);
  searchInput.value?.focus();
}

function getFiltersFromKey(key: string) {
  switch (key) {
    case 'beginner': return { learningStage: 'beginner' };
    case 'tools': return { contentType: 'tool' };
    case 'guide': return { contentType: 'guide' };
    default: return {};
  }
}

// Lifecycle
onMounted(() => {
  initializeSearch();
});
</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.1);
}

.search-clear-btn {
  position: absolute;
  right: 0.5rem;
  padding: 0.25rem;
  border: none;
  border-radius: 0.25rem;
  background: none;
  color: #9ca3af;
  cursor: pointer;
}

.search-clear-btn:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.search-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 0.25rem;
  background: #f3f4f6;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-btn:hover {
  background: #e5e7eb;
}

.filter-btn.active {
  background: #3b82f6;
  color: white;
}

.results-count {
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
