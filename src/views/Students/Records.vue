<template>
  <v-container
    fluid
    class="records-container"
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
              class="records-header-toolbar"
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
                Student Registration
              </div>

              <v-btn
                v-if="canManageRegistration"
                color="primary"
                small
                class="text-capitalize"
                elevation="2"
                style="margin-right: 4px"
                @click="handleAddRecord"
                aria-label="Add new student registration"
              >
                <v-icon left small>mdi-plus</v-icon>
                New Student
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
                  <v-list-item @click="openExportColumnsDialog('print')">
                    <v-list-item-icon>
                      <v-icon x-small>mdi-printer</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Print</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="openExportColumnsDialog('excel')">
                    <v-list-item-icon>
                      <v-icon x-small>mdi-file-excel-box</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Export to Excel</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-btn
                v-if="canManageRegistration"
                icon
                x-small
                style="margin: 0 2px; min-width: 32px"
                @click="handleDeleteSelected"
                title="Delete Selected Rows"
                aria-label="Delete selected students"
                :disabled="!hasSelectedRows"
              >
                <v-icon small style="color: black">mdi-delete</v-icon>
              </v-btn>

              <v-btn
                v-if="canManageRegistration"
                color="primary"
                small
                class="text-capitalize"
                elevation="2"
                style="margin-left: 4px"
                @click="triggerFileUpload"
                :loading="uploading"
                title="Upload Excel File"
                aria-label="Upload Excel file to import students"
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
              :columns="visibleColumns"
              :ajaxURL="ajaxURL"
              :loading="loading"
              :enable-column-management="true"
              column-management-storage-key="records-columns"
              persistence-id="records-page"
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
              :locale="false"
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
            Choose which columns you want to
            {{ exportActionType === "print" ? "print" : "export to Excel" }}.
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
          Delete Student Record
        </v-card-title>
        <v-card-text>
          <p class="subtitle-1 mb-2">
            Are you sure you want to delete the student record for
            <strong>{{
              studentToDelete?.student_name || `ID ${studentToDelete?.id}`
            }}</strong
            >?
          </p>
          <p class="body-2 text--secondary">
            This action cannot be undone. All data associated with this student
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
          Delete Selected Students
        </v-card-title>
        <v-card-text>
          <p class="subtitle-1 mb-2">
            Are you sure you want to delete
            <strong>{{ selectedRowsCount }}</strong> selected student(s)?
          </p>
          <p class="body-2 text--secondary">
            This action cannot be undone. All data associated with these
            students will be permanently deleted.
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
  </v-container>
</template>

<script>
import TabulatorDatatable from "@/components/Tabulator/Tabulator-datatable.vue";
import api from "@/config/api";
import { toast } from "@/utils/toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "@/assets/css/Records.css";
import dummyData from "@/data/dummyData.json";

