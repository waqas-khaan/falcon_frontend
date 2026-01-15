// Utility to fetch dummy data from online URL
import axios from "axios";

// Default dummy data URL - can be overridden via environment variable
// Using raw.githack.com for CORS support, or you can set VUE_APP_DUMMY_DATA_URL in .env file
const GITHUB_RAW_URL =
  "https://raw.githubusercontent.com/waqas-khaan/falcon_UoP/main/frontend/src/data/dummyData.json";
const CORS_PROXY_URL = GITHUB_RAW_URL.replace(
  "raw.githubusercontent.com",
  "raw.githack.com"
);
const DUMMY_DATA_URL = process.env.VUE_APP_DUMMY_DATA_URL || CORS_PROXY_URL;

// Cache for dummy data
let cachedDummyData = null;
let loadingPromise = null;

/**
 * Fetch dummy data from online URL
 * @returns {Promise<Object>} Dummy data object
 */
export async function fetchDummyData() {
  // Return cached data if available
  if (cachedDummyData) {
    return cachedDummyData;
  }

  // Return existing promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }

  // Create new loading promise - will fallback to embedded data if fetch fails
  loadingPromise = axios
    .get(DUMMY_DATA_URL, {
      timeout: 10000, // 10 second timeout for production
      headers: {
        Accept: "application/json",
      },
      // Add CORS handling
      withCredentials: false,
    })
    .then((response) => {
      if (response.data && typeof response.data === "object") {
        cachedDummyData = response.data;
        console.log(
          "Dummy data fetched successfully from URL:",
          DUMMY_DATA_URL
        );
        return cachedDummyData;
      } else {
        throw new Error("Invalid response data format");
      }
    })
    .catch((error) => {
      console.warn("Failed to fetch dummy data from URL:", DUMMY_DATA_URL);
      console.warn("Error details:", error.message || error.code || error);
      console.log("Using fallback dummy data instead");
      // Always return fallback dummy data if fetch fails
      const fallbackData = getFallbackDummyData();
      // Cache fallback data so we don't keep trying to fetch
      cachedDummyData = fallbackData;
      return fallbackData;
    })
    .finally(() => {
      loadingPromise = null;
    });

  return loadingPromise;
}

/**
 * Get fallback dummy data (used if online fetch fails)
 * @returns {Object} Fallback dummy data
 */
function getFallbackDummyData() {
  console.log("Using fallback dummy data (embedded in bundle)");
  // Use the complete local dummy data that's bundled with the app
  return localDummyData.default || localDummyData;

  // Old fallback code below (kept as reference, but using import above)
  /*return {
    statistics: {
      registerRecords: 1250,
      students: 850,
      colleges: 12,
      programs: 45,
      results: 3200,
    },
    health: {
      status: "ok",
      message: "System is healthy",
      database: {
        status: "connected",
        connected: true,
        sizeMB: 245.8,
      },
      server: {
        uptime: 99.98,
        latency: 15,
      },
    },
    systemResources: {
      cpu: 45.2,
      memory: 62.5,
      disk: 38.7,
      database: {
        sizeMB: 245.8,
        connections: 25,
      },
    },
    students: [
      {
        id: 1,
        register_no: "REG001",
        name: "Ahmed Khan",
        father_name: "Muhammad Khan",
        cnic: "35201-1234567-1",
        college: "College of Engineering",
        program: "Computer Science",
        degree: "BS",
        exam_year: 2024,
        part: "Part I",
        study_status: "Regular",
        roll_no_from: "1001",
        roll_no_to: "1001",
        created_at: "2024-01-15T10:30:00Z",
      },
    ],
    results: [
      {
        id: 1,
        register_no: "REG001",
        student_name: "Ahmed Khan",
        college: "College of Engineering",
        program: "Computer Science",
        degree: "BS",
        exam_year: 2024,
        part: "Part I",
        total_marks: 850,
        obtained_marks: 720,
        percentage: 84.71,
        grade: "A",
        status: "Pass",
        created_at: "2024-02-01T10:30:00Z",
      },
    ],
    registerRecords: [
      {
        id: 1,
        register_no: "REG001",
        degree: "BS",
        exam_year: 2024,
        part: "Part I",
        study_status: "Regular",
        year_as: "2024",
        roll_no_from: "1001",
        roll_no_to: "1001",
        operator: "Admin User",
        created_at: "2024-01-15T10:30:00Z",
      },
    ],
    colleges: [
      {
        id: 1,
        name: "College of Engineering",
        code: "COE",
        description: "Engineering programs",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    programs: [
      {
        id: 1,
        name: "Computer Science",
        code: "CS",
        college_id: 1,
        college: "College of Engineering",
        description: "Computer Science program",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    degrees: [
      {
        id: 1,
        name: "Bachelor of Science",
        code: "BS",
        description: "Bachelor of Science degree",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    divisionsGrades: [
      {
        id: 1,
        name: "First Division",
        code: "1ST",
        min_percentage: 60,
        max_percentage: 100,
        description: "First Division",
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
    users: [
      {
        id: 1,
        username: "admin",
        email: "admin@university.edu",
        role: "admin",
        full_name: "Administrator",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
      },
    ],
  };*/
}

// Export default for backward compatibility
export default {
  fetchDummyData,
  getFallbackDummyData,
};
