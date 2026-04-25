<template>
  <div class="search-container">
    <div class="search-box">
      <input
        v-model="query"
        type="text"
        placeholder="Search recipes by name or ingredients..."
        @keyup.enter="search"
        @keyup.escape="clearSearch"
        :disabled="isLoading"
      />
      <button @click="search" :disabled="isLoading" class="btn-search">
        <span v-if="!isLoading">🔍</span>
        <span v-else class="mini-spinner"></span>
      </button>
    </div>

    <div v-if="searchHistory.length > 0" class="search-history">
      <span class="history-label">Recent:</span>
      <div class="history-list">
        <button
          v-for="item in searchHistory.slice(0, 5)"
          :key="item"
          @click="quickSearch(item)"
          class="history-item"
        >
          {{ item }}
        </button>
      </div>
      <button class="clear-history" @click="clearHistory">Clear recent</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useSearchStore } from "../store/useSearchStore";

const searchStore = useSearchStore();
const query = ref(searchStore.searchQuery || "");
const isLoading = computed(() => searchStore.isLoading);
const searchHistory = computed(() => searchStore.searchHistory);

const emit = defineEmits(["search", "clear"]);

function search() {
  const trimmed = query.value.trim();
  if (trimmed) {
    emit("search", trimmed);
  }
}

function quickSearch(item) {
  query.value = item;
  emit("search", item);
}

function clearSearch() {
  query.value = "";
  emit("clear");
}

function clearHistory() {
  searchStore.clearSearchHistory();
}
</script>

<style scoped>
.search-container {
  width: 100%;
}

.search-box {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

input {
  flex: 1;
  padding: 10px 16px;
  font-size: 0.95rem;
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
  background: var(--surface-strong);
  color: var(--ink);
}

input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.16);
}

input:disabled {
  background: var(--surface-soft);
  cursor: not-allowed;
}

.btn-search {
  padding: 10px 14px;
  background: var(--accent);
  color: var(--surface-strong);
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-search:hover:not(:disabled) {
  background: var(--accent-hover);
}

.btn-search:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.mini-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--surface-strong);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.search-history {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 0.85rem;
}

.history-label {
  font-weight: 600;
  color: var(--ink-muted);
}

.history-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.clear-history {
  border: none;
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0;
}

.clear-history:hover {
  text-decoration: underline;
}

.history-item {
  padding: 4px 8px;
  background: var(--surface-soft);
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  color: var(--ink-soft);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.history-item:hover {
  background: var(--surface-muted);
  border-color: var(--accent);
  color: var(--accent);
}
</style>
