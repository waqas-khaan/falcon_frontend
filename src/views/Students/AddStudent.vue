<template>
  <v-container fluid class="pa-2 pt-3 pb-2 fill-height">
    <v-row class="mt-0 fill-height">
      <v-col cols="12" class="pt-0 d-flex">
        <v-card
          elevation="2"
          class="flex d-flex flex-column"
          style="width: 100%"
        >
          <!-- <v-card-title class="headline py-2">
            <v-icon left small>mdi-account-plus</v-icon>
            Add New Student
          </v-card-title> -->

          <v-card-text class="pt-2 pb-2">
            <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
              <!-- Compact Multi-Column Layout -->
              <v-row dense class="mt-0">
                <!-- Personal Information Section -->
                <v-col cols="12" class="pb-0">
                  <div class="section-title mb-2">
                    <v-icon small color="primary" class="mr-1"
                      >mdi-account</v-icon
                    >
                    Personal Information
                  </div>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.serial_no"
                    label="Serial No"
                    placeholder="Enter Serial Number"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.registration_no"
                    label="Registration No *"
                    placeholder="Enter Registration Number"
                    :rules="registrationNoRules"
                    required
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.student_name"
                    label="Student Name *"
                    placeholder="Enter Student Name"
                    :rules="studentNameRules"
                    required
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.father_name"
                    label="Father Name *"
                    placeholder="Enter Father Name"
                    :rules="fatherNameRules"
                    required
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.dob"
                    label="Date of Birth (DOB)"
                    type="date"
                    placeholder="Select Date of Birth"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.admission_date"
                    label="Date of Admission / Re-Admission / Leave"
                    type="date"
                    placeholder="Select Date of Admission"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <!-- Academic Information Section -->
                <v-col cols="12" class="pt-2 pb-0">
                  <div class="section-title">
                    <v-icon x-small color="primary" class="mr-1"
                      >mdi-school</v-icon
                    >
                    Academic Information
                  </div>
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                    v-model="formData.degree"
                    :items="degreeList"
                    label="Degree"
                    placeholder="Select Degree"
                    outlined
                    dense
                    class="mb-1"
                    clearable
                  ></v-select>
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                    v-model="formData.program"
                    :items="programList"
                    label="Program"
                    placeholder="Select Program"
                    outlined
                    dense
                    class="mb-1"
                    clearable
                  ></v-select>
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                    v-model="formData.college_name"
                    :items="collegeList"
                    label="College Name"
                    placeholder="Select College"
                    outlined
                    dense
                    class="mb-1"
                    clearable
                  ></v-select>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.college_code"
                    label="College Code"
                    placeholder="Enter College Code"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.year"
                    label="Year"
                    type="number"
                    placeholder="Enter Year (e.g., 2024)"
                    :rules="yearRules"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                    v-model="formData.year_as"
                    :items="['ANNUAL', 'SUPPLY']"
                    label="Annual/Supply"
                    placeholder="Select Annual/Supply"
                    outlined
                    dense
                    class="mb-1"
                    clearable
                  ></v-select>
                </v-col>

                <!-- Examination Information Section -->
                <v-col cols="12" class="pt-2 pb-0">
                  <div class="section-title">
                    <v-icon x-small color="primary" class="mr-1"
                      >mdi-file-document-edit</v-icon
                    >
                    Examination Information
                  </div>
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                    v-model="formData.exam_status"
                    :items="['PASS', 'FAIL']"
                    label="Examination Pass/Fail"
                    placeholder="Select Status"
                    outlined
                    dense
                    class="mb-1"
                    clearable
                  ></v-select>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.roll_no_inter"
                    label="Roll No - Inter"
                    placeholder="Enter Roll No - Inter"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.inter_result"
                    label="Inter-Result"
                    placeholder="Enter Inter-Result"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.marks_obtained"
                    label="Marks Obtained"
                    type="number"
                    placeholder="Enter Marks Obtained"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-select
                    v-model="formData.division_grade"
                    :items="divisionGradeList"
                    item-text="name"
                    item-value="name"
                    label="Division / Grade"
                    placeholder="Select Division / Grade"
                    outlined
                    dense
                    class="mb-1"
                    clearable
                  ></v-select>
                </v-col>

                <!-- Additional Information Section -->
                <v-col cols="12" class="pt-2 pb-0">
                  <div class="section-title">
                    <v-icon x-small color="primary" class="mr-1"
                      >mdi-information</v-icon
                    >
                    Additional Information
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="formData.remarks"
                    label="Remarks"
                    placeholder="Enter Remarks"
                    outlined
                    rows="2"
                    dense
                    class="mb-1"
                  ></v-textarea>
                </v-col>

                <v-col cols="12" md="6">
                  <v-row dense>
                    <v-col cols="12" md="8">
                      <v-file-input
                        v-model="imageFile"
                        label="Physical Image (Max 20MB)"
                        placeholder="Select image file or scan"
                        accept="image/*"
                        prepend-icon="mdi-camera"
                        outlined
                        dense
                        show-size
                        :rules="imageRules"
                        @change="handleImageChange"
                        class="mb-1"
                      ></v-file-input>
                    </v-col>
                    <v-col cols="12" md="4" class="d-flex align-center">
                      <v-btn
                        color="primary"
                        outlined
                        small
                        block
                        @click="openScanDialog"
                        :disabled="scanning"
                        class="mt-0"
                      >
                        <v-icon left small>mdi-scanner</v-icon>
                        Scan Image
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <!-- Image Preview -->
              <v-row v-if="imagePreview" class="mb-2 mt-2">
                <v-col cols="12" md="6">
                  <v-card outlined>
                    <v-card-title class="subtitle-2 py-2"
                      >Image Preview</v-card-title
                    >
                    <v-card-text class="py-2">
                      <v-img
                        :src="imagePreview"
                        max-height="150"
                        contain
                        class="mb-1"
                      ></v-img>
                      <v-btn small color="error" @click="removeImage" dense>
                        <v-icon left small>mdi-delete</v-icon>
                        Remove Image
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Error Message -->
              <v-alert v-if="error" type="error" dense text class="mb-2 mt-2">
                {{ error }}
              </v-alert>

              <!-- Action Buttons -->
              <v-card-actions class="pt-2 pb-2">
                <v-spacer></v-spacer>
                <v-btn text @click="$router.back()" :disabled="loading">
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :disabled="!valid || loading"
                  :loading="loading"
                >
                  <v-icon left>mdi-content-save</v-icon>
                  Save Student
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Scan Image Dialog -->
    <v-dialog v-model="showScanDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Scan Image</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeScanDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-alert v-if="scanError" type="error" dense class="mb-4">
            {{ scanError }}
          </v-alert>
          <div v-if="!streamActive" class="text-center py-8">
            <v-icon size="64" color="grey">mdi-camera</v-icon>
            <p class="mt-4">Click "Start Camera" to begin scanning</p>
          </div>
          <div v-else class="text-center">
            <video
              ref="videoElement"
              autoplay
              playsinline
              style="
                max-width: 100%;
                max-height: 400px;
                border: 2px solid #e0e0e0;
                border-radius: 4px;
              "
            ></video>
            <v-row class="mt-4">
              <v-col cols="12" v-if="capturedImage">
                <v-card outlined>
                  <v-card-title class="subtitle-2">Captured Image</v-card-title>
                  <v-card-text>
                    <v-img
                      :src="capturedImage"
                      max-height="200"
                      contain
                      class="mb-1"
                    ></v-img>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeScanDialog" :disabled="scanning">
            Cancel
          </v-btn>
          <v-btn
            v-if="!streamActive"
            color="primary"
            @click="startCamera"
            :loading="scanning"
          >
            <v-icon left>mdi-camera</v-icon>
            Start Camera
          </v-btn>
          <v-btn
            v-if="streamActive && !capturedImage"
            color="primary"
            @click="captureImage"
            :disabled="scanning"
          >
            <v-icon left>mdi-camera-iris</v-icon>
            Capture
          </v-btn>
          <v-btn
            v-if="capturedImage"
            color="success"
            @click="useCapturedImage"
            :disabled="scanning"
          >
            <v-icon left>mdi-check</v-icon>
            Use This Image
          </v-btn>
          <v-btn
            v-if="capturedImage"
            text
            @click="retakeImage"
            :disabled="scanning"
          >
            Retake
          </v-btn>
          <v-btn
            v-if="streamActive"
            text
            @click="stopCamera"
            :disabled="scanning"
          >
            Stop Camera
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "@/config/api";
import { toast } from "@/utils/toast";
import "@/assets/css/AddStudent.css";
import logoImage from "@/assets/university-of-peshawar-logo.png";

