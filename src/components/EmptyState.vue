<template>
  <div class="empty-state">
    <div class="icon">📚</div>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <button v-if="showStartButton" @click="$emit('start')" class="btn-primary">
      Start Searching
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "No recipes found"
  },
  message: {
    type: String,
    default: "Try adjusting your filters or search terms."
  },
  showStartButton: {
    type: Boolean,
    default: false
  }
});

defineEmits(["start"]);
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 20px;
  text-align: center;
}

.icon {
  font-size: 3rem;
}

h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.25rem;
}

p {
  margin: 0;
  color: #64748b;
  max-width: 400px;
}

.btn-primary {
  margin-top: 8px;
  padding: 8px 16px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #0369a1;
}
</style>
