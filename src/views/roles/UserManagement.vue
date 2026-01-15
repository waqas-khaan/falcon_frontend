<template>
  <v-container
    fluid
    class="user-management-container"
    style="
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 0 !important;
      margin: 0 !important;
      max-width: 100% !important;
    "
    :class="{ 'pa-0': true }"
  >
    <!-- Modern Header with Toolbar -->
    <v-toolbar
      flat
      color="white"
      class="user-management-header-toolbar"
      style="flex-shrink: 0; border-bottom: 1px solid #e0e0e0"
    >
      <v-toolbar-title class="dashboard-title">
        User Management
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Add User Button -->
      <v-btn
        color="primary"
        class="mx-1"
        @click="openAddUserDialog"
        title="Add New User"
        aria-label="Add new user"
      >
        <v-icon left>mdi-account-plus</v-icon>
        Add User
      </v-btn>

      <!-- Refresh Button -->
      <v-btn
        icon
        class="mx-1"
        @click="fetchUsers"
        :loading="loading"
        title="Refresh"
        aria-label="Refresh users list"
      >
        <v-icon style="color: black">mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- Main Content -->
    <v-row style="margin: 0; flex: 1; min-height: 0; overflow: hidden">
      <v-col
        cols="12"
        style="padding: 0; display: flex; flex-direction: column; min-height: 0"
      >
        <v-card
          elevation="0"
          class="table-card"
          style="
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
            overflow: hidden;
            height: 100%;
          "
        >
          <!-- Card Header with Search -->
          <v-card-title
            class="d-flex align-center"
            style="
              flex-shrink: 0;
              border-bottom: 1px solid #e0e0e0;
              background-color: #fafafa;
              padding: 12px 16px !important;
              min-height: 56px;
            "
          >
            <span class="text-h6 font-weight-bold">All Users</span>
            <v-spacer></v-spacer>
            <v-chip color="primary" small class="mr-4 user-count-chip" outlined>
              <v-icon small left>mdi-account-group</v-icon>
              Total: {{ users.length }}
            </v-chip>
            <v-text-field
              v-model="search"
              label="Search users"
              prepend-inner-icon="mdi-magnify"
              single-line
              hide-details
              outlined
              dense
              style="max-width: 300px"
              class="search-field"
            ></v-text-field>
          </v-card-title>

          <!-- Table -->
          <v-card-text
            class="pa-0"
            style="
              flex: 1;
              min-height: 0;
              overflow: hidden;
              display: flex;
              flex-direction: column;
            "
          >
            <v-data-table
              :headers="headers"
              :items="users"
              :items-per-page="25"
              :loading="loading"
              class="elevation-0 user-management-table"
              :search="search"
              :footer-props="{
                'items-per-page-options': [10, 25, 50, 100, -1],
                'items-per-page-text': 'Users per page:',
              }"
              :no-data-text="loading ? 'Loading users...' : 'No users found'"
              style="
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
              "
            >
              <template slot="item.email" slot-scope="{ item }">
                <div class="d-flex align-center">
                  <v-icon small color="primary" class="mr-2"
                    >mdi-email-outline</v-icon
                  >
                  <span class="text-body-2 user-email">{{ item.email }}</span>
                </div>
              </template>
              <template slot="item.name" slot-scope="{ item }">
                <div class="d-flex align-center">
                  <v-icon small color="primary" class="mr-2"
                    >mdi-account-outline</v-icon
                  >
                  <span class="text-body-2 font-weight-medium user-name">{{
                    item.name || "N/A"
                  }}</span>
                </div>
              </template>
              <template slot="item.role" slot-scope="{ item }">
                <v-chip
                  :color="getRoleColor(item.role)"
                  small
                  dark
                  class="text-capitalize font-weight-medium role-chip"
                >
                  {{ item.role }}
                </v-chip>
              </template>
              <template slot="item.created_at" slot-scope="{ item }">
                <span class="text-body-2">{{
                  formatDate(item.created_at)
                }}</span>
              </template>
              <template slot="item.actions" slot-scope="{ item }">
                <div class="d-flex justify-center action-buttons">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        small
                        class="action-btn"
                        @click="openUpdateDialog(item)"
                        v-bind="attrs"
                        v-on="on"
                        :disabled="updating"
                        title="Update User"
                      >
                        <v-icon small style="color: black">mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Update User</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        small
                        class="action-btn"
                        @click="openDeleteDialog(item)"
                        v-bind="attrs"
                        v-on="on"
                        :disabled="deleting || isCurrentUser(item)"
                        title="Delete User"
                      >
                        <v-icon small style="color: black">mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span v-if="isCurrentUser(item)"
                      >Cannot delete your own account</span
                    >
                    <span v-else>Delete User</span>
                  </v-tooltip>
                </div>
              </template>
              <template slot="no-data">
                <div class="text-center pa-8">
                  <v-icon size="64" color="grey lighten-1"
                    >mdi-account-off</v-icon
                  >
                  <p class="mt-4 grey--text text--darken-1">No users found</p>
                </div>
              </template>
              <template slot="loading">
                <div class="text-center pa-8">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="48"
                  ></v-progress-circular>
                  <p class="mt-4 grey--text text--darken-1">Loading users...</p>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add User Dialog -->
    <v-dialog v-model="showAddUserDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="headline white--text dialog-header-add">
          <v-icon color="white" class="mr-2">mdi-account-plus</v-icon>
          Add New User
        </v-card-title>
        <v-card-text class="pt-6">
          <v-form ref="addUserForm" v-model="addUserFormValid">
            <v-text-field
              v-model="newUser.email"
              label="Email"
              type="email"
              outlined
              dense
              prepend-inner-icon="mdi-email-outline"
              :rules="emailRules"
              required
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="newUser.name"
              label="Name (Optional)"
              outlined
              dense
              prepend-inner-icon="mdi-account-outline"
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="newUser.password"
              label="Password"
              :type="addPasswordVisible ? 'text' : 'password'"
              outlined
              dense
              prepend-inner-icon="mdi-lock-outline"
              :append-icon="addPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="addPasswordVisible = !addPasswordVisible"
              :rules="passwordRules"
              required
              class="mb-3"
            ></v-text-field>

            <v-select
              v-model="newUser.role"
              :items="roleOptions"
              label="Role"
              outlined
              dense
              prepend-inner-icon="mdi-shield-account-outline"
              :rules="[(v) => !!v || 'Role is required']"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeAddUserDialog" :disabled="creating">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="createUser"
            :loading="creating"
            :disabled="!addUserFormValid"
          >
            <v-icon left>mdi-content-save</v-icon>
            Create User
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Update User Dialog -->
    <v-dialog v-model="showUpdateDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="headline white--text dialog-header-edit">
          <v-icon color="white" class="mr-2">mdi-account-edit</v-icon>
          Update User
        </v-card-title>
        <v-card-text class="pt-6">
          <v-form ref="updateUserForm" v-model="updateUserFormValid">
            <v-text-field
              v-model="updateForm.email"
              label="Email"
              type="email"
              outlined
              dense
              prepend-inner-icon="mdi-email-outline"
              :rules="emailRules"
              required
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="updateForm.name"
              label="Name"
              outlined
              dense
              prepend-inner-icon="mdi-account-outline"
              class="mb-3"
            ></v-text-field>

            <v-select
              v-model="updateForm.role"
              :items="roleOptions"
              label="Role"
              outlined
              dense
              prepend-inner-icon="mdi-shield-account-outline"
              :rules="[(v) => !!v || 'Role is required']"
              required
              class="mb-3"
            ></v-select>

            <v-text-field
              v-model="updateForm.password"
              label="New Password (optional)"
              :type="updatePasswordVisible ? 'text' : 'password'"
              outlined
              dense
              prepend-inner-icon="mdi-lock-reset"
              :append-icon="updatePasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="updatePasswordVisible = !updatePasswordVisible"
              hint="Leave blank to keep the current password"
              persistent-hint
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeUpdateDialog" :disabled="updating">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="updateUser"
            :loading="updating"
            :disabled="!updateUserFormValid"
          >
            Update User
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="headline white--text dialog-header-delete">
          <v-icon color="white" class="mr-2">mdi-alert-circle</v-icon>
          Delete User
        </v-card-title>
        <v-card-text class="pt-6">
          <v-alert
            v-if="deletingUser && isCurrentUser(deletingUser)"
            type="warning"
            class="mb-4"
            icon="mdi-information-outline"
            prominent
            text
          >
            You cannot delete your own account. Please ask another admin to
            delete it if needed.
          </v-alert>
          <p v-else class="mb-4 text-body-1 grey--text text--darken-3">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div class="user-info-section user-info-section-delete mt-4">
            <div class="user-info-item mb-3">
              <v-icon small color="primary" class="mr-2">mdi-email</v-icon>
              <strong class="mr-2">Email:</strong>
              <span>{{ deletingUser?.email }}</span>
            </div>
            <div class="user-info-item mb-3">
              <v-icon small color="primary" class="mr-2">mdi-account</v-icon>
              <strong class="mr-2">Name:</strong>
              <span>{{ deletingUser?.name || "N/A" }}</span>
            </div>
            <div class="user-info-item">
              <v-icon small color="primary" class="mr-2"
                >mdi-shield-account</v-icon
              >
              <strong class="mr-2">Role:</strong>
              <v-chip
                :color="getRoleColor(deletingUser?.role)"
                small
                dark
                class="ml-2"
              >
                {{ deletingUser?.role }}
              </v-chip>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDeleteDialog" :disabled="deleting">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            @click="confirmDelete"
            :loading="deleting"
            :disabled="deletingUser && isCurrentUser(deletingUser)"
          >
            <v-icon left>mdi-delete</v-icon>
            Delete User
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "@/config/api";
import { toast } from "@/utils/toast";
import "@/assets/css/UserManagement.css";
import dummyData from "@/data/dummyData.json";

