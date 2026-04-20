<template>
  <div class="filter-bar">
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
      v-if="selectedDiets.length > 0"
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
const dietTypes = computed(() => searchStore.dietTypes);
const selectedDiets = computed(() => searchStore.selectedDiets);

const emit = defineEmits(["filter-changed", "clear-filters"]);

function toggleDiet(dietKey) {
  const updated = selectedDiets.value.includes(dietKey)
    ? selectedDiets.value.filter((d) => d !== dietKey)
    : [...selectedDiets.value, dietKey];

  searchStore.setSelectedDiets(updated);
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
  background: #f8fafc;
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
  color: #334155;
  font-size: 0.875rem;
}

.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  padding: 6px 12px;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  transition: all 0.2s;
}

.chip:hover {
  border-color: #0ea5e9;
  color: #0ea5e9;
}

.chip.active {
  background: #0ea5e9;
  color: white;
  border-color: #0ea5e9;
}

.btn-clear {
  padding: 6px 12px;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-clear:hover {
  background: #fecaca;
}
</style>
