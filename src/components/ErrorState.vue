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
    default: "Something went wrong"
  },
  message: {
    type: String,
    default: "We encountered an error. Please try again."
  }
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
  color: #991b1b;
  font-size: 1.25rem;
}

p {
  margin: 0;
  color: #64748b;
  max-width: 400px;
}

.btn-secondary {
  margin-top: 8px;
  padding: 8px 16px;
  background: #e2e8f0;
  color: #0f172a;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background: #cbd5e1;
}
</style>
