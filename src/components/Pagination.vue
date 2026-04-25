<template>
  <div class="pagination">
    <button
      :disabled="currentPageNo <= 1"
      @click="$emit('prev')"
      class="btn-paging"
    >
      ← Previous
    </button>

    <div class="page-info">
      Page {{ currentPageNo }} of {{ totalPages }}
      <span class="total-count">({{ total }} total)</span>
    </div>

    <button :disabled="!hasMore" @click="$emit('next')" class="btn-paging">
      Next →
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPageNo: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  hasMore: {
    type: Boolean,
    required: true,
  },
});

defineEmits(["prev", "next"]);
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
  flex-wrap: wrap;
}

.btn-paging {
  padding: 8px 16px;
  background: var(--ink);
  color: var(--surface-strong);
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-paging:hover:not(:disabled) {
  background: var(--ink-soft);
}

.btn-paging:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--ink-muted);
  font-weight: 500;
  font-size: 0.95rem;
}

.total-count {
  color: var(--ink-muted);
  font-size: 0.85rem;
}
</style>
