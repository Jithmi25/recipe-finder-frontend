<template>
  <div class="ingredient-input">
    <input
      v-model="ingredient"
      type="text"
      placeholder="Add ingredient..."
      @keyup.enter="addIngredient"
    />
    <button @click="addIngredient">Add</button>

    <ul>
      <li v-for="(item, index) in searchStore.ingredients" :key="index">
        {{ item }}
        <button @click="removeIngredient(index)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSearchStore } from '../store/useSearchStore'

const ingredient = ref('')
const searchStore = useSearchStore()

function addIngredient() {
  if (ingredient.value.trim()) {
    searchStore.addIngredient(ingredient.value)
    ingredient.value = ''
  }
}

function removeIngredient(index) {
  searchStore.removeIngredient(index)
}
</script>

<style scoped>
.ingredient-input {
  margin-bottom: 20px;
}
input {
  padding: 8px;
  width: 60%;
}
button {
  margin-left: 5px;
  padding: 5px 8px;
}
ul {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}
li {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  background: #eee;
  padding: 5px;
  border-radius: 4px;
}
</style>
