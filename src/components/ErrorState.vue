<template>
  <div class="error-state">
    <div class="icon">⚠️</div>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <button @click="$emit('retry')" class="btn-secondary">Try Again</button>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "Something went wrong",
  },
  message: {
    type: String,
    default: "We encountered an error. Please try again.",
  },
});

defineEmits(["retry"]);
</script>

<style scoped>
.error-state {
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
  color: var(--danger-ink);
  font-size: 1.25rem;
}

p {
  margin: 0;
  color: var(--ink-muted);
  max-width: 400px;
}

.btn-secondary {
  margin-top: 8px;
  padding: 8px 16px;
  background: var(--surface-soft);
  color: var(--ink);
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background: var(--border);
}
</style>