export default {
  name: "AddStudent",
  data() {
    return {
      valid: false,
      loading: false,
      error: null,
      imageFile: null,
      imagePreview: null,
      logoBase64: null,
      formData: {
        serial_no: "",
        registration_no: "",
        student_name: "",
        father_name: "",
        dob: "",
        admission_date: "",
        degree: "",
        program: "",
        college_name: "",
        college_code: "",
        year: null,
        year_as: "",
        exam_status: "",
        roll_no_inter: "",
        inter_result: "",
        marks_obtained: null,
        division_grade: "",
        remarks: "",
        physical_image: null,
      },
      programList: [],
      collegeList: [],
      degreeList: [],
      divisionGradeList: [],
      // Scan dialog state
      showScanDialog: false,
      scanning: false,
      streamActive: false,
      videoStream: null,
      capturedImage: null,
      scanError: null,
      registrationNoRules: [
        (v) => !!v || "Registration number is required",
        (v) =>
          (v && v.length <= 100) ||
          "Registration number must be less than 100 characters",
      ],
      studentNameRules: [
        (v) => !!v || "Student name is required",
        (v) =>
          (v && v.length <= 200) ||
          "Student name must be less than 200 characters",
      ],
      fatherNameRules: [
        (v) => !!v || "Father name is required",
        (v) =>
          (v && v.length <= 200) ||
          "Father name must be less than 200 characters",
      ],
      yearRules: [
        (v) =>
          !v ||
          (v >= 1900 && v <= 2100) ||
          "Year must be between 1900 and 2100",
      ],
      imageRules: [
        (file) => {
          if (!file) return true;
          const maxSize = 20 * 1024 * 1024; // 20MB in bytes
          if (file.size > maxSize) {
            return "Image size must be less than 20MB";
          }
          return true;
        },
      ],
    };
  },
  mounted() {
    this.loadLogo();
    this.fetchPrograms();
    this.fetchColleges();
    this.fetchDegrees();
    this.fetchDivisionsGrades();
  },
  computed: {
    hasFormData() {
      return (
        this.formData.serial_no ||
        this.formData.registration_no ||
        this.formData.student_name ||
        this.formData.father_name ||
        this.formData.dob ||
        this.formData.admission_date ||
        this.formData.program ||
        this.formData.college_name ||
        this.formData.college_code ||
        this.formData.year ||
        this.formData.year_as ||
        this.formData.exam_status ||
        this.formData.roll_no_inter ||
        this.formData.inter_result ||
        this.formData.marks_obtained ||
        this.formData.division_grade ||
        this.formData.remarks
      );
    },
  },
  methods: {
    handleImageChange(file) {
      if (file) {
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.imagePreview = null;
      }
    },
    removeImage() {
      this.imageFile = null;
      this.imagePreview = null;
      this.formData.physical_image = null;
    },
    openScanDialog() {
      this.showScanDialog = true;
      this.scanError = null;
      this.capturedImage = null;
      this.streamActive = false;
    },
    closeScanDialog() {
      this.stopCamera();
      this.showScanDialog = false;
      this.scanError = null;
      this.capturedImage = null;
    },
    async startCamera() {
      this.scanning = true;
      this.scanError = null;

      try {
        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          this.scanError =
            "Camera access is not supported in this browser. Please use a modern browser with camera support.";
          this.scanning = false;
          return;
        }

        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Prefer back camera (for mobile)
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        this.videoStream = stream;
        this.streamActive = true;

        // Wait for video element to be available
        await this.$nextTick();
        if (this.$refs.videoElement) {
          const video = this.$refs.videoElement;
          video.srcObject = stream;

          // Wait for video to be ready and start playing
          await new Promise((resolve, reject) => {
            video.onloadedmetadata = () => {
              video
                .play()
                .then(() => {
                  resolve();
                })
                .catch((error) => {
                  console.error("Error playing video:", error);
                  this.scanError =
                    "Failed to start video stream. Please try again.";
                  reject(error);
                });
            };

            // Timeout after 5 seconds
            setTimeout(() => {
              if (video.readyState < 2) {
                reject(new Error("Video loading timeout"));
              }
            }, 5000);
          });
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        this.scanError =
          "Unable to access camera. Please ensure you have granted camera permissions and that your device has a camera.";
        if (error.name === "NotAllowedError") {
          this.scanError =
            "Camera permission denied. Please allow camera access in your browser settings.";
        } else if (error.name === "NotFoundError") {
          this.scanError = "No camera found on your device.";
        } else if (error.name === "NotReadableError") {
          this.scanError =
            "Camera is already in use by another application. Please close other applications using the camera.";
        }
      } finally {
        this.scanning = false;
      }
    },
    stopCamera() {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach((track) => track.stop());
        this.videoStream = null;
      }
      this.streamActive = false;
      if (this.$refs.videoElement) {
        this.$refs.videoElement.srcObject = null;
      }
    },
    captureImage() {
      if (!this.$refs.videoElement) {
        this.scanError = "Video element not available";
        return;
      }

      try {
        const video = this.$refs.videoElement;

        // Check if video is ready
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
          this.scanError =
            "Video is not ready. Please wait a moment and try again.";
          return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to base64 data URL (same format as uploaded images)
        const dataURL = canvas.toDataURL("image/jpeg", 0.9);
        this.capturedImage = dataURL;
      } catch (error) {
        console.error("Error capturing image:", error);
        this.scanError = "Failed to capture image. Please try again.";
      }
    },
    retakeImage() {
      this.capturedImage = null;
    },
    useCapturedImage() {
      if (!this.capturedImage) {
        return;
      }

      // Store the captured image (already in base64 format like uploaded images)
      this.imagePreview = this.capturedImage;
      this.formData.physical_image = this.capturedImage;

      // Create a File object for the file input (optional, for consistency)
      // Convert data URL to blob
      fetch(this.capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "scanned-image.jpg", {
            type: "image/jpeg",
          });
          this.imageFile = file;
        })
        .catch((error) => {
          console.error("Error converting captured image to file:", error);
          // Continue anyway - the base64 is already stored
        });

      // Close dialog
      this.closeScanDialog();
    },
    async fetchPrograms() {
      try {
        const response = await api.get("/api/programs");
        if (response.data.success) {
          // Map to array of program names for the select dropdown
          const programs = response.data.data || [];
          this.programList = programs.map((p) => p.name).filter(Boolean);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        // Fallback to old endpoint if new one fails
        try {
          const fallbackResponse = await api.get("/api/students/programs");
          if (fallbackResponse.data.success) {
            this.programList = fallbackResponse.data.data || [];
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
          // Map to array of college names for the select dropdown
          const colleges = response.data.data || [];
          this.collegeList = colleges.map((c) => c.name).filter(Boolean);
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
        // Fallback to old endpoint if new one fails
        try {
          const fallbackResponse = await api.get("/api/students/colleges");
          if (fallbackResponse.data.success) {
            this.collegeList = fallbackResponse.data.data || [];
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
          // Map to array of degree names for the select dropdown
          const degrees = response.data.data || [];
          this.degreeList = degrees.map((d) => d.name).filter(Boolean);
        }
      } catch (error) {
        console.error("Error fetching degrees:", error);
      }
    },
    async fetchDivisionsGrades() {
      try {
        const response = await api.get("/api/divisions-grades");
        if (response.data.success) {
          this.divisionGradeList = response.data.data || [];
        }
      } catch (error) {
        console.error("Error fetching divisions/grades:", error);
      }
    },
    async handleSubmit(event) {
      // Prevent form submission and page refresh
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (!this.$refs.form.validate()) {
        return false;
      }

      this.loading = true;
      this.error = null;

      try {
        // Prepare form data
        const submitData = { ...this.formData };

        // Handle image upload if present (file upload)
        if (this.imageFile) {
          // Validate file size (20MB limit)
          const maxSize = 20 * 1024 * 1024; // 20MB in bytes
          if (this.imageFile.size > maxSize) {
            this.error =
              "Image size must be less than 20MB. Please compress or resize the image.";
            this.loading = false;
            return;
          }

          // Convert image to base64 data URL for storage in database
          // LONGTEXT column can store up to 4GB, so 20MB images are well within limits
          try {
            const base64Image = await this.convertToBase64(this.imageFile);
            // Store the full data URL (includes data:image/...;base64, prefix)
            submitData.physical_image = base64Image;
            console.log("Image converted to base64");
            console.log(
              "Original file size:",
              (this.imageFile.size / 1024 / 1024).toFixed(2),
              "MB"
            );
            console.log(
              "Base64 length:",
              (base64Image.length / 1024 / 1024).toFixed(2),
              "MB"
            );
          } catch (error) {
            console.error("Error converting image to base64:", error);
            this.error = "Failed to process image. Please try again.";
            this.loading = false;
            return;
          }
        } else if (this.formData.physical_image) {
          // Handle scanned image (already in base64 format)
          // Scanned images are already stored in formData.physical_image as base64
          submitData.physical_image = this.formData.physical_image;
          console.log("Using scanned image (already in base64 format)");
        }

        // Remove null/empty values (but keep physical_image even if it's a long base64 string)
        Object.keys(submitData).forEach((key) => {
          if (submitData[key] === null || submitData[key] === "") {
            delete submitData[key];
          }
        });

        // Debug: Log what we're sending
        console.log("Submitting student data:", {
          ...submitData,
          physical_image: submitData.physical_image
            ? `${submitData.physical_image.substring(0, 50)}... (length: ${
                submitData.physical_image.length
              })`
            : null,
        });

        // Submit to API
        const response = await api.post("/api/students", submitData);

        if (response.data.success) {
          toast.success("Student added successfully!");

          // Clear form after successful submission
          this.$refs.form.reset();
          this.removeImage();
          this.formData = {
            serial_no: "",
            registration_no: "",
            student_name: "",
            father_name: "",
            dob: "",
            admission_date: "",
            degree: "",
            program: "",
            college_name: "",
            college_code: "",
            year: null,
            year_as: "",
            exam_status: "",
            roll_no_inter: "",
            inter_result: "",
            marks_obtained: null,
            division_grade: "",
            remarks: "",
            physical_image: null,
          };
        }
      } catch (error) {
        console.error("Error adding student:", error);

        if (error.response) {
          this.error =
            error.response.data?.error ||
            `Failed to add student: ${error.response.status} ${error.response.statusText}`;
        } else if (error.request) {
          this.error =
            "Unable to connect to server. Please ensure the backend server is running.";
        } else {
          this.error =
            error.message || "An error occurred while adding student";
        }
      } finally {
        this.loading = false;
      }
    },
    convertToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
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
    printStudentForm() {
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
                  margin: 1cm 1.2cm;
                }
                body {
                  margin: 0;
                  padding: 0;
                }
                .no-print {
                  display: none;
                }
                .print-container {
                  height: 100%;
                  overflow: hidden;
                }
              }
              * {
                box-sizing: border-box;
              }
              body {
                font-family: 'Arial', 'Helvetica', sans-serif;
                margin: 0;
                padding: 10px;
                background: white;
                color: #333;
              }
              .print-container {
                max-width: 21cm;
                margin: 0 auto;
                background: white;
                height: calc(29.7cm - 2cm);
                display: flex;
                flex-direction: column;
              }
              .header {
                display: grid;
                grid-template-columns: 80px 1fr 80px;
                align-items: center;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 2px solid #497CB1;
                flex-shrink: 0;
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
                margin: 0 0 4px 0;
                font-size: 18px;
                font-weight: bold;
              }
              .header .subtitle {
                color: #666;
                font-size: 10px;
                margin: 2px 0;
              }
              .content-wrapper {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
              }
              .info-section {
                margin-bottom: 10px;
                flex-shrink: 0;
              }
              .info-section-title {
                background-color: #497CB1;
                color: white;
                padding: 6px 10px;
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 8px;
                border-radius: 3px 3px 0 0;
              }
              .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 8px;
              }
              .info-item {
                padding: 6px 8px;
                border: 1px solid #e0e0e0;
                border-radius: 3px;
                background-color: #fafafa;
              }
              .info-item.full-width {
                grid-column: 1 / -1;
              }
              .info-label {
                font-weight: bold;
                color: #497CB1;
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                margin-bottom: 3px;
              }
              .info-value {
                font-size: 11px;
                color: #333;
                word-wrap: break-word;
                line-height: 1.3;
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
                margin-top: 8px;
                padding-top: 6px;
                border-top: 1px solid #e0e0e0;
                text-align: center;
                font-size: 8px;
                color: #666;
                flex-shrink: 0;
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
                .footer {
                  margin-top: auto;
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
                  <h1>Student Information Form</h1>
                  <div class="subtitle">University of Peshawar</div>
                  <div class="subtitle">Generated on: ${date} at ${time}</div>
                </div>
              </div>

              <div class="content-wrapper">
              <div class="info-section">
                <div class="info-section-title">Personal Information</div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Serial Number</div>
                    <div class="info-value ${
                      !this.formData.serial_no ? "empty" : ""
                    }">
                      ${this.formData.serial_no || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Registration Number</div>
                    <div class="info-value ${
                      !this.formData.registration_no ? "empty" : ""
                    }">
                      ${this.formData.registration_no || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item full-width">
                    <div class="info-label">Student Name</div>
                    <div class="info-value ${
                      !this.formData.student_name ? "empty" : ""
                    }">
                      ${this.formData.student_name || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item full-width">
                    <div class="info-label">Father Name</div>
                    <div class="info-value ${
                      !this.formData.father_name ? "empty" : ""
                    }">
                      ${this.formData.father_name || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Date of Birth</div>
                    <div class="info-value ${
                      !this.formData.dob ? "empty" : ""
                    }">
                      ${this.formData.dob || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Date of Admission / Re-Admission / Leave</div>
                    <div class="info-value ${
                      !this.formData.admission_date ? "empty" : ""
                    }">
                      ${this.formData.admission_date || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>

              <div class="info-section">
                <div class="info-section-title">Academic Information</div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Degree</div>
                    <div class="info-value ${
                      !this.formData.degree ? "empty" : ""
                    }">
                      ${this.formData.degree || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Program</div>
                    <div class="info-value ${
                      !this.formData.program ? "empty" : ""
                    }">
                      ${this.formData.program || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item full-width">
                    <div class="info-label">College Name</div>
                    <div class="info-value ${
                      !this.formData.college_name ? "empty" : ""
                    }">
                      ${this.formData.college_name || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">College Code</div>
                    <div class="info-value ${
                      !this.formData.college_code ? "empty" : ""
                    }">
                      ${this.formData.college_code || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Year</div>
                    <div class="info-value ${
                      !this.formData.year ? "empty" : ""
                    }">
                      ${this.formData.year || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Annual/Supply</div>
                    <div class="info-value ${
                      !this.formData.year_as ? "empty" : ""
                    }">
                      ${this.formData.year_as || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>

              <div class="info-section">
                <div class="info-section-title">Examination Information</div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Examination Pass/Fail</div>
                    <div class="info-value ${
                      !this.formData.exam_status ? "empty" : ""
                    }">
                      ${this.formData.exam_status || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Roll No - Inter</div>
                    <div class="info-value ${
                      !this.formData.roll_no_inter ? "empty" : ""
                    }">
                      ${this.formData.roll_no_inter || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Inter-Result</div>
                    <div class="info-value ${
                      !this.formData.inter_result ? "empty" : ""
                    }">
                      ${this.formData.inter_result || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Marks Obtained</div>
                    <div class="info-value ${
                      !this.formData.marks_obtained ? "empty" : ""
                    }">
                      ${this.formData.marks_obtained || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Division / Grade</div>
                    <div class="info-value ${
                      !this.formData.division_grade ? "empty" : ""
                    }">
                      ${this.formData.division_grade || "Not provided"}
                    </div>
                  </div>
                  <div class="info-item full-width">
                    <div class="info-label">Remarks</div>
                    <div class="info-value ${
                      !this.formData.remarks ? "empty" : ""
                    }">
                      ${this.formData.remarks || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
        `;

        // Image section removed from print - not printable as per requirement

        htmlContent += `
              </div>
              <div class="footer">
                <p>This document was generated from the University of Peshawar</p>
                <p>Date: ${date} | Time: ${time}</p>
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
          //   printWindow.print();
        }, 250);

        toast.success("Print dialog opened!");
      } catch (error) {
        console.error("Print error:", error);
        this.error = "Failed to open print dialog. Please try again.";
        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    },
  },
  beforeDestroy() {
    // Clean up camera stream when component is destroyed
    this.stopCamera();
  },
};
</script>