export default {
  name: "UserManagement",
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      search: "",
      headers: [
        // {
        //   text: "ID",
        //   value: "id",
        //   sortable: true,
        //   width: "80px",
        // },
        {
          text: "Email",
          value: "email",
          sortable: true,
        },
        {
          text: "Name",
          value: "name",
          sortable: true,
        },
        {
          text: "Role",
          value: "role",
          sortable: true,
          width: "120px",
        },
        {
          text: "Created At",
          value: "created_at",
          sortable: true,
          width: "200px",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "150px",
          align: "center",
        },
      ],
      showAddUserDialog: false,
      showUpdateDialog: false,
      showDeleteDialog: false,
      updatingUser: null,
      deletingUser: null,
      newUser: {
        email: "",
        name: "",
        password: "",
        role: "",
      },
      addUserFormValid: false,
      updateUserFormValid: false,
      addPasswordVisible: false,
      updatePasswordVisible: false,
      updateForm: {
        email: "",
        name: "",
        role: "",
        password: "",
      },
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 6) || "Password must be at least 6 characters",
      ],
      roleOptions: [
        { text: "Admin", value: "admin" },
        { text: "Operator", value: "user" },
        { text: "Result Control", value: "result_control" },
        { text: "Registration Control", value: "registration_control" },
      ],
      creating: false,
      updating: false,
      deleting: false,
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/api/auth/users");
        const data = response.data;
        this.users = data.data || data || [];
      } catch (error) {
        console.error("Error fetching users:", error);
        if (error.response) {
          if (error.response.status === 401) {
            this.error = "Your session has expired. Please log in again.";
            this.$router.push("/login");
          } else if (error.response.status === 403) {
            this.error = "Access denied. Admin privileges required.";
            // Redirect to main page after a short delay
            setTimeout(() => {
              this.$router.push("/dashboard/admin");
            }, 2000);
          } else if (error.response.status >= 500) {
            this.error =
              "Server error. Please try again later or contact support.";
          } else {
            this.error =
              error.response.data?.error ||
              "Failed to load users. Please try again.";
          }
        } else if (error.request && !error.response) {
          // Network error - backend unavailable, use dummy data
          console.log("Using dummy data for users (backend unavailable)");
          this.users = dummyData.users;
          this.error = null;
        } else {
          this.error = "An unexpected error occurred. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },
    getRoleColor(role) {
      // Normalize role: "administration" -> "admin", "operator" -> "user"
      let normalizedRole = (role || "").toLowerCase();
      if (normalizedRole === "administration") {
        normalizedRole = "admin";
      } else if (normalizedRole === "operator") {
        normalizedRole = "user";
      }

      const roleColors = {
        admin: "deep-purple darken-2", // Dark purple
        user: "blue darken-3", // Dark blue for Operator
        result_control: "green darken-3", // Dark green for Result Control
        registration_control: "deep-orange darken-2", // Dark orange for Registration Control
      };
      return roleColors[normalizedRole] || "grey";
    },
    isCurrentUser(user) {
      // Check if the user is the currently logged-in user
      if (!user) return false;

      // Try to get current user from store
      let currentUser = null;
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          currentUser = JSON.parse(userStr);
        }
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }

      if (currentUser && user) {
        // Compare by email or ID
        return currentUser.email === user.email || currentUser.id === user.id;
      }
      return false;
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        return dateString;
      }
    },
    openAddUserDialog() {
      this.newUser = {
        email: "",
        name: "",
        password: "",
        role: "",
      };
      this.addUserFormValid = false;
      this.addPasswordVisible = false;
      this.showAddUserDialog = true;
      this.$nextTick(() => {
        if (this.$refs.addUserForm) {
          this.$refs.addUserForm.resetValidation();
        }
      });
    },
    closeAddUserDialog() {
      this.showAddUserDialog = false;
      this.newUser = {
        email: "",
        name: "",
        password: "",
        role: "",
      };
      this.addUserFormValid = false;
      this.addPasswordVisible = false;
      if (this.$refs.addUserForm) {
        this.$refs.addUserForm.resetValidation();
      }
    },
    async createUser() {
      if (!this.$refs.addUserForm.validate()) {
        return;
      }

      this.creating = true;
      this.error = null;

      try {
        await api.post("/api/auth/register", {
          email: this.newUser.email.trim(),
          name: this.newUser.name.trim() || null,
          password: this.newUser.password,
          role: this.newUser.role,
        });

        toast.success(`User "${this.newUser.email}" created successfully`);
        this.closeAddUserDialog();
        await this.fetchUsers();
      } catch (error) {
        console.error("Error creating user:", error);
        if (error.response) {
          const errorMessage =
            error.response.data?.error ||
            "Failed to create user. Please try again.";
          toast.error(errorMessage);
          this.error = errorMessage;
        } else {
          toast.error("An unexpected error occurred. Please try again.");
          this.error = "An unexpected error occurred. Please try again.";
        }
      } finally {
        this.creating = false;
      }
    },
    openUpdateDialog(user) {
      this.updatingUser = { ...user };
      this.updateForm = {
        email: user.email,
        name: user.name || "",
        role: user.role,
        password: "",
      };
      this.updatePasswordVisible = false;
      this.updateUserFormValid = false;
      this.showUpdateDialog = true;
      this.$nextTick(() => {
        if (this.$refs.updateUserForm) {
          this.$refs.updateUserForm.resetValidation();
        }
      });
    },
    closeUpdateDialog() {
      this.showUpdateDialog = false;
      this.updatingUser = null;
      this.updateForm = {
        email: "",
        name: "",
        role: "",
        password: "",
      };
      this.updatePasswordVisible = false;
      this.updateUserFormValid = false;
      if (this.$refs.updateUserForm) {
        this.$refs.updateUserForm.resetValidation();
      }
    },
    async updateUser() {
      if (!this.$refs.updateUserForm || !this.$refs.updateUserForm.validate()) {
        return;
      }
      if (!this.updatingUser) return;

      this.updating = true;
      this.error = null;

      try {
        const payload = {
          email: this.updateForm.email.trim(),
          name: this.updateForm.name.trim(),
          role: this.updateForm.role,
        };
        if (this.updateForm.password && this.updateForm.password.trim()) {
          payload.password = this.updateForm.password;
        }

        await api.put(`/api/auth/users/${this.updatingUser.id}`, payload);
        toast.success("User updated successfully");
        this.closeUpdateDialog();
        await this.fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
        if (error.response) {
          this.error =
            error.response.data?.error ||
            "Failed to update user. Please try again.";
          toast.error(this.error);
        } else {
          this.error = "An unexpected error occurred. Please try again.";
          toast.error(this.error);
        }
      } finally {
        this.updating = false;
      }
    },
    openDeleteDialog(user) {
      // Prevent opening delete dialog for current user
      if (this.isCurrentUser(user)) {
        this.error = "You cannot delete your own account";
        setTimeout(() => {
          this.error = null;
        }, 3000);
        return;
      }
      this.deletingUser = { ...user };
      this.showDeleteDialog = true;
    },
    closeDeleteDialog() {
      this.showDeleteDialog = false;
      this.deletingUser = null;
    },
    async confirmDelete() {
      if (!this.deletingUser) return;

      this.deleting = true;
      this.error = null;

      try {
        await api.delete(`/api/auth/users/${this.deletingUser.id}`);

        toast.success(`User "${this.deletingUser.email}" deleted successfully`);
        this.closeDeleteDialog();
        await this.fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        if (error.response) {
          this.error =
            error.response.data?.error ||
            "Failed to delete user. Please try again.";
        } else {
          this.error = "An unexpected error occurred. Please try again.";
        }
      } finally {
        this.deleting = false;
      }
    },
  },
};
</script>
