<template>
  <v-container fluid fill-height class="login-container">
    <!-- Background Image -->
    <div
      class="background-image"
      :style="{ backgroundImage: 'url(' + backgroundImage + ')' }"
    ></div>

    <!-- Content -->
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="5" xl="4">
        <v-card class="white rounded-lg elevation-5">
          <v-card-text class="pa-8">
            <!-- Logo -->
            <div class="text-center mb-6">
              <v-img
                :src="require('@/assets/university-of-peshawar-logo.png')"
                alt="University of Peshawar"
                max-width="200"
                class="mx-auto"
                contain
              ></v-img>
            </div>

            <!-- Heading -->
            <h1 class="text-h4 font-weight-bold mb-2 text-center">
              Create Account / Login
            </h1>
            <p class="text-body-2 text-center mb-8 grey--text text--darken-1">
              Enter your details to create an account or login. If the account
              exists, your role will be updated.
            </p>

            <!-- Form -->
            <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
              <!-- Name Field -->
              <div class="mb-4">
                <div
                  class="text-body-2 font-weight-medium mb-2 d-flex align-center"
                >
                  <v-icon small class="mr-1">mdi-account-outline</v-icon>
                  <span class="grey--text text--darken-2">Name</span>
                </div>
                <v-text-field
                  v-model="name"
                  type="text"
                  placeholder="Enter Your Name"
                  :rules="nameRules"
                  required
                  outlined
                  hide-details="auto"
                  class="mb-3"
                  @blur="validateName"
                ></v-text-field>
              </div>

              <!-- Email Field -->
              <div class="mb-4">
                <div
                  class="text-body-2 font-weight-medium mb-2 d-flex align-center"
                >
                  <v-icon small class="mr-1">mdi-email-outline</v-icon>
                  <span class="grey--text text--darken-2">Email</span>
                </div>
                <v-text-field
                  v-model="email"
                  type="email"
                  placeholder="Enter Email"
                  :rules="emailRules"
                  required
                  outlined
                  hide-details="auto"
                  class="mb-3"
                  @blur="validateEmail"
                ></v-text-field>
              </div>

              <!-- Password Field -->
              <div class="mb-4">
                <div
                  class="text-body-2 font-weight-medium mb-2 d-flex align-center"
                >
                  <v-icon small class="mr-1">mdi-lock-outline</v-icon>
                  <span class="grey--text text--darken-2">Password</span>
                </div>
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter Password"
                  :rules="passwordRules"
                  required
                  outlined
                  hide-details="auto"
                  class="mb-3"
                  @blur="validatePassword"
                >
                  <template v-slot:append>
                    <v-icon
                      @click="showPassword = !showPassword"
                      class="pointer"
                    >
                      {{ showPassword ? "mdi-eye-off" : "mdi-eye" }}
                    </v-icon>
                  </template>
                </v-text-field>
              </div>

              <!-- User Role Selection -->
              <div class="mb-4">
                <div
                  class="text-body-2 font-weight-medium mb-2 d-flex align-center"
                >
                  <v-icon small class="mr-1">mdi-account-cog-outline</v-icon>
                  <span class="grey--text text--darken-2">User Role</span>
                </div>
                <v-select
                  v-model="userRole"
                  :items="roleOptions"
                  placeholder="Select Role"
                  :rules="roleRules"
                  required
                  outlined
                  hide-details="auto"
                  class="mb-3"
                  item-text="text"
                  item-value="value"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        item.description
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                </v-select>
              </div>

              <!-- Create/Login Button -->
              <v-btn
                block
                large
                color="primary"
                :disabled="!valid || loading"
                :loading="loading"
                @click="handleLogin"
                class="mb-4 text-uppercase font-weight-bold"
                elevation="2"
              >
                Create Account / Login
              </v-btn>

              <!-- Error Alert -->
              <v-alert v-if="error" type="error" dense text class="mb-4">
                {{ error }}
              </v-alert>

              <!-- Success Alert -->
              <v-alert v-if="success" type="success" dense text class="mb-4">
                {{ success }}
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from "@/config/api";
import "@/assets/css/UserRoleLogin.css";

