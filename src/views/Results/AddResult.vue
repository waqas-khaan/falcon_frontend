<template>
  <v-container fluid class="pa-2 pt-3 pb-2 fill-height">
    <v-row class="mt-0 fill-height">
      <v-col cols="12" class="pt-0 d-flex">
        <v-card
          elevation="2"
          class="flex d-flex flex-column"
          style="width: 100%"
        >
          <v-card-text class="pt-2 pb-2">
            <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
              <!-- Compact Multi-Column Layout -->
              <v-row dense class="mt-0">
                <!-- Result Information Section -->
                <v-col cols="12" class="pb-0">
                  <div class="section-title mb-2">
                    <v-icon small color="primary" class="mr-1"
                      >mdi-file-document-edit</v-icon
                    >
                    Result Information
                  </div>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.roll_no"
                    label="Exam Roll No *"
                    placeholder="Enter Exam Roll Number"
                    :rules="rollNoRules"
                    required
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.student_name"
                    label="Student Name"
                    placeholder="Enter Student Name"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.father_name"
                    label="Father Name"
                    placeholder="Enter Father Name"
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
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.session"
                    label="Session"
                    placeholder="e.g., 2021 - 2025"
                    outlined
                    dense
                    class="mb-1"
                    @input="formatSession"
                    maxlength="13"
                    hint="Type year range (e.g., 2021 - 2025)"
                    persistent-hint
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.registration_no"
                    label="Registration No"
                    placeholder="Enter Registration Number"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.serial_no"
                    label="Student Serial No"
                    placeholder="Enter Student Serial Number (optional)"
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

                <v-col cols="12" md="6">
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

                <v-col cols="12" md="6">
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

                <!-- Result Details Section -->
                <v-col cols="12" class="pt-2 pb-0">
                  <div class="section-title">
                    <v-icon x-small color="primary" class="mr-1"
                      >mdi-trophy</v-icon
                    >
                    Result Details
                  </div>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.result"
                    label="Result"
                    placeholder="Enter Result"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.gpa"
                    label="GPA"
                    type="number"
                    step="0.01"
                    placeholder="Enter GPA"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="formData.cgpa"
                    label="CGPA"
                    type="number"
                    step="0.01"
                    placeholder="Enter CGPA"
                    outlined
                    dense
                    class="mb-1"
                  ></v-text-field>
                </v-col>

                <!-- Result Image Section -->
                <v-col cols="12" class="pt-2 pb-0">
                  <div class="section-title">
                    <v-icon x-small color="primary" class="mr-1"
                      >mdi-camera</v-icon
                    >
                    Result Image
                  </div>
                </v-col>

                <v-col cols="12" md="8">
                  <v-file-input
                    v-model="resultImageFile"
                    label="Result Image (Max 30MB)"
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
                      <v-btn small color="error" @click="clearImage" dense>
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
                <v-btn text @click="$router.back()" :disabled="submitting">
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :disabled="!valid || submitting"
                  :loading="submitting"
                >
                  <v-icon left>mdi-content-save</v-icon>
                  Save Result
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
import "@/assets/css/AddResult.css";

