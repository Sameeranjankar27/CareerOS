import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Layout from "./components/Layout/Layout";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Jobs from "./pages/Jobs/Jobs";
import Resume from "./pages/Resume/Resume";
import AIAnalysis from "./pages/AIAnalysis/AIAnalysis";
import AIInterviewPrep from "./pages/AIInterviewPrep/AIInterviewPrep";
import Notifications from "./pages/Notifications/Notifications";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            <Route path="dashboard" element={<Dashboard />} />

            <Route path="jobs" element={<Jobs />} />

            <Route path="resume" element={<Resume />} />

            <Route path="ai-analysis" element={<AIAnalysis />} />

            <Route
              path="ai-interview-prep"
              element={<AIInterviewPrep />}
            />

            <Route
              path="notifications"
              element={<Notifications />}
            />
          </Route>

          {/* Unknown route ko login par bhej do */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;