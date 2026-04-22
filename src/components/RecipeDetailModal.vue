<template>
  <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-panel">
      <button class="close-btn" @click="$emit('close')">x</button>

      <div v-if="isLoading" class="loading">Loading recipe details...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="recipe" class="content">
        <img
          v-if="recipeImage"
          :src="recipeImage"
          :alt="recipe.title"
          class="hero-image"
        />

        <header class="top">
          <h2>{{ recipe.title }}</h2>
          <div class="top-actions">
            <button class="btn" @click="$emit('toggle-favorite', recipe.id)">
              {{ isFavorite ? "Saved" : "Save" }}
            </button>
            <button class="btn primary" @click="$emit('share', recipe)">
              Share
            </button>
          </div>
        </header>

        <p v-if="recipe.description" class="desc">{{ recipe.description }}</p>

        <div class="meta">
          <span v-if="recipe.prep_minutes"
            >Prep {{ recipe.prep_minutes }}m</span
          >
          <span v-if="recipe.cook_minutes"
            >Cook {{ recipe.cook_minutes }}m</span
          >
          <span v-if="recipe.servings">Serves {{ recipe.servings }}</span>
          <span v-if="recipe.diet_types">{{ recipe.diet_types }}</span>
        </div>

        <section
          v-if="
            Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
          "
        >
          <h3>Ingredients</h3>
          <ul>
            <li v-for="(item, idx) in recipe.ingredients" :key="idx">
              <strong>{{ item.quantity || "" }}</strong>
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h3>Instructions</h3>
          <p class="instructions">
            {{ recipe.instructions || "Instructions not available." }}
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  recipe: {
    type: Object,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

const recipeImage = computed(
  () =>
    props.recipe?.image_url ||
    props.recipe?.image ||
    props.recipe?.imageUrl ||
    props.recipe?.thumbnail_url ||
    props.recipe?.thumbnail ||
    "",
);

defineEmits(["close", "toggle-favorite", "share"]);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: grid;
  place-items: center;
  z-index: 100;
  padding: 20px;
}

.modal-panel {
  width: min(760px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: #fff;
  border-radius: 16px;
  padding: 22px;
  position: relative;
}

.hero-image {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 14px;
}

.close-btn {
  position: absolute;
  right: 12px;
  top: 12px;
  border: none;
  background: #e2e8f0;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.top-actions {
  display: flex;
  gap: 8px;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 600;
  cursor: pointer;
  background: #e2e8f0;
  color: #0f172a;
}

.btn.primary {
  background: #0ea5e9;
  color: #fff;
}

.desc {
  color: #475569;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.meta span {
  background: #f1f5f9;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.85rem;
}

ul {
  margin: 0;
  padding-left: 18px;
}

li {
  margin: 6px 0;
}

li strong {
  margin-right: 6px;
}

.instructions {
  white-space: pre-line;
  line-height: 1.6;
}

.loading,
.error {
  padding: 24px;
  text-align: center;
}

.error {
  color: #b91c1c;
}
</style>
