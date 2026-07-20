import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import ScrollToTop from "./components/common/ScrollToTop";
import LoadingSpinner from "./components/common/LoadingSpinner";

// ── Lazy-loaded pages ──────────────────────────────────────────────────────────
const Home = lazy(() => import("./pages/Home"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const NotFound = lazy(() => import("./pages/NotFound"));

// ── Lazy-loaded admin components ───────────────────────────────────────────────
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const ManageProfile = lazy(() => import("./components/admin/ManageProfile"));
const ManageSkills = lazy(() => import("./components/admin/ManageSkills"));
const ManageProjects = lazy(() => import("./components/admin/ManageProjects"));
const ManageExperience = lazy(
  () => import("./components/admin/ManageExperience"),
);
const ManageCertifications = lazy(
  () => import("./components/admin/ManageCertifications"),
);
const ManageTestimonials = lazy(
  () => import("./components/admin/ManageTestimonials"),
);
const ManageMessages = lazy(() => import("./components/admin/ManageMessages"));

// ── Suspense fallback ──────────────────────────────────────────────────────────
const PageLoader = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-primary)",
    }}
  >
    <LoadingSpinner message="Loading…" />
  </div>
);

const Lazy = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

// ── Toast must be inside ThemeProvider so it can read the theme ────────────────
const ThemedToast = () => {
  const { isDark } = useTheme();
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDark ? "dark" : "light"}
      limit={4}
    />
  );
};

// ── Route tree ─────────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <>
    {/* Scrolls window to top on every route change */}
    <ScrollToTop />
    <ThemedToast />

    <Routes>
      {/* Public portfolio */}
      <Route
        path="/"
        element={
          <Lazy>
            <Home />
          </Lazy>
        }
      />

      {/* Admin login — no auth required */}
      <Route
        path="/admin/login"
        element={
          <Lazy>
            <AdminLogin />
          </Lazy>
        }
      />

      {/* Admin panel — protected by JWT */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Lazy>
              <AdminLayout />
            </Lazy>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Lazy>
              <Dashboard />
            </Lazy>
          }
        />
        <Route
          path="profile"
          element={
            <Lazy>
              <ManageProfile />
            </Lazy>
          }
        />
        <Route
          path="skills"
          element={
            <Lazy>
              <ManageSkills />
            </Lazy>
          }
        />
        <Route
          path="projects"
          element={
            <Lazy>
              <ManageProjects />
            </Lazy>
          }
        />
        <Route
          path="experience"
          element={
            <Lazy>
              <ManageExperience />
            </Lazy>
          }
        />
        <Route
          path="certifications"
          element={
            <Lazy>
              <ManageCertifications />
            </Lazy>
          }
        />
        <Route
          path="testimonials"
          element={
            <Lazy>
              <ManageTestimonials />
            </Lazy>
          }
        />
        <Route
          path="messages"
          element={
            <Lazy>
              <ManageMessages />
            </Lazy>
          }
        />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <Lazy>
            <NotFound />
          </Lazy>
        }
      />
    </Routes>
  </>
);

// ── Root component — provides all contexts ────────────────────────────────────
const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