export default {
  name: "Records-Section",
  components: {
    TabulatorDatatable,
  },
  data() {
    return {
      students: [],
      loading: true, // Start with loading true - will be set to false when data loads
      error: null,
      showExportMenu: false,
      allColumns: [],
      showDeleteDialog: false,
      showBulkDeleteDialog: false,
      studentToDelete: null,
      deleting: false,
      selectedRowsCount: 0,
      // Export column selection
      showExportColumnsDialog: false,
      exportColumnsSelection: [],
      availableExportColumns: [],
      exportActionType: null, // 'print' or 'excel'
      programList: [],
      collegeList: [],
      degreeList: [],
      divisionGradeList: [],
      examStatusList: [],
      operatorList: [],
      ajaxURL: "/api/students?all=1",
      // Excel upload
      uploading: false,
    };
  },
  computed: {
    isAdmin() {
      const userRole = this.$store.getters.getRole || "";
      return userRole.toLowerCase() === "admin";
    },
    isRegistrationControl() {
      const userRole = this.$store.getters.getRole || "";
      return userRole.toLowerCase() === "registration_control";
    },
    canManageRegistration() {
      const userRole = (this.$store.getters.getRole || "").toLowerCase();
      return userRole === "admin" || userRole === "registration_control";
    },
    isUserOrOperator() {
      const userRole = (this.$store.getters.getRole || "").toLowerCase();
      return userRole === "user" || userRole === "operator";
    },
    hasSelectedRows() {
      return this.selectedRowsCount > 0;
    },
    visibleColumns() {
      // Return all columns - column management is now handled by Tabulator-datatable
      if (this.allColumns && this.allColumns.length > 0) {
        return this.allColumns.filter((col) => col.visible !== false);
      }
      return [];
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
        // Removed navFirst and navLast as they are not valid Tabulator keybinding actions
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
    // Fetch filter lists from server first
    await Promise.all([
      this.fetchPrograms(),
      this.fetchColleges(),
      this.fetchDegrees(),
      this.fetchDivisionGrades(),
      this.fetchExamStatuses(),
      this.fetchOperators(),
    ]);
    // Initialize columns (now with server-side filter lists)
    this.initializeColumns();
    // Load saved column visibility and order (for exports compatibility)
    this.loadColumnVisibility();
    this.loadColumnOrder();
    // Tabulator will automatically load data via AJAX using ajaxURL
  },
  methods: {
    // Custom Date Filter Editor
    dateFilterEditor(cell, onRendered, success, cancel) {
      const container = document.createElement("div");
      container.style.width = "100%";
      container.style.boxSizing = "border-box";

      const input = document.createElement("input");
      input.setAttribute("type", "date");
      input.style.width = "100%";
      input.style.padding = "4px";
      input.style.boxSizing = "border-box";
      input.style.border = "1px solid #ccc";
      input.style.borderRadius = "3px";
      input.style.fontSize = "12px";
      input.value = cell.getValue() || "";

      function buildValue() {
        success(input.value || null);
      }

      function keypress(e) {
        if (e.keyCode == 13) {
          buildValue();
        }
        if (e.keyCode == 27) {
          cancel();
        }
      }

      input.addEventListener("change", buildValue);
      input.addEventListener("blur", buildValue);
      input.addEventListener("keydown", keypress);

      container.appendChild(input);

      onRendered(() => {
        input.focus();
      });

      return container;
    },

    // Custom Date Filter Function
    dateFilterFunction(headerValue, rowValue) {
      if (!headerValue) return true;
      if (!rowValue) return false;

      const filterDate = new Date(headerValue);
      const rowDate = new Date(rowValue);

      // Compare dates (ignoring time)
      filterDate.setHours(0, 0, 0, 0);
      rowDate.setHours(0, 0, 0, 0);

      return filterDate.getTime() === rowDate.getTime();
    },

    // Custom Min/Max Header Filter Editor
    minMaxFilterEditor(cell, onRendered, success, cancel) {
      let end;

      const container = document.createElement("span");

      // Create and style inputs
      const start = document.createElement("input");
      start.setAttribute("type", "number");
      start.setAttribute("placeholder", "Min");
      start.style.padding = "4px";
      start.style.width = "50%";
      start.style.boxSizing = "border-box";
      start.value = cell.getValue()?.start || "";

      function buildValues() {
        success({
          start: start.value,
          end: end.value,
        });
      }

      function keypress(e) {
        if (e.keyCode == 13) {
          buildValues();
        }
        if (e.keyCode == 27) {
          cancel();
        }
      }

      end = start.cloneNode();
      end.setAttribute("placeholder", "Max");
      end.value = cell.getValue()?.end || "";

      start.addEventListener("change", buildValues);
      start.addEventListener("blur", buildValues);
      start.addEventListener("keydown", keypress);
      end.addEventListener("change", buildValues);
      end.addEventListener("blur", buildValues);
      end.addEventListener("keydown", keypress);

      container.appendChild(start);
      container.appendChild(end);

      return container;
    },

    // Custom Min/Max Filter Function
    minMaxFilterFunction(headerValue, rowValue) {
      // headerValue - the value of the header filter element
      // rowValue - the value of the column in this row
      // rowData - the data for the row being filtered
      // filterParams - params object passed to the headerFilterFuncParams property

      if (!headerValue) return true;

      if (rowValue !== null && rowValue !== undefined && rowValue !== "") {
        const numValue = Number(rowValue);
        if (isNaN(numValue)) return true;

        if (
          headerValue.start !== "" &&
          headerValue.start !== null &&
          headerValue.start !== undefined
        ) {
          const min = Number(headerValue.start);
          if (isNaN(min)) return true;

          if (
            headerValue.end !== "" &&
            headerValue.end !== null &&
            headerValue.end !== undefined
          ) {
            const max = Number(headerValue.end);
            if (isNaN(max)) return true;
            return numValue >= min && numValue <= max;
          } else {
            return numValue >= min;
          }
        } else {
          if (
            headerValue.end !== "" &&
            headerValue.end !== null &&
            headerValue.end !== undefined
          ) {
            const max = Number(headerValue.end);
            if (isNaN(max)) return true;
            return numValue <= max;
          }
        }
      }

      return true; // must return a boolean, true if it passes the filter.
    },

    getStorageKey(key) {
      // Use the same storage key as Tabulator-datatable component
      // Tabulator-datatable uses persistence-id (records-page) as the base
      return `records-page-${key}`;
    },
    loadColumnVisibility() {
      // Load column visibility from Tabulator-datatable component
      if (
        this.$refs.tabulatorTable &&
        this.$refs.tabulatorTable.loadColumnVisibility
      ) {
        this.$refs.tabulatorTable.loadColumnVisibility();
      }
    },
    loadColumnOrder() {
      // Load column order from Tabulator-datatable component
      if (
        this.$refs.tabulatorTable &&
        this.$refs.tabulatorTable.loadColumnOrder
      ) {
        this.$refs.tabulatorTable.loadColumnOrder();
      }
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
    refreshPage() {
      // Refresh the entire page
      window.location.reload();
    },
    initializeColumns() {
      // Define all columns with visibility settings in the specified order
      this.allColumns = [
        // 1. Registration No (First)
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
        // 2. Student Name (Second)
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
        // 3. Father Name (Third)
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
        // 4. DOB (Date of Birth) - Calendar
        {
          title: "DOB",
          field: "dob",
          width: 150,
          minWidth: 120,
          maxWidth: 180,
          headerFilter: this.dateFilterEditor,
          headerFilterFunc: this.dateFilterFunction,
          sorter: "date",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const val = cell.getValue();
            if (!val) return "-";
            const d = new Date(val);
            if (isNaN(d.getTime())) return val;
            return d.toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
          },
        },
        // 5. Date of Admission / Re-Admission / Leave
        {
          title: "Date of Admission / Re-Admission / Leave",
          field: "admission_date",
          width: 370,
          headerFilter: this.dateFilterEditor,
          headerFilterFunc: this.dateFilterFunction,
          sorter: "date",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const val = cell.getValue();
            if (!val) return "-";
            const d = new Date(val);
            if (isNaN(d.getTime())) return val;
            return d.toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
          },
        },
        // 6. College / Department
        {
          title: "College / Department",
          field: "college_name",
          width: 230,
          minWidth: 180,
          maxWidth: 300,
          headerFilter: "list",
          headerFilterParams: {
            values: this.getCollegeFilterValues(),
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
        // 7. Examination Pass/Fail
        {
          title: "Examination Pass/Fail",
          field: "exam_status",
          width: 230,
          maxWidth: 250,
          headerFilter: "list",
          headerFilterParams: {
            values: this.getExamStatusFilterValues(),
            clearable: true,
            multiselect: false,
          },
          sorter: "string",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            return value ? String(value).toUpperCase() : "-";
          },
        },
        // 8. Year - A/S
        {
          title: "Annual/Supply",
          field: "year_as",
          width: 180,
          headerFilter: "list",
          headerFilterParams: {
            values: ["ANNUAL", "SUPPLY"],
            clearable: true,
            multiselect: false,
          },
          sorter: "string",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            return value ? String(value).toUpperCase() : "-";
          },
        },
        // 9. Roll No - Inter
        {
          title: "Roll No - Inter",
          field: "roll_no_inter",
          width: 170,
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
        // 10. Inter-Result
        {
          title: "Inter-Result",
          field: "inter_result",
          width: 160,
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
        // 11. Marks Obtained
        {
          title: "Marks Obtained",
          field: "marks_obtained",
          width: 180,
          maxWidth: 190,
          headerFilter: "input",
          sorter: "number",
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          formatter: (cell) => {
            const value = cell.getValue();
            return value !== null && value !== undefined ? value : "-";
          },
        },
        // 12. Division / Grade
        {
          title: "Division / Grade",
          field: "division_grade",
          width: 180,
          maxWidth: 200,
          headerFilter: "list",
          headerFilterParams: {
            values: this.getDivisionGradeFilterValues(),
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
        // 13. Remarks (Last)
        {
          title: "Remarks",
          field: "remarks",
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
        // Additional columns (keep existing ones not in the required list)
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
            const value = cell.getValue();
            return value || "-";
          },
        },
        {
          title: "Degree",
          field: "degree",
          width: 120,
          minWidth: 100,
          maxWidth: 150,
          headerFilter: "list",
          headerFilterParams: {
            values: this.getDegreeFilterValues(),
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
          title: "Program",
          field: "program",
          width: 200,
          minWidth: 150,
          maxWidth: 350,
          headerFilter: "list",
          headerFilterParams: {
            values: this.getProgramFilterValues(),
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
          title: "Audit Logs",
          field: "operator",
          width: 300,
          minWidth: 200,
          maxWidth: 400,
          headerFilter: "list",
          headerFilterParams: {
            values: this.getOperatorFilterValues(),
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
          width: 220,
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
          width: 220,
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
          title: "Actions",
          field: "actions",
          headerSort: false,
          width: 150,
          maxWidth: 200,
          frozen: true,
          hozAlign: "center",
          headerHozAlign: "center",
          visible: true,
          movable: false,
          formatter: (cell) => {
            const data = cell.getRow().getData();
            const serialNo = data.serial_no;
            const canManageRegistration = this.canManageRegistration;
            const isUserOrOperator = this.isUserOrOperator;
            return `
              <div class="action-buttons">
                <button 
                  class="action-btn view-btn" 
                  title="View Details"
                  aria-label="View student details"
                  data-serial="${serialNo || ""}"
                  type="button"
                >
                  <span class="mdi mdi-file-document-outline" style="color: black; font-size: 22px;" aria-hidden="true"></span>
                </button>
                ${
                  !isUserOrOperator
                    ? `
                <button 
                  class="action-btn edit-btn" 
                  title="Edit Student"
                  aria-label="Edit student record"
                  data-serial="${serialNo || ""}"
                  type="button"
                >
                  <span class="mdi mdi-pencil" style="color: black; font-size: 22px;" aria-hidden="true"></span>
                </button>
                `
                    : ""
                }
                ${
                  canManageRegistration
                    ? `
                <button 
                  class="action-btn delete-btn" 
                  title="Delete Student"
                  aria-label="Delete student record"
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
          },
          cellClick: (e, cell) => {
            const target = e.target.closest("button");
            if (!target) return;

            const data = cell.getRow().getData();
            const serialNo = data.serial_no;
            const id = data.id;

            if (target.classList.contains("view-btn") && serialNo) {
              this.$router.push(`/student/${serialNo}`);
            } else if (target.classList.contains("edit-btn") && serialNo) {
              this.handleEdit(data);
            } else if (target.classList.contains("delete-btn")) {
              this.handleDelete(id, data);
            }
          },
        },
      ];
    },
    handleDataLoaded() {
      // Data loaded successfully - update file columns visibility if needed
      this.error = null;
      this.loading = false; // Hide loading when data is loaded
      this.$nextTick(() => {
        this.updateFileColumnsVisibility();
        this.updateSelectedRowsCount();
      });
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
    handleDataLoadError(error) {
      // Handle AJAX loading errors
      console.error("Error loading data via AJAX:", error);
      if (error.response) {
        if (error.response.status === 401) {
          this.error = "Your session has expired. Please log in again.";
        } else if (error.response.status === 403) {
          this.error =
            "You don't have permission to view student registration.";
        } else if (error.response.status === 404) {
          this.error =
            "Student registration endpoint not found. Please contact support.";
        } else if (error.response.status >= 500) {
          this.error =
            "Server error. Please try again later or contact support.";
        } else {
          this.error =
            error.response.data?.error ||
            "Failed to load student registration. Please try again.";
        }
      } else if (error.request && !error.response) {
        // Network error - backend unavailable, use dummy data
        console.log("Using dummy data for students (backend unavailable)");
        if (this.$refs.tabulatorTable && this.$refs.tabulatorTable.setData) {
          this.$refs.tabulatorTable.setData(dummyData.students);
        }
        this.error = null;
      } else {
        this.error = "An unexpected error occurred. Please try again.";
      }
    },
    handleRowClick(e, row, rowData) {
      const target = e.target;
      // Don't navigate if clicking on action buttons or checkbox
      if (
        target.closest(".action-buttons") ||
        target.closest(".tabulator-cell[tabulator-field='checkbox']")
      ) {
        return;
      }
      const serialNo = rowData.serial_no;
      if (serialNo) {
        this.$router.push(`/student/${serialNo}`);
      }
    },
    handleEdit(data) {
      // Handle edit action
      this.$router.push(`/student/${data.serial_no}/edit`);
    },
    handleDelete(id, data) {
      // Validate that id exists
      if (!id) {
        this.error = "Student ID is missing. Cannot delete record.";
        console.error("Delete error: Student ID is missing", data);
        return;
      }

      // Store student data and open delete dialog
      this.studentToDelete = { id, ...data };
      this.showDeleteDialog = true;
    },
    async confirmDelete() {
      if (!this.studentToDelete || !this.studentToDelete.id) {
        this.error = "Student ID is missing. Cannot delete record.";
        this.showDeleteDialog = false;
        return;
      }

      const id = this.studentToDelete.id;
      const studentName = this.studentToDelete.student_name || `ID ${id}`;

      try {
        this.deleting = true;
        this.error = null;

        // Call delete API endpoint
        const response = await api.delete(`/api/students/${id}`);

        console.log("Delete response:", response.data);

        // Close dialog
        this.showDeleteDialog = false;
        this.studentToDelete = null;

        // Show success message
        toast.success(
          `Student record for "${studentName}" has been deleted successfully.`
        );

        // Refresh the table using Tabulator's reloadData (since table uses AJAX)
        if (this.$refs.tabulatorTable && this.$refs.tabulatorTable.reloadData) {
          this.$refs.tabulatorTable.reloadData();
        }
      } catch (error) {
        console.error("Delete error:", error);
        this.error =
          error.response?.data?.error ||
          error.message ||
          `Failed to delete student record. Please try again.`;

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
          api.delete(`/api/students/${row.id}`)
        );
        await Promise.all(deletePromises);
        toast.success(`Successfully deleted ${selectedRows.length} student(s)`);
        this.showBulkDeleteDialog = false;
        this.selectedRowsCount = 0;
        this.refreshPage();
      } catch (error) {
        console.error("Bulk delete error:", error);
        toast.error("Failed to delete some students. Please try again.");
      } finally {
        this.deleting = false;
      }
    },
    openExportColumnsDialog(action) {
      // Build column list from allColumns just for the popover UI
      let cols = (this.allColumns || []).filter(
        (col) =>
          col.field !== "checkbox" &&
          col.field !== "actions" &&
          col.field !== "physical_image"
      );
      if (!cols.length) {
        // Fallback: static list of key student fields
        cols = [
          { title: "Registration No", field: "registration_no" },
          { title: "Student Name", field: "student_name" },
          { title: "Father Name", field: "father_name" },
          { title: "DOB", field: "dob" },
          {
            title: "Date of Admission / Re-Admission / Leave",
            field: "admission_date",
          },
          { title: "College / Department", field: "college_name" },
          { title: "Examination Pass/Fail", field: "exam_status" },
          { title: "Annual/Supply", field: "year_as" },
          { title: "Roll No - Inter", field: "roll_no_inter" },
          { title: "Inter-Result", field: "inter_result" },
          { title: "Marks Obtained", field: "marks_obtained" },
          { title: "Division / Grade", field: "division_grade" },
          { title: "Remarks", field: "remarks" },
          { title: "Serial No", field: "serial_no" },
          { title: "Degree", field: "degree" },
          { title: "Program", field: "program" },
          { title: "Year", field: "year" },
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

      if (this.exportActionType === "print") {
        this.printStudentData(this.exportColumnsSelection);
      } else if (this.exportActionType === "excel") {
        this.exportToExcel(this.exportColumnsSelection);
      }

      this.showExportColumnsDialog = false;
    },
    updateFileColumnsVisibility() {
      // Check if any student has file-related fields
      const hasPhysicalImage = this.students.some(
        (student) => student.physical_image
      );

      // Update column visibility based on data
      const physicalImageCol = this.allColumns.find(
        (col) => col.field === "physical_image"
      );
      if (physicalImageCol) {
        physicalImageCol.visible = hasPhysicalImage;
      }

      // Column management is now handled by Tabulator-datatable component
      // Update the table columns via the component
      if (
        this.$refs.tabulatorTable &&
        this.$refs.tabulatorTable.refreshTableColumns
      ) {
        this.$refs.tabulatorTable.refreshTableColumns();
      }
    },
    handleAddRecord() {
      // Navigate to add record page or open dialog
      this.$router.push("/student/add");
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

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("File size exceeds 10MB limit");
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("excelFile", file);

      this.uploading = true;
      try {
        const response = await api.post(
          "/api/students/upload-excel",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

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
    exportToPDF() {
      if (!this.$refs.tabulatorTable) return;

      try {
        const doc = new jsPDF("landscape", "mm", "a4");
        const tableData = [];
        const headers = [];

        // Get visible columns (excluding checkbox and actions)
        const visibleCols = this.allColumns.filter(
          (col) =>
            col.visible !== false &&
            col.field !== "checkbox" &&
            col.field !== "actions" &&
            col.field !== "physical_image"
        );

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
        doc.text("Student Registration", 14, 15);

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
        const fileName = `student-records-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        doc.save(fileName);
        this.showExportMenu = false;
        toast.success("PDF downloaded successfully!");
      } catch (error) {
        console.error("PDF export error:", error);
        this.error = "Failed to export PDF. Please try again.";
        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    },
    printStudentData(selectedFields) {
      if (!this.$refs.tabulatorTable) return;

      try {
        // Get visible columns from Tabulator (excluding checkbox, actions, images)
        const table = this.$refs.tabulatorTable.getTabulatorInstance?.();
        if (!table) return;

        let visibleCols = table
          .getColumns()
          .filter(
            (col) =>
              col.isVisible() &&
              col.getField() !== "checkbox" &&
              col.getField() !== "actions" &&
              col.getField() !== "physical_image"
          )
          .map((col) => col.getDefinition());

        if (selectedFields && selectedFields.length) {
          const fieldSet = new Set(selectedFields);
          visibleCols = visibleCols.filter((col) => fieldSet.has(col.field));
        }
        if (!visibleCols.length) {
          toast.warning("No visible columns to print. Please select columns.");
          return;
        }

        // Get selected data or all data
        const allData = this.getSelectedData();

        // Create print window
        const printWindow = window.open("", "_blank");
        const date = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const selectedCount =
          this.$refs.tabulatorTable.getTabulatorInstance()?.getSelectedData()
            ?.length || 0;
        const recordText =
          selectedCount > 0
            ? `Selected Records: ${selectedCount}`
            : `Total Records: ${allData.length}`;

        // Build HTML content
        let htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Student Registration - Print</title>
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
              <h1>Student Registration</h1>
              <p>Generated on: ${date}</p>
              <p>${recordText}</p>
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

        // Add rows
        allData.forEach((row) => {
          htmlContent += "<tr>";
          visibleCols.forEach((col) => {
            let value = row[col.field];
            if (value === null || value === undefined || value === "") {
              value = "-";
            } else if (typeof value === "object") {
              value = JSON.stringify(value);
            }
            htmlContent += `<td>${String(value)}</td>`;
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
        this.error = "Failed to open print dialog. Please try again.";
        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    },
    exportToExcel(selectedFields) {
      if (!this.$refs.tabulatorTable) return;

      try {
        // Get visible columns from Tabulator (excluding checkbox, actions)
        const table = this.$refs.tabulatorTable.getTabulatorInstance?.();
        if (!table) return;

        let visibleCols = table
          .getColumns()
          .filter(
            (col) =>
              col.isVisible() &&
              col.getField() !== "checkbox" &&
              col.getField() !== "actions"
          )
          .map((col) => col.getDefinition());
        if (selectedFields && selectedFields.length) {
          const fieldSet = new Set(selectedFields);
          visibleCols = visibleCols.filter((col) => fieldSet.has(col.field));
        }
        if (!visibleCols.length) {
          toast.warning(
            "No visible columns to export. Please select columns first."
          );
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
        XLSX.utils.book_append_sheet(wb, ws, "Student Registration");

        // Save file
        XLSX.writeFile(wb, "student-registration.xlsx");
        this.showExportMenu = false;
        toast.success("Excel file exported successfully!");
      } catch (error) {
        console.error("Excel export error:", error);
        this.error = "Failed to export Excel file. Please try again.";
      }
    },
    getProgramFilterValues() {
      // Return array of unique programs from database (no "All" option)
      return this.programList.length > 0 ? this.programList : [];
    },
    getCollegeFilterValues() {
      // Return array of unique colleges from database (no "All" option)
      return this.collegeList.length > 0 ? this.collegeList : [];
    },
    getDegreeFilterValues() {
      // Return array of unique degrees from database (no "All" option)
      return this.degreeList.length > 0 ? this.degreeList : [];
    },
    async fetchPrograms() {
      try {
        const response = await api.get("/api/programs");
        if (response.data.success) {
          // Map to array of program names for the filter dropdown
          const programs = response.data.data || [];
          this.programList = programs.map((p) => p.name).filter(Boolean);
          // Update column filter if table is already initialized
          this.updateFilterColumns();
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        // Fallback to old endpoint if new one fails
        try {
          const fallbackResponse = await api.get("/api/students/programs");
          if (fallbackResponse.data.success) {
            this.programList = fallbackResponse.data.data || [];
            this.updateFilterColumns();
          }
        } catch (fallbackError) {
          console.error(
            "Error fetching programs from fallback:",
            fallbackError
          );
        }
      }
    },
    async fetchColleges() {
      try {
        const response = await api.get("/api/colleges");
        if (response.data.success) {
          // Map to array of college names for the filter dropdown
          const colleges = response.data.data || [];
          this.collegeList = colleges.map((c) => c.name).filter(Boolean);
          // Update column filter if table is already initialized
          this.updateFilterColumns();
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
        // Fallback to old endpoint if new one fails
        try {
          const fallbackResponse = await api.get("/api/students/colleges");
          if (fallbackResponse.data.success) {
            this.collegeList = fallbackResponse.data.data || [];
            this.updateFilterColumns();
          }
        } catch (fallbackError) {
          console.error(
            "Error fetching colleges from fallback:",
            fallbackError
          );
        }
      }
    },
    async fetchDegrees() {
      try {
        const response = await api.get("/api/degrees");
        if (response.data.success) {
          // Map to array of degree names for the filter dropdown
          const degrees = response.data.data || [];
          this.degreeList = degrees.map((d) => d.name).filter(Boolean);
          // Update column filter if table is already initialized
          this.updateFilterColumns();
        }
      } catch (error) {
        console.error("Error fetching degrees:", error);
      }
    },
    async fetchDivisionGrades() {
      try {
        // Fetch all students to get unique division/grade values
        const response = await api.get("/api/students?all=1");
        if (response.data.success) {
          const students = response.data.data || [];
          // Extract unique division_grade values
          const uniqueGrades = [
            ...new Set(
              students
                .map((s) => s.division_grade)
                .filter((g) => g && g.trim() !== "")
            ),
          ].sort();
          this.divisionGradeList = uniqueGrades;
          // Update column filter if table is already initialized
          this.updateFilterColumns();
        }
      } catch (error) {
        console.error("Error fetching division grades:", error);
      }
    },
    async fetchExamStatuses() {
      try {
        // Fetch all students to get unique exam_status values
        const response = await api.get("/api/students?all=1");
        if (response.data.success) {
          const students = response.data.data || [];
          // Extract unique exam_status values
          const uniqueStatuses = [
            ...new Set(
              students
                .map((s) => s.exam_status)
                .filter((s) => s && s.trim() !== "")
            ),
          ].sort();
          this.examStatusList = uniqueStatuses;
          // Update column filter if table is already initialized
          this.updateFilterColumns();
        }
      } catch (error) {
        console.error("Error fetching exam statuses:", error);
      }
    },
    getDivisionGradeFilterValues() {
      // Return array of unique division/grade values from database
      return this.divisionGradeList.length > 0 ? this.divisionGradeList : [];
    },
    getExamStatusFilterValues() {
      // Return array of unique exam status values from database in uppercase
      return this.examStatusList.length > 0
        ? this.examStatusList.map((status) =>
            status ? String(status).toUpperCase() : status
          )
        : [];
    },
    async fetchOperators() {
      try {
        // Fetch all students to get unique operator values
        const response = await api.get("/api/students?all=1");
        if (response.data.success) {
          const students = response.data.data || [];
          // Extract unique operator values
          const uniqueOperators = [
            ...new Set(
              students
                .map((s) => s.operator)
                .filter((o) => o && o.trim() !== "")
            ),
          ].sort();
          this.operatorList = uniqueOperators;
          // Update column filter if table is already initialized
          this.updateFilterColumns();
        }
      } catch (error) {
        console.error("Error fetching operators:", error);
      }
    },
    getOperatorFilterValues() {
      // Return array of unique operator values from database
      return this.operatorList.length > 0 ? this.operatorList : [];
    },
    updateFilterColumns() {
      // Update column filter lists if table is already initialized
      if (this.allColumns && this.allColumns.length > 0) {
        const programColumn = this.allColumns.find(
          (col) => col.field === "program"
        );
        const collegeColumn = this.allColumns.find(
          (col) => col.field === "college_name"
        );
        const degreeColumn = this.allColumns.find(
          (col) => col.field === "degree"
        );
        const divisionGradeColumn = this.allColumns.find(
          (col) => col.field === "division_grade"
        );
        const examStatusColumn = this.allColumns.find(
          (col) => col.field === "exam_status"
        );
        if (programColumn && programColumn.headerFilterParams) {
          programColumn.headerFilterParams.values =
            this.getProgramFilterValues();
        }
        if (collegeColumn && collegeColumn.headerFilterParams) {
          collegeColumn.headerFilterParams.values =
            this.getCollegeFilterValues();
        }
        if (degreeColumn && degreeColumn.headerFilterParams) {
          degreeColumn.headerFilterParams.values = this.getDegreeFilterValues();
        }
        if (divisionGradeColumn && divisionGradeColumn.headerFilterParams) {
          divisionGradeColumn.headerFilterParams.values =
            this.getDivisionGradeFilterValues();
        }
        if (examStatusColumn && examStatusColumn.headerFilterParams) {
          examStatusColumn.headerFilterParams.values =
            this.getExamStatusFilterValues();
        }
        const operatorColumn = this.allColumns.find(
          (col) => col.field === "operator"
        );
        if (operatorColumn && operatorColumn.headerFilterParams) {
          operatorColumn.headerFilterParams.values =
            this.getOperatorFilterValues();
        }
        // Force Tabulator to refresh column definitions
        if (this.$refs.tabulatorTable && this.$refs.tabulatorTable.tabulator) {
          this.$refs.tabulatorTable.tabulator.setColumns(this.allColumns);
        }
      }
    },
    async fetchStudents() {
      try {
        this.loading = true;
        this.error = null;

        const response = await api.get("/api/students", {
          params: { all: 1 },
        });

        const data = response.data;
        this.students = data.data || data;

        // Check if data has file-related fields and show columns accordingly
        this.updateFileColumnsVisibility();
      } catch (error) {
        console.error("Error fetching students:", error);

        // HCI: User-friendly error messages
        if (error.response) {
          if (error.response.status === 401) {
            this.error = "Your session has expired. Please log in again.";
          } else if (error.response.status === 403) {
            this.error =
              "You don't have permission to view student registration.";
          } else if (error.response.status === 404) {
            this.error =
              "Student registration endpoint not found. Please contact support.";
          } else if (error.response.status >= 500) {
            this.error =
              "Server error. Please try again later or contact support.";
          } else {
            this.error =
              error.response.data?.error ||
              "Failed to load student registration. Please try again.";
          }
        } else if (error.request && !error.response) {
          // Network error - backend unavailable, use dummy data
          console.log("Using dummy data for students (backend unavailable)");
          this.students = dummyData.students;
          this.error = null;
        } else {
          this.error = "An unexpected error occurred. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
