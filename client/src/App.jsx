import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Jobs from "./pages/Jobs/Jobs";
import Resume from "./pages/Resume/Resume";
import AIAnalysis from "./pages/AIAnalysis/AIAnalysis";
import AIInterviewPrep from "./pages/AIInterviewPrep/AIInterviewPrep";

import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Notifications from "./pages/Notifications/Notifications";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Layout>
                <Jobs />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <Layout>
                <Resume />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-analysis"
          element={
            <ProtectedRoute>
              <Layout>
                <AIAnalysis />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-interview-prep"
          element={
            <ProtectedRoute>
              <Layout>
                <AIInterviewPrep />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Layout>
        <Notifications />
      </Layout>
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;