export default {
  name: "AddResult",
  data() {
    return {
      valid: false,
      submitting: false,
      error: null,
      resultImageFile: null,
      imagePreview: null,
      // Excel upload
      excelFile: null,
      uploading: false,
      uploadMessage: null,
      uploadMessageType: "info",
      formData: {
        roll_no: "",
        student_name: "",
        father_name: "",
        year: "",
        session: "",
        registration_no: "",
        serial_no: "",
        program: "",
        college_name: "",
        result: "",
        gpa: "",
        cgpa: "",
        result_image: null,
      },
      programList: [],
      collegeList: [],
      // Scan dialog state
      showScanDialog: false,
      scanning: false,
      streamActive: false,
      videoStream: null,
      capturedImage: null,
      scanError: null,
      rollNoRules: [
        (v) => !!v || "Exam Roll No is required",
        (v) =>
          (v && v.length >= 1) || "Exam Roll No must be at least 1 character",
      ],
      imageRules: [
        (file) => {
          if (!file) return true;
          const maxSize = 30 * 1024 * 1024; // 30MB in bytes
          if (file.size > maxSize) {
            return "Image size must be less than 30MB";
          }
          return true;
        },
      ],
    };
  },
  mounted() {
    this.fetchPrograms();
    this.fetchColleges();
  },
  methods: {
    formatSession() {
      // Get the raw input value (remove all non-digits)
      let value = this.formData.session.replace(/\D/g, "");

      // Limit to 8 digits (4 for each year)
      if (value.length > 8) {
        value = value.substring(0, 8);
      }

      // Format based on length
      if (value.length === 0) {
        this.formData.session = "";
      } else if (value.length <= 4) {
        // Just the first year
        this.formData.session = value;
      } else {
        // First year + separator + second year
        const firstYear = value.substring(0, 4);
        const secondYear = value.substring(4);
        this.formData.session = `${firstYear} - ${secondYear}`;
      }
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
            const list = fallbackResponse.data.data || [];
            this.programList = Array.isArray(list) ? list : [];
          }
        } catch (fallbackError) {
          this.programList = [];
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
          this.collegeList = [];
        }
      }
    },
    handleImageChange(file) {
      if (file) {
        // Validate file size (30MB limit)
        const maxSize = 30 * 1024 * 1024; // 30MB in bytes
        if (file.size > maxSize) {
          this.error =
            "Image size must be less than 30MB. Please compress or resize the image.";
          this.resultImageFile = null;
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
          // Convert to base64 for storage
          this.formData.result_image = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.clearImage();
      }
    },
    clearImage() {
      this.resultImageFile = null;
      this.imagePreview = null;
      this.formData.result_image = null;
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
      this.formData.result_image = this.capturedImage;

      // Create a File object for the file input (optional, for consistency)
      // Convert data URL to blob
      fetch(this.capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "scanned-image.jpg", {
            type: "image/jpeg",
          });
          this.resultImageFile = file;
        })
        .catch((error) => {
          console.error("Error converting captured image to file:", error);
          // Continue anyway - the base64 is already stored
        });

      // Close dialog
      this.closeScanDialog();
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

      this.submitting = true;
      this.error = null;

      try {
        // Prepare data - only include fields that have values
        const submitData = {
          roll_no: this.formData.roll_no,
        };

        if (this.formData.student_name) {
          submitData.student_name = this.formData.student_name;
        }
        if (this.formData.father_name) {
          submitData.father_name = this.formData.father_name;
        }
        if (this.formData.year) {
          submitData.year = parseInt(this.formData.year) || null;
        }
        if (this.formData.session) {
          submitData.session = this.formData.session;
        }
        if (this.formData.registration_no) {
          submitData.registration_no = this.formData.registration_no;
        }
        if (this.formData.serial_no) {
          submitData.serial_no = this.formData.serial_no;
        }
        if (this.formData.program) {
          submitData.program = this.formData.program;
        }
        if (this.formData.college_name) {
          submitData.college_name = this.formData.college_name;
        }
        if (this.formData.result) {
          submitData.result = this.formData.result;
        }
        if (this.formData.gpa) {
          submitData.gpa = parseFloat(this.formData.gpa) || null;
        }
        if (this.formData.cgpa) {
          submitData.cgpa = parseFloat(this.formData.cgpa) || null;
        }
        if (this.formData.result_image) {
          submitData.result_image = this.formData.result_image;
        }

        const response = await api.post("/api/results", submitData);

        if (response.data.success) {
          toast.success("Result added successfully!");

          // Clear form after successful submission
          this.$refs.form.reset();
          this.clearImage();
          this.formData = {
            roll_no: "",
            student_name: "",
            father_name: "",
            year: "",
            session: "",
            registration_no: "",
            serial_no: "",
            program: "",
            college_name: "",
            result: "",
            gpa: "",
            cgpa: "",
            result_image: null,
          };
        } else {
          this.error = response.data.error || "Failed to add result";
        }
      } catch (error) {
        console.error("Error adding result:", error);

        // HCI: User-friendly error messages
        if (error.response) {
          if (error.response.status === 401) {
            this.error = "Your session has expired. Please log in again.";
            setTimeout(() => {
              this.$router.push("/login");
            }, 2000);
          } else if (error.response.status === 403) {
            this.error = "You don't have permission to add result records.";
          } else if (error.response.status === 409) {
            this.error = "A result with this roll number already exists.";
          } else if (error.response.status === 400) {
            this.error =
              error.response.data?.error ||
              "Invalid data. Please check your input.";
          } else if (error.response.status >= 500) {
            this.error =
              "Server error. Please try again later or contact support.";
          } else {
            this.error =
              error.response.data?.error ||
              "Failed to add result. Please try again.";
          }
        } else if (error.request) {
          this.error =
            "Unable to connect to the server. Please check your internet connection and try again.";
        } else {
          this.error = "An unexpected error occurred. Please try again.";
        }

        // Clear error message after 5 seconds
        setTimeout(() => {
          this.error = null;
        }, 5000);
      } finally {
        this.submitting = false;
      }
    },
  },
  beforeDestroy() {
    // Clean up camera stream when component is destroyed
    this.stopCamera();
  },
};
</script>
