import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/roles/Login.vue";
import UserRoleLogin from "../views/roles/UserRoleLogin.vue";
import Dashboard from "../views/Dashboards/Dashboard.vue";
import Records from "../views/Students/Records.vue";
import Results from "../views/Results/Results.vue";
import ResultDetail from "../views/Results/ResultDetail.vue";
import StudentDetail from "../views/Students/StudentDetail.vue";
import AddStudent from "../views/Students/AddStudent.vue";
import EditStudent from "../views/Students/EditStudent.vue";
import AddResult from "../views/Results/AddResult.vue";
import EditResult from "../views/Results/EditResult.vue";
import CollegePrograms from "../views/CollegePrograms.vue";
import UserManagement from "../views/roles/UserManagement.vue";
import NotFound from "../views/404 Not Found/NotFound.vue";
import RegisterRecords from "../views/Results/RegisterRecords.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false, title: "Login" },
  },
  {
    path: "/index/auth/login/user_role",
    name: "UserRoleLogin",
    component: UserRoleLogin,
    meta: { requiresAuth: false, title: "Select User Role" },
  },
  // Also support the route without /index prefix for easier access
  {
    path: "/auth/login/user_role",
    name: "UserRoleLoginAlt",
    component: UserRoleLogin,
    meta: { requiresAuth: false, title: "Select User Role" },
  },
  {
    path: "/dashboard/admin",
    name: "AdminDashboard",
    component: Dashboard,
    meta: { requiresAuth: true, title: "Admin Dashboard" },
  },
  {
    path: "/dashboard/user",
    name: "UserDashboard",
    component: Dashboard,
    meta: { requiresAuth: true, title: "User Dashboard" },
  },
  {
    path: "/student-registration",
    name: "Records",
    component: Records,
    meta: {
      // Any authenticated role can VIEW student registration records.
      // Edit/delete/create is still restricted in the component by role.
      requiresAuth: true,
      title: "Student Registration",
    },
  },
  {
    path: "/results",
    name: "Results",
    component: Results,
    meta: {
      // Any authenticated role can VIEW results.
      // Edit/delete/create is still restricted in the component by role.
      requiresAuth: true,
      title: "Student Results",
    },
  },
  {
    path: "/register-records",
    name: "RegisterRecords",
    component: RegisterRecords,
    meta: {
      // Any authenticated role can VIEW register records.
      // Creating/updating/deleting is still restricted in the component by role.
      requiresAuth: true,
      title: "Register Records",
    },
  },
  {
    path: "/result/add",
    name: "AddResult",
    component: AddResult,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      allowsResultControl: true,
      title: "Add Result",
    },
  },
  {
    path: "/result/:roll_no",
    name: "ResultDetail",
    component: ResultDetail,
    meta: { requiresAuth: true, title: "Result Details" },
  },
  {
    path: "/result/:id/edit",
    name: "EditResult",
    component: EditResult,
    meta: {
      requiresAuth: true,
      allowsResultControl: true,
      title: "Edit Result",
    },
  },
  {
    path: "/college-programs",
    name: "CollegePrograms",
    component: CollegePrograms,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: "Colleges & Programs",
    },
  },
  {
    path: "/student/add",
    name: "AddStudent",
    component: AddStudent,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      allowsRegistrationControl: true,
      title: "Add Student",
    },
  },
  {
    path: "/student/:serial_no/edit",
    name: "EditStudent",
    component: EditStudent,
    meta: {
      requiresAuth: true,
      allowsRegistrationControl: true,
      title: "Edit Student",
    },
  },
  {
    path: "/student/:serial_no",
    name: "StudentDetail",
    component: StudentDetail,
    meta: { requiresAuth: true, title: "Student Details" },
  },
  {
    path: "/index/auth/login/admin/get/user_role",
    name: "UserManagement",
    component: UserManagement,
    meta: { requiresAuth: true, requiresAdmin: true, title: "User Management" },
  },
  // Catch-all 404 page - must be last
  {
    path: "*",
    name: "NotFound",
    component: NotFound,
    meta: { requiresAuth: false, title: "Page Not Found" },
  },
];

