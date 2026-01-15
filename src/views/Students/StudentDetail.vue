<template>
  <v-container
    fluid
    class="student-detail-container pa-3"
    style="max-height: calc(100vh - 64px); overflow-y: auto"
  >
    <!-- Header Actions -->
    <v-row class="mb-2">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <v-btn
          v-if="!isEmbedded"
          large
          outlined
          color="grey darken-1"
          @click="$router.back()"
          class="back-btn"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Back To Registration
        </v-btn>
        <v-btn
          v-if="student && hasData"
          large
          color="primary"
          class="print-btn"
          @click="printStudentData"
        >
          <v-icon left>mdi-printer</v-icon>
          Print Student Data
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 subtitle-1 text--secondary">
          Loading student information...
        </p>
      </v-col>
    </v-row>

    <!-- Student Information -->
    <v-row v-else-if="student && hasData" class="student-info-row">
      <!-- Profile Card - Compact -->
      <v-col cols="12" class="mb-3">
        <v-card class="profile-header-card" elevation="2">
          <v-card-text class="pa-3">
            <v-row align="center" no-gutters>
              <v-col cols="auto" class="mr-4">
              <v-avatar
                v-if="!imageUrl || imageError"
                  size="100"
                color="grey lighten-3"
                class="profile-avatar"
              >
                  <v-icon size="60" color="grey darken-1">mdi-account</v-icon>
              </v-avatar>
              <v-avatar
                v-else
                  size="100"
                class="profile-avatar clickable-avatar"
                @click="showImageDialog = true"
              >
                <v-img
                  :src="imageUrl"
                  :alt="student.student_name || 'Student Photo'"
                  cover
                  @error="handleImageError"
                >
                  <template v-slot:placeholder>
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                  </template>
                </v-img>
                <div class="image-overlay">
                    <v-icon color="white" size="24">mdi-magnify</v-icon>
                </div>
              </v-avatar>
              </v-col>
              <v-col>
                <h2 class="text-h5 font-weight-bold mb-1 primary--text">
              {{ student.student_name || "N/A" }}
            </h2>
                <v-chip color="primary" text-color="white" small class="mt-1">
                  <v-icon left x-small>mdi-card-account-details</v-icon>
                  {{ student.registration_no || "N/A" }}
            </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Information Cards - Grid Layout -->
      <v-col cols="12">
        <v-card class="info-card" elevation="2">
          <v-card-title class="info-card-header pa-3">
            <v-icon left color="white" size="20">mdi-account-details</v-icon>
            <span class="subtitle-1 font-weight-bold white--text">
              Student Information
            </span>
          </v-card-title>

          <v-card-text class="pa-4">
            <v-row>
              <!-- Personal Information Column -->
              <v-col cols="12" md="4" class="px-2">
                <div class="info-section-compact info-section-card">
                  <h3 class="section-title-compact mb-2">
                    <v-icon small color="primary" class="mr-1"
                      >mdi-account</v-icon
                    >
                    Personal Information
                  </h3>
                  <div class="info-grid-compact">
                    <div class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-identifier</v-icon
                        >
                        SERIAL NO
                      </div>
                      <div class="info-value-compact">
                    {{ student.serial_no || "N/A" }}
                      </div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                    >mdi-card-account-details</v-icon
                  >
                        REGISTRATION NO
                      </div>
                      <div class="info-value-compact">
                    {{ student.registration_no || "N/A" }}
                      </div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-account</v-icon
                        >
                        NAME
                      </div>
                      <div class="info-value-compact">
                    {{ student.student_name || "N/A" }}
                      </div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-account-circle</v-icon
                        >
                        FATHER NAME
                      </div>
                      <div class="info-value-compact">
                    {{ student.father_name || "N/A" }}
                      </div>
                    </div>
                    <div v-if="student.dob" class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-calendar-today</v-icon
                        >
                        DATE OF BIRTH
                      </div>
                      <div class="info-value-compact">
                        {{ formatDate(student.dob) || "N/A" }}
                      </div>
                    </div>
                    <div
                      v-if="student.admission_date"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-calendar-clock</v-icon
                        >
                        DATE OF ADMISSION
                      </div>
                      <div class="info-value-compact">
                        {{ formatDate(student.admission_date) || "N/A" }}
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Academic Information Column -->
              <v-col cols="12" md="4" class="px-2">
                <div class="info-section-compact info-section-card">
                  <h3 class="section-title-compact mb-2">
                    <v-icon small color="primary" class="mr-1"
                      >mdi-school</v-icon
                    >
                    Academic Information
                  </h3>
                  <div class="info-grid-compact">
                    <div v-if="student.degree" class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-school-outline</v-icon
                        >
                        DEGREE
                      </div>
                      <div class="info-value-compact">
                        {{ student.degree || "N/A" }}
                      </div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-book-open-variant</v-icon
                        >
                        PROGRAM
                      </div>
                      <div class="info-value-compact">
                    {{ student.program || "N/A" }}
                      </div>
                    </div>
                    <div class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-calendar</v-icon
                        >
                        YEAR
                      </div>
                      <div class="info-value-compact">
                    {{ student.year || "N/A" }}
                      </div>
                    </div>
                    <div v-if="student.year_as" class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-calendar-range</v-icon
                        >
                        ANNUAL/SUPPLY
                      </div>
                      <div class="info-value-compact">
                        {{ student.year_as || "N/A" }}
                      </div>
                    </div>
                    <div v-if="student.college_name" class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-office-building</v-icon
                        >
                        COLLEGE NAME
                      </div>
                      <div class="info-value-compact">
                    {{ student.college_name || "N/A" }}
                      </div>
                    </div>
                    <div v-if="student.college_code" class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-barcode</v-icon
                        >
                        COLLEGE CODE
                      </div>
                      <div class="info-value-compact">
                        {{ student.college_code }}
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Examination Information Column -->
              <v-col cols="12" md="4" class="px-2">
                <div class="info-section-compact info-section-card">
                  <h3 class="section-title-compact mb-2">
                    <v-icon small color="primary" class="mr-1"
                      >mdi-certificate</v-icon
                    >
                    Examination Information
                  </h3>
                  <div class="info-grid-compact">
                    <div v-if="student.exam_status" class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-check-circle</v-icon
                        >
                        EXAM STATUS
                      </div>
                      <div class="info-value-compact">
                        {{ student.exam_status || "N/A" }}
                      </div>
                    </div>
                    <div v-if="student.roll_no_inter" class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-identifier</v-icon
                        >
                        ROLL NO - INTER
                      </div>
                      <div class="info-value-compact">
                        {{ student.roll_no_inter || "N/A" }}
                      </div>
                    </div>
                    <div v-if="student.inter_result" class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-file-document</v-icon
                        >
                        INTER-RESULT
                      </div>
                      <div class="info-value-compact">
                        {{ student.inter_result || "N/A" }}
                      </div>
                    </div>
                    <div
                      v-if="student.marks_obtained"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-numeric</v-icon
                        >
                        MARKS OBTAINED
                      </div>
                      <div class="info-value-compact">
                        {{ student.marks_obtained || "N/A" }}
                      </div>
                    </div>
                    <div
                      v-if="student.division_grade"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-certificate</v-icon
                        >
                        DIVISION / GRADE
                      </div>
                      <div class="info-value-compact">
                        {{ student.division_grade || "N/A" }}
                      </div>
                    </div>
                    <div v-if="student.remarks" class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-note-text</v-icon
                        >
                        REMARKS
                      </div>
                      <div class="info-value-compact">
                        {{ student.remarks || "N/A" }}
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

                <!-- Audit Information Row -->
                <v-col cols="12" v-if="student && (student.operator || student.created_at || student.updated_at)">
        <v-card class="info-card" elevation="2">
          <v-card-title class="info-card-header pa-3">
            <v-icon left color="white" size="20">mdi-clock-outline</v-icon>
            <span class="subtitle-1 font-weight-bold white--text">
              Audit Information
            </span>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="4" class="px-2" v-if="student.operator">
                <div class="info-section-compact info-section-card">
                  <div class="info-item-compact">
                    <div class="info-label-compact">
                      <v-icon x-small color="primary" class="mr-1">mdi-account-cog</v-icon>
                      OPERATOR
                    </div>
                    <div class="info-value-compact">
                      {{ student.operator || "N/A" }}
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4" class="px-2" v-if="student.created_at">
                <div class="info-section-compact info-section-card">
                  <div class="info-item-compact">
                    <div class="info-label-compact">
                      <v-icon x-small color="primary" class="mr-1">mdi-calendar-plus</v-icon>
                      CREATED AT
                    </div>
                    <div class="info-value-compact">
                      {{ formatDateTime(student.created_at) || "N/A" }}
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4" class="px-2" v-if="student.updated_at">
                <div class="info-section-compact info-section-card">
                  <div class="info-item-compact">
                    <div class="info-label-compact">
                      <v-icon x-small color="primary" class="mr-1">mdi-calendar-edit</v-icon>
                      UPDATED AT
                    </div>
                    <div class="info-value-compact">
                      {{ formatDateTime(student.updated_at) || "N/A" }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- No Data State -->
    <v-row v-else>
      <v-col cols="12">
        <v-card class="no-data-card" elevation="4" shaped>
          <v-card-text class="text-center py-12">
            <v-icon size="100" color="grey lighten-1" class="mb-4">
              mdi-information-outline
            </v-icon>
            <h2
              class="display-1 font-weight-bold mb-3 grey--text text--darken-1"
            >
              No Available Data
            </h2>
            <p class="subtitle-1 grey--text">
              The student information you are looking for is not available.
            </p>
            <v-btn
              large
              color="primary"
              class="mt-4"
              @click="$router.back()"
              v-if="!isEmbedded"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              Go Back
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Image Popup Dialog -->
    <v-dialog
      v-model="showImageDialog"
      max-width="90%"
      max-height="90%"
      @click:outside="showImageDialog = false"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center pa-0">
          <span class="pa-4">Student Photo</span>
          <v-btn icon @click="showImageDialog = false" class="ma-2">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0 text-center" style="background-color: #000">
          <v-img
            v-if="imageUrl && !imageError"
            :src="imageUrl"
            :alt="student.student_name || 'Student Photo'"
            contain
            max-height="80vh"
            class="mx-auto"
            @error="handleImageError"
          ></v-img>
          <div v-else class="pa-12">
            <v-icon size="100" color="grey">mdi-account</v-icon>
            <p class="mt-4 text--secondary">No Image Available</p>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "@/config/api";
import logoImage from "@/assets/university-of-peshawar-logo.png";

export default {
  name: "StudentDetail",
  data() {
    return {
      student: null,
      loading: true,
      imageError: false,
      showImageDialog: false,
      logoBase64: null,
    };
  },
  computed: {
    hasData() {
      if (!this.student) return false;
      return (
        this.student.student_name ||
        this.student.father_name ||
        this.student.program ||
        this.student.year ||
        this.student.college_name ||
        this.student.college_code ||
        this.student.registration_no
      );
    },
    isEmbedded() {
      const q = this.$route.query || {};
      const val = q.embed;
      return (
        val !== undefined &&
        val !== null &&
        `${val}` !== "0" &&
        `${val}` !== "false"
      );
    },
    imageUrl() {
      if (!this.student || !this.student.physical_image) {
        return null;
      }

      const img = this.student.physical_image;

      // If it's already a full URL or data URL, return as is
      if (
        img.startsWith("http://") ||
        img.startsWith("https://") ||
        img.startsWith("data:image/")
      ) {
        return img;
      }

      // If it's a base64 string without prefix, add the prefix
      // Check for common base64 image patterns
      if (
        img.startsWith("/9j/") ||
        img.startsWith("iVBORw0KGgo") ||
        img.startsWith("R0lGOD") ||
        (img.length > 100 &&
          !img.includes("/") &&
          !img.includes("\\") &&
          !img.includes("http"))
      ) {
        // It's likely base64, determine the format
        if (img.startsWith("/9j/") || img.startsWith("/9j/4AAQ")) {
          return `data:image/jpeg;base64,${img}`;
        } else if (img.startsWith("iVBORw0KGgo")) {
          return `data:image/png;base64,${img}`;
        } else if (img.startsWith("R0lGOD")) {
          return `data:image/gif;base64,${img}`;
        } else {
          // Default to jpeg if unsure
          return `data:image/jpeg;base64,${img}`;
        }
      }

      // If it's just a filename (contains extension or looks like a filename)
      // Since we don't have file serving, return null to show placeholder
      if (img.includes(".") && img.length < 255) {
        // It's likely a filename, but we can't serve it without file upload endpoint
        console.warn(
          "Image stored as filename, but no file serving endpoint available:",
          img
        );
        return null;
      }

      // If it's a very long string without special chars, it might be base64 without prefix
      // Try to detect and add prefix
      if (img.length > 500 && /^[A-Za-z0-9+/=]+$/.test(img)) {
        // Looks like base64, default to jpeg
        return `data:image/jpeg;base64,${img}`;
      }

      // Unknown format, return null
      console.warn("Unknown image format:", img.substring(0, 50));
      return null;
    },
  },
  mounted() {
    this.fetchStudent();
    this.loadLogo();
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return as-is if invalid
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } catch (e) {
        return dateString; // Return as-is if parsing fails
      }
    },
    formatDateTime(dateString) {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      } catch (e) {
        return dateString;
      }
    },
    async fetchStudent() {
      try {
        const serialNo = this.$route.params.serial_no;
        const response = await api.get(`/api/students/${serialNo}`);

        const data = response.data;
        this.student = data.data || data;

        // Debug: Log the image value to see what format it's in
        if (this.student && this.student.physical_image) {
          // console.log("Physical image value:", this.student.physical_image);
          // console.log("Image URL computed:", this.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        if (error.response && error.response.status === 404) {
          this.student = null;
        } else {
          this.student = null;
        }
      } finally {
        this.loading = false;
      }
    },
    handleImageError() {
      console.error("Image failed to load:", this.imageUrl);
      this.imageError = true;
    },
    async loadLogo() {
      try {
        const response = await fetch(logoImage);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          this.logoBase64 = reader.result;
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error loading logo:", error);
      }
    },
    printStudentData() {
      if (!this.student) return;

      try {
        const printWindow = window.open("", "_blank");
        const date = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const time = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Build HTML content with professional A4 formatting
        let htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>

            <meta charset="UTF-8">
            <style>
              @media print {
                @page {
                  size: A4;
                  margin: 2cm 1.5cm;
                }
                body {
                  margin: 0;
                  padding: 0;
                }
                .no-print {
                  display: none;
                }
              }
              * {
                box-sizing: border-box;
              }
              body {
                font-family: 'Arial', 'Helvetica', sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
                color: #333;
              }
              .print-container {
                max-width: 21cm;
                margin: 0 auto;
                background: white;
              }
              .header {
                display: grid;
                grid-template-columns: 80px 1fr 80px;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid #497CB1;
              }
              .header-logo {
                grid-column: 1;
                justify-self: start;
              }
              .header-logo img {
                max-width: 80px;
                max-height: 80px;
                height: auto;
                width: auto;
                display: block;
              }
              .header-content {
                grid-column: 2;
                text-align: center;
              }
              .header h1 {
                color: #497CB1;
                margin: 0 0 10px 0;
                font-size: 28px;
                font-weight: bold;
              }
              .header .subtitle {
                color: #666;
                font-size: 14px;
                margin: 5px 0;
              }
              .info-section {
                margin-bottom: 25px;
              }
              .info-section-title {
                background-color: #497CB1;
                color: white;
                padding: 10px 15px;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 15px;
                border-radius: 4px 4px 0 0;
              }
              .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 15px;
              }
              .info-item {
                padding: 12px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                background-color: #fafafa;
              }
              .info-item.full-width {
                grid-column: 1 / -1;
              }
              .info-label {
                font-weight: bold;
                color: #497CB1;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
              }
              .info-value {
                font-size: 14px;
                color: #333;
                word-wrap: break-word;
              }
              .info-value.empty {
                color: #999;
                font-style: italic;
              }
              .image-section {
                margin-top: 20px;
                text-align: center;
              }
              .image-container {
                display: inline-block;
                border: 2px solid #497CB1;
                padding: 10px;
                border-radius: 8px;
                background: white;
              }
              .image-container img {
                max-width: 300px;
                max-height: 300px;
                object-fit: contain;
                display: block;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #e0e0e0;
                text-align: center;
                font-size: 11px;
                color: #666;
              }
              .print-button {
                margin: 20px 0;
                text-align: center;
              }
              .print-button button {
                background-color: #497CB1;
                color: white;
                border: none;
                padding: 12px 30px;
                font-size: 16px;
                cursor: pointer;
                border-radius: 4px;
                font-weight: bold;
              }
              .print-button button:hover {
                background-color: #3a6a9d;
              }
              @media print {
                .info-item {
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <div class="header">
                ${
                  this.logoBase64
                    ? `<div class="header-logo">
                        <img src="${this.logoBase64}" alt="University of Peshawar Logo" />
                      </div>`
                    : ""
                }
                <div class="header-content">
                  <h1>Student Information</h1>
                  <div class="subtitle">University of Peshawar</div>
                  <div class="subtitle">Generated on: ${date} at ${time}</div>
                </div>
              </div>

              <div class="info-section">
                <div class="info-section-title">Personal Information</div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Serial Number</div>
                    <div class="info-value ${
                      !this.student.serial_no ? "empty" : ""
                    }">
                      ${this.student.serial_no || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Registration Number</div>
                    <div class="info-value ${
                      !this.student.registration_no ? "empty" : ""
                    }">
                      ${this.student.registration_no || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item full-width">
                    <div class="info-label">Student Name</div>
                    <div class="info-value ${
                      !this.student.student_name ? "empty" : ""
                    }">
                      ${this.student.student_name || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item full-width">
                    <div class="info-label">Father Name</div>
                    <div class="info-value ${
                      !this.student.father_name ? "empty" : ""
                    }">
                      ${this.student.father_name || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>

              <div class="info-section">
                <div class="info-section-title">Academic Information</div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Program</div>
                    <div class="info-value ${
                      !this.student.program ? "empty" : ""
                    }">
                      ${this.student.program || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Year</div>
                    <div class="info-value ${
                      !this.student.year ? "empty" : ""
                    }">
                      ${this.student.year || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item full-width">
                    <div class="info-label">College Name</div>
                    <div class="info-value ${
                      !this.student.college_name ? "empty" : ""
                    }">
                      ${this.student.college_name || "Not provided"}
                    </div>
                  </div>
                  ${
                    this.student.college_code
                      ? `
                  <div class="info-item">
                    <div class="info-label">College Code</div>
                    <div class="info-value">
                      ${this.student.college_code}
                    </div>
                  </div>
                  `
                      : ""
                  }
                </div>
              </div>
        `;

        // Image section removed from print - not printable as per requirement

        htmlContent += `
              <div class="footer">
                <p>This document was generated from the University of Peshawar</p>
              </div>
            </div>

            <div class="print-button no-print">
              <button onclick="window.print()">Print Document</button>
            </div>
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
      } catch (error) {
        console.error("Print error:", error);
        alert("Failed to open print dialog. Please try again.");
      }
    },
  },
};
</script>

