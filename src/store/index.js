import Vue from "vue";
import Vuex from "vuex";
import Cookies from "js-cookie";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: (() => {
      const isExplicitlyLoggedOut =
        localStorage.getItem("isExplicitlyLoggedOut") === "true";
      return isExplicitlyLoggedOut
        ? null
        : localStorage.getItem("token") || null;
    })(),
    role: (() => {
      const isExplicitlyLoggedOut =
        localStorage.getItem("isExplicitlyLoggedOut") === "true";
      return isExplicitlyLoggedOut
        ? null
        : localStorage.getItem("userRole") || null;
    })(),
    user: (() => {
      try {
        const isExplicitlyLoggedOut =
          localStorage.getItem("isExplicitlyLoggedOut") === "true";
        if (isExplicitlyLoggedOut) return null;
        const userStr = Cookies.get("user") || localStorage.getItem("user");
        if (userStr) {
          return JSON.parse(userStr);
        }
      } catch (e) {
        // Invalid JSON, return null
      }
      return null;
    })(),
    isAuthenticated: (() => {
      const isExplicitlyLoggedOut =
        localStorage.getItem("isExplicitlyLoggedOut") === "true";
      return !isExplicitlyLoggedOut && !!localStorage.getItem("token");
    })(),
    isExplicitlyLoggedOut:
      localStorage.getItem("isExplicitlyLoggedOut") === "true",
  },
  mutations: {
    setUser(state, { token, role, user }) {
      state.token = token;
      state.role = role;
      state.user = user;
      state.isAuthenticated = true;
      state.isExplicitlyLoggedOut = false;

      // Store in both cookies and localStorage for consistency
      // Cookies expire in 1 day (24 hours)
      if (token) {
        Cookies.set("token", token, { expires: 1 }); // Expires in 1 day (24 hours)
        localStorage.setItem("token", token);
      }
      if (role) {
        Cookies.set("userRole", role, { expires: 1 });
        localStorage.setItem("userRole", role);
      }
      if (user) {
        Cookies.set("user", JSON.stringify(user), { expires: 1 });
        localStorage.setItem("user", JSON.stringify(user));
      }
      // Clear logout flag when user logs in
      localStorage.removeItem("isExplicitlyLoggedOut");
    },
    clearUser(state) {
      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isExplicitlyLoggedOut = true;

      // Clear from both cookies and localStorage
      Cookies.remove("token");
      Cookies.remove("userRole");
      Cookies.remove("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
      // Set explicit logout flag to prevent auto-login
      localStorage.setItem("isExplicitlyLoggedOut", "true");
    },
  },
  getters: {
    getRole: (state) => state.role,
    isAuthenticated: (state) => state.isAuthenticated,
    getToken: (state) => state.token,
    getUser: (state) => {
      // First try to get from state (reactive)
      if (state.user) {
        return state.user;
      }
      // Fallback to cookies/localStorage
      try {
        const userStr = Cookies.get("user") || localStorage.getItem("user");
        if (userStr) {
          return JSON.parse(userStr);
        }
      } catch (e) {
        // Invalid JSON, return null
      }
      return null;
    },
  },
  actions: {
    refreshAuth({ commit }) {
      // Check if user explicitly logged out - if so, don't restore session
      const isExplicitlyLoggedOut =
        localStorage.getItem("isExplicitlyLoggedOut") === "true";
      if (isExplicitlyLoggedOut) {
        commit("clearUser");
        return;
      }

      // Refresh auth state from localStorage and cookies
      let token = null;
      let role = null;
      let userStr = null;

      // Try to get from cookies first
      try {
        token = Cookies.get("token");
        role = Cookies.get("userRole");
        userStr = Cookies.get("user");
      } catch (error) {
        // Cookies not available, will use localStorage
      }

      // Fallback to localStorage
      if (!token) {
        token = localStorage.getItem("token");
      }
      if (!role) {
        role = localStorage.getItem("userRole");
      }
      if (!userStr) {
        userStr = localStorage.getItem("user");
      }

      if (token) {
        let user = null;
        if (userStr) {
          try {
            user = JSON.parse(userStr);
          } catch (e) {
            // Invalid JSON, ignore
          }
        }

        commit("setUser", {
          token,
          role,
          user,
        });
      } else {
        commit("clearUser");
      }
    },
  },
  modules: {},
});
