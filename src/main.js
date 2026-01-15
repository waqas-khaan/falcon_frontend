import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

// Import all CSS files
import "./css.js";

// Import Material Design Icons
// import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;
Vue.config.errorHandler = function (err, vm, info) {
  // Suppress ResizeObserver errors in Vue error handler
  const resizeObserverRegex = /ResizeObserver/i;
  if (
    (err?.message && resizeObserverRegex.test(err.message)) ||
    (err?.toString && resizeObserverRegex.test(err.toString()))
  ) {
    return; // Suppress the error
  }

  // Suppress Vue Router navigation redirect errors (expected behavior)
  const navigationRedirectRegex =
    /Redirected when going from.*via a navigation guard/i;
  const navigationDuplicatedRegex =
    /Avoided redundant navigation to current location/i;
  const navigationGuardRegex = /navigation guard/i;

  // Check error message, toString, stack, and name
  const errorText = [
    err?.message || "",
    err?.toString() || "",
    err?.stack || "",
    err?.name || "",
  ].join(" ");

  if (
    navigationRedirectRegex.test(errorText) ||
    navigationDuplicatedRegex.test(errorText) ||
    navigationGuardRegex.test(errorText) ||
    err?.name === "NavigationDuplicated" ||
    err?.name === "NavigationRedirected"
  ) {
    return; // Suppress the error - redirects and duplicate navigations are expected
  }

  // Call default error handler for other errors
  console.error(err, info);
};

// Suppress ResizeObserver loop warnings and errors (harmless browser warning)
// This warning occurs when ResizeObserver callbacks trigger layout changes
// It's safe to ignore as it doesn't affect functionality
const resizeObserverLoopErrRe = /ResizeObserver/i;
const originalError = window.console.error;
const originalWarn = window.console.warn;

// Helper function to check if error is ResizeObserver related
function isResizeObserverError(arg) {
  if (typeof arg === "string") {
    return resizeObserverLoopErrRe.test(arg);
  }
  if (arg && typeof arg === "object") {
    const message = arg.message || arg.toString();
    return resizeObserverLoopErrRe.test(message);
  }
  return false;
}

// Helper function to check if error is navigation redirect related
function isNavigationRedirectError(arg) {
  const navigationRedirectRegex =
    /Redirected when going from.*via a navigation guard/i;
  const navigationDuplicatedRegex =
    /Avoided redundant navigation to current location/i;
  const navigationGuardRegex = /navigation guard/i;
  if (typeof arg === "string") {
    return (
      navigationRedirectRegex.test(arg) ||
      navigationDuplicatedRegex.test(arg) ||
      navigationGuardRegex.test(arg)
    );
  }
  if (arg && typeof arg === "object") {
    const message = arg.message || arg.toString();
    return (
      navigationRedirectRegex.test(message) ||
      navigationDuplicatedRegex.test(message) ||
      navigationGuardRegex.test(message) ||
      arg.name === "NavigationDuplicated" ||
      arg.name === "NavigationRedirected"
    );
  }
  return false;
}

// Suppress console errors
window.console.error = function (...args) {
  if (
    args.some(isResizeObserverError) ||
    args.some(isNavigationRedirectError)
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Suppress console warnings
window.console.warn = function (...args) {
  if (args.some(isResizeObserverError)) {
    return;
  }
  originalWarn.apply(console, args);
};

// Suppress ResizeObserver errors in error handlers (capture phase)
window.addEventListener(
  "error",
  (event) => {
    const message = event.message || event.error?.message || "";
    if (typeof message === "string" && resizeObserverLoopErrRe.test(message)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  },
  true
);

// Suppress unhandled promise rejections related to ResizeObserver
window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason?.message || event.reason?.toString() || "";
  if (typeof reason === "string" && resizeObserverLoopErrRe.test(reason)) {
    event.preventDefault();
    return false;
  }
});

// Suppress errors in webpack-dev-server overlay - Must be before Vue initialization
if (typeof window !== "undefined") {
  // Override global error handler - catches all errors including webpack-dev-server
  const originalOnError = window.onerror;
  const navigationRedirectRegex =
    /Redirected when going from.*via a navigation guard/i;
  const navigationDuplicatedRegex =
    /Avoided redundant navigation to current location/i;
  window.onerror = function (message, source, lineno, colno, error) {
    const errorMessage = message || error?.message || "";
    const errorString = String(error || "");
    const errorStack = error?.stack || "";

    // Check all possible error text
    const allErrorText = [errorMessage, errorString, errorStack].join(" ");

    if (resizeObserverLoopErrRe.test(allErrorText)) {
      return true; // Suppress the error completely
    }

    // Suppress navigation redirect errors (expected behavior in Vue Router)
    const navigationGuardRegex = /navigation guard/i;
    if (
      navigationRedirectRegex.test(allErrorText) ||
      navigationDuplicatedRegex.test(allErrorText) ||
      navigationGuardRegex.test(allErrorText) ||
      error?.name === "NavigationDuplicated" ||
      error?.name === "NavigationRedirected"
    ) {
      return true; // Suppress the error completely
    }

    if (originalOnError) {
      return originalOnError.call(
        window,
        message,
        source,
        lineno,
        colno,
        error
      );
    }
    return false;
  };

  // Intercept webpack-dev-server client error handler
  if (window.__webpack_dev_server_client__) {
    const client = window.__webpack_dev_server_client__;
    if (client.default && client.default.handleErrors) {
      const originalHandleErrors = client.default.handleErrors;
      const navigationRedirectRegex =
        /Redirected when going from.*via a navigation guard/i;
      const navigationDuplicatedRegex =
        /Avoided redundant navigation to current location/i;
      client.default.handleErrors = function (errors) {
        const filteredErrors = errors.filter((error) => {
          const errorText = JSON.stringify(error || {});
          const isResizeObserver = resizeObserverLoopErrRe.test(errorText);
          const isNavigationRedirect =
            navigationRedirectRegex.test(errorText) ||
            navigationDuplicatedRegex.test(errorText) ||
            error?.name === "NavigationDuplicated";
          return !isResizeObserver && !isNavigationRedirect;
        });
        if (filteredErrors.length > 0) {
          return originalHandleErrors.call(this, filteredErrors);
        }
      };
    }
  }

  // Override dispatchEvent to catch webpack-dev-server overlay errors
  if (window.dispatchEvent) {
    const originalDispatch = window.dispatchEvent;
    const navigationRedirectRegex =
      /Redirected when going from.*via a navigation guard/i;
    const navigationDuplicatedRegex =
      /Avoided redundant navigation to current location/i;
    window.dispatchEvent = function (event) {
      if (event && event.type === "error") {
        const message =
          event.message ||
          event.error?.message ||
          event.error?.toString() ||
          "";
        const stack = event.error?.stack || "";
        const allText = [message, stack].join(" ");
        const navigationGuardRegex = /navigation guard/i;
        if (
          typeof allText === "string" &&
          (resizeObserverLoopErrRe.test(allText) ||
            navigationRedirectRegex.test(allText) ||
            navigationDuplicatedRegex.test(allText) ||
            navigationGuardRegex.test(allText) ||
            event.error?.name === "NavigationDuplicated" ||
            event.error?.name === "NavigationRedirected")
        ) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          return false;
        }
      }
      return originalDispatch.call(window, event);
    };
  }
}

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

// Make store accessible for API interceptor
window.$store = store;
