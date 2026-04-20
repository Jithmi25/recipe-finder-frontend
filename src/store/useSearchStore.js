import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const useSearchStore = defineStore("search", {
  state: () => ({
    recipes: [],
    favorites: [],
    favoriteRecipeIds: [],
    selectedRecipe: null,
    dietTypes: [],
    searchQuery: "",
    selectedDiets: [],
    currentPage: 0,
    pageSize: 12,
    total: 0,
    hasMore: false,
    isLoading: false,
    isDetailLoading: false,
    error: "",
    detailError: "",
    searchHistory: JSON.parse(localStorage.getItem("searchHistory") || "[]"),
    lastSearch: null,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.pageSize),
    currentPageNo: (state) => state.currentPage / state.pageSize + 1,
    isEmpty: (state) =>
      !state.isLoading && state.recipes.length === 0 && state.lastSearch,
    hasSelectedRecipe: (state) => Boolean(state.selectedRecipe),
  },

  actions: {
    clearError() {
      this.error = "";
    },

    clearDetailError() {
      this.detailError = "";
    },

    setSelectedDiets(diets) {
      this.selectedDiets = diets;
      this.currentPage = 0;
    },

    addToSearchHistory(query) {
      if (!query || this.searchHistory.includes(query)) return;
      this.searchHistory.unshift(query);
      if (this.searchHistory.length > 10) {
        this.searchHistory.pop();
      }
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    },

    goToPage(pageNo) {
      this.currentPage = (pageNo - 1) * this.pageSize;
    },

    nextPage() {
      if (this.hasMore) {
        this.currentPage += this.pageSize;
      }
    },

    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage -= this.pageSize;
      }
    },

    async fetchDietTypes() {
      try {
        const authStore = useAuthStore();
        const response = await axios.get(`${API_BASE_URL}/api/recipes/diets`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });
        this.dietTypes = response.data;
      } catch (err) {
        console.error("Error fetching diet types:", err);
      }
    },

    async fetchFavorites() {
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.favorites = [];
        this.favoriteRecipeIds = [];
        return;
      }

      try {
        const [favoritesRes, idsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/recipes/favorites`, {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }),
          axios.get(`${API_BASE_URL}/api/recipes/favorites/ids`, {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }),
        ]);

        this.favorites = favoritesRes.data;
        this.favoriteRecipeIds = idsRes.data.recipeIds;
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    },

    isFavorite(recipeId) {
      return this.favoriteRecipeIds.includes(Number(recipeId));
    },

    async toggleFavorite(recipeId) {
      const authStore = useAuthStore();
      const normalizedId = Number(recipeId);

      if (!authStore.token || !Number.isInteger(normalizedId)) {
        return;
      }

      try {
        if (this.isFavorite(normalizedId)) {
          await axios.delete(
            `${API_BASE_URL}/api/recipes/favorites/${normalizedId}`,
            {
              headers: {
                Authorization: `Bearer ${authStore.token}`,
              },
            },
          );
        } else {
          await axios.post(
            `${API_BASE_URL}/api/recipes/favorites/${normalizedId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${authStore.token}`,
              },
            },
          );
        }

        await this.fetchFavorites();
      } catch (err) {
        console.error("Error toggling favorite:", err);
      }
    },

    async openRecipeDetails(recipeId) {
      const authStore = useAuthStore();
      const normalizedId = Number(recipeId);

      if (!authStore.token || !Number.isInteger(normalizedId)) {
        return;
      }

      this.isDetailLoading = true;
      this.clearDetailError();

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/recipes/${normalizedId}`,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          },
        );
        this.selectedRecipe = response.data;
      } catch (err) {
        this.detailError =
          err?.response?.data?.error || "Failed to load recipe details.";
      } finally {
        this.isDetailLoading = false;
      }
    },

    closeRecipeDetails() {
      this.selectedRecipe = null;
      this.clearDetailError();
      this.isDetailLoading = false;
    },

    async searchRecipes(query) {
      if (!query.trim()) {
        this.recipes = [];
        this.lastSearch = null;
        this.error = "";
        return;
      }

      this.searchQuery = query;
      this.currentPage = 0;
      this.lastSearch = { query, diets: [...this.selectedDiets] };
      this.addToSearchHistory(query);

      await this._performSearch();
    },

    async _performSearch() {
      const authStore = useAuthStore();

      if (!authStore.token) {
        this.error = "Authentication required";
        this.recipes = [];
        return;
      }

      this.isLoading = true;
      this.clearError();

      try {
        const params = {
          q: this.searchQuery,
          limit: this.pageSize,
          offset: this.currentPage,
        };

        if (this.selectedDiets.length > 0) {
          params.diets = this.selectedDiets.join(",");
        }

        const response = await axios.get(`${API_BASE_URL}/api/recipes/search`, {
          params,
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        this.recipes = response.data.data;
        this.total = response.data.pagination.total;
        this.hasMore = response.data.pagination.hasMore;
      } catch (err) {
        this.error =
          err?.response?.data?.error ||
          "Failed to fetch recipes. Please try again.";
        this.recipes = [];
      } finally {
        this.isLoading = false;
      }
    },

    async applyFilters() {
      this.currentPage = 0;
      if (this.searchQuery) {
        await this._performSearch();
      }
    },

    clearAllUserData() {
      this.recipes = [];
      this.favorites = [];
      this.favoriteRecipeIds = [];
      this.selectedRecipe = null;
      this.lastSearch = null;
      this.searchQuery = "";
      this.error = "";
      this.detailError = "";
      this.currentPage = 0;
      this.total = 0;
      this.hasMore = false;
    },
  },
});
