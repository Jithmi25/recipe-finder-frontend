<template>
  <div class="app-shell">
    <section v-if="!authStore.isAuthenticated" class="auth-card">
      <p class="kicker">Google Login Required</p>
      <h1>Recipe Finder</h1>
      <p class="subtitle">
        Sign in with Google to search, save, and share recipes.
      </p>
      <div v-if="authStore.error" class="alert">{{ authStore.error }}</div>
      <div v-if="!hasGoogleClientId" class="alert warning">
        Missing VITE_GOOGLE_CLIENT_ID in frontend env.
      </div>
      <div id="google-signin-button" class="google-button-slot"></div>
    </section>

    <section v-else class="app-card">
      <header class="app-header">
        <div class="user-block">
          <img
            v-if="authStore.user?.picture"
            :src="authStore.user.picture"
            alt="avatar"
            class="avatar"
          />
          <div>
            <p class="kicker">Signed in as</p>
            <h2>{{ authStore.user?.name }}</h2>
            <p class="email">{{ authStore.user?.email }}</p>
          </div>
        </div>
        <div class="header-actions">
          <span class="stat-pill"
            >Saved {{ searchStore.favorites.length }}</span
          >
          <button class="sign-out" @click="logout">Sign out</button>
        </div>
      </header>

      <h1 class="title">Recipe Finder</h1>

      <div class="tabs">
        <button
          :class="['tab', { active: activeTab === 'explore' }]"
          @click="activeTab = 'explore'"
        >
          Explore
        </button>
        <button
          :class="['tab', { active: activeTab === 'saved' }]"
          @click="activeTab = 'saved'"
        >
          Saved Recipes
        </button>
      </div>

      <SearchBar
        v-if="activeTab === 'explore'"
        @search="onSearch"
        @clear="onClearSearch"
      />

      <FilterBar
        v-if="activeTab === 'explore' && searchStore.dietTypes.length > 0"
        @filter-changed="onFilterChanged"
        @clear-filters="onClearFilters"
      />

      <LoadingState v-if="activeTab === 'explore' && searchStore.isLoading" />
      <ErrorState
        v-else-if="activeTab === 'explore' && searchStore.error"
        :message="searchStore.error"
        @retry="onRetry"
      />
      <EmptyState
        v-else-if="activeTab === 'explore' && searchStore.isEmpty"
        title="No recipes found"
        message="Try adjusting your filters or search terms."
      />
      <EmptyState
        v-else-if="activeTab === 'saved' && searchStore.favorites.length === 0"
        title="No saved recipes yet"
        message="Save recipes from Explore and they will appear here."
      />
      <div v-else-if="displayedRecipes.length > 0">
        <div class="recipes-grid">
          <RecipeCard
            v-for="recipe in displayedRecipes"
            :key="recipe.id"
            :recipe="recipe"
            :is-favorite="searchStore.isFavorite(recipe.id)"
            @select="onRecipeSelect"
            @toggle-favorite="onToggleFavorite"
          />
        </div>

        <Pagination
          v-if="activeTab === 'explore'"
          :current-page-no="searchStore.currentPageNo"
          :total-pages="searchStore.totalPages"
          :total="searchStore.total"
          :has-more="searchStore.hasMore"
          @prev="
            searchStore.prevPage();
            performSearch();
          "
          @next="
            searchStore.nextPage();
            performSearch();
          "
        />
      </div>

      <div v-if="shareMessage" class="toast">{{ shareMessage }}</div>
    </section>

    <RecipeDetailModal
      :open="modalOpen"
      :recipe="searchStore.selectedRecipe"
      :is-loading="searchStore.isDetailLoading"
      :error="searchStore.detailError"
      :is-favorite="selectedRecipeIsFavorite"
      @close="closeModal"
      @toggle-favorite="onToggleFavorite"
      @share="onShare"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from "vue";
import SearchBar from "./components/SearchBar.vue";
import FilterBar from "./components/FilterBar.vue";
import RecipeCard from "./components/RecipeCard.vue";
import LoadingState from "./components/LoadingState.vue";
import EmptyState from "./components/EmptyState.vue";
import ErrorState from "./components/ErrorState.vue";
import Pagination from "./components/Pagination.vue";
import RecipeDetailModal from "./components/RecipeDetailModal.vue";
import { useSearchStore } from "./store/useSearchStore";
import { useAuthStore } from "./store/useAuthStore";