const router = new VueRouter({
  mode: "history", // Use history mode - nginx is configured to handle SPA routing
  base: process.env.BASE_URL,
  routes,
});

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  // Check if user explicitly logged out - if so, don't allow auto-login
  const isExplicitlyLoggedOut =
    localStorage.getItem("isExplicitlyLoggedOut") === "true";

  // Get auth state - try store first, then fallback to localStorage
  let token = null;
  let userRole = "";

  // If explicitly logged out, don't restore session
  if (!isExplicitlyLoggedOut) {
    try {
      // Try to get store from router instance
      const store = router.app && router.app.$store;
      if (store && store.getters) {
        token = store.getters.getToken || null;
        userRole = (store.getters.getRole || "").toLowerCase().trim();
      }
    } catch (error) {
      // Store not available, will use fallback
    }

    // Fallback to localStorage if store not available
    if (!token) {
      token = localStorage.getItem("token");
    }
    if (!userRole) {
      userRole = (localStorage.getItem("userRole") || "").toLowerCase().trim();
    }

    // Also check cookies as fallback
    try {
      const Cookies = require("js-cookie");
      if (!token) {
        token = Cookies.get("token") || null;
      }
      if (!userRole) {
        userRole = (Cookies.get("userRole") || "").toLowerCase().trim();
      }
    } catch (error) {
      // Cookies not available, continue with localStorage values
    }
  }

  // Define login paths
  const loginPaths = [
    "/login",
    "/index/auth/login/user_role",
    "/auth/login/user_role",
  ];

  // If already navigating to a login page, allow it (prevents redirect errors)
  if (loginPaths.includes(to.path)) {
    // If user is logged in and tries to access login pages, redirect to appropriate dashboard
    if (token) {
      // Normalize roles: "administration" -> "admin", "operator" -> "user"
      const normalizedRole =
        userRole === "administration"
          ? "admin"
          : userRole === "operator"
          ? "user"
          : userRole;

      let redirectPath = "/dashboard/user"; // default
      if (normalizedRole === "admin") {
        redirectPath = "/dashboard/admin";
      } else if (normalizedRole === "user") {
        redirectPath = "/dashboard/user";
      } else if (normalizedRole === "result_control") {
        redirectPath = "/dashboard/user";
      } else if (normalizedRole === "registration_control") {
        redirectPath = "/dashboard/user";
      }
      // Only redirect if not already going to the target path
      if (to.path !== redirectPath && from.path !== redirectPath) {
        next({ path: redirectPath, replace: true });
      } else {
        next();
      }
    } else {
      // No token, allow access to login page
      next();
    }
    return;
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const allowsResultControl = to.matched.some(
    (record) => record.meta.allowsResultControl
  );
  const allowsRegistrationControl = to.matched.some(
    (record) => record.meta.allowsRegistrationControl
  );

  // If route requires authentication and no token, redirect to login
  if (requiresAuth && !token) {
    // Prevent redirect loop by checking if we're already going to or coming from login
    const isGoingToLogin = loginPaths.includes(to.path);
    const isComingFromLogin = loginPaths.includes(from.path);

    if (!isGoingToLogin && !isComingFromLogin) {
      // Store the intended destination for redirect after login
      if (to.path !== "/login") {
        localStorage.setItem("redirectAfterLogin", to.fullPath);
      }
      // Redirect to login - Vue Router will handle this properly
      // The error is already suppressed in main.js error handler
      next({ path: "/login", replace: true });
      return;
    } else {
      next();
      return;
    }
  }

  // Normalize roles: "administration" -> "admin", "operator" -> "user"
  const normalizedRole =
    userRole === "administration"
      ? "admin"
      : userRole === "operator"
      ? "user"
      : userRole;

  // Check role-based access control
  const adminRoles = ["admin"];
  const resultControlRoles = ["admin", "result_control"];
  const registrationControlRoles = ["admin", "registration_control"];

  // If route requires admin and user is not admin or doesn't have alternative access
  if (requiresAdmin && !adminRoles.includes(normalizedRole)) {
    // Check if route allows result_control or registration_control
    const hasResultControlAccess =
      allowsResultControl && normalizedRole === "result_control";
    const hasRegistrationControlAccess =
      allowsRegistrationControl && normalizedRole === "registration_control";

    if (!hasResultControlAccess && !hasRegistrationControlAccess) {
      console.warn(
        `Access denied: Route ${to.path} requires admin role, but user role is: ${userRole} (normalized: ${normalizedRole})`
      );
      // Redirect to appropriate main page based on role
      let redirectPath = "/dashboard/user"; // default
      if (normalizedRole === "user") {
        redirectPath = "/dashboard/user";
      } else if (normalizedRole === "result_control") {
        redirectPath = "/dashboard/user";
      } else if (normalizedRole === "registration_control") {
        redirectPath = "/dashboard/user";
      } else if (normalizedRole === "admin") {
        redirectPath = "/dashboard/admin";
      }
      // Only redirect if not already going to the target path
      if (to.path !== redirectPath && from.path !== redirectPath) {
        next({ path: redirectPath, replace: true });
      } else {
        next();
      }
      return;
    }
  }

  // Check if route allows result_control but user doesn't have access
  if (allowsResultControl && !resultControlRoles.includes(normalizedRole)) {
    console.warn(
      `Access denied: Route ${to.path} requires result_control or admin role, but user role is: ${userRole} (normalized: ${normalizedRole})`
    );
    let redirectPath = "/dashboard/user";
    if (normalizedRole === "registration_control") {
      redirectPath = "/dashboard/user";
    } else if (normalizedRole === "user") {
      redirectPath = "/dashboard/user";
    } else if (normalizedRole === "result_control") {
      redirectPath = "/dashboard/user";
    } else if (normalizedRole === "admin") {
      redirectPath = "/dashboard/admin";
    }
    if (to.path !== redirectPath && from.path !== redirectPath) {
      next({ path: redirectPath, replace: true });
    } else {
      next();
    }
    return;
  }

  // Check if route allows registration_control but user doesn't have access
  if (
    allowsRegistrationControl &&
    !registrationControlRoles.includes(normalizedRole)
  ) {
    console.warn(
      `Access denied: Route ${to.path} requires registration_control or admin role, but user role is: ${userRole} (normalized: ${normalizedRole})`
    );
    let redirectPath = "/dashboard/user";
    if (normalizedRole === "result_control") {
      redirectPath = "/dashboard/user";
    } else if (normalizedRole === "user") {
      redirectPath = "/dashboard/user";
    } else if (normalizedRole === "registration_control") {
      redirectPath = "/dashboard/user";
    } else if (normalizedRole === "admin") {
      redirectPath = "/dashboard/admin";
    }
    if (to.path !== redirectPath && from.path !== redirectPath) {
      next({ path: redirectPath, replace: true });
    } else {
      next();
    }
    return;
  }

  // Allow navigation
  next();
});

// Set document title based on route meta
router.afterEach((to) => {
  // Get title from route meta
  const title = to.meta?.title || to.name || "";

  // Set document title
  document.title = `${title}`;
});

export default router;
