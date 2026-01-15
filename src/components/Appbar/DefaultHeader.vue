<template>
  <v-app-bar app color="white" elevation="1" class="demo-navbar">
    <v-app-bar-nav-icon
      v-if="isLoggedIn"
      @click="$emit('toggle-drawer')"
      aria-label="Toggle navigation menu"
    />
    <div class="d-flex align-center navbar-brand">
      <img
        src="@/assets/university-of-peshawar-logo.png"
        alt="University of Peshawar"
        class="navbar-logo"
      />
      <span v-if="currentPageTitle" class="navbar-page-title">
        {{ currentPageTitle }}
      </span>
    </div>
    <v-spacer></v-spacer>
    <CurrentTimeDate />
    <v-spacer></v-spacer>
    <div v-if="isLoggedIn" class="user-role-badge">
      <v-icon class="user-role-icon">mdi-account-circle</v-icon>
      <div class="user-info">
        <span v-if="userName" class="user-name">{{ userName }}</span>
        <span class="user-role-text">{{ userRoleText }}</span>
      </div>
    </div>
  </v-app-bar>
</template>

<script>
import CurrentTimeDate from "./CurrentTimeDate.vue";

export default {
  name: "DefaultHeader",
  props: {
    isLoggedIn: { type: Boolean, default: false },
    userRoleText: { type: String, default: "" },
  },
  components: {
    CurrentTimeDate,
  },
  computed: {
    currentPageTitle() {
      // Get the current route's meta title
      if (this.$route && this.$route.meta && this.$route.meta.title) {
        return this.$route.meta.title;
      }
      // Fallback to route name if no meta title
      if (this.$route && this.$route.name) {
        return this.$route.name;
      }
      return "";
    },
    userName() {
      const user = this.$store.getters.getUser;
      if (user) {
        // Try name first, then email as fallback
        if (user.name && user.name.trim()) {
          return user.name.trim();
        }
        // If no name, use email prefix as fallback
        if (user.email) {
          const emailPrefix = user.email.split("@")[0];
          return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
        }
      }
      return null;
    },
  },
};
</script>
