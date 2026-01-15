<template>
  <div v-if="showStatus" class="connection-status" :class="statusClass">
    <v-alert
      :type="alertType"
      :dismissible="true"
      @input="dismiss"
      border="left"
      colored-border
      elevation="2"
      class="ma-2"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ statusIcon }}</v-icon>
        <div>
          <strong>{{ statusTitle }}</strong>
          <div class="text-caption">{{ statusMessage }}</div>
          <div v-if="connectionInfo" class="text-caption mt-1">
            <span v-if="connectionInfo.server"
              >Server: {{ connectionInfo.server }}</span
            >
            <span v-if="connectionInfo.database" class="ml-2">
              Database: {{ connectionInfo.database }}
            </span>
          </div>
        </div>
      </div>
    </v-alert>
  </div>
</template>

<script>
import { getConnectionStatus, checkServerHealth } from "@/config/api";
import "@/assets/css/ConnectionStatus.css";

export default {
  name: "ConnectionStatus",
  data() {
    return {
      showStatus: false,
      connectionStatus: null,
      checkInterval: null,
    };
  },
  computed: {
    statusClass() {
      if (!this.connectionStatus) return "";
      if (this.connectionStatus.isConnected) {
        if (this.connectionStatus.databaseHealth === "disconnected") {
          return "warning";
        }
        return "success";
      }
      return "error";
    },
    alertType() {
      if (!this.connectionStatus) return "info";
      if (this.connectionStatus.isConnected) {
        if (this.connectionStatus.databaseHealth === "disconnected") {
          return "warning";
        }
        return "success";
      }
      return "error";
    },
    statusIcon() {
      if (!this.connectionStatus) return "mdi-information";
      if (this.connectionStatus.isConnected) {
        if (this.connectionStatus.databaseHealth === "disconnected") {
          return "mdi-alert";
        }
        return "mdi-check-circle";
      }
      return "mdi-alert-circle";
    },
    statusTitle() {
      if (!this.connectionStatus) return "Checking connection...";
      if (this.connectionStatus.isConnected) {
        if (this.connectionStatus.databaseHealth === "disconnected") {
          return "Database Disconnected";
        }
        return "Connected";
      }
      return "Connection Failed";
    },
    statusMessage() {
      if (!this.connectionStatus) return "Checking server status...";
      if (this.connectionStatus.isConnected) {
        if (this.connectionStatus.databaseHealth === "disconnected") {
          return "Server is running but database is not connected. Please check database configuration.";
        }
        return "Server and database are connected successfully.";
      }
      return "Cannot connect to server. Please ensure the Java server is running on port 5002.";
    },
    connectionInfo() {
      if (!this.connectionStatus) return null;
      return {
        server: this.connectionStatus.serverHealth,
        database: this.connectionStatus.databaseHealth,
      };
    },
  },
  mounted() {
    this.updateStatus();
    // Check connection status every 10 seconds
    this.checkInterval = setInterval(() => {
      this.updateStatus();
    }, 10000);
  },
  beforeDestroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  },
  methods: {
    async updateStatus() {
      this.connectionStatus = getConnectionStatus();

      // Only show status if there's an issue or on first load
      if (
        !this.connectionStatus.isConnected ||
        this.connectionStatus.databaseHealth === "disconnected"
      ) {
        this.showStatus = true;
      }

      // Refresh health check if needed
      if (!this.connectionStatus.isConnected) {
        await checkServerHealth();
        this.connectionStatus = getConnectionStatus();
      }
    },
    dismiss() {
      this.showStatus = false;
    },
  },
};
</script>
