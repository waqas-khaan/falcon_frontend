// Dummy data for fallback when backend is unavailable
export default {
  statistics: {
    registerRecords: 1250,
    students: 850,
    colleges: 12,
    programs: 45,
    results: 3200
  },
  health: {
    status: "ok",
    message: "System is healthy",
    database: {
      status: "connected",
      connected: true,
      sizeMB: 245.8
    },
    server: {
      uptime: 99.98,
      latency: 15
    }
  },
  systemResources: {
    cpu: 45.2,
    memory: 62.5,
    disk: 38.7,
    database: {
      sizeMB: 245.8,
      connections: 25
    }
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
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      register_no: "REG002",
      name: "Fatima Ali",
      father_name: "Hassan Ali",
      cnic: "35201-2345678-2",
      college: "College of Sciences",
      program: "Mathematics",
      degree: "BS",
      exam_year: 2024,
      part: "Part II",
      study_status: "Regular",
      roll_no_from: "2001",
      roll_no_to: "2001",
      created_at: "2024-01-16T11:20:00Z"
    },
    {
      id: 3,
      register_no: "REG003",
      name: "Hassan Malik",
      father_name: "Ibrahim Malik",
      cnic: "35201-3456789-3",
      college: "College of Business",
      program: "Business Administration",
      degree: "BBA",
      exam_year: 2024,
      part: "Part I",
      study_status: "Private",
      roll_no_from: "3001",
      roll_no_to: "3001",
      created_at: "2024-01-17T09:15:00Z"
    },
    {
      id: 4,
      register_no: "REG004",
      name: "Ayesha Sheikh",
      father_name: "Abdul Sheikh",
      cnic: "35201-4567890-4",
      college: "College of Engineering",
      program: "Electrical Engineering",
      degree: "BS",
      exam_year: 2023,
      part: "Part IV",
      study_status: "Regular",
      roll_no_from: "4001",
      roll_no_to: "4001",
      created_at: "2024-01-18T14:45:00Z"
    },
    {
      id: 5,
      register_no: "REG005",
      name: "Usman Ahmad",
      father_name: "Nadeem Ahmad",
      cnic: "35201-5678901-5",
      college: "College of Sciences",
      program: "Physics",
      degree: "BS",
      exam_year: 2024,
      part: "Part III",
      study_status: "Regular",
      roll_no_from: "5001",
      roll_no_to: "5001",
      created_at: "2024-01-19T16:30:00Z"
    }
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
      created_at: "2024-02-01T10:00:00Z"
    },
    {
      id: 2,
      register_no: "REG002",
      student_name: "Fatima Ali",
      college: "College of Sciences",
      program: "Mathematics",
      degree: "BS",
      exam_year: 2024,
      part: "Part II",
      total_marks: 900,
      obtained_marks: 810,
      percentage: 90.0,
      grade: "A+",
      status: "Pass",
      created_at: "2024-02-02T11:30:00Z"
    },
    {
      id: 3,
      register_no: "REG003",
      student_name: "Hassan Malik",
      college: "College of Business",
      program: "Business Administration",
      degree: "BBA",
      exam_year: 2024,
      part: "Part I",
      total_marks: 800,
      obtained_marks: 650,
      percentage: 81.25,
      grade: "A",
      status: "Pass",
      created_at: "2024-02-03T09:15:00Z"
    },
    {
      id: 4,
      register_no: "REG004",
      student_name: "Ayesha Sheikh",
      college: "College of Engineering",
      program: "Electrical Engineering",
      degree: "BS",
      exam_year: 2023,
      part: "Part IV",
      total_marks: 1000,
      obtained_marks: 920,
      percentage: 92.0,
      grade: "A+",
      status: "Pass",
      created_at: "2024-02-04T14:20:00Z"
    },
    {
      id: 5,
      register_no: "REG005",
      student_name: "Usman Ahmad",
      college: "College of Sciences",
      program: "Physics",
      degree: "BS",
      exam_year: 2024,
      part: "Part III",
      total_marks: 850,
      obtained_marks: 680,
      percentage: 80.0,
      grade: "A",
      status: "Pass",
      created_at: "2024-02-05T16:45:00Z"
    }
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
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      register_no: "REG002",
      degree: "BS",
      exam_year: 2024,
      part: "Part II",
      study_status: "Regular",
      year_as: "2024",
      roll_no_from: "2001",
      roll_no_to: "2001",
      operator: "Admin User",
      created_at: "2024-01-16T11:20:00Z"
    },
    {
      id: 3,
      register_no: "REG003",
      degree: "BBA",
      exam_year: 2024,
      part: "Part I",
      study_status: "Private",
      year_as: "2024",
      roll_no_from: "3001",
      roll_no_to: "3001",
      operator: "Data Entry Operator",
      created_at: "2024-01-17T09:15:00Z"
    },
    {
      id: 4,
      register_no: "REG004",
      degree: "BS",
      exam_year: 2023,
      part: "Part IV",
      study_status: "Regular",
      year_as: "2023",
      roll_no_from: "4001",
      roll_no_to: "4001",
      operator: "Admin User",
      created_at: "2024-01-18T14:45:00Z"
    },
    {
      id: 5,
      register_no: "REG005",
      degree: "BS",
      exam_year: 2024,
      part: "Part III",
      study_status: "Regular",
      year_as: "2024",
      roll_no_from: "5001",
      roll_no_to: "5001",
      operator: "Admin User",
      created_at: "2024-01-19T16:30:00Z"
    }
  ],
  colleges: [
    {
      id: 1,
      name: "College of Engineering",
      code: "COE",
      description: "Engineering programs",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "College of Sciences",
      code: "COS",
      description: "Science programs",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      name: "College of Business",
      code: "COB",
      description: "Business programs",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 4,
      name: "College of Arts",
      code: "COA",
      description: "Arts and humanities programs",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 5,
      name: "College of Medicine",
      code: "COM",
      description: "Medical programs",
      created_at: "2024-01-01T00:00:00Z"
    }
  ],
  programs: [
    {
      id: 1,
      name: "Computer Science",
      code: "CS",
      college_id: 1,
      college: "College of Engineering",
      description: "Computer Science program",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Electrical Engineering",
      code: "EE",
      college_id: 1,
      college: "College of Engineering",
      description: "Electrical Engineering program",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      name: "Mathematics",
      code: "MATH",
      college_id: 2,
      college: "College of Sciences",
      description: "Mathematics program",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 4,
      name: "Physics",
      code: "PHY",
      college_id: 2,
      college: "College of Sciences",
      description: "Physics program",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 5,
      name: "Business Administration",
      code: "BBA",
      college_id: 3,
      college: "College of Business",
      description: "Business Administration program",
      created_at: "2024-01-01T00:00:00Z"
    }
  ],
  degrees: [
    {
      id: 1,
      name: "Bachelor of Science",
      code: "BS",
      description: "Bachelor of Science degree",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Bachelor of Business Administration",
      code: "BBA",
      description: "Bachelor of Business Administration degree",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      name: "Master of Science",
      code: "MS",
      description: "Master of Science degree",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 4,
      name: "Master of Business Administration",
      code: "MBA",
      description: "Master of Business Administration degree",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 5,
      name: "Doctor of Philosophy",
      code: "PhD",
      description: "Doctor of Philosophy degree",
      created_at: "2024-01-01T00:00:00Z"
    }
  ],
  divisionsGrades: [
    {
      id: 1,
      name: "First Division",
      code: "1ST",
      min_percentage: 60,
      max_percentage: 100,
      description: "First Division",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Second Division",
      code: "2ND",
      min_percentage: 45,
      max_percentage: 59.99,
      description: "Second Division",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 3,
      name: "Third Division",
      code: "3RD",
      min_percentage: 33,
      max_percentage: 44.99,
      description: "Third Division",
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 4,
      name: "Fail",
      code: "FAIL",
      min_percentage: 0,
      max_percentage: 32.99,
      description: "Fail",
      created_at: "2024-01-01T00:00:00Z"
    }
  ],
  users: [
    {
      id: 1,
      username: "admin",
      email: "admin@university.edu",
      role: "admin",
      full_name: "Administrator",
      is_active: true,
      created_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      username: "dataentry",
      email: "dataentry@university.edu",
      role: "data_entry",
      full_name: "Data Entry Operator",
      is_active: true,
      created_at: "2024-01-02T00:00:00Z"
    },
    {
      id: 3,
      username: "viewer",
      email: "viewer@university.edu",
      role: "viewer",
      full_name: "Viewer User",
      is_active: true,
      created_at: "2024-01-03T00:00:00Z"
    },
    {
      id: 4,
      username: "manager",
      email: "manager@university.edu",
      role: "manager",
      full_name: "Manager User",
      is_active: true,
      created_at: "2024-01-04T00:00:00Z"
    },
    {
      id: 5,
      username: "inactive_user",
      email: "inactive@university.edu",
      role: "viewer",
      full_name: "Inactive User",
      is_active: false,
      created_at: "2024-01-05T00:00:00Z"
    }
  ]
};