export default {
  name: "UserRoleLogin",
  data() {
    return {
      valid: false,
      name: "",
      email: "",
      password: "",
      userRole: "",
      showPassword: false,
      loading: false,
      error: null,
      success: null,
      nameError: false,
      emailError: false,
      passwordError: false,
      backgroundImage: require("@/assets/uop-main.jpeg"),
      roleOptions: [
        {
          text: "Admin",
          value: "admin",
          description: "Full system access and management",
        },
        {
          text: "Operator",
          value: "user",
          description: "Standard user access",
        },
        {
          text: "Result Control",
          value: "result_control",
          description: "Manage results: view, add, and edit result data",
        },
        {
          text: "Registration Control",
          value: "registration_control",
          description:
            "Manage student registration: view, add, and edit student data",
        },
      ],
      nameRules: [
        (v) => !!v || "Name is required",
        (v) =>
          (v && v.trim().length >= 2) || "Name must be at least 2 characters",
      ],
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
      passwordRules: [(v) => !!v || "Password is required"],
      roleRules: [(v) => !!v || "User role is required"],
    };
  },
  methods: {
    validateName() {
      this.nameError = !this.name || this.name.trim().length < 2;
    },
    validateEmail() {
      this.emailError = !this.email;
    },
    validatePassword() {
      this.passwordError = !this.password;
    },
    async handleLogin(event) {
      // Prevent form submission and page refresh
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (!this.$refs.form.validate()) {
        this.validateName();
        this.validateEmail();
        this.validatePassword();
        return false;
      }

      this.loading = true;
      this.error = null;
      this.success = null;
      this.nameError = false;
      this.emailError = false;
      this.passwordError = false;

      try {
        // Create or update user and login in one call
        const response = await api.post(
          "/api/auth/create-or-update-and-login",
          {
            name: this.name.trim(),
            email: this.email,
            password: this.password,
            role: this.userRole,
          }
        );

        // Java backend wraps response in ApiResponse, so data is nested
        const apiResponse = response.data;
        const data = apiResponse.data || apiResponse; // Support both wrapped and unwrapped responses

        // Validate response
        if (!data || !data.token || !data.user) {
          console.error("Invalid login response:", apiResponse);
          this.error =
            apiResponse.error ||
            "Invalid response from server. Please try again.";
          return;
        }

        // Show success message
        this.success =
          data.message || apiResponse.message || "Successfully logged in!";

        // Store JWT token and user data in Vuex (which stores in cookies)
        this.$store.commit("setUser", {
          token: data.token,
          role: data.user.role.toLowerCase().trim(),
          user: data.user,
        });

        // Navigate based on role
        // Normalize roles: "administration" -> "admin", "operator" -> "user"
        setTimeout(() => {
          let role = data.user.role.toLowerCase();
          if (role === "administration") {
            role = "admin";
          } else if (role === "operator") {
            role = "user";
          }

          if (role === "admin") {
            this.$router.push("/dashboard/admin");
          } else if (role === "user") {
            this.$router.push("/dashboard/user");
          } else if (role === "result_control") {
            this.$router.push("/dashboard/user");
          } else if (role === "registration_control") {
            this.$router.push("/dashboard/user");
          } else {
            this.$router.push("/student-registration");
          }
        }, 1000);
      } catch (error) {
        if (error.response) {
          // Server responded with error status
          this.error =
            error.response.data?.error ||
            `Operation failed: ${error.response.status} ${error.response.statusText}`;
        } else if (error.request) {
          // Request made but no response received
          this.error =
            "Unable to connect to server. Please ensure the backend server is running.";
        } else {
          // Error setting up request
          this.error = error.message || "An error occurred";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
