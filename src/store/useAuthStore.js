import { defineStore } from "pinia";
import axios from "axios";

const TOKEN_KEY = "recipeFinderToken";
const USER_KEY = "recipeFinderUser";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://recipefinder-1-syd5.onrender.com";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || "",
    user: JSON.parse(localStorage.getItem(USER_KEY) || "null"),
    isLoading: false,
    error: "",
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
  },
  actions: {
    clearError() {
      this.error = "";
    },
    setSession(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    logout() {
      this.token = "";
      this.user = null;
      this.error = "";
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    async loginWithGoogleCredential(credential) {
      this.isLoading = true;
      this.clearError();

      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {
          credential,
        });
        this.setSession(response.data.token, response.data.user);
      } catch (error) {
        this.error =
          error?.response?.data?.error ||
          "Google login failed. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
  },
});
