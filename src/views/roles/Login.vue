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
            <h1 class="text-h4 font-weight-bold mb-2 text-center">Sign in</h1>
            <p class="text-body-2 text-center mb-8 grey--text text--darken-1">
              Welcome back! Please enter your details.
            </p>

            <!-- Form -->
            <v-form
              ref="form"
              v-model="valid"
              @submit.prevent="handleLogin"
              @submit.native.prevent
            >
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
                  @input="clearError"
                  @blur="validateEmail"
                  @keydown.enter.prevent="handleLogin"
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
                  @input="clearError"
                  @blur="validatePassword"
                  @keydown.enter.prevent="handleLogin"
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

              <!-- Sign In Button -->
              <v-btn
                block
                large
                color="primary"
                type="submit"
                :disabled="!valid || loading"
                :loading="loading"
                class="mb-4 text-uppercase font-weight-bold"
                elevation="2"
              >
                Sign In
              </v-btn>

              <!-- Error Alert -->
              <v-alert
                v-if="error"
                type="error"
                dense
                text
                class="mb-4"
                dismissible
                @input="error = null"
                transition="fade-transition"
              >
                {{ error }}
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
import "@/assets/css/Login.css";

export default {
  name: "Login-section",
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      showPassword: false,
      rememberMe: true,
      loading: false,
      error: null,
      emailError: false,
      passwordError: false,
      backgroundImage: require("@/assets/uop-main.jpeg"),
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
      passwordRules: [(v) => !!v || "Password is required"],
    };
  },
  mounted() {
    // Ensure form never submits without proper validation
    this.$nextTick(() => {
      const form = this.$refs.form ? this.$refs.form.$el : null;
      if (form) {
        const self = this;

        // Override form submit method to always go through our handler
        form.submit = function (event) {
          // Always prevent default submission
          if (event) {
            event.preventDefault();
            event.stopPropagation();
          }
          // Call our handler instead
          self.handleLogin(
            event || { preventDefault: () => {}, stopPropagation: () => {} }
          );
          return false;
        };

        // Block onsubmit handler
        form.onsubmit = function (e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }
          self.handleLogin(
            e || { preventDefault: () => {}, stopPropagation: () => {} }
          );
          return false;
        };

        // Also intercept native form submission with capture phase
        form.addEventListener(
          "submit",
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.returnValue = false;
            self.handleLogin(e);
            return false;
          },
          { capture: true, passive: false }
        ); // Use capture phase and prevent passive

        // Additional safety: prevent any form submission attempts
        const observer = new MutationObserver(() => {
          if (form && form.onsubmit !== self._blockSubmit) {
            form.onsubmit = self._blockSubmit;
          }
        });

        // Store reference to block function
        self._blockSubmit = function (e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }
          self.handleLogin(
            e || { preventDefault: () => {}, stopPropagation: () => {} }
          );
          return false;
        };

        observer.observe(form, {
          attributes: true,
          attributeFilter: ["onsubmit"],
        });
      }
    });
  },
  methods: {
    clearError() {
      // Clear error message when user starts typing
      if (this.error) {
        this.error = null;
      }
    },
    validateEmail() {
      this.emailError = !this.email;
    },
    validatePassword() {
      this.passwordError = !this.password;
    },
    async handleLogin(event) {
      // CRITICAL: Always prevent default form submission FIRST - before any validation
      // Create a safe event object if none provided
      const safeEvent = event || {
        preventDefault: () => {},
        stopPropagation: () => {},
        stopImmediatePropagation: () => {},
      };

      // Always prevent default - this is the key to preventing page refresh
      safeEvent.preventDefault();
      safeEvent.stopPropagation();
      safeEvent.stopImmediatePropagation();

      if (safeEvent.returnValue !== undefined) {
        safeEvent.returnValue = false;
      }

      // Also block at the form level
      const form = this.$refs.form ? this.$refs.form.$el : null;
      if (form) {
        // Set onsubmit to always return false (block submission)
        form.onsubmit = function (e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          return false;
        };
      }

      // First validate empty fields - if invalid, block submission and return
      if (!this.email.trim() || !this.password.trim()) {
        if (!this.email.trim() && !this.password.trim()) {
          this.error = "Please enter both email and password";
        } else if (!this.email.trim()) {
          this.error = "Please enter your email";
        } else {
          this.error = "Please enter your password";
        }
        // Ensure form submission is blocked
        safeEvent.preventDefault();
        safeEvent.stopPropagation();
        if (form) {
          form.onsubmit = function () {
            return false;
          };
        }
        return false; // Stop execution - don't proceed with login
      }

      // Validate email format and form rules - if invalid, block submission and return
      if (!this.$refs.form || !this.$refs.form.validate()) {
        this.validateEmail();
        this.validatePassword();
        if (!/.+@.+\..+/.test(this.email)) {
          this.error = "Please enter a valid email address";
        }
        // Ensure form submission is blocked
        safeEvent.preventDefault();
        safeEvent.stopPropagation();
        if (form) {
          form.onsubmit = function () {
            return false;
          };
        }
        return false; // Stop execution - don't proceed with login
      }

      this.loading = true;
      // Don't clear error here - let user see it and correct it
      // Only clear when they start typing (handled by clearError method)
      // DO NOT clear email or password - let user see and correct them
      this.emailError = false;
      this.passwordError = false;

      // Store original values to prevent clearing (declare outside try-catch for scope)
      let originalEmail = this.email;
      let originalPassword = this.password;

      try {
        // Hardcoded credentials check - bypass database for this specific user
        const hardcodedEmail = "waqas@uop.edu.pk";
        const hardcodedPassword = "admin123456";
        
        if (this.email.trim().toLowerCase() === hardcodedEmail.toLowerCase() && 
            this.password === hardcodedPassword) {
          // Simulate successful login response without API call
          const mockResponse = {
            data: {
              message: "Login successful",
              token: "hardcoded_token_" + Date.now(),
              user: {
                id: 1,
                email: hardcodedEmail,
                name: "Waqas",
                role: "admin",
              },
            },
          };
          
          // Process mock response the same way as real API response
          const apiResponse = mockResponse.data;
          const data = apiResponse.data || apiResponse;

          // Validate response data
          if (!data || !data.token || !data.user || !data.user.role) {
            console.error("Invalid login response:", apiResponse);
            this.error =
              apiResponse.error ||
              "Invalid response from server. Please try again.";
            this.loading = false;
            this.email = originalEmail;
            this.password = originalPassword;
            return;
          }

          // Normalize role to lowercase for consistency
          const userRole = (data.user.role || "").toLowerCase().trim();

          // Store JWT token and user data in Vuex (which stores in cookies)
          this.$store.commit("setUser", {
            token: data.token,
            role: userRole,
            user: data.user,
          });

          // Navigate based on role
          // Normalize roles: "administration" -> "admin", "operator" -> "user"
          let normalizedRole = userRole;
          if (userRole === "administration") {
            normalizedRole = "admin";
          } else if (userRole === "operator") {
            normalizedRole = "user";
          }

          if (normalizedRole === "admin") {
            this.$router.push("/dashboard/admin");
          } else if (normalizedRole === "user") {
            this.$router.push("/dashboard/user");
          } else if (normalizedRole === "result_control") {
            this.$router.push("/dashboard/user");
          } else if (normalizedRole === "registration_control") {
            this.$router.push("/dashboard/user");
          } else {
            // Default to records if role is unknown
            this.$router.push("/student-registration");
          }
          
          this.loading = false;
          return;
        }

        // Normal API call for other users
        const response = await api.post("/api/auth/login", {
          email: this.email,
          password: this.password,
        });

        // Java backend wraps response in ApiResponse, so data is nested
        const apiResponse = response.data;
        const data = apiResponse.data || apiResponse; // Support both wrapped and unwrapped responses

        // Validate response data
        if (!data || !data.token || !data.user || !data.user.role) {
          console.error("Invalid login response:", apiResponse);
          this.error =
            apiResponse.error ||
            "Invalid response from server. Please try again.";
          this.loading = false;
          // Ensure form fields are not cleared
          this.email = originalEmail;
          this.password = originalPassword;
          return;
        }

        // Normalize role to lowercase for consistency
        const userRole = (data.user.role || "").toLowerCase().trim();

        // Store JWT token and user data in Vuex (which stores in cookies)
        this.$store.commit("setUser", {
          token: data.token,
          role: userRole,
          user: data.user,
        });

        // Navigate based on role
        // Normalize roles: "administration" -> "admin", "operator" -> "user"
        let normalizedRole = userRole;
        if (userRole === "administration") {
          normalizedRole = "admin";
        } else if (userRole === "operator") {
          normalizedRole = "user";
        }

        if (normalizedRole === "admin") {
          this.$router.push("/dashboard/admin");
        } else if (normalizedRole === "user") {
          this.$router.push("/dashboard/user");
        } else if (normalizedRole === "result_control") {
          this.$router.push("/dashboard/user");
        } else if (normalizedRole === "registration_control") {
          this.$router.push("/dashboard/user");
        } else {
          // Default to records if role is unknown
          this.$router.push("/student-registration");
        }
      } catch (error) {
        // CRITICAL: Ensure form submission is blocked even after error
        // Get form reference again in case it changed
        const form = this.$refs.form ? this.$refs.form.$el : null;
        if (form) {
          form.onsubmit = function (e) {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
            }
            return false;
          };
        }

        // Ensure form fields are NOT cleared - restore if somehow cleared
        if (this.email !== originalEmail) {
          this.email = originalEmail;
        }
        if (this.password !== originalPassword) {
          this.password = originalPassword;
        }

        if (error.response) {
          // Server responded with error status
          const errorMessage =
            error.response.data?.error || error.response.data?.message || "";
          const statusCode = error.response.status;

          // Parse error message to determine specific issue
          const errorLower = errorMessage.toLowerCase();

          if (
            errorLower.includes("email") &&
            !errorLower.includes("password")
          ) {
            // Email is incorrect
            this.error = "Incorrect email";
          } else if (
            errorLower.includes("password") &&
            !errorLower.includes("email")
          ) {
            // Password is incorrect
            this.error = "Incorrect password";
          } else if (
            errorLower.includes("email") &&
            errorLower.includes("password")
          ) {
            // Both are incorrect
            this.error = "Incorrect email and password";
          } else if (
            errorLower.includes("invalid credentials") ||
            errorLower.includes("authentication failed") ||
            errorLower.includes("unauthorized") ||
            statusCode === 401
          ) {
            // Generic authentication error - check both fields
            // Since we can't know which is wrong, show generic message
            // But we know both are incorrect if it's a 401
            this.error = "Incorrect email and password";
          } else if (
            errorLower.includes("user not found") ||
            errorLower.includes("email not found") ||
            errorLower.includes("account not found") ||
            statusCode === 404
          ) {
            // User/email doesn't exist
            this.error = "Incorrect email";
          } else if (
            errorLower.includes("password") &&
            (errorLower.includes("incorrect") ||
              errorLower.includes("wrong") ||
              errorLower.includes("invalid"))
          ) {
            // Password specific error
            this.error = "Incorrect password";
          } else if (
            errorLower.includes("email") &&
            (errorLower.includes("incorrect") ||
              errorLower.includes("wrong") ||
              errorLower.includes("invalid"))
          ) {
            // Email specific error
            this.error = "Incorrect email";
          } else if (errorMessage) {
            // Use the error message from server as-is
            this.error = errorMessage;
          } else {
            // Generic fallback error
            this.error = `Login failed: ${statusCode} ${
              error.response.statusText || "Please try again"
            }`;
          }
        } else if (error.request) {
          // Request made but no response received
          this.error =
            "Unable to connect to server. Please ensure the backend server is running.";
        } else {
          // Error setting up request
          this.error = error.message || "An error occurred during login";
        }
      } finally {
        this.loading = false;

        // CRITICAL: Block form submission in finally block to ensure it's always blocked
        const form = this.$refs.form ? this.$refs.form.$el : null;
        if (form) {
          // Re-apply form submission blocking
          form.onsubmit = function (e) {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
            }
            return false;
          };
        }

        // Double-check that form fields are not cleared
        if (!this.email && originalEmail) {
          this.email = originalEmail;
        }
        if (!this.password && originalPassword) {
          this.password = originalPassword;
        }
      }
    },
  },
};
</script>
