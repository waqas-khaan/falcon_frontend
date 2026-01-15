<template>
  <div
    ref="tabulator"
    class="tabulator-container tabulator-datatable-container responsive-tabulator"
  >
    <!-- Column Management Button (if enabled and not hidden) -->
    <div
      v-if="shouldShowColumnManager && !hideColumnManagerIcon"
      class="tabulator-column-manager-btn-wrapper"
    >
      <v-menu
        v-model="showColumnManager"
        offset-y
        :close-on-content-click="false"
        content-class="column-manager-menu"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            color="primary"
            class="tabulator-column-manager-btn"
            v-bind="attrs"
            v-on="on"
            title="Column Management"
            aria-label="Manage columns"
          >
            <v-icon style="color: black">mdi-view-column-outline</v-icon>
          </v-btn>
        </template>

        <v-card class="column-manager-popover">
          <v-list class="pa-0" dense>
            <v-list-item
              v-for="(column, index) in columnMenuItems"
              :key="column.field"
              class="column-item-list"
              :class="{ dragging: draggedColumnIndex === index }"
              :draggable="true"
              @dragstart.stop="handleDragStart($event, index)"
              @dragover.prevent.stop="handleDragOver($event, index)"
              @drop.prevent.stop="handleDrop($event, index)"
              @dragend="handleDragEnd"
            >
              <v-list-item-action class="mr-2">
                <v-checkbox
                  :input-value="column.visible"
                  @change="updateColumnVisibility(column.field, $event)"
                  color="primary"
                  hide-details
                  dense
                ></v-checkbox>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title class="column-name-text">
                  {{ column.title }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action class="mr-0">
                <div class="drag-handle" style="cursor: grab">
                  <v-icon color="grey" small>mdi-drag-vertical</v-icon>
                </div>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="tabulator-loading-overlay">
      <div class="tabulator-loading-content">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-body-1">Loading data...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "@/assets/css/TabulatorDatatable.css";

export default {
  name: "Tabulator-datatable",
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      default: () => [],
    },
    height: {
      type: String,
      default: "600px",
    },
    pagination: {
      type: [Boolean, String],
      default: true,
    },
    paginationSize: {
      type: Number,
      default: 20,
    },
    paginationSizeSelector: {
      type: Array,
      default: () => [10, 20, 50, 100],
    },
    paginationCounter: {
      type: String,
      default: "rows",
    },
    movableColumns: {
      type: Boolean,
      default: true,
    },
    resizableColumns: {
      type: Boolean,
      default: true,
    },
    selectable: {
      type: [Boolean, Number],
      default: 1,
    },
    selectableRangeMode: {
      type: String,
      default: "click",
    },
    layout: {
      type: String,
      default: "fitColumns",
    },
    headerFilterLiveFilter: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "No Data Available",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    rowHeader: {
      type: Object,
      default: null,
    },
    keybindings: {
      type: Object,
      default: () => ({}),
    },
    locale: {
      type: [Boolean, Object],
      default: false,
    },
    langs: {
      type: Object,
      default: () => ({}),
    },
    ajaxURL: {
      type: String,
      default: null,
    },
    ajaxConfig: {
      type: Object,
      default: () => ({}),
    },
    ajaxRequestFunc: {
      type: Function,
      default: null,
    },
    enableColumnManagement: {
      type: Boolean,
      default: false,
    },
    columnManagementStorageKey: {
      type: String,
      default: "tabulator-columns",
    },
    persistenceId: {
      type: String,
      default: null,
    },
    hideColumnManagerIcon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tabulator: null,
      hasServerError: false, // Track if server is offline or connection error
      handleResize: null, // Store resize handler reference
      isLoading: false, // Internal loading state
      // Column management
      showColumnManager: false,
      availableColumns: [],
      allColumns: [],
      draggedColumnIndex: null,
    };
  },
  computed: {
    shouldShowColumnManager() {
      // Show icon if enableColumnManagement is true
      // The persistenceId or storage key is optional but recommended for proper localStorage isolation
      return this.enableColumnManagement === true;
    },
    columnMenuItems() {
      // Prefer initialized availableColumns; fall back to current columns
      if (this.availableColumns && this.availableColumns.length > 0) {
        return this.availableColumns;
      }
      if (this.columns && this.columns.length > 0) {
        return this.columns
          .filter((col) => col.field !== "checkbox")
          .map((col) => ({
            field: col.field,
            title: col.title,
            visible: col.visible !== false,
          }));
      }
      return [];
    },
  },
  watch: {
    data: {
      handler(newData) {
        // Only update data if not using AJAX loading
        if (this.tabulator && this.$refs.tabulator && !this.ajaxURL) {
          try {
            this.tabulator.setData(newData);
          } catch (error) {
            console.error("Error setting data:", error);
          }
        }
      },
      deep: true,
    },
    ajaxURL: {
      handler(newURL) {
        if (this.tabulator && newURL) {
          // Reload data from AJAX URL
          this.tabulator.setData(newURL);
        }
      },
    },
    columns: {
      handler(newColumns) {
        if (
          this.tabulator &&
          this.$refs.tabulator &&
          newColumns &&
          newColumns.length > 0
        ) {
          // Initialize column management if enabled
          if (this.enableColumnManagement) {
            this.initializeColumnManagement(newColumns);
            // Don't set columns directly - let column management handle it via refreshTableColumns()
            return;
          }
          // Use nextTick to ensure DOM is ready
          this.$nextTick(() => {
            try {
              this.tabulator.setColumns(newColumns);
            } catch (error) {
              console.error("Error setting columns:", error);
              // Retry after a short delay if it fails
              setTimeout(() => {
                if (this.tabulator && this.$refs.tabulator) {
                  try {
                    this.tabulator.setColumns(newColumns);
                  } catch (retryError) {
                    console.error("Error retrying setColumns:", retryError);
                  }
                }
              }, 100);
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
    loading: {
      handler(newVal) {
        // Update internal loading state for overlay display
        this.isLoading = newVal;
        // Tabulator handles loading automatically through the config option
        // No need to manually call showLoading/hideLoading
      },
      immediate: true,
    },
  },
  mounted() {
    // Wait for next tick to ensure DOM is ready
    this.$nextTick(() => {
      this.initTabulator();
      // Initialize column management if enabled - wait for tabulator to be ready
      if (
        this.enableColumnManagement &&
        this.columns &&
        this.columns.length > 0
      ) {
        // Use setTimeout to ensure tabulator is fully initialized
        setTimeout(() => {
          if (this.tabulator && this.$refs.tabulator) {
            this.initializeColumnManagement(this.columns);
          }
        }, 100);
      }
      // Recalculate height after a short delay to ensure parent is sized
      setTimeout(() => {
        if (this.tabulator && this.height === "100%") {
          this.recalculateHeight();
        }
      }, 100);

      // Add window resize listener for responsive behavior
      this.handleResize = () => {
        if (this.tabulator) {
          // Recalculate height on resize
          if (this.height === "100%") {
            this.recalculateHeight();
          }
          // Redraw table to ensure proper rendering
          this.$nextTick(() => {
            if (this.tabulator) {
              this.tabulator.redraw(true);
            }
          });
        }
      };
      window.addEventListener("resize", this.handleResize);

      // Also listen for orientation change on mobile devices
      window.addEventListener("orientationchange", () => {
        setTimeout(() => {
          if (this.tabulator) {
            if (this.height === "100%") {
              this.recalculateHeight();
            }
            this.tabulator.redraw(true);
          }
        }, 200);
      });
    });
  },
  beforeDestroy() {
    // Remove resize listener
    if (this.handleResize) {
      window.removeEventListener("resize", this.handleResize);
    }
    if (this.tabulator) {
      this.tabulator.destroy();
    }
  },
  methods: {
    initTabulator() {
      // Ensure the DOM element exists
      if (!this.$refs.tabulator) {
        console.error("Tabulator container element not found");
        return;
      }

      // Calculate height properly
      let calculatedHeight = this.height;
      if (this.height === "100%") {
        // If height is 100%, calculate based on parent container
        const parent = this.$refs.tabulator?.parentElement;
        if (parent) {
          const parentHeight = parent.clientHeight;
          calculatedHeight = parentHeight > 0 ? `${parentHeight}px` : "600px";
        } else {
          calculatedHeight = "600px";
        }
      }

      // Store placeholder text and component reference for use in function
      const placeholderText = this.placeholder || "No Data Available";
      const componentRef = this; // Store reference to component

      // Create placeholder function that checks filters
      // Note: Tabulator passes the table instance as the first parameter
      const placeholderFunction = (table) => {
        // If server error (server off or connection error), show "No Data Available"
        if (componentRef.hasServerError) {
          return placeholderText;
        }

        // Use the table parameter if available, otherwise try to use component's tabulator instance
        const tabulatorInstance = table || componentRef.tabulator;

        // Check if table is available and initialized
        if (
          !tabulatorInstance ||
          typeof tabulatorInstance.getFilters !== "function" ||
          typeof tabulatorInstance.getDataCount !== "function"
        ) {
          return placeholderText;
        }

        try {
          // Check if table is fully built by checking for internal properties
          // Tabulator needs to have rows initialized before we can safely call getDataCount
          if (!tabulatorInstance.modules || !tabulatorInstance.modules.rows) {
            return placeholderText;
          }

          // Check if filters are active
          const activeFilters = tabulatorInstance.getFilters();
          const hasFilters = activeFilters && activeFilters.length > 0;

          // Get total data count (all data, not just visible)
          // Wrap in try-catch as getDataCount might fail if table isn't fully ready
          let totalDataCount = 0;
          let visibleDataCount = 0;

          try {
            totalDataCount = tabulatorInstance.getDataCount("all");
            visibleDataCount = tabulatorInstance.getDataCount("visible");
          } catch (countError) {
            // If getDataCount fails, table isn't ready yet, return default
            return placeholderText;
          }

          // If filters are active and there's data but no matches, show "No Matched Data"
          if (hasFilters && totalDataCount > 0 && visibleDataCount === 0) {
            return "No Matched Data";
          }
        } catch (error) {
          // If table methods are not available yet, return default message
          // Only log if it's not a common initialization error
          if (!error.message || !error.message.includes("visibleRows")) {
            console.warn("Placeholder function error:", error);
          }
        }

        // If no data at all (with or without filters), show "No Data Available"
        return placeholderText;
      };

      const config = {
        height: calculatedHeight,
        layout: this.layout,
        pagination: this.pagination,
        paginationSize: this.paginationSize,
        paginationSizeSelector: this.paginationSizeSelector,
        paginationCounter: this.paginationCounter,
        movableColumns: this.movableColumns,
        resizableColumns: this.resizableColumns,
        selectable: this.selectable,
        selectableRangeMode: this.selectableRangeMode,
        headerFilterLiveFilter: this.headerFilterLiveFilter,
        placeholder: placeholderFunction,
        loading: this.loading,
        tabEndNewRow: false,
        columns: this.columns || [],
      };

      // Use AJAX URL if provided, otherwise use static data
      if (this.ajaxURL) {
        config.ajaxURL = this.ajaxURL;
        // Add custom AJAX request function if provided
        if (this.ajaxRequestFunc) {
          config.ajaxRequestFunc = this.ajaxRequestFunc;
        } else {
          // Default AJAX request function using our API instance
          config.ajaxRequestFunc = this.defaultAjaxRequest;
        }
        // Merge any additional AJAX config
        if (Object.keys(this.ajaxConfig).length > 0) {
          Object.assign(config, this.ajaxConfig);
        }
      } else {
        // Use static data
        config.data = this.data || [];
      }

      // Add rowHeader if provided
      if (this.rowHeader) {
        config.rowHeader = this.rowHeader;
      }

      // Add keybindings if provided
      if (Object.keys(this.keybindings).length > 0) {
        config.keybindings = this.keybindings;
      }

      // Add locale if provided
      if (this.locale) {
        config.locale = this.locale;
      }

      // Add langs if provided
      if (Object.keys(this.langs).length > 0) {
        config.langs = this.langs;
      }

      try {
        this.tabulator = new Tabulator(this.$refs.tabulator, config);

        // Track if table is built (will be set by tableBuilt event)
        let isTableBuilt = false;

        // Helper method to update placeholder dynamically
        const updatePlaceholder = () => {
          if (!this.tabulator) return;

          try {
            // Check if table is fully initialized before calling methods
            if (
              !isTableBuilt ||
              typeof this.tabulator.getFilters !== "function" ||
              typeof this.tabulator.getDataCount !== "function" ||
              !this.tabulator.modules ||
              !this.tabulator.modules.rows
            ) {
              // Table not ready yet, skip update
              return;
            }

            // If server error (server off or connection error), show "No Data Available"
            if (this.hasServerError) {
              const placeholderEl = this.$refs.tabulator?.querySelector(
                ".tabulator-placeholder"
              );
              if (placeholderEl) {
                placeholderEl.textContent = placeholderText;
              }
              return;
            }

            // Safely get filters and data counts
            let activeFilters = [];
            let totalDataCount = 0;
            let visibleDataCount = 0;

            try {
              activeFilters = this.tabulator.getFilters();
              totalDataCount = this.tabulator.getDataCount("all");
              visibleDataCount = this.tabulator.getDataCount("visible");
            } catch (methodError) {
              // If methods fail, table isn't ready yet, skip update
              return;
            }

            const hasFilters = activeFilters && activeFilters.length > 0;

            // Update placeholder based on state
            let newPlaceholder = placeholderText;
            // Show "No Matched Data" only if filters are active AND there's data but no matches
            if (hasFilters && totalDataCount > 0 && visibleDataCount === 0) {
              newPlaceholder = "No Matched Data";
            }

            // Update placeholder if it changed
            if (this.tabulator.modules && this.tabulator.modules.placeholder) {
              const placeholderEl = this.$refs.tabulator?.querySelector(
                ".tabulator-placeholder"
              );
              if (placeholderEl) {
                placeholderEl.textContent = newPlaceholder;
              }
            }
          } catch (error) {
            // Only log if it's not a common initialization error
            if (!error.message || !error.message.includes("visibleRows")) {
              console.warn("Error updating placeholder:", error);
            }
          }
        };

        // Listen for tableBuilt event to know when table is ready
        this.tabulator.on("tableBuilt", () => {
          isTableBuilt = true;
          // Update placeholder after table is built
          this.$nextTick(() => {
            updatePlaceholder();
          });
        });

        // Emit row click event
        this.tabulator.on("rowClick", (e, row) => {
          this.$emit("row-click", e, row, row.getData());
        });

        // Emit other useful events
        this.tabulator.on("rowSelected", (row) => {
          this.$emit("row-selected", row.getData(), row);
        });

        this.tabulator.on("rowDeselected", (row) => {
          this.$emit("row-deselected", row.getData(), row);
        });

        // AJAX loading events
        if (this.ajaxURL) {
          this.tabulator.on("dataLoading", () => {
            // Update loading state - Tabulator handles the visual indicator automatically
            this.isLoading = true;
            this.$emit("data-loading");
          });

          this.tabulator.on("dataLoaded", () => {
            // Update loading state - Tabulator handles the visual indicator automatically
            this.isLoading = false;
            // Reset server error flag on successful load
            this.hasServerError = false;
            this.$emit("data-loaded");
            this.$nextTick(() => {
              updatePlaceholder();
            });
          });

          this.tabulator.on("dataLoadError", (error) => {
            // Update loading state - Tabulator handles the visual indicator automatically
            this.isLoading = false;
            // Set server error flag if connection failed or server is off
            if (error.request && !error.response) {
              // Network error, connection refused, server off
              this.hasServerError = true;
            } else if (error.response && error.response.status >= 500) {
              // Server error (500+)
              this.hasServerError = true;
            }

            // Update placeholder to show "No Data Available"
            this.$nextTick(() => {
              updatePlaceholder();
            });

            this.$emit("data-load-error", error);
          });
        }

        // Update placeholder when filters change
        this.tabulator.on("dataFiltered", () => {
          this.$nextTick(() => {
            updatePlaceholder();
          });
        });

        // Column management events - save column order when columns are moved
        if (this.enableColumnManagement) {
          this.tabulator.on("columnMoved", () => {
            // When a column is moved in the table, update our column order tracking
            this.$nextTick(() => {
              if (this.tabulator) {
                const currentColumns = this.tabulator.getColumns();
                const columnOrder = currentColumns
                  .map((col) => col.getField())
                  .filter((field) => field && field !== "checkbox");

                // Update availableColumns order to match table
                const orderedColumns = [];
                columnOrder.forEach((field) => {
                  const col = this.availableColumns.find(
                    (c) => c.field === field
                  );
                  if (col) {
                    orderedColumns.push(col);
                  }
                });
                // Add any columns that weren't in the table (shouldn't happen, but safety check)
                this.availableColumns.forEach((col) => {
                  if (!orderedColumns.find((c) => c.field === col.field)) {
                    orderedColumns.push(col);
                  }
                });
                this.availableColumns = orderedColumns;

                // Save the new order to localStorage
                this.saveColumnOrder();
              }
            });
          });
        }

        // Initial placeholder update after a short delay
        this.$nextTick(() => {
          setTimeout(() => {
            updatePlaceholder();
          }, 100);
        });
      } catch (error) {
        console.error("Error initializing Tabulator:", error);
      }
    },
    // Expose Tabulator methods
    setData(data) {
      if (this.tabulator) {
        this.tabulator.setData(data);
      }
    },
    clearData() {
      if (this.tabulator) {
        this.tabulator.clearData();
      }
    },
    setFilter(field, type, value) {
      if (this.tabulator) {
        this.tabulator.setFilter(field, type, value);
      }
    },
    clearFilter() {
      if (this.tabulator) {
        // Clear all filters including header filters
        this.tabulator.clearFilter();
        // Also clear header filter values by redrawing
        this.$nextTick(() => {
          if (this.tabulator) {
            this.tabulator.redraw(true);
          }
        });
      }
    },
    setColumns(columns) {
      if (
        this.tabulator &&
        this.$refs.tabulator &&
        columns &&
        columns.length > 0
      ) {
        try {
          this.$nextTick(() => {
            if (this.tabulator && this.$refs.tabulator) {
              this.tabulator.setColumns(columns);
            }
          });
        } catch (error) {
          console.error("Error in setColumns:", error);
        }
      }
    },
    redraw(force) {
      if (this.tabulator) {
        this.tabulator.redraw(force);
      }
    },
    getData(mode) {
      if (this.tabulator) {
        return this.tabulator.getData(mode);
      }
      return [];
    },
    getTabulatorInstance() {
      return this.tabulator;
    },
    recalculateHeight() {
      if (this.tabulator && this.$refs.tabulator) {
        if (this.height === "100%") {
          const parent = this.$refs.tabulator.parentElement;
          if (parent) {
            const parentHeight = parent.clientHeight;
            if (parentHeight > 0) {
              this.tabulator.setHeight(`${parentHeight}px`);
            }
          }
        } else {
          // For fixed heights, ensure table is visible on small screens
          const windowHeight = window.innerHeight;
          const minHeight = Math.min(
            parseInt(this.height) || 600,
            windowHeight - 200
          );
          this.tabulator.setHeight(`${minHeight}px`);
        }
        // Redraw to ensure proper rendering
        this.$nextTick(() => {
          if (this.tabulator) {
            this.tabulator.redraw(true);
          }
        });
      }
    },
    // Default AJAX request function using our API instance
    defaultAjaxRequest(url, config, params) {
      // Import api dynamically to avoid circular dependencies
      return import("@/config/api").then((module) => {
        const api = module.default;
        return api
          .get(url, {
            params: params,
            ...config,
          })
          .then((response) => {
            // Reset server error flag on successful response
            this.hasServerError = false;

            // Handle our API response format: {success: true, data: [...]}
            // or direct array response
            let data = [];
            if (response.data) {
              if (Array.isArray(response.data)) {
                data = response.data;
              } else if (
                response.data.success &&
                Array.isArray(response.data.data)
              ) {
                data = response.data.data;
              } else if (
                response.data.data &&
                Array.isArray(response.data.data)
              ) {
                data = response.data.data;
              }
            }
            return data;
          })
          .catch((error) => {
            console.error("AJAX request error:", error);

            // Set server error flag if connection failed or server is off
            if (error.request && !error.response) {
              // Network error, connection refused, server off
              this.hasServerError = true;
            } else if (error.response && error.response.status >= 500) {
              // Server error (500+)
              this.hasServerError = true;
            }

            // Emit error event
            this.$emit("data-load-error", error);
            throw error;
          });
      });
    },
    // Method to reload data via AJAX
    reloadData() {
      if (this.tabulator && this.ajaxURL) {
        // Update loading state - Tabulator will show loading automatically
        this.isLoading = true;
        // Reload data - Tabulator handles showing/hiding loading indicator
        this.tabulator.setData(this.ajaxURL);
      }
    },
    // Column Management Methods
    initializeColumnManagement(columns) {
      if (!this.enableColumnManagement || !columns || columns.length === 0) {
        return;
      }

      // Ensure tabulator is initialized before proceeding
      if (!this.tabulator || !this.$refs.tabulator) {
        // Retry after a short delay
        setTimeout(() => {
          if (this.tabulator && this.$refs.tabulator) {
            this.initializeColumnManagement(columns);
          }
        }, 100);
        return;
      }

      // Store all columns with visibility
      this.allColumns = columns.map((col) => ({
        ...col,
        visible: col.visible !== false,
      }));

      // Initialize available columns (exclude only checkbox, include actions)
      this.availableColumns = this.allColumns
        .filter((col) => col.field !== "checkbox")
        .map((col) => ({
          field: col.field,
          title: col.title,
          visible: col.visible !== false,
        }));

      // Load saved preferences
      this.loadColumnVisibility();
      this.loadColumnOrder();

      // Apply saved preferences to columns - use nextTick to ensure tabulator is ready
      this.$nextTick(() => {
        if (this.tabulator && this.$refs.tabulator) {
          this.refreshTableColumns();
        }
      });
    },
    getStorageKey(key) {
      // Use persistenceId if provided, otherwise use columnManagementStorageKey
      const baseKey = this.persistenceId || this.columnManagementStorageKey;
      return `${baseKey}-${key}`;
    },
    loadColumnVisibility() {
      try {
        const saved = localStorage.getItem(this.getStorageKey("columns"));
        if (saved) {
          const savedColumns = JSON.parse(saved);
          // Apply saved visibility to columns
          this.allColumns.forEach((col) => {
            if (savedColumns[col.field] !== undefined) {
              col.visible = savedColumns[col.field];
            }
          });
          // Update availableColumns to match
          this.availableColumns.forEach((col) => {
            if (savedColumns[col.field] !== undefined) {
              col.visible = savedColumns[col.field];
            }
          });
        }
      } catch (error) {
        console.error("Error loading column visibility:", error);
      }
    },
    saveColumnVisibility() {
      try {
        const visibility = {};
        this.allColumns.forEach((col) => {
          visibility[col.field] = col.visible !== false;
        });
        localStorage.setItem(
          this.getStorageKey("columns"),
          JSON.stringify(visibility)
        );
      } catch (error) {
        console.error("Error saving column visibility:", error);
      }
    },
    loadColumnOrder() {
      try {
        const saved = localStorage.getItem(this.getStorageKey("columnOrder"));
        if (saved) {
          const savedOrder = JSON.parse(saved);
          // Reorder availableColumns based on saved order
          const orderedColumns = [];
          savedOrder.forEach((field) => {
            const col = this.availableColumns.find((c) => c.field === field);
            if (col) {
              orderedColumns.push(col);
            }
          });
          // Add any new columns that weren't in saved order
          this.availableColumns.forEach((col) => {
            if (!orderedColumns.find((c) => c.field === col.field)) {
              orderedColumns.push(col);
            }
          });
          this.availableColumns = orderedColumns;
        }
      } catch (error) {
        console.error("Error loading column order:", error);
      }
    },
    saveColumnOrder() {
      try {
        const order = this.availableColumns.map((col) => col.field);
        localStorage.setItem(
          this.getStorageKey("columnOrder"),
          JSON.stringify(order)
        );
        // Also update allColumns order
        this.updateAllColumnsOrder();
      } catch (error) {
        console.error("Error saving column order:", error);
      }
    },
    updateAllColumnsOrder() {
      // Update allColumns to match availableColumns order
      const orderedAllColumns = [];
      // First add checkbox if exists
      const checkboxCol = this.allColumns.find(
        (col) => col.field === "checkbox"
      );
      if (checkboxCol) orderedAllColumns.push(checkboxCol);
      // Then add columns in the order of availableColumns (including actions)
      this.availableColumns.forEach((availCol) => {
        const allCol = this.allColumns.find(
          (col) => col.field === availCol.field
        );
        if (allCol) orderedAllColumns.push(allCol);
      });
      this.allColumns = orderedAllColumns;
    },
    handleDragStart(e, index) {
      this.draggedColumnIndex = index;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", e.target.outerHTML);
      e.target.style.opacity = "0.5";
    },
    handleDragOver(e, index) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const columnItem = e.currentTarget;
      if (
        this.draggedColumnIndex !== null &&
        this.draggedColumnIndex !== index
      ) {
        // Add visual feedback
        columnItem.classList.add("drag-over");
      }
    },
    handleDrop(e, index) {
      e.preventDefault();
      if (
        this.draggedColumnIndex !== null &&
        this.draggedColumnIndex !== index
      ) {
        // Reorder columns
        const draggedColumn = this.availableColumns[this.draggedColumnIndex];
        this.availableColumns.splice(this.draggedColumnIndex, 1);
        this.availableColumns.splice(index, 0, draggedColumn);
        this.saveColumnOrder();
        this.updateColumnOrderInTable();
      }
      // Remove visual feedback
      e.currentTarget.classList.remove("drag-over");
    },
    handleDragEnd(e) {
      e.target.style.opacity = "1";
      this.draggedColumnIndex = null;
      // Remove all drag-over classes
      document
        .querySelectorAll(".column-item-list.drag-over")
        .forEach((el) => el.classList.remove("drag-over"));
    },
    updateColumnVisibility(field, visible) {
      // Update in allColumns
      const column = this.allColumns.find((col) => col.field === field);
      if (column) {
        column.visible = visible;
      }

      // Update in availableColumns for the panel
      const availableCol = this.availableColumns.find(
        (col) => col.field === field
      );
      if (availableCol) {
        availableCol.visible = visible;
      }

      // Save to localStorage
      this.saveColumnVisibility();

      // Immediately update the Tabulator table with new column configuration
      this.refreshTableColumns();
    },
    showAllColumns() {
      this.availableColumns.forEach((col) => {
        col.visible = true;
        this.updateColumnVisibility(col.field, true);
      });
    },
    hideAllColumns() {
      this.availableColumns.forEach((col) => {
        col.visible = false;
        this.updateColumnVisibility(col.field, false);
      });
    },
    resetColumnOrder() {
      // Reset to default order (original order from allColumns, excluding checkbox)
      const defaultOrder = this.allColumns
        .filter((col) => col.field !== "checkbox")
        .map((col) => col.field);

      // Reorder availableColumns to match default order
      this.availableColumns.sort((a, b) => {
        const indexA = defaultOrder.indexOf(a.field);
        const indexB = defaultOrder.indexOf(b.field);
        return indexA - indexB;
      });

      // Update the order in allColumns
      this.updateAllColumnsOrder();
      this.saveColumnOrder();
      this.updateColumnOrderInTable();
    },
    refreshTableColumns() {
      if (!this.tabulator) return;

      // Check if tabulator element exists in DOM
      if (!this.$refs.tabulator) return;

      // Ensure allColumns is initialized and has data
      if (!this.allColumns || this.allColumns.length === 0) return;

      try {
        // Ensure column order is up to date
        this.updateAllColumnsOrder();

        // Get visible columns in the correct order (preserving all column properties)
        const visibleColumns = this.allColumns
          .filter((col) => col.visible !== false)
          .map((col) => ({ ...col })); // Create new objects to ensure reactivity

        // Only proceed if we have visible columns
        if (visibleColumns.length === 0) return;

        // Update the table columns - this will show/hide and reorder columns
        // Use nextTick to ensure DOM is ready
        this.$nextTick(() => {
          if (this.tabulator && this.$refs.tabulator) {
            try {
              this.tabulator.setColumns(visibleColumns);
              // Redraw the table to ensure changes are visible
              this.tabulator.redraw(true);
            } catch (error) {
              console.warn("Error refreshing table columns:", error);
              // Retry after a short delay if it fails
              setTimeout(() => {
                if (this.tabulator && this.$refs.tabulator) {
                  try {
                    this.tabulator.setColumns(visibleColumns);
                    this.tabulator.redraw(true);
                  } catch (retryError) {
                    console.error("Error retrying setColumns:", retryError);
                  }
                }
              }, 100);
            }
          }
        });
      } catch (error) {
        console.error("Error in refreshTableColumns:", error);
      }
    },
    updateColumnOrderInTable() {
      // Update column order and refresh the table
      this.refreshTableColumns();
    },
    // Method to open column manager dialog from parent component
    openColumnManager() {
      if (this.enableColumnManagement) {
        this.showColumnManager = true;
      }
    },
  },
};
</script>
