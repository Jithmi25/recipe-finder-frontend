<template>
  <div class="filter-bar">
    <div v-if="categories.length > 0" class="filters">
      <span class="label">Category:</span>
      <div class="filter-chips">
        <button
          v-for="category in categories"
          :key="category.key_name"
          :class="[
            'chip',
            { active: selectedCategories.includes(category.key_name) },
          ]"
          @click="toggleCategory(category.key_name)"
        >
          {{ category.display_name }}
        </button>
      </div>
    </div>
    <div v-if="dietTypes.length > 0" class="filters">
      <span class="label">Diet:</span>
      <div class="filter-chips">
        <button
          v-for="diet in dietTypes"
          :key="diet.key_name"
          :class="['chip', { active: selectedDiets.includes(diet.key_name) }]"
          @click="toggleDiet(diet.key_name)"
        >
          {{ diet.display_name }}
        </button>
      </div>
    </div>
    <button
      v-if="selectedDiets.length > 0 || selectedCategories.length > 0"
      @click="$emit('clear-filters')"
      class="btn-clear"
    >
      Clear Filters
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSearchStore } from "../store/useSearchStore";

const searchStore = useSearchStore();
const categories = computed(() => searchStore.categories);
const dietTypes = computed(() => searchStore.dietTypes);
const selectedDiets = computed(() => searchStore.selectedDiets);
const selectedCategories = computed(() => searchStore.selectedCategories);

const emit = defineEmits(["filter-changed", "clear-filters"]);

function toggleDiet(dietKey) {
  const updated = selectedDiets.value.includes(dietKey)
    ? selectedDiets.value.filter((d) => d !== dietKey)
    : [...selectedDiets.value, dietKey];

  searchStore.setSelectedDiets(updated);
  emit("filter-changed");
}

function toggleCategory(categoryKey) {
  const updated = selectedCategories.value.includes(categoryKey)
    ? selectedCategories.value.filter((c) => c !== categoryKey)
    : [...selectedCategories.value, categoryKey];

  searchStore.setSelectedCategories(updated);
  emit("filter-changed");
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 8px;
  flex-wrap: wrap;
}

.filters {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.label {
  font-weight: 600;
  color: var(--ink-soft);
  font-size: 0.875rem;
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  padding: 6px 12px;
  background: var(--surface-strong);
  border: 1px solid var(--border-strong);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink-soft);
  transition: all 0.2s;
}

.chip:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.chip.active {
  background: var(--accent);
  color: var(--surface-strong);
  border-color: var(--accent);
}

.btn-clear {
  padding: 6px 12px;
  background: var(--danger-soft);
  color: var(--danger-ink);
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.2s;
}

.btn-clear:hover {
  transform: translateY(-1px);
}
</style>
