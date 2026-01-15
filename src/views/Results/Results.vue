<template>
  <v-container
    fluid
    class="results-container"
    style="
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: 0 !important;
      margin: 0 !important;
      max-width: 100% !important;
    "
  >
    <!-- Table Card -->
    <v-row style="margin: 0; flex: 1 1 auto; min-height: 0; display: flex">
      <v-col
        cols="12"
        style="padding: 0; display: flex; flex-direction: column; min-height: 0"
      >
        <v-card
          elevation="0"
          class="table-card"
          style="
            display: flex;
            flex-direction: column;
            flex: 1 1 auto;
            min-height: 0;
          "
        >
          <v-card-text
            class="pa-0 table-container"
            style="
              display: flex;
              flex-direction: column;
              flex: 1 1 auto;
              min-height: 0;
              overflow: hidden;
            "
          >
            <!-- Compact Header Row - shown only when data is loaded -->
            <div
              v-if="!loading"
              class="results-header-toolbar"
              style="
                flex-shrink: 0;
                border-bottom: 1px solid rgb(224, 224, 224);
                min-height: 48px;
                background-color: white;
                display: flex;
                align-items: center;
                padding: 0px 8px;
                margin-top: 5px;
                margin-bottom: 0px;
                height: 71px;
              "
            >
              <div
                class="dashboard-title"
                style="flex: 0 0 auto; margin-right: 26px"
              >
                Student Results
              </div>

              <v-btn
                v-if="canManageResults"
                color="primary"
                small
                class="text-capitalize"
                elevation="2"
                style="margin-right: 4px"
                @click="handleAddResult"
                aria-label="Add new student result"
              >
                <v-icon left small>mdi-plus</v-icon>
                New Result
              </v-btn>

              <div style="flex: 1 1 auto"></div>

              <v-btn
                icon
                x-small
                style="margin: 0 2px; min-width: 32px"
                @click="refreshPage"
                title="Refresh Page"
                aria-label="Refresh page"
              >
                <v-icon small style="color: black">mdi-refresh</v-icon>
              </v-btn>

              <v-btn
                icon
                x-small
                style="margin: 0 2px; min-width: 32px"
                @click="openColumnManager"
                title="Column Management"
                aria-label="Manage columns"
              >
                <v-icon small style="color: black"
                  >mdi-view-column-outline</v-icon
                >
              </v-btn>

              <v-menu
                v-model="showExportMenu"
                :close-on-content-click="true"
                offset-y
                left
                transition="slide-y-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    x-small
                    style="margin: 0 2px; min-width: 32px"
                    v-bind="attrs"
                    v-on="on"
                    title="Export Options"
                    aria-label="Export data"
                  >
                    <v-icon small style="color: black">mdi-download</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="openExportColumnsDialog('excel')">
                    <v-list-item-icon>
                      <v-icon x-small>mdi-file-excel-box</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Export to Excel</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-btn
                v-if="canManageResults"
                icon
                x-small
                style="margin: 0 2px; min-width: 32px"
                @click="handleDeleteSelected"
                title="Delete Selected Rows"
                aria-label="Delete selected results"
                :disabled="!hasSelectedRows"
              >
                <v-icon small style="color: black">mdi-delete</v-icon>
              </v-btn>

              <v-btn
                v-if="canManageResults"
                color="primary"
                small
                class="text-capitalize"
                elevation="2"
                style="margin-left: 4px"
                @click="triggerFileUpload"
                :loading="uploading"
                title="Upload Excel File"
                aria-label="Upload Excel file to import results"
              >
                <v-icon left small>mdi-upload</v-icon>
                Upload Excel
              </v-btn>

              <!-- Hidden file input -->
              <input
                ref="fileInput"
                type="file"
                accept=".xlsx,.xls"
                style="display: none"
                @change="handleFileSelect"
              />
            </div>

            <!-- Column Management icon and functionality is provided by Tabulator-datatable component -->
            <Tabulator-datatable
              ref="tabulatorTable"
              :columns="columns"
              :ajaxURL="ajaxURL"
              :loading="loading"
              :enable-column-management="true"
              column-management-storage-key="results-columns"
              persistence-id="results-page"
              :hide-column-manager-icon="false"
              height="100%"
              layout="fitDataStretch"
              pagination="local"
              :pagination-size="100"
              :pagination-size-selector="[100, 200, 500]"
              pagination-counter="rows"
              :movable-columns="true"
              :resizable-columns="true"
              :selectable="true"
              selectable-range-mode="click"
              :header-filter-live-filter="true"
              placeholder="No Data Available"
              :row-header="rowHeaderConfig"
              :keybindings="keybindingsConfig"
              :locale="true"
              :langs="langsConfig"
              @row-click="handleRowClick"
              @row-selected="handleRowSelected"
              @row-deselected="handleRowDeselected"
              @data-loading="handleDataLoading"
              @data-loaded="handleDataLoaded"
              @data-load-error="handleDataLoadError"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Export Columns Selection Dialog (reverted for reliability) -->
    <v-dialog v-model="showExportColumnsDialog" max-width="420px">
      <v-card>
        <v-card-title class="headline">Select Columns</v-card-title>
        <v-card-text>
          <p class="text-body-2 mb-2">
            Choose which columns you want to export to Excel.
          </p>
          <v-simple-table dense>
            <tbody>
              <tr v-for="col in availableExportColumns" :key="col.field">
                <td style="width: 40px">
                  <v-checkbox
                    v-model="exportColumnsSelection"
                    :value="col.field"
                    hide-details
                    dense
                  ></v-checkbox>
                </td>
                <td>{{ col.title || col.field }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showExportColumnsDialog = false"> Cancel </v-btn>
          <v-btn color="primary" @click="confirmExportColumns">
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline error--text">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Delete Result Record
        </v-card-title>
        <v-card-text>
          <p class="subtitle-1 mb-2">
            Are you sure you want to delete the result record for
            <strong>{{
              resultToDelete?.roll_no || `ID ${resultToDelete?.id}`
            }}</strong
            >?
          </p>
          <p class="body-2 text--secondary">
            This action cannot be undone. All data associated with this result
            will be permanently deleted.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDeleteDialog = false" :disabled="deleting">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            depressed
            @click="confirmDelete"
            :loading="deleting"
          >
            <v-icon left>mdi-delete</v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Bulk Delete Confirmation Dialog -->
    <v-dialog v-model="showBulkDeleteDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline error--text">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Delete Selected Results
        </v-card-title>
        <v-card-text>
          <p class="subtitle-1 mb-2">
            Are you sure you want to delete
            <strong>{{ selectedRowsCount }}</strong> selected result(s)?
          </p>
          <p class="body-2 text--secondary">
            This action cannot be undone. All data associated with these results
            will be permanently deleted.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="showBulkDeleteDialog = false"
            :disabled="deleting"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            depressed
            @click="confirmBulkDelete"
            :loading="deleting"
          >
            <v-icon left>mdi-delete</v-icon>
            Delete All
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Result Detail Modal -->
    <v-dialog v-model="showModal" max-width="800px" scrollable>
      <v-card v-if="selectedResult">
        <v-card-title>
          <span class="headline">Result Details</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="showModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <td class="font-weight-bold">Exam Roll No:</td>
                      <td>{{ selectedResult.roll_no || "N/A" }}</td>
                    </tr>
                    <tr>
                      <td class="font-weight-bold">Year:</td>
                      <td>{{ selectedResult.year || "N/A" }}</td>
                    </tr>
                    <tr v-if="selectedResult.serial_no">
                      <td class="font-weight-bold">Serial No:</td>
                      <td>{{ selectedResult.serial_no }}</td>
                    </tr>
                    <tr v-if="selectedResult.program">
                      <td class="font-weight-bold">Program:</td>
                      <td>{{ selectedResult.program }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="12" md="6" v-if="selectedResult.result_image">
              <v-img
                :src="selectedResult.result_image"
                :alt="`Result for ${selectedResult.roll_no}`"
                max-height="400"
                contain
              ></v-img>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import TabulatorDatatable from "@/components/Tabulator/Tabulator-datatable.vue";
import api from "@/config/api";
import { toast } from "@/utils/toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "@/assets/css/Results.css";
import { fetchDummyData } from "@/utils/dummyData";

export default {
  name: "Results-Section",
  components: {
    TabulatorDatatable,
  },
  data() {
    return {
      results: [],
      showModal: false,
      selectedResult: null,
      loading: true, // Start with loading true - will be set to false when data loads
      error: null,
      showExportMenu: false,
      programList: [],
      operatorList: [],
      showDeleteDialog: false,
      showBulkDeleteDialog: false,
      resultToDelete: null,
      deleting: false,
      selectedRowsCount: 0,
      // Export column selection
      showExportColumnsDialog: false,
      exportColumnsSelection: [],
      availableExportColumns: [],
      exportActionType: null, // 'excel'
      ajaxURL: "/api/results",
      // Excel upload
      uploading: false,
      columns: [
        // {
        //   title: "ID",
        //   field: "id",
        //   width: 100,
        //   headerFilter: "input",
        //   sorter: "number",
        //   hozAlign: "center",
        //   headerHozAlign: "center",
        //   visible: true,
        // },
        {
          title: "Exam Roll No",
          field: "roll_no",
          width: 180,
          minWidth: 120,
          maxWidth: 250,
          headerFilter: "input",
          sorter: "string",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            return value || "-";
          },
        },
        {
          title: "Student Name",
          field: "student_name",
          width: 200,
          minWidth: 150,
          maxWidth: 300,
          headerFilter: "input",
          sorter: "string",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            return value || "-";
          },
        },
        {
          title: "Father Name",
          field: "father_name",
          width: 200,
          minWidth: 150,
          maxWidth: 300,
          headerFilter: "input",
          sorter: "string",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            return value || "-";
          },
        },
        {
          title: "Year",
          field: "year",
          width: 100,
          minWidth: 80,
          maxWidth: 120,
          headerFilter: "input",
          sorter: "number",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            return value || "-";
          },
        },
        {
          title: "Session",
          field: "session",
          width: 150,
          minWidth: 120,
          maxWidth: 200,
          headerFilter: "input",
          sorter: "string",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            return value || "-";
          },
        },
        {
          title: "Registration No",
          field: "registration_no",
          width: 180,
          minWidth: 150,
          maxWidth: 250,
          headerFilter: "input",
          sorter: "string",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            return value || "-";
          },
        },
        {
          title: "Result",
          field: "result",
          width: 120,
          minWidth: 100,
          maxWidth: 180,
          headerFilter: "input",
          sorter: "string",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            return value || "-";
          },
        },
        {
          title: "GPA",
          field: "gpa",
          width: 100,
          minWidth: 80,
          maxWidth: 120,
          headerFilter: "input",
          sorter: "number",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            if (value === null || value === undefined || value === "")
              return "-";
            return parseFloat(value).toFixed(2);
          },
        },
        {
          title: "CGPA",
          field: "cgpa",
          width: 100,
          minWidth: 80,
          maxWidth: 120,
          headerFilter: "input",
          sorter: "number",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            if (value === null || value === undefined || value === "")
              return "-";
            return parseFloat(value).toFixed(2);
          },
        },
        {
          title: "Program",
          field: "program",
          width: 220,
          minWidth: 150,
          maxWidth: 350,
          headerFilter: "list",
          headerFilterParams: {
            values: [],
            clearable: true,
            multiselect: false,
          },
          sorter: "string",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            return value || "-";
          },
        },
        {
          title: "Serial No",
          field: "serial_no",
          width: 150,
          minWidth: 120,
          maxWidth: 220,
          headerFilter: "input",
          sorter: "string",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const el = cell.getElement();
            if (el) {
              el.style.color = "#497CB1";
              el.style.fontWeight = "600";
            }
            const value = cell.getValue();
            return value || "-";
          },
        },
        {
          title: "Audit Logs",
          field: "operator",
          width: 300,
          minWidth: 200,
          maxWidth: 400,
          headerFilter: "list",
          headerFilterParams: {
            values: [],
            clearable: true,
            multiselect: false,
          },
          sorter: "string",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            if (!value) return "-";
            // Format: "Name - Role" - display with styling
            // If it contains " - ", parse and format it
            if (value.includes(" - ")) {
              const parts = value.split(" - ");
              if (parts.length === 2) {
                const roleName = parts[1];
                // Format role name: result_control -> Result Control, registration_control -> Registration Control
                let formattedRole = roleName;
                let roleColor = "#1976d2"; // Default blue

                if (roleName === "result_control") {
                  formattedRole = "Result Control";
                  roleColor = "#2e7d32"; // Dark green
                } else if (roleName === "registration_control") {
                  formattedRole = "Registration Control";
                  roleColor = "#e65100"; // Dark orange
                } else if (roleName === "admin") {
                  formattedRole = "Admin";
                  roleColor = "#5e35b1"; // Dark purple
                } else if (roleName === "user") {
                  formattedRole = "Operator";
                  roleColor = "#1565c0"; // Dark blue
                } else {
                  // Fallback: replace underscores with spaces and capitalize each word
                  formattedRole = roleName
                    .split("_")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ");
                }
                // Return HTML string for styled display
                return `<div style="display: flex; align-items: center; justify-content: center; gap: 4px;"><span style="font-weight: 500; color: #424242;">${parts[0]}</span><span style="color: #757575;">-</span><span style="color: ${roleColor}; font-weight: 600;">${formattedRole}</span></div>`;
              }
            }
            return value;
          },
        },
        {
          title: "Created At",
          field: "created_at",
          width: 200,
          minWidth: 180,
          maxWidth: 250,
          headerFilter: false,
          sorter: "datetime",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const val = cell.getValue();
            if (!val) return "-";
            const d = new Date(val);
            if (isNaN(d.getTime())) return val;
            return d.toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });
          },
        },
        {
          title: "Updated At",
          field: "updated_at",
          width: 200,
          minWidth: 180,
          maxWidth: 250,
          headerFilter: false,
          sorter: "datetime",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const val = cell.getValue();
            if (!val) return "-";
            const d = new Date(val);
            if (isNaN(d.getTime())) return val;
            return d.toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });
          },
        },
        // {
        //   title: "Result Image",
        //   field: "result_image",
        //   width: 200,
        //   headerSort: false,
        //   hozAlign: "center",
        //   headerHozAlign: "center",
        //   visible: true,
        //   formatter: (cell) => {
        //     const value = cell.getValue();
        //     if (value) {
        //       // Check if it's a data URL or full URL
        //       if (
        //         value.startsWith("data:image/") ||
        //         value.startsWith("http://") ||
        //         value.startsWith("https://")
        //       ) {
        //         return `<img src="${value}" style="max-width: 100px; max-height: 80px; object-fit: contain; border-radius: 4px; cursor: pointer;" alt="Result Image" onclick="window.open('${value}', '_blank')" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';" />
        //           <span style="display: none; color: #999; font-size: 12px;">No Image</span>`;
        //       } else if (
        //         value.length > 100 &&
        //         /^[A-Za-z0-9+/=\s]*$/.test(value.replace(/\s/g, ""))
        //       ) {
        //         // It's base64 without prefix
        //         const cleanBase64 = value.replace(/\s/g, "");
        //         const dataUrl = `data:image/jpeg;base64,${cleanBase64}`;
        //         return `<img src="${dataUrl}" style="max-width: 100px; max-height: 80px; object-fit: contain; border-radius: 4px; cursor: pointer;" alt="Result Image" onclick="window.open('${dataUrl}', '_blank')" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';" />
        //           <span style="display: none; color: #999; font-size: 12px;">No Image</span>`;
        //       } else {
        //         return '<span style="color: #999; font-size: 12px;">Image (filename)</span>';
        //       }
        //     }
        //     return '<span style="color: #999; font-size: 12px;">-</span>';
        //   },
        // },
        {
          title: "Actions",
          field: "actions",
          headerSort: false,
          width: 150,
          minWidth: 150,
          maxWidth: 200,
          frozen: true,
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          movable: false,
          formatter: null, // Will be set in mounted() to access this.canManageResults
          cellClick: (e, cell) => {
            const target = e.target.closest("button");
            if (!target) return;

            const data = cell.getRow().getData();
            const id = data.id;

            if (target.classList.contains("view-btn")) {
              if (data.roll_no) {
                this.$router.push(
                  `/result/${encodeURIComponent(data.roll_no)}`
                );
              } else {
                this.handleView(data);
              }
            } else if (target.classList.contains("edit-btn")) {
              this.handleEdit(data);
            } else if (target.classList.contains("delete-btn")) {
              this.handleDelete(id, data);
            }
          },
        },
      ],
    };
  },
  computed: {
    isAdmin() {
      const userRole = this.$store.getters.getRole || "";
      return userRole.toLowerCase() === "admin";
    },
    isResultControl() {
      const userRole = this.$store.getters.getRole || "";
      return userRole.toLowerCase() === "result_control";
    },
    canManageResults() {
      const userRole = (this.$store.getters.getRole || "").toLowerCase();
      return userRole === "admin" || userRole === "result_control";
    },
    isUserOrOperator() {
      const userRole = (this.$store.getters.getRole || "").toLowerCase();
      return userRole === "user" || userRole === "operator";
    },
    hasSelectedRows() {
      return this.selectedRowsCount > 0;
    },
    rowHeaderConfig() {
      return {
        headerSort: false,
        resizable: false,
        frozen: true,
        headerHozAlign: "center",
        hozAlign: "center",
        formatter: "rowSelection",
        titleFormatter: "rowSelection",
        cellClick: function (e, cell) {
          cell.getRow().toggleSelect();
        },
      };
    },
    keybindingsConfig() {
      return {
        navPrev: "arrowup",
        navNext: "arrowdown",
        navLeft: "arrowleft",
        navRight: "arrowright",
        navFirst: "home",
        navLast: "end",
      };
    },
    langsConfig() {
      return {
        default: {
          pagination: {
            page_size: "Page Size",
            page_title: "Show Page",
            first: "First",
            first_title: "First Page",
            last: "Last",
            last_title: "Last Page",
            prev: "Prev",
            prev_title: "Previous Page",
            next: "Next",
            next_title: "Next Page",
            all: "All",
            counter: {
              showing: "Showing",
              of: "of",
              rows: "rows",
              page: "page",
              pages: "pages",
            },
          },
        },
      };
    },
  },
  async mounted() {
    // Set the actions formatter with proper this context
    const actionsColumn = this.columns.find((col) => col.field === "actions");
    if (actionsColumn) {
      actionsColumn.formatter = this.getActionsFormatter();
    }
    // Fetch filter lists from server first
    await Promise.all([this.fetchPrograms(), this.fetchOperators()]);
    // Initialize columns with filters
    this.updateProgramFilter();
    this.updateOperatorFilter();

    // Ensure column visibility & order are restored from localStorage
    // Wait for Tabulator component to be fully initialized
    this.$nextTick(() => {
      // Add a small delay to ensure Tabulator is fully ready
      setTimeout(() => {
        if (this.$refs.tabulatorTable) {
          // Re-initialize column management after columns are set up
          // This ensures saved preferences are loaded and applied
          if (
            this.$refs.tabulatorTable.initializeColumnManagement &&
            this.columns &&
            this.columns.length > 0
          ) {
            this.$refs.tabulatorTable.initializeColumnManagement(this.columns);
          }
        }
      }, 100);
    });
    // Tabulator will automatically load data via AJAX using ajaxURL
  },
  methods: {
    getActionsFormatter() {
      return (cell) => {
        const data = cell.getRow().getData();
        const rollNo = data.roll_no;
        const canManageResults = this.canManageResults;
        const isUserOrOperator = this.isUserOrOperator;
        return `
          <div class="action-buttons">
            <button class="action-btn view-btn" title="View Details" aria-label="View result details" data-roll="${
              rollNo || ""
            }" type="button">
              <span class="mdi mdi-file-document-outline" style="color: black; font-size: 22px;" aria-hidden="true"></span>
            </button>
            ${
              !isUserOrOperator
                ? `
            <button 
              class="action-btn edit-btn" 
              title="Edit Result"
              aria-label="Edit result record"
              data-id="${data.id}"
              type="button"
            >
              <span class="mdi mdi-pencil" style="color: black; font-size: 22px;" aria-hidden="true"></span>
            </button>
            `
                : ""
            }
            ${
              canManageResults
                ? `
            <button 
              class="action-btn delete-btn" 
              title="Delete Result"
              aria-label="Delete result record"
              data-id="${data.id}"
              type="button"
            >
              <span class="mdi mdi-delete" style="color: black; font-size: 22px;" aria-hidden="true"></span>
            </button>
            `
                : ""
            }
          </div>
        `;
      };
    },
    handleRowClick(e, row, rowData) {
      const target = e.target;
      // Don't navigate if clicking on action buttons
      if (target.closest(".action-buttons")) {
        return;
      }
      // Navigate to dedicated result page if roll number exists
      if (rowData && rowData.roll_no) {
        this.$router.push(`/result/${encodeURIComponent(rowData.roll_no)}`);
      }
    },
    handleView(data) {
      // Always navigate to dedicated page instead of opening dialog
      if (data && data.roll_no) {
        this.$router.push(`/result/${encodeURIComponent(data.roll_no)}`);
      }
    },
    handleEdit(data) {
      // Navigate to edit result page
      if (data && data.id) {
        this.$router.push(`/result/${data.id}/edit`);
      } else {
        this.error = "Result ID is missing. Cannot edit record.";
        console.error("Edit error: Result ID is missing", data);
      }
    },
    handleDelete(id, data) {
      // Validate that id exists
      if (!id) {
        this.error = "Result ID is missing. Cannot delete record.";
        console.error("Delete error: Result ID is missing", data);
        return;
      }

      // Store result data and open delete dialog
      this.resultToDelete = { id, ...data };
      this.showDeleteDialog = true;
    },
    async confirmDelete() {
      if (!this.resultToDelete || !this.resultToDelete.id) {
        this.error = "Result ID is missing. Cannot delete record.";
        this.showDeleteDialog = false;
        return;
      }

      const id = this.resultToDelete.id;
      const rollNo = this.resultToDelete.roll_no || `ID ${id}`;

      try {
        this.deleting = true;
        this.error = null;

        // Call delete API endpoint
        const response = await api.delete(`/api/results/${id}`);

        console.log("Delete response:", response.data);

        // Close dialog
        this.showDeleteDialog = false;
        this.resultToDelete = null;

        // Show success message
        toast.success(
          `Result record for "${rollNo}" has been deleted successfully.`
        );

        // Refresh the table via AJAX
        if (this.$refs.tabulatorTable) {
          this.$refs.tabulatorTable.reloadData();
        }
      } catch (error) {
        console.error("Delete error:", error);
        this.error =
          error.response?.data?.error ||
          error.message ||
          `Failed to delete result record. Please try again.`;

        // Clear error message after 5 seconds
        setTimeout(() => {
          this.error = null;
        }, 5000);
      } finally {
        this.deleting = false;
      }
    },
    handleDeleteSelected() {
      if (!this.hasSelectedRows) {
        toast.warning("Please select at least one row to delete");
        return;
      }
      this.showBulkDeleteDialog = true;
    },
    async confirmBulkDelete() {
      if (!this.$refs.tabulatorTable) return;

      const table = this.$refs.tabulatorTable.getTabulatorInstance();
      if (!table) return;

      const selectedRows = table.getSelectedData();
      if (selectedRows.length === 0) {
        toast.warning("No rows selected");
        this.showBulkDeleteDialog = false;
        return;
      }

      try {
        this.deleting = true;
        const deletePromises = selectedRows.map((row) =>
          api.delete(`/api/results/${row.id}`)
        );
        await Promise.all(deletePromises);
        toast.success(`Successfully deleted ${selectedRows.length} result(s)`);
        this.showBulkDeleteDialog = false;
        this.selectedRowsCount = 0;
        this.refreshPage();
      } catch (error) {
        console.error("Bulk delete error:", error);
        toast.error("Failed to delete some results. Please try again.");
      } finally {
        this.deleting = false;
      }
    },
    handleDataLoaded() {
      // Data loaded successfully
      this.error = null;
      this.loading = false; // Hide loading when data is loaded
      this.updateSelectedRowsCount();
    },
    // eslint-disable-next-line no-unused-vars
    handleRowSelected(_rowData, _row) {
      this.updateSelectedRowsCount();
    },
    // eslint-disable-next-line no-unused-vars
    handleRowDeselected(_rowData, _row) {
      this.updateSelectedRowsCount();
    },
    updateSelectedRowsCount() {
      this.$nextTick(() => {
        if (!this.$refs.tabulatorTable) {
          this.selectedRowsCount = 0;
          return;
        }
        const table = this.$refs.tabulatorTable.getTabulatorInstance();
        if (!table) {
          this.selectedRowsCount = 0;
          return;
        }
        const selectedRows = table.getSelectedData();
        this.selectedRowsCount = selectedRows.length;
      });
    },
    handleDataLoading() {
      // Show loading when data starts loading
      this.loading = true;
    },
    async handleDataLoadError(error) {
      // Handle AJAX loading errors
      console.error("Error loading data via AJAX:", error);
      this.loading = false; // Hide loading on error
      if (error.response) {
        if (error.response.status === 401) {
          this.error = "Your session has expired. Please log in again.";
        } else if (error.response.status === 403) {
          this.error = "You don't have permission to view results.";
        } else if (error.response.status === 404) {
          this.error = "Results endpoint not found. Please contact support.";
        } else if (error.response.status >= 500) {
          this.error =
            "Server error. Please try again later or contact support.";
        } else {
          this.error =
            error.response.data?.error ||
            "Failed to load results. Please try again.";
        }
      } else if (error.request && !error.response) {
        // Network error - backend unavailable, use dummy data from online URL
        console.log("Using dummy data for results (backend unavailable)");
        try {
          const dummyData = await fetchDummyData();
          if (this.$refs.tabulatorTable && this.$refs.tabulatorTable.setData && dummyData?.results) {
            this.$refs.tabulatorTable.setData(dummyData.results);
          }
          this.error = null;
        } catch (dummyError) {
          console.error("Failed to load dummy data:", dummyError);
        }
      } else {
        this.error = "An unexpected error occurred. Please try again.";
      }
    },
    refreshPage() {
      // Refresh the entire page
      window.location.reload();
    },
    openColumnManager() {
      // Open column manager dialog from Tabulator-datatable component
      if (
        this.$refs.tabulatorTable &&
        this.$refs.tabulatorTable.openColumnManager
      ) {
        this.$refs.tabulatorTable.openColumnManager();
      }
    },
    handleAddResult() {
      // Navigate to add result page
      this.$router.push("/result/add");
    },
    triggerFileUpload() {
      // Trigger the hidden file input
      this.$refs.fileInput?.click();
    },
    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (!["xlsx", "xls"].includes(fileExtension)) {
        toast.error("Please select a valid Excel file (.xlsx or .xls)");
        return;
      }

      // Validate file size (100MB limit)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        toast.error("File size exceeds 100MB limit");
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("excelFile", file);

      this.uploading = true;
      try {
        const response = await api.post("/api/results/upload-excel", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          const data = response.data.data;
          let message = response.data.message;

          // Show detailed results if available
          if (data) {
            if (data.failed > 0 && data.errors && data.errors.length > 0) {
              // Show errors for first few rows
              const errorDetails = data.errors
                .slice(0, 5)
                .map((e) => `Row ${e.row}: ${e.error}`)
                .join("\n");
              message += `\n\nErrors:\n${errorDetails}`;
              if (data.errors.length > 5) {
                message += `\n... and ${data.errors.length - 5} more error(s)`;
              }
            }
          }

          toast.success(message);

          // Refresh the table
          if (
            this.$refs.tabulatorTable &&
            this.$refs.tabulatorTable.reloadData
          ) {
            this.$refs.tabulatorTable.reloadData();
          }
        } else {
          toast.error(response.data.error || "Failed to upload Excel file");
        }
      } catch (error) {
        console.error("Excel upload error:", error);
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to upload Excel file. Please try again.";
        toast.error(errorMessage);
      } finally {
        this.uploading = false;
        // Reset file input
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = "";
        }
      }
    },
    getSelectedData() {
      // Get selected rows if any, otherwise get all data
      if (!this.$refs.tabulatorTable) return [];

      const table = this.$refs.tabulatorTable.getTabulatorInstance();
      if (!table) return [];

      const selectedRows = table.getSelectedData();
      // If rows are selected, use them; otherwise use all data
      return selectedRows.length > 0
        ? selectedRows
        : this.$refs.tabulatorTable.getData("all") || [];
    },
    /**
     * Format field name to readable title
     */
    formatFieldName(field) {
      return field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    },
    /**
     * Get the currently visible columns from Tabulator for export/print.
     * This respects the user's column management selections.
     */
    getVisibleExportColumns() {
      if (!this.$refs.tabulatorTable) return [];

      const table = this.$refs.tabulatorTable.getTabulatorInstance?.();
      if (!table) return [];

      return table
        .getColumns()
        .filter(
          (col) =>
            col.isVisible() &&
            col.getField() !== "checkbox" &&
            col.getField() !== "actions"
        )
        .map((col) => col.getDefinition());
    },
    openExportColumnsDialog(action) {
      // Build column list from defined columns just for the popover UI
      let cols = (this.columns || []).filter(
        (col) => col.field !== "checkbox" && col.field !== "actions"
      );
      if (!cols.length) {
        // Fallback: static list of key result fields
        cols = [
          { title: "Exam Roll No", field: "roll_no" },
          { title: "Student Name", field: "student_name" },
          { title: "Father Name", field: "father_name" },
          { title: "Year", field: "year" },
          { title: "Session", field: "session" },
          { title: "Registration No", field: "registration_no" },
          { title: "Result", field: "result" },
          { title: "GPA", field: "gpa" },
          { title: "CGPA", field: "cgpa" },
          { title: "Serial No", field: "serial_no" },
          { title: "Program", field: "program" },
          { title: "Part", field: "part" },
          { title: "Annual/Supply", field: "year_as" },
          { title: "Total Marks", field: "total_marks" },
          { title: "Obtained Marks", field: "obtained_marks" },
          { title: "Division / Grade", field: "division_grade" },
          { title: "Remarks", field: "remarks" },
          { title: "Audit Logs", field: "operator" },
          { title: "Created At", field: "created_at" },
          { title: "Updated At", field: "updated_at" },
        ];
      }

      this.availableExportColumns = cols;
      this.exportColumnsSelection = cols.map((c) => c.field);
      this.exportActionType = action;
      this.showExportColumnsDialog = true;
      this.showExportMenu = false;
    },
    confirmExportColumns() {
      if (!this.exportColumnsSelection.length) {
        toast.warning("Please select at least one column.");
        return;
      }

      if (this.exportActionType === "excel") {
        this.exportToExcel(this.exportColumnsSelection);
      }

      this.showExportColumnsDialog = false;
    },
    exportToPDF(selectedFields) {
      if (!this.$refs.tabulatorTable) return;

      try {
        const doc = new jsPDF("landscape", "mm", "a4");
        const tableData = [];
        const headers = [];

        // Get visible columns from Tabulator (excluding checkbox and actions)
        let visibleCols = this.getVisibleExportColumns();
        if (selectedFields && selectedFields.length) {
          const fieldSet = new Set(selectedFields);
          visibleCols = visibleCols.filter((col) => fieldSet.has(col.field));
        }
        if (!visibleCols.length) {
          toast.warning("No columns to export. Please select columns first.");
          return;
        }

        // Add headers
        visibleCols.forEach((col) => {
          headers.push(col.title);
        });

        // Get selected data or all data
        const allData = this.getSelectedData();

        // Add rows
        allData.forEach((row) => {
          const rowData = [];
          visibleCols.forEach((col) => {
            let value = row[col.field];
            if (value === null || value === undefined || value === "") {
              value = "-";
            } else if (typeof value === "object") {
              value = JSON.stringify(value);
            }
            // Truncate long values
            const stringValue = String(value);
            if (stringValue.length > 50) {
              value = stringValue.substring(0, 47) + "...";
            }
            rowData.push(stringValue);
          });
          tableData.push(rowData);
        });

        // Add title and date
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Student Results", 14, 15);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const date = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        doc.text(`Generated on: ${date}`, 14, 22);
        const selectedCount =
          this.$refs.tabulatorTable.getTabulatorInstance()?.getSelectedData()
            ?.length || 0;
        const recordText =
          selectedCount > 0
            ? `Selected Records: ${selectedCount}`
            : `Total Records: ${allData.length}`;
        doc.text(recordText, 200, 22);

        // Add table to PDF
        doc.autoTable({
          head: [headers],
          body: tableData,
          startY: 28,
          styles: {
            fontSize: 7,
            cellPadding: 2,
            overflow: "linebreak",
            cellWidth: "wrap",
          },
          headStyles: {
            fillColor: [73, 124, 177], // #497CB1
            textColor: 255,
            fontStyle: "bold",
            halign: "center",
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: { top: 28, left: 14, right: 14 },
          tableWidth: "auto",
        });

        // Save PDF
        const fileName = `student-results-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        doc.save(fileName);
        this.showExportMenu = false;
        toast.success("PDF downloaded successfully!");
      } catch (error) {
        console.error("PDF export error:", error);
        toast.error("Failed to export PDF. Please try again.");
      }
    },
    printResults() {
      if (!this.$refs.tabulatorTable) return;

      try {
        // Get selected data or all data
        const allData = this.getSelectedData();

        if (!allData || allData.length === 0) {
          toast.warning("No data to print.");
          return;
        }

        // Get Tabulator instance to check column visibility
        const table = this.$refs.tabulatorTable.getTabulatorInstance?.();
        if (!table) {
          toast.error("Table not initialized.");
          return;
        }

        // Create a Set of allowed field names from this.columns (excluding checkbox, actions, result_image)
        const allowedFields = new Set(
          (this.columns || [])
            .filter(
              (col) =>
                col.field &&
                col.field !== "checkbox" &&
                col.field !== "actions" &&
                col.field !== "result_image"
            )
            .map((col) => col.field)
        );

        // Get only columns defined in this.columns that are visible in the table
        // Exclude checkbox, actions, and result_image
        const visibleCols = (this.columns || [])
          .filter((col) => {
            // Skip checkbox, actions, and result_image
            if (
              !col.field ||
              col.field === "checkbox" ||
              col.field === "actions" ||
              col.field === "result_image"
            ) {
              return false;
            }
            // Check if column is visible in Tabulator
            const tabulatorCol = table.getColumn(col.field);
            return tabulatorCol && tabulatorCol.isVisible();
          })
          .map((col) => ({
            title: col.title,
            field: col.field,
          }));

        if (!visibleCols.length) {
          toast.warning("No columns to print.");
          return;
        }

        // Create print window
        const printWindow = window.open("", "_blank");
        const date = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // Build HTML content
        let htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Student Results - Print</title>
            <style>
              @media print {
                @page {
                  size: landscape;
                  margin: 1cm;
                }
                body {
                  margin: 0;
                  padding: 0;
                }
                .no-print {
                  display: none;
                }
              }
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 2px solid #497CB1;
                padding-bottom: 10px;
              }
              .header h1 {
                color: #497CB1;
                margin: 0;
                font-size: 24px;
              }
              .header p {
                margin: 5px 0;
                color: #666;
                font-size: 12px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 10px;
              }
              th {
                background-color: #497CB1;
                color: white;
                padding: 8px;
                text-align: center;
                border: 1px solid #ddd;
                font-weight: bold;
              }
              td {
                padding: 6px;
                border: 1px solid #ddd;
                text-align: left;
              }
              tr:nth-child(even) {
                background-color: #f5f5f5;
              }
              tr:hover {
                background-color: #e8f4f8;
              }
              .print-button {
                margin: 20px 0;
                text-align: center;
              }
              .print-button button {
                background-color: #497CB1;
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 14px;
                cursor: pointer;
                border-radius: 4px;
              }
              .print-button button:hover {
                background-color: #3a6a9d;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Student Results</h1>
              <p>Generated on: ${date}</p>
              <p>${
                this.$refs.tabulatorTable
                  .getTabulatorInstance()
                  ?.getSelectedData()?.length > 0
                  ? `Selected Records: ${
                      this.$refs.tabulatorTable
                        .getTabulatorInstance()
                        .getSelectedData().length
                    }`
                  : `Total Records: ${allData.length}`
              }</p>
            </div>
            <div class="print-button no-print">
              <button onclick="window.print()">Print</button>
            </div>
            <table>
              <thead>
                <tr>
        `;

        // Add headers
        visibleCols.forEach((col) => {
          htmlContent += `<th>${col.title}</th>`;
        });

        htmlContent += `
                </tr>
              </thead>
              <tbody>
        `;

        // Add rows - only use fields that are in the allowed fields set
        allData.forEach((row) => {
          htmlContent += "<tr>";
          visibleCols.forEach((col) => {
            // Only access fields that are in our allowed fields set
            if (!allowedFields.has(col.field)) {
              htmlContent += `<td>-</td>`;
              return;
            }

            let value = row[col.field];

            // Format based on field type
            if (value === null || value === undefined || value === "") {
              value = "-";
            } else if (typeof value === "object") {
              value = JSON.stringify(value);
            } else if (typeof value === "number") {
              // Format numbers appropriately
              if (col.field === "gpa" || col.field === "cgpa") {
                value = parseFloat(value).toFixed(2);
              }
            } else if (typeof value === "string") {
              // For operator field, extract just the name part (before " - ")
              if (col.field === "operator" && value.includes(" - ")) {
                value = value.split(" - ")[0];
              }
              // For date fields, format them
              if (col.field === "created_at" || col.field === "updated_at") {
                try {
                  const date = new Date(value);
                  if (!isNaN(date.getTime())) {
                    value = date.toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    });
                  }
                } catch (e) {
                  // Keep original value if date parsing fails
                }
              }
            }
            // Escape HTML to prevent XSS
            const escapedValue = String(value)
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
            htmlContent += `<td>${escapedValue}</td>`;
          });
          htmlContent += "</tr>";
        });

        htmlContent += `
              </tbody>
            </table>
          </body>
          </html>
        `;

        // Write content and trigger print
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for content to load, then trigger print
        setTimeout(() => {
          printWindow.print();
        }, 250);

        this.showExportMenu = false;
        toast.success("Print dialog opened!");
      } catch (error) {
        console.error("Print error:", error);
        toast.error("Failed to open print dialog. Please try again.");
      }
    },
    exportToExcel(selectedFields) {
      if (!this.$refs.tabulatorTable) return;

      try {
        // Get visible columns from Tabulator (excluding checkbox, actions)
        let visibleCols = this.getVisibleExportColumns();
        if (selectedFields && selectedFields.length) {
          const fieldSet = new Set(selectedFields);
          visibleCols = visibleCols.filter((col) => fieldSet.has(col.field));
        }
        if (!visibleCols.length) {
          toast.warning("No columns to export. Please select columns first.");
          return;
        }

        // Get selected data or all data
        const allData = this.getSelectedData();

        // Prepare data for Excel
        const excelData = [];
        const headers = visibleCols.map((col) => col.title);
        excelData.push(headers);

        allData.forEach((row) => {
          const rowData = visibleCols.map((col) => {
            let value = row[col.field];
            return value === null || value === undefined ? "-" : value;
          });
          excelData.push(rowData);
        });

        // Create workbook and worksheet
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Student Results");

        // Save file
        XLSX.writeFile(wb, "student-results.xlsx");
        this.showExportMenu = false;
        toast.success("Excel file exported successfully!");
      } catch (error) {
        console.error("Excel export error:", error);
        toast.error("Failed to export Excel file. Please try again.");
      }
    },
    getProgramFilterValues() {
      // Return array of unique programs from results database (no "All" option)
      return this.programList.length > 0 ? this.programList : [];
    },
    async fetchPrograms() {
      try {
        // Use the new programs API endpoint
        const response = await api.get("/api/programs");
        if (response.data.success) {
          // Map to array of program names for the filter dropdown
          const programs = response.data.data || [];
          this.programList = programs.map((p) => p.name).filter(Boolean);
          // Update column filter if table is already initialized
          this.updateProgramFilter();
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        // Fallback to old endpoint if new one fails
        try {
          const fallbackResponse = await api.get("/api/results/programs");
          if (fallbackResponse.data.success) {
            this.programList = fallbackResponse.data.data || [];
            this.updateProgramFilter();
          }
        } catch (fallbackError) {
          console.error(
            "Error fetching programs from fallback:",
            fallbackError
          );
        }
      }
    },
    updateProgramFilter() {
      // Update column filter list if table is already initialized
      if (this.columns && this.columns.length > 0) {
        const programColumn = this.columns.find(
          (col) => col.field === "program"
        );
        if (programColumn && programColumn.headerFilterParams) {
          programColumn.headerFilterParams.values =
            this.getProgramFilterValues();
        }
        // Force Tabulator to refresh column definitions
        if (this.$refs.tabulatorTable && this.$refs.tabulatorTable.tabulator) {
          this.$refs.tabulatorTable.tabulator.setColumns(this.columns);
        }
      }
    },
    getOperatorFilterValues() {
      // Return array of unique operator values from database
      return this.operatorList.length > 0 ? this.operatorList : [];
    },
    async fetchOperators() {
      try {
        // Fetch all results to get unique operator values
        const response = await api.get("/api/results?all=1");
        if (response.data.success) {
          const results = response.data.data || [];
          // Extract unique operator values
          const uniqueOperators = [
            ...new Set(
              results.map((r) => r.operator).filter((o) => o && o.trim() !== "")
            ),
          ].sort();
          this.operatorList = uniqueOperators;
          // Update column filter if table is already initialized
          this.updateOperatorFilter();
        }
      } catch (error) {
        console.error("Error fetching operators:", error);
        if (error.request && !error.response) {
          // Network error - backend unavailable, use dummy data from online URL
          console.log("Using dummy data for operators (backend unavailable)");
          try {
            const dummyData = await fetchDummyData();
            if (dummyData?.results) {
              const uniqueOperators = [
                ...new Set(
                  dummyData.results.map((r) => r.operator).filter((o) => o && o.trim() !== "")
                ),
              ].sort();
              this.operatorList = uniqueOperators;
              this.updateOperatorFilter();
            }
          } catch (dummyError) {
            console.error("Failed to load dummy data:", dummyError);
          }
        }
      }
    },
    updateOperatorFilter() {
      // Update column filter list if table is already initialized
      if (this.columns && this.columns.length > 0) {
        const operatorColumn = this.columns.find(
          (col) => col.field === "operator"
        );
        if (operatorColumn && operatorColumn.headerFilterParams) {
          operatorColumn.headerFilterParams.values =
            this.getOperatorFilterValues();
        }
        // Force Tabulator to refresh column definitions
        if (this.$refs.tabulatorTable && this.$refs.tabulatorTable.tabulator) {
          this.$refs.tabulatorTable.tabulator.setColumns(this.columns);
        }
      }
    },
  },
};
</script>
