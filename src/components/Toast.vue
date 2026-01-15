<template>
  <transition-group name="toast" tag="div" class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast', `toast-${toast.type}`]"
      @click="removeToast(toast.id)"
    >
      <div class="toast-content">
        <div class="toast-icon">
          <v-icon :color="getIconColor(toast.type)" size="24">
            {{ getIcon(toast.type) }}
          </v-icon>
        </div>
        <div class="toast-message">
          {{ toast.message }}
        </div>
        <button
          class="toast-close"
          @click.stop="removeToast(toast.id)"
          aria-label="Close notification"
        >
          <v-icon size="18" color="#666">mdi-close</v-icon>
        </button>
      </div>
      <div class="toast-progress">
        <div
          class="toast-progress-bar"
          :style="{ animationDuration: `${toast.duration}ms` }"
        ></div>
      </div>
    </div>
  </transition-group>
</template>

<script>
import "@/assets/css/Toast.css";

export default {
  name: "Toast",
  data() {
    return {
      toasts: [],
    };
  },
  methods: {
    addToast(message, type = "success", duration = 3000) {
      const id = Date.now() + Math.random();
      const toast = {
        id,
        message,
        type,
        duration,
      };

      this.toasts.push(toast);

      // Auto remove after duration
      setTimeout(() => {
        this.removeToast(id);
      }, duration);

      return id;
    },
    removeToast(id) {
      const index = this.toasts.findIndex((t) => t.id === id);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    },
    getIcon(type) {
      const icons = {
        success: "mdi-check-circle",
        error: "mdi-alert-circle",
        warning: "mdi-alert",
        info: "mdi-information",
      };
      return icons[type] || icons.info;
    },
    getIconColor(type) {
      const colors = {
        success: "#4caf50",
        error: "#f44336",
        warning: "#ff9800",
        info: "#2196f3",
      };
      return colors[type] || colors.info;
    },
  },
  mounted() {
    // Make addToast available globally
    this.$root.$toast = this;
    window.$toast = this;
  },
};
</script>
