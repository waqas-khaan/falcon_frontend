<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    class="demo-sidebar"
    width="300"
    :aria-label="'Navigation menu'"
    role="navigation"
  >
    <div class="sidebar-content-wrapper">
      <v-list nav dense class="sidebar-menu" role="menu">
        <template v-for="(item, index) in menuItems">
          <!-- Group items with children (dropdown) -->
          <v-list-group
            v-if="item.children && item.children.length > 0"
            :key="`group-${index}-${item.title}`"
            :prepend-icon="item.icon"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="child in item.children"
              :key="`child-${index}-${child.title}`"
              :to="child.to"
              :exact="child.exact"
              link
              class="sidebar-menu-item"
              :aria-label="`Navigate to ${child.title}`"
              role="menuitem"
              tabindex="0"
            >
              <v-list-item-icon>
                <v-icon aria-hidden="true">{{ child.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ child.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <!-- Regular items without children -->
          <v-list-item
            v-else
            :key="`item-${index}-${item.title}`"
            :to="item.to"
            :exact="item.exact"
            link
            class="sidebar-menu-item"
            :aria-label="`Navigate to ${item.title}`"
            role="menuitem"
            tabindex="0"
          >
            <v-list-item-icon>
              <v-icon aria-hidden="true">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-list-item
          @click="signOut"
          class="sidebar-menu-item"
          aria-label="Sign out from the system"
          role="menuitem"
          tabindex="0"
        >
          <v-list-item-icon>
            <v-icon aria-hidden="true">mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- Development Company Logo -->

      <img
        :src="logoImage"
        alt="Falcon Development Company Logo"
        class="sidebar-logo"
        @error="handleImageError"
      />
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "MainToolbar",
  data() {
    return {
      logoImage: require("@/assets/Falcon-logos.png"),
      imageError: false,
    };
  },
  mounted() {
    require("@/assets/css/MainToolbar.css");
  },
  props: {
    value: Boolean,
  },
  computed: {
    drawer: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    menuItems() {
      // Normalize roles: "administration" -> "admin", "operator" -> "user"
      let userRole = (this.$store.getters.getRole || "").toLowerCase();
      if (userRole === "administration") {
        userRole = "admin";
      } else if (userRole === "operator") {
        userRole = "user";
      }

      const isAdmin = userRole === "admin";
      const isResultControl = userRole === "result_control";
      const isRegistrationControl = userRole === "registration_control";
      const isUser = userRole === "user";

      const items = [];

      // Dashboard - show for all roles
      items.push({
        title: "Dashboard",
        icon: isAdmin ? "mdi-view-dashboard" : "mdi-view-dashboard-outline",
        to: isAdmin ? "/dashboard/admin" : "/dashboard/user",
        exact: true,
      });

      // Register Records - admin and read-only user (operator) can view
      if (isAdmin || isUser) {
        items.push({
          title: "Results Register",
          icon: "mdi-book-open-variant",
          to: "/register-records",
          exact: false,
        });
      }

      // Registration - admin, registration_control, and read-only user (operator) can view
      if (isAdmin || isRegistrationControl || isUser) {
        items.push({
          title: "Registration",
          icon: "mdi-file-document",
          to: "/student-registration",
          exact: false,
        });
      }

      // Results - admin, result_control, and read-only user (operator) can view
      if (isAdmin || isResultControl || isUser) {
        items.push({
          title: "Results",
          icon: "mdi-school",
          to: "/results",
          exact: false,
        });
      }

      // Add admin-only items
      if (isAdmin) {
        items.push(
          {
            title: "Colleges & Programs",
            icon: "mdi-school-outline",
            to: "/college-programs",
            exact: false,
          },
          {
            title: "User Management",
            icon: "mdi-account-group",
            to: "/index/auth/login/admin/get/user_role",
            exact: true,
          }
        );
      }

      return items;
    },
  },
  methods: {
    signOut() {
      // Clear user from Vuex store (which clears cookies and localStorage)
      this.$store.commit("clearUser");
      this.$router.push("/login");
    },
    handleImageError() {
      if (!this.imageError) {
        console.error("Failed to load Falcon logo");
        this.imageError = true;
      }
    },
  },
};
</script>