const searchStore = useSearchStore();
const authStore = useAuthStore();
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const hasGoogleClientId = computed(() => Boolean(googleClientId));
const activeTab = ref("explore");
const modalOpen = ref(false);
const shareMessage = ref("");

const displayedRecipes = computed(() =>
  activeTab.value === "explore" ? searchStore.recipes : searchStore.favorites,
);

const selectedRecipeIsFavorite = computed(() => {
  if (!searchStore.selectedRecipe?.id) {
    return false;
  }
  return searchStore.isFavorite(searchStore.selectedRecipe.id);
});

function logout() {
  authStore.logout();
  searchStore.clearAllUserData();
  activeTab.value = "explore";
  modalOpen.value = false;
  nextTick(() => {
    initializeGoogleButton();
  });
}

async function onSearch(query) {
  await searchStore.searchRecipes(query);
}

function onClearSearch() {
  searchStore.recipes = [];
  searchStore.lastSearch = null;
  searchStore.searchQuery = "";
  searchStore.error = "";
}

async function onFilterChanged() {
  await searchStore.applyFilters();
}

async function onClearFilters() {
  searchStore.setSelectedDiets([]);
  await searchStore.applyFilters();
}

async function onRetry() {
  await performSearch();
}

async function performSearch() {
  await searchStore._performSearch();
}

async function onRecipeSelect(recipeId) {
  modalOpen.value = true;
  await searchStore.openRecipeDetails(recipeId);
}

function closeModal() {
  modalOpen.value = false;
  searchStore.closeRecipeDetails();
}

async function onToggleFavorite(recipeId) {
  await searchStore.toggleFavorite(recipeId);
}

async function onShare(recipe) {
  const shareText = `${recipe.title} - ${recipe.description || "Recipe from Recipe Finder"}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: recipe.title,
        text: shareText,
      });
      shareMessage.value = "Shared successfully.";
    } else {
      await navigator.clipboard.writeText(shareText);
      shareMessage.value = "Recipe copied to clipboard.";
    }
  } catch {
    shareMessage.value = "Unable to share recipe right now.";
  }

  setTimeout(() => {
    shareMessage.value = "";
  }, 2200);
}

function initializeGoogleButton(retryCount = 0) {
  if (!hasGoogleClientId.value || authStore.isAuthenticated) {
    return;
  }

  const googleApi = window.google?.accounts?.id;
  if (!googleApi) {
    if (retryCount < 20) {
      setTimeout(() => initializeGoogleButton(retryCount + 1), 200);
    }
    return;
  }

  googleApi.initialize({
    client_id: googleClientId,
    callback: async (response) => {
      if (!response?.credential) {
        return;
      }

      await authStore.loginWithGoogleCredential(response.credential);
      nextTick(async () => {
        await Promise.all([
          searchStore.fetchDietTypes(),
          searchStore.fetchFavorites(),
        ]);
      });
    },
  });

  googleApi.renderButton(document.getElementById("google-signin-button"), {
    theme: "filled_blue",
    size: "large",
    text: "signin_with",
    shape: "pill",
    width: 300,
  });
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await Promise.all([
      searchStore.fetchDietTypes(),
      searchStore.fetchFavorites(),
    ]);
  } else {
    initializeGoogleButton();
  }
});
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.auth-card,
.app-card {
  width: min(1080px, 100%);
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.1);
  padding: 32px;
}

.auth-card {
  max-width: 520px;
  text-align: center;
}

.kicker {
  margin: 0 0 8px;
  color: #0c4a6e;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

h1,
h2 {
  margin: 0;
}

.subtitle,
.email {
  color: #475569;
}

.google-button-slot {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

.alert {
  margin-top: 14px;
  border-radius: 12px;
  padding: 10px;
  font-size: 0.9rem;
  color: #991b1b;
  background: #fee2e2;
}

.alert.warning {
  color: #7c2d12;
  background: #ffedd5;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.user-block {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-pill {
  background: #e0f2fe;
  color: #0c4a6e;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.85rem;
  font-weight: 600;
}

.title {
  margin: 0 0 18px 0;
  font-size: 2rem;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.tab {
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #334155;
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
}

.tab.active {
  background: #0f172a;
  color: #f8fafc;
  border-color: #0f172a;
}

.sign-out {
  border: none;
  background: #0f172a;
  color: #f8fafc;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sign-out:hover {
  background: #334155;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #0f172a;
  color: #f8fafc;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.9rem;
}

@media (max-width: 700px) {
  .auth-card,
  .app-card {
    padding: 22px;
  }

  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .recipes-grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.5rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
