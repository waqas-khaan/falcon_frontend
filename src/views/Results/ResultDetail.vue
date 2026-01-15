<template>
  <v-container
    fluid
    class="result-detail-container pa-3"
    style="max-height: calc(100vh - 64px); overflow-y: auto"
  >
    <!-- Header Actions -->
    <v-row class="mb-2">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <v-btn
          large
          outlined
          color="grey darken-1"
          @click="$router.back()"
          class="back-btn"
        >
          <v-icon left>mdi-arrow-left</v-icon>
          Back
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 subtitle-1 text--secondary">
          Loading result information...
        </p>
      </v-col>
    </v-row>

    <!-- Result Info -->
    <v-row v-else-if="result" class="result-info-row">
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
                  <v-icon size="60" color="grey darken-1"
                    >mdi-file-image</v-icon
                  >
                </v-avatar>
                <v-avatar
                  v-else
                  size="100"
                  class="profile-avatar clickable-avatar"
                  @click="showImageDialog = true"
                >
                  <v-img
                    :src="imageUrl"
                    :alt="`Result for ${result.roll_no || 'N/A'}`"
                    contain
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
                  Result Image
                </h2>
                <v-chip color="primary" text-color="white" small class="mt-1">
                  <v-icon left x-small>mdi-numeric</v-icon>
                  {{ result.roll_no || "N/A" }}
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
            <v-icon left color="white" size="20"
              >mdi-file-document-outline</v-icon
            >
            <span class="subtitle-1 font-weight-bold white--text">
              Result Information
            </span>
          </v-card-title>

          <v-card-text class="pa-4">
            <v-row>
              <!-- Basic Information Column -->
              <v-col cols="12" md="4" class="px-2">
                <div class="info-section-compact info-section-card">
                  <h3 class="section-title-compact mb-2">
                    <v-icon small color="primary" class="mr-1"
                      >mdi-information</v-icon
                    >
                    Basic Information
                  </h3>
                  <div class="info-grid-compact">
                    <div
                      v-if="hasValue(result.roll_no)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-numeric</v-icon
                        >
                        ROLL NO
                      </div>
                      <div class="info-value-compact">
                        {{ result.roll_no }}
                      </div>
                    </div>
                    <div
                      v-if="hasValue(result.student_name)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-account</v-icon
                        >
                        STUDENT NAME
                      </div>
                      <div class="info-value-compact">
                        {{ result.student_name }}
                      </div>
                    </div>
                    <div
                      v-if="hasValue(result.father_name)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-account-circle</v-icon
                        >
                        FATHER NAME
                      </div>
                      <div class="info-value-compact">
                        {{ result.father_name }}
                      </div>
                    </div>
                    <div v-if="hasValue(result.year)" class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-calendar</v-icon
                        >
                        YEAR
                      </div>
                      <div class="info-value-compact">
                        {{ result.year }}
                      </div>
                    </div>
                    <div
                      v-if="hasValue(result.session)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-calendar-range</v-icon
                        >
                        SESSION
                      </div>
                      <div class="info-value-compact">
                        {{ result.session }}
                      </div>
                    </div>
                    <div
                      v-if="hasValue(result.registration_no)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-card-account-details</v-icon
                        >
                        REGISTRATION NO
                      </div>
                      <div class="info-value-compact">
                        {{ result.registration_no }}
                      </div>
                    </div>
                    <div
                      v-if="hasValue(result.serial_no)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-identifier</v-icon
                        >
                        SERIAL NO
                      </div>
                      <div class="info-value-compact">
                        {{ result.serial_no }}
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
                    <div
                      v-if="hasValue(result.program)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-book-open-variant</v-icon
                        >
                        PROGRAM
                      </div>
                      <div class="info-value-compact">
                        {{ result.program }}
                      </div>
                    </div>
                    <div v-if="hasValue(result.part)" class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-file-document-outline</v-icon
                        >
                        PART
                      </div>
                      <div class="info-value-compact">
                        {{ result.part }}
                      </div>
                    </div>
                    <div
                      v-if="hasValue(result.year_as)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-calendar-clock</v-icon
                        >
                        ANNUAL/SUPPLY
                      </div>
                      <div class="info-value-compact">
                        {{ result.year_as }}
                      </div>
                    </div>
                    <div
                      v-if="hasValue(result.college_name)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-office-building</v-icon
                        >
                        COLLEGE NAME
                      </div>
                      <div class="info-value-compact">
                        {{ result.college_name }}
                      </div>
                    </div>
                    <div
                      v-if="hasValue(result.college_code)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-barcode</v-icon
                        >
                        COLLEGE CODE
                      </div>
                      <div class="info-value-compact">
                        {{ result.college_code }}
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Result Details Column -->
              <v-col cols="12" md="4" class="px-2">
                <div class="info-section-compact info-section-card">
                  <h3 class="section-title-compact mb-2">
                    <v-icon small color="primary" class="mr-1"
                      >mdi-file-document</v-icon
                    >
                    Result Details
                  </h3>
                  <div class="info-grid-compact">
                    <div
                      v-if="hasValue(result.result)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-trophy</v-icon
                        >
                        RESULT
                      </div>
                      <div class="info-value-compact">
                        {{ result.result }}
                      </div>
                    </div>
                    <div
                      v-if="hasNumericValue(result.gpa)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-chart-line</v-icon
                        >
                        GPA
                      </div>
                      <div class="info-value-compact">
                        {{ parseFloat(result.gpa).toFixed(2) }}
                      </div>
                    </div>
                    <div
                      v-if="hasNumericValue(result.cgpa)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-chart-bar</v-icon
                        >
                        CGPA
                      </div>
                      <div class="info-value-compact">
                        {{ parseFloat(result.cgpa).toFixed(2) }}
                      </div>
                    </div>
                    <div
                      v-if="hasValue(result.total_marks)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-counter</v-icon
                        >
                        TOTAL MARKS
                      </div>
                      <div class="info-value-compact">
                        {{ result.total_marks }}
                      </div>
                    </div>
                    <div
                      v-if="hasValue(result.obtained_marks)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-check-circle</v-icon
                        >
                        OBTAINED MARKS
                      </div>
                      <div class="info-value-compact">
                        {{ result.obtained_marks }}
                      </div>
                    </div>
                    <div
                      v-if="hasValue(result.division_grade)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-star</v-icon
                        >
                        DIVISION / GRADE
                      </div>
                      <div class="info-value-compact">
                        {{ result.division_grade }}
                      </div>
                    </div>
                    <div
                      v-if="hasValue(result.remarks)"
                      class="info-item-compact"
                    >
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-comment-text</v-icon
                        >
                        REMARKS
                      </div>
                      <div class="info-value-compact">
                        {{ result.remarks }}
                      </div>
                    </div>
                    <div v-if="imageUrl" class="info-item-compact">
                      <div class="info-label-compact">
                        <v-icon x-small color="primary" class="mr-1"
                          >mdi-image</v-icon
                        >
                        RESULT IMAGE
                      </div>
                      <div class="info-value-compact">Available</div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Audit Information Row -->
      <v-col
        cols="12"
        v-if="
          result && (result.operator || result.created_at || result.updated_at)
        "
      >
        <v-card class="info-card" elevation="2">
          <v-card-title class="info-card-header pa-3">
            <v-icon left color="white" size="20">mdi-clock-outline</v-icon>
            <span class="subtitle-1 font-weight-bold white--text">
              Audit Information
            </span>
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="4" class="px-2" v-if="result.operator">
                <div class="info-section-compact info-section-card">
                  <div class="info-item-compact">
                    <div class="info-label-compact">
                      <v-icon x-small color="primary" class="mr-1"
                        >mdi-account-cog</v-icon
                      >
                      OPERATOR
                    </div>
                    <div class="info-value-compact">
                      {{ result.operator || "N/A" }}
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4" class="px-2" v-if="result.created_at">
                <div class="info-section-compact info-section-card">
                  <div class="info-item-compact">
                    <div class="info-label-compact">
                      <v-icon x-small color="primary" class="mr-1"
                        >mdi-calendar-plus</v-icon
                      >
                      CREATED AT
                    </div>
                    <div class="info-value-compact">
                      {{ formatDate(result.created_at) || "N/A" }}
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="4" class="px-2" v-if="result.updated_at">
                <div class="info-section-compact info-section-card">
                  <div class="info-item-compact">
                    <div class="info-label-compact">
                      <v-icon x-small color="primary" class="mr-1"
                        >mdi-calendar-edit</v-icon
                      >
                      UPDATED AT
                    </div>
                    <div class="info-value-compact">
                      {{ formatDate(result.updated_at) || "N/A" }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- No Data -->
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
              The result information you are looking for is not available.
            </p>
            <v-btn large color="primary" class="mt-4" @click="$router.back()">
              <v-icon left>mdi-arrow-left</v-icon>
              Go Back
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Image Dialog -->
    <v-dialog
      v-model="showImageDialog"
      max-width="90%"
      max-height="90%"
      @click:outside="showImageDialog = false"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center pa-0">
          <span class="pa-4">Result Image</span>
          <v-btn icon @click="showImageDialog = false" class="ma-2">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0 text-center" style="background-color: #000">
          <v-img
            v-if="imageUrl && !imageError"
            :src="imageUrl"
            :alt="`Result for ${result.roll_no || 'N/A'}`"
            contain
            max-height="80vh"
            class="mx-auto"
            @error="handleImageError"
          ></v-img>
          <div v-else class="pa-12">
            <v-icon size="100" color="grey">mdi-file-image</v-icon>
            <p class="mt-4 text--secondary">No Image Available</p>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "@/config/api";
import "@/assets/css/ResultDetail.css";

export default {
  name: "ResultDetail",
  data() {
    return {
      result: null,
      loading: true,
      imageError: false,
      showImageDialog: false,
    };
  },
  computed: {
    imageUrl() {
      if (!this.result || !this.result.result_image) return null;
      const img = this.result.result_image;
      if (
        img.startsWith("http://") ||
        img.startsWith("https://") ||
        img.startsWith("data:image/")
      ) {
        return img;
      }
      if (
        img.startsWith("/9j/") ||
        img.startsWith("iVBORw0KGgo") ||
        img.startsWith("R0lGOD") ||
        (img.length > 100 &&
          !img.includes("/") &&
          !img.includes("\\") &&
          !img.includes("http"))
      ) {
        if (img.startsWith("/9j/") || img.startsWith("/9j/4AAQ")) {
          return `data:image/jpeg;base64,${img}`;
        } else if (img.startsWith("iVBORw0KGgo")) {
          return `data:image/png;base64,${img}`;
        } else if (img.startsWith("R0lGOD")) {
          return `data:image/gif;base64,${img}`;
        }
        return `data:image/jpeg;base64,${img}`;
      }
      if (img.includes(".") && img.length < 255) {
        return null;
      }
      if (img.length > 500 && /^[A-Za-z0-9+/=]+$/.test(img)) {
        return `data:image/jpeg;base64,${img}`;
      }
      return null;
    },
  },
  mounted() {
    this.fetchResult();
  },
  methods: {
    async fetchResult() {
      try {
        const rollNo = this.$route.params.roll_no;
        const response = await api.get(
          `/api/results/${encodeURIComponent(rollNo)}`
        );
        this.result = response.data?.data || response.data || null;
      } catch (error) {
        this.result = null;
      } finally {
        this.loading = false;
      }
    },
    handleImageError() {
      this.imageError = true;
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      try {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      } catch (error) {
        return dateString;
      }
    },
    hasValue(value) {
      return (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        String(value).trim() !== ""
      );
    },
    hasNumericValue(value) {
      if (!this.hasValue(value)) return false;
      const num = parseFloat(value);
      return !isNaN(num) && isFinite(num);
    },
  },
};
</script>
