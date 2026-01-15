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
    <!-- Table -->
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
            <!-- Compact Header Row - always visible for better UX -->
            <div
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
                Results Register
              </div>

              <v-btn
                v-if="isAdmin"
                color="primary"
                small
                class="text-capitalize"
                elevation="2"
                style="margin-right: 4px"
                @click="openCreateDialog"
                aria-label="Add new register record"
              >
                <v-icon left small>mdi-plus</v-icon>
                New Register Record
              </v-btn>

              <div style="flex: 1 1 auto"></div>

              <!-- Roll No Search -->
              <v-text-field
                v-model="searchRollNo"
                placeholder="Search by Roll No"
                prepend-inner-icon="mdi-magnify"
                dense
                outlined
                clearable
                hide-details
                style="max-width: 250px; margin-right: 8px"
                @input="handleSearchRollNo"
                @clear="handleSearchRollNo"
                @keyup.enter="handleSearchRollNo"
              />

              <!-- Refresh -->
              <v-btn
                icon
                x-small
                style="margin: 0 2px; min-width: 32px"
                @click="reloadTable"
                title="Refresh"
                aria-label="Refresh register records"
              >
                <v-icon small style="color: black">mdi-refresh</v-icon>
              </v-btn>

              <!-- Column Management Button -->
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

              <!-- Export Menu Button -->
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
                    ref="exportMenuButton"
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

              <!-- Delete Selected Rows Button (Admin Only) -->
              <v-btn
                v-if="isAdmin"
                icon
                x-small
                style="margin: 0 2px; min-width: 32px"
                @click="handleDeleteSelected"
                title="Delete Selected Rows"
                aria-label="Delete selected register records"
                :disabled="!hasSelectedRows"
              >
                <v-icon small style="color: black">mdi-delete</v-icon>
              </v-btn>
            </div>

            <Tabulator-datatable
              ref="tabulatorTable"
              :columns="columns"
              :ajaxURL="computedAjaxURL"
              :loading="loading"
              :enable-column-management="true"
              column-management-storage-key="register-records-columns"
              persistence-id="register-records-page"
              :hide-column-manager-icon="false"
              height="100%"
              layout="fitColumns"
              pagination="local"
              :pagination-size="100"
              :pagination-size-selector="[100, 200, 500]"
              pagination-counter="rows"
              :movable-columns="true"
              :resizable-columns="true"
              :selectable="true"
              selectable-range-mode="click"
              :row-header="rowHeaderConfig"
              :header-filter-live-filter="true"
              placeholder="No Register Records Available"
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

    <!-- Create Register Record Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">New Register Record</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeCreateDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="createForm" v-model="formValid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.register_no"
                    label="Register No"
                    :rules="[rules.required]"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="form.degree"
                    label="Degree"
                    :items="degreeList"
                    :rules="[rules.required]"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="form.degree2"
                    label="Second Degree (Optional)"
                    :items="degreeList"
                    dense
                    outlined
                    clearable
                    hint="If filled, will be combined as (Degree - Degree2)"
                    persistent-hint
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.exam_year"
                    label="Year"
                    type="number"
                    :rules="[rules.required]"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="form.part"
                    label="Part"
                    :items="partOptions"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="form.study_status"
                    label="Study Status"
                    :items="studyStatusOptions"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.year_as"
                    label="Annual/Supply"
                    :items="yearAsOptions"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.roll_no_from"
                    label="Roll No From"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.roll_no_to"
                    label="Roll No To"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="pdfFile"
                    accept="application/pdf"
                    label="Upload Register PDF"
                    prepend-icon="mdi-file-pdf-box"
                    dense
                    outlined
                    show-size
                    :rules="[rules.pdfRequired]"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeCreateDialog" :disabled="saving">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            depressed
            @click="submitForm"
            :loading="saving"
          >
            <v-icon left>mdi-content-save</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Register Record Dialog -->
    <v-dialog v-model="showEditDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Edit Register Record</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeEditDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="editFormValid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.register_no"
                    label="Register No"
                    :rules="[rules.required]"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="form.degree"
                    label="Degree"
                    :items="degreeList"
                    :rules="[rules.required]"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="form.degree2"
                    label="Second Degree (Optional)"
                    :items="degreeList"
                    dense
                    outlined
                    clearable
                    hint="If filled, will be combined as (Degree - Degree2)"
                    persistent-hint
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.exam_year"
                    label="Year"
                    type="number"
                    :rules="[rules.required]"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="form.part"
                    label="Part"
                    :items="partOptions"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="form.study_status"
                    label="Study Status"
                    :items="studyStatusOptions"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.year_as"
                    label="Annual/Supply"
                    :items="yearAsOptions"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.roll_no_from"
                    label="Roll No From"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.roll_no_to"
                    label="Roll No To"
                    dense
                    outlined
                    clearable
                  />
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="pdfFile"
                    accept="application/pdf"
                    label="Upload New Register PDF (Optional)"
                    prepend-icon="mdi-file-pdf-box"
                    dense
                    outlined
                    show-size
                    hint="Leave empty to keep existing PDF"
                    persistent-hint
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeEditDialog" :disabled="saving">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            depressed
            @click="updateForm"
            :loading="saving"
          >
            <v-icon left>mdi-content-save</v-icon>
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- PDF Preview Dialog -->
    <v-dialog v-model="showPdfDialog" max-width="900px">
      <v-card>
        <v-card-title>
          <span class="headline">
            PDF - {{ selectedRecord?.register_no || "Register Record" }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon @click="showPdfDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div v-if="selectedRecord && selectedRecord.pdf_document">
            <iframe
              :src="selectedRecord.pdf_document"
              style="width: 100%; height: 600px; border: none"
              title="Register PDF"
            ></iframe>
          </div>
          <div v-else class="text-center py-6">
            <v-icon large color="grey">mdi-file-pdf-box</v-icon>
            <div class="mt-2">No PDF document available for this record.</div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showPdfDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline error--text">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Delete Register Record
        </v-card-title>
        <v-card-text>
          <p class="subtitle-1 mb-2">
            Are you sure you want to delete register
            <strong>{{ recordToDelete?.register_no }}</strong> ?
          </p>
          <p class="body-2 text--secondary">
            This action cannot be undone. The associated PDF will also be
            permanently removed.
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
          Delete Selected Records
        </v-card-title>
        <v-card-text>
          <p class="subtitle-1 mb-2">
            Are you sure you want to delete
            <strong>{{ selectedRowsCount }}</strong> selected register
            record(s)?
          </p>
          <p class="body-2 text--secondary">
            This action cannot be undone. All associated PDFs will also be
            permanently removed.
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
import Cookies from "js-cookie";
import "@/assets/css/Results.css";

export default {
  name: "Register-Records",
  components: {
    TabulatorDatatable,
  },
  data() {
    return {
      loading: false,
      saving: false,
      deleting: false,
      uploadProgress: 0,
      searchTimeout: null,
      showCreateDialog: false,
      showEditDialog: false,
      showPdfDialog: false,
      showDeleteDialog: false,
      showBulkDeleteDialog: false,
      showExportMenu: false,
      selectedRowsCount: 0,
      // Export column selection
      showExportColumnsDialog: false,
      exportColumnsSelection: [],
      availableExportColumns: [],
      exportActionType: null, // 'print' or 'excel'
      formValid: false,
      editFormValid: false,
      form: {
        register_no: "",
        degree: "",
        degree2: "",
        exam_year: "",
        part: "",
        study_status: "",
        year_as: "",
        roll_no_from: "",
        roll_no_to: "",
      },
      pdfFile: null,
      selectedRecord: null,
      recordToDelete: null,
      searchRollNo: "",
      ajaxURL: "/api/register-records",
      columns: [],
      partOptions: ["PART I", "PART II"],
      studyStatusOptions: ["PRIVATE", "REGULAR"],
      yearAsOptions: ["ANNUAL", "SUPPLY"],
      degreeList: [],
      operatorList: [],
      keybindingsConfig: {
        navPrev: "38", // Up arrow
        navNext: "40", // Down arrow
      },
      langsConfig: {
        default: {
          pagination: {
            first: "First",
            last: "Last",
            prev: "Prev",
            next: "Next",
          },
        },
      },
      rules: {
        required: (v) => !!v || "Field is required",
        pdfRequired: (v) => !!v || "PDF file is required",
      },
    };
  },
  computed: {
    isAdmin() {
      const role = (this.$store.getters.getRole || "").toLowerCase();
      return role === "admin";
    },
    hasSelectedRows() {
      return this.selectedRowsCount > 0;
    },
    computedAjaxURL() {
      if (this.searchRollNo && this.searchRollNo.trim() !== "") {
        return `/api/register-records?searchRollNo=${encodeURIComponent(
          this.searchRollNo.trim()
        )}`;
      }
      return "/api/register-records";
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
  },
  async created() {
    await Promise.all([this.fetchDegrees(), this.fetchOperators()]);
    this.initColumns();
    this.updateOperatorFilter();
  },
  mounted() {
    // After table is mounted, restore any saved column visibility/order
    this.$nextTick(() => {
      if (this.$refs.tabulatorTable) {
        if (this.$refs.tabulatorTable.loadColumnVisibility) {
          this.$refs.tabulatorTable.loadColumnVisibility();
        }
        if (this.$refs.tabulatorTable.loadColumnOrder) {
          this.$refs.tabulatorTable.loadColumnOrder();
        }
      }
    });
  },
  methods: {
    initColumns() {
      const isAdmin = this.isAdmin;
      this.columns = [
        // {
        //   title: "ID",
        //   field: "rowIndex",
        //   width: 70,
        //   hozAlign: "center",
        //   headerSort: false,
        //   formatter: (cell) => cell.getRow().getPosition() + 1,
        // },
        {
          title: "Register No",
          field: "register_no",
          headerFilter: "input",
          minWidth: 150,
        },
        {
          title: "Degree",
          field: "degree",
          headerFilter: "list",
          headerFilterParams: {
            values: this.degreeList,
            clearable: true,
            multiselect: false,
          },
          minWidth: 140,
        },
        {
          title: "Year",
          field: "exam_year",
          headerFilter: "input",
          width: 100,
          hozAlign: "center",
        },
        {
          title: "Part",
          field: "part",
          headerFilter: "list",
          headerFilterParams: {
            values: this.partOptions,
            clearable: true,
            multiselect: false,
          },
          width: 100,
          hozAlign: "center",
        },
        {
          title: "Study Status",
          field: "study_status",
          headerFilter: "list",
          headerFilterParams: {
            values: this.studyStatusOptions,
            clearable: true,
            multiselect: false,
          },
          minWidth: 170,
        },
        {
          title: "Annual/Supply",
          field: "year_as",
          headerFilter: "list",
          headerFilterParams: {
            values: this.yearAsOptions,
            clearable: true,
            multiselect: false,
          },
          width: 180,
          hozAlign: "center",
        },
        {
          title: "Roll No From",
          field: "roll_no_from",
          minWidth: 160,
        },
        {
          title: "Roll No To",
          field: "roll_no_to",
          minWidth: 150,
        },
        {
          title: "Audit Logs",
          field: "operator",
          width: 300,
          minWidth: 200,
          maxWidth: 400,
          headerFilter: "list",
          headerFilterParams: {
            values: this.operatorList,
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
        {
          title: "Actions",
          field: "actions",
          headerSort: false,
          hozAlign: "center",
          width: 150,
          maxWidth: 200,
          frozen: true,
          movable: false,
          formatter: (cell) => {
            const data = cell.getRow().getData();
            const isAdmin = this.isAdmin;
            return `
              <div class="action-buttons">
                <button 
                  class="action-btn view-btn" 
                  title="View PDF"
                  aria-label="View PDF"
                  data-action="view"
                  data-id="${data.id || ""}"
                  type="button"
                >
                  <span class="mdi mdi-file-pdf-box" style="color: black; font-size: 22px;" aria-hidden="true"></span>
                </button>
                ${
                  isAdmin
                    ? `
                <button 
                  class="action-btn edit-btn" 
                  title="Edit Record"
                  aria-label="Edit register record"
                  data-action="edit"
                  data-id="${data.id || ""}"
                  type="button"
                >
                  <span class="mdi mdi-pencil" style="color: black; font-size: 22px;" aria-hidden="true"></span>
                </button>
                <button 
                  class="action-btn delete-btn" 
                  title="Delete Record"
                  aria-label="Delete register record"
                  data-action="delete"
                  data-id="${data.id || ""}"
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
            const action = target.getAttribute("data-action");
            const id = data.id;

            if (action === "view" && id) {
              this.viewPdf(id);
            } else if (action === "edit" && id && isAdmin) {
              this.handleEdit(data);
            } else if (action === "delete" && id && isAdmin) {
              this.askDelete(data);
            }
          },
        },
      ];
    },
    handleRowClick() {
      // Don't do anything on row click - actions are handled by action buttons
      // This prevents accidental PDF opening when clicking on rows
    },
    viewPdf(id) {
      // Open PDF in a new browser tab using backend streaming endpoint
      if (!id) {
        toast.error("No PDF is stored for this register record.");
        return;
      }
      // Get token from cookies (preferred) or localStorage (fallback) - same way as API interceptor
      const token = Cookies.get("token") || localStorage.getItem("token");
      const tokenParam = token ? `&token=${encodeURIComponent(token)}` : "";
      const src = `/api/register-records/${id}/pdf?ts=${Date.now()}${tokenParam}`;
      try {
        window.open(src, "_blank");
      } catch (err) {
        console.error("Failed to open PDF in new tab:", err);
        toast.error("Unable to open PDF. Please check popup blocker settings.");
      }
    },
    handleEdit(data) {
      // Open edit dialog with record data
      if (!data || !data.id) {
        toast.error("Record ID is missing. Cannot edit record.");
        return;
      }
      this.selectedRecord = { ...data };
      // Parse degree value (might be in format "(Degree1 - Degree2)")
      const parsedDegree = this.parseDegree(data.degree || "");
      this.form = {
        register_no: data.register_no || "",
        degree: parsedDegree.degree || "",
        degree2: parsedDegree.degree2 || "",
        exam_year: data.exam_year || "",
        part: data.part || "",
        study_status: data.study_status || "",
        year_as: data.year_as || "",
        roll_no_from: data.roll_no_from || "",
        roll_no_to: data.roll_no_to || "",
      };
      this.pdfFile = null; // Don't pre-populate PDF file
      this.showEditDialog = true;
    },
    handleDataLoading() {
      this.loading = true;
    },
    handleDataLoaded() {
      this.loading = false;
      this.updateSelectedRowsCount();
    },
    handleDataLoadError(error) {
      this.loading = false;
      console.error("Register records load error:", error);
      toast.error("Failed to load register records");
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
    reloadTable() {
      const table = this.$refs.tabulatorTable;
      if (table && table.reloadData) {
        table.reloadData();
      } else {
        const instance = table?.getTabulatorInstance?.();
        if (instance && this.computedAjaxURL) {
          instance.setData(this.computedAjaxURL);
        }
      }
    },
    handleSearchRollNo() {
      // Debounce the search to avoid too many API calls
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(() => {
        this.reloadTable();
      }, 300);
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
    openCreateDialog() {
      this.resetForm();
      this.showCreateDialog = true;
    },
    closeCreateDialog() {
      this.showCreateDialog = false;
    },
    closeEditDialog() {
      this.showEditDialog = false;
      this.selectedRecord = null;
      if (this.$refs.editForm) {
        this.$refs.editForm.resetValidation();
      }
    },
    resetForm() {
      this.form = {
        register_no: "",
        degree: "",
        degree2: "",
        exam_year: "",
        part: "",
        study_status: "",
        year_as: "",
        roll_no_from: "",
        roll_no_to: "",
      };
      this.pdfFile = null;
      if (this.$refs.createForm) {
        this.$refs.createForm.resetValidation();
      }
    },
    formatDegree() {
      // Combine degrees if both are filled
      if (this.form.degree && this.form.degree2) {
        return `${this.form.degree} - ${this.form.degree2}`;
      } else if (this.form.degree) {
        return this.form.degree;
      }
      return "";
    },
    parseDegree(degreeValue) {
      // Parse degree value that might be in format "Degree1 - Degree2" or "(Degree1 - Degree2)"
      if (!degreeValue) return { degree: "", degree2: "" };

      // Check if it's in the format "Degree1 - Degree2"
      const match = degreeValue.match(/^\(?(.+?)\s*-\s*(.+?)\)?$/);
      if (match) {
        return {
          degree: match[1].trim(),
          degree2: match[2].trim(),
        };
      }
      // Otherwise, it's just a single degree
      return {
        degree: degreeValue,
        degree2: "",
      };
    },
    async submitForm() {
      if (!this.$refs.createForm) return;
      const valid = this.$refs.createForm.validate();
      if (!valid) return;

      if (!this.pdfFile) {
        toast.error("Please upload a PDF file");
        return;
      }

      // Frontend safety: limit PDF size to 100MB
      const MAX_PDF_BYTES = 100 * 1024 * 1024;
      if (this.pdfFile.size > MAX_PDF_BYTES) {
        toast.error(
          "PDF is too large. Please upload a file smaller than 100MB."
        );
        return;
      }

      try {
        this.saving = true;
        this.uploadProgress = 0;

        // Use FormData for faster multipart upload (no base64 encoding overhead)
        const formData = new FormData();
        formData.append("pdfFile", this.pdfFile);
        formData.append("register_no", this.form.register_no);
        // Combine degrees if both are filled
        const degreeValue = this.formatDegree();
        formData.append("degree", degreeValue);
        formData.append("exam_year", this.form.exam_year);
        if (this.form.part) formData.append("part", this.form.part);
        if (this.form.study_status)
          formData.append("study_status", this.form.study_status);
        if (this.form.year_as) formData.append("year_as", this.form.year_as);
        if (this.form.roll_no_from)
          formData.append("roll_no_from", this.form.roll_no_from);
        if (this.form.roll_no_to)
          formData.append("roll_no_to", this.form.roll_no_to);

        await api.post("/api/register-records", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              this.uploadProgress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            }
          },
        });
        toast.success("Register record created successfully");
        // Don't close dialog automatically - let user close it manually
        // this.closeCreateDialog();
        this.reloadTable();
        // Reset form for next entry
        this.resetForm();
      } catch (error) {
        console.error("Create register record error:", error);
        const status = error.response?.status;
        const messageFromServer = error.response?.data?.error;

        if (status === 413 && messageFromServer) {
          toast.error(messageFromServer);
        } else if (status === 400 && messageFromServer) {
          toast.error(messageFromServer);
        } else {
          const message =
            messageFromServer || "Failed to create register record";
          toast.error(message);
        }
      } finally {
        this.saving = false;
        this.uploadProgress = 0;
      }
    },
    async updateForm() {
      if (!this.$refs.editForm) return;
      const valid = this.$refs.editForm.validate();
      if (!valid) return;

      if (!this.selectedRecord || !this.selectedRecord.id) {
        toast.error("Record ID is missing. Cannot update record.");
        return;
      }

      // Frontend safety: limit PDF size to 100MB
      const MAX_PDF_BYTES = 100 * 1024 * 1024;
      if (this.pdfFile && this.pdfFile.size > MAX_PDF_BYTES) {
        toast.error(
          "PDF is too large. Please upload a file smaller than 100MB."
        );
        return;
      }

      try {
        this.saving = true;
        this.uploadProgress = 0;

        // Use FormData for faster multipart upload (no base64 encoding overhead)
        const formData = new FormData();
        if (this.pdfFile) {
          formData.append("pdfFile", this.pdfFile);
        }
        formData.append("register_no", this.form.register_no);
        // Combine degrees if both are filled
        const degreeValue = this.formatDegree();
        formData.append("degree", degreeValue);
        formData.append("exam_year", this.form.exam_year);
        if (this.form.part) formData.append("part", this.form.part);
        if (this.form.study_status)
          formData.append("study_status", this.form.study_status);
        if (this.form.year_as) formData.append("year_as", this.form.year_as);
        if (this.form.roll_no_from)
          formData.append("roll_no_from", this.form.roll_no_from);
        if (this.form.roll_no_to)
          formData.append("roll_no_to", this.form.roll_no_to);

        await api.put(
          `/api/register-records/${this.selectedRecord.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                this.uploadProgress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
              }
            },
          }
        );
        toast.success("Register record updated successfully");
        this.closeEditDialog();
        this.reloadTable();
      } catch (error) {
        console.error("Update register record error:", error);
        const status = error.response?.status;
        const messageFromServer = error.response?.data?.error;

        if (status === 413 && messageFromServer) {
          toast.error(messageFromServer);
        } else if (status === 400 && messageFromServer) {
          toast.error(messageFromServer);
        } else {
          const message =
            messageFromServer || "Failed to update register record";
          toast.error(message);
        }
      } finally {
        this.saving = false;
        this.uploadProgress = 0;
      }
    },
    readFileAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    },
    async fetchDegrees() {
      try {
        const response = await api.get("/api/degrees");
        if (response.data.success) {
          // Map to array of degree names for the dropdown
          const degrees = response.data.data || [];
          this.degreeList = degrees.map((d) => d.name).filter(Boolean);
        }
      } catch (error) {
        console.error("Error fetching degrees:", error);
        toast.error(error.response?.data?.error || "Failed to fetch degrees");
      }
    },
    getOperatorFilterValues() {
      // Return array of unique operator values from database
      return this.operatorList.length > 0 ? this.operatorList : [];
    },
    async fetchOperators() {
      try {
        // Fetch all register records to get unique operator values
        const response = await api.get("/api/register-records");
        if (response.data.success) {
          const records = response.data.data || [];
          // Extract unique operator values
          const uniqueOperators = [
            ...new Set(
              records.map((r) => r.operator).filter((o) => o && o.trim() !== "")
            ),
          ].sort();
          this.operatorList = uniqueOperators;
        }
      } catch (error) {
        console.error("Error fetching operators:", error);
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
        if (
          this.$refs.tabulatorTable &&
          this.$refs.tabulatorTable.getTabulatorInstance
        ) {
          const table = this.$refs.tabulatorTable.getTabulatorInstance();
          if (table) {
            table.setColumns(this.columns);
          }
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
        // Fallback: static list of known fields
        cols = [
          { title: "Register No", field: "register_no" },
          { title: "Degree", field: "degree" },
          { title: "Year", field: "exam_year" },
          { title: "Part", field: "part" },
          { title: "Study Status", field: "study_status" },
          { title: "Year - A/S", field: "year_as" },
          { title: "Roll No From", field: "roll_no_from" },
          { title: "Roll No To", field: "roll_no_to" },
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
        this.printRegisterRecords(this.exportColumnsSelection);
      } else if (this.exportActionType === "excel") {
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
          toast.warning(
            "No visible columns to export. Please select columns first."
          );
          return;
        }

        // Add headers
        visibleCols.forEach((col) => {
          headers.push(col.title);
        });

        // Get selected data or all data
        const dataToExport = this.getSelectedData();

        // Add rows
        dataToExport.forEach((row) => {
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
        doc.text("Register Records", 14, 15);

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
            : `Total Records: ${dataToExport.length}`;
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
        const fileName = `register-records-${
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
    printRegisterRecords(selectedFields) {
      if (!this.$refs.tabulatorTable) return;

      try {
        // Get visible columns from Tabulator (excluding checkbox and actions)
        let visibleCols = this.getVisibleExportColumns();
        if (selectedFields && selectedFields.length) {
          const fieldSet = new Set(selectedFields);
          visibleCols = visibleCols.filter((col) => fieldSet.has(col.field));
        }
        if (!visibleCols.length) {
          toast.warning("No visible columns to print. Please select columns.");
          return;
        }

        // Get selected data or all data
        const dataToExport = this.getSelectedData();

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
            : `Total Records: ${dataToExport.length}`;

        // Build HTML content
        let htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Register Records - Print</title>
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
              <h1>Register Records</h1>
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
        dataToExport.forEach((row) => {
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
        toast.error("Failed to open print dialog. Please try again.");
      }
    },
    exportToExcel(selectedFields) {
      if (!this.$refs.tabulatorTable) return;

      try {
        // Get visible columns from Tabulator (excluding checkbox and actions)
        let visibleCols = this.getVisibleExportColumns();
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
        const dataToExport = this.getSelectedData();

        // Prepare data for Excel
        const excelData = [];
        const headers = visibleCols.map((col) => col.title);
        excelData.push(headers);

        dataToExport.forEach((row) => {
          const rowData = visibleCols.map((col) => {
            let value = row[col.field];
            return value === null || value === undefined ? "-" : value;
          });
          excelData.push(rowData);
        });

        // Create workbook and worksheet
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Register Records");

        // Save file
        XLSX.writeFile(wb, "register-records.xlsx");
        this.showExportMenu = false;
        toast.success("Excel file exported successfully!");
      } catch (error) {
        console.error("Excel export error:", error);
        toast.error("Failed to export Excel file. Please try again.");
      }
    },
    // fetchAndOpenPdf no longer needed; streaming endpoint is used directly
    askDelete(record) {
      this.recordToDelete = record;
      this.showDeleteDialog = true;
    },
    async confirmDelete() {
      if (!this.recordToDelete) return;
      try {
        this.deleting = true;
        await api.delete(`/api/register-records/${this.recordToDelete.id}`);
        toast.success("Register record deleted");
        this.showDeleteDialog = false;
        this.reloadTable();
      } catch (error) {
        console.error("Delete register record error:", error);
        toast.error("Failed to delete register record");
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
          api.delete(`/api/register-records/${row.id}`)
        );
        await Promise.all(deletePromises);
        toast.success(
          `Successfully deleted ${selectedRows.length} register record(s)`
        );
        this.showBulkDeleteDialog = false;
        this.selectedRowsCount = 0;
        this.reloadTable();
      } catch (error) {
        console.error("Bulk delete error:", error);
        toast.error("Failed to delete some records. Please try again.");
      } finally {
        this.deleting = false;
      }
    },
  },
  beforeDestroy() {
    // Clear search timeout on component destroy
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  },
};
</script>
