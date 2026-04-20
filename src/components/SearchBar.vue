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
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.btn-search {
  padding: 10px 14px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-search:hover:not(:disabled) {
  background: #0369a1;
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
  border-top-color: white;
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
  color: #64748b;
}

.history-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.history-item {
  padding: 4px 8px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #475569;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.history-item:hover {
  background: #e2e8f0;
  border-color: #0ea5e9;
  color: #0ea5e9;
}
</style>
