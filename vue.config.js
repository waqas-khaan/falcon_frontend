const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],

  devServer: {
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: (error) => {
          // Suppress ResizeObserver errors
          const resizeObserverRegex = /ResizeObserver/i;

          // Suppress WebSocket / bootstrap errors
          const websocketErrorRegex =
            /WebSocket connection|Failed to load|bootstrap/i;

          const allErrorText = [
            error?.message || "",
            error?.name || "",
            error?.stack || "",
            String(error || ""),
            error?.toString?.() || "",
          ].join(" ");

          if (
            resizeObserverRegex.test(allErrorText) ||
            websocketErrorRegex.test(allErrorText)
          ) {
            return false; // hide from overlay
          }

          return true;
        },
      },
    },
  },

  configureWebpack: {
    devtool: "source-map",
  },
});
