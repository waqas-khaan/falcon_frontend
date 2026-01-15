<template>
  <v-app>
    <DefaultHeader
      v-if="!isLoginPage"
      :is-logged-in="isLoggedIn"
      :user-role-text="userRoleText"
      @toggle-drawer="drawer = !drawer"
    />
    <MainToolbar v-if="isLoggedIn && !isLoginPage" v-model="drawer" />
    <!-- <ConnectionStatus /> -->
    <v-main>
      <router-view />
    </v-main>
    <Toast ref="toast" />
  </v-app>
</template>

<script>
import MainToolbar from "./components/SideView/MainToolbar.vue";
import DefaultHeader from "./components/Appbar/DefaultHeader.vue";
import Toast from "./components/Toast.vue";
// import ConnectionStatus from "./components/ConnectionStatus.vue";
import "@/assets/css/Navbar.css";

export default {
  name: "App",
  components: {
    MainToolbar,
    DefaultHeader,
    Toast,
    // ConnectionStatus,
  },
  data() {
    // Check if current route is a student detail/edit page (not /student/add)
    const path = this.$route.path;
    const isStudentDetailPage =
      path.startsWith("/student/") && path !== "/student/add";

    return {
      drawer: !isStudentDetailPage,
    };
  },
  computed: {
    isLoggedIn() {
      // Get authentication state from Vuex store (reactive)
      return this.$store.getters.isAuthenticated;
    },
    isLoginPage() {
      const isAuthRoute =
        this.$route.path === "/login" ||
        this.$route.path === "/index/auth/login/user_role" ||
        this.$route.path === "/auth/login/user_role";
      const embedFlag = this.$route.query && this.$route.query.embed;
      const isEmbedded =
        embedFlag !== undefined &&
        embedFlag !== null &&
        `${embedFlag}` !== "0" &&
        `${embedFlag}` !== "false";
      return isAuthRoute || isEmbedded;
    },
    isStudentPage() {
      return this.$route.path.startsWith("/student/");
    },
    isStudentDetailPage() {
      // Hide sidebar only on student detail/edit pages, not on /student/add
      const path = this.$route.path;
      return path.startsWith("/student/") && path !== "/student/add";
    },
    userRole() {
      // Get role from Vuex store (reactive)
      return this.$store.getters.getRole;
    },
    userRoleText() {
      const role = (this.userRole || "").toLowerCase();
      // Normalize roles: "administration" -> "admin", "operator" -> "user"
      const normalizedRole =
        role === "administration"
          ? "admin"
          : role === "operator"
          ? "user"
          : role;

      if (normalizedRole === "admin") {
        return "Admin";
      } else if (normalizedRole === "user") {
        return "Operator";
      } else if (normalizedRole === "result_control") {
        return "Result Control";
      } else if (normalizedRole === "registration_control") {
        return "Registration Control";
      }
      return "";
    },
  },
  mounted() {
    // Refresh auth state from cookies on mount for real-time updates
    this.$store.dispatch("refreshAuth");

    // Set up periodic refresh for real-time updates (every 30 seconds)
    this.authRefreshInterval = setInterval(() => {
      this.$store.dispatch("refreshAuth");
    }, 30000);

    // Make toast available globally
    this.$root.$toast = this.$refs.toast;
    window.$toast = this.$refs.toast;
    window.$vue = this;
  },
  beforeDestroy() {
    // Clear interval on component destroy
    if (this.authRefreshInterval) {
      clearInterval(this.authRefreshInterval);
    }
  },
  methods: {
    logout() {
      // Clear user from Vuex store (which clears cookies)
      this.$store.commit("clearUser");
      this.$router.push("/login");
    },
  },
  watch: {
    $route() {
      // Close drawer on mobile when route changes
      if (this.$vuetify.breakpoint.mobile) {
        this.drawer = false;
      } else {
        // Set drawer state based on route: closed on student detail/edit pages, open on others (including /student/add)
        this.drawer = !this.isStudentDetailPage;
      }
    },
  },
};
</script>
