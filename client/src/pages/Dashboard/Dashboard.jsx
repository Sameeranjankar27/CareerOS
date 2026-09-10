import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user, token } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [statsResponse, jobsResponse] =
          await Promise.all([
            api.get("/jobs/stats", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            api.get("/jobs", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        setStats(statsResponse.data);

        setRecentJobs(
          jobsResponse.data.jobs.slice(0, 5)
        );
      } catch (error) {
        console.error(
          "Dashboard Data Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // ==========================================
  // HELPERS
  // ==========================================
  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "status-applied";

      case "Interview":
        return "status-interview";

      case "Offer":
        return "status-offer";

      case "Rejected":
        return "status-rejected";

      default:
        return "";
    }
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // PIPELINE
  // ==========================================
  const pipelineSteps = [
    {
      label: "Applied",
      count: stats.applied,
      icon: "📤",
      className: "pipeline-applied",
    },
    {
      label: "Interview",
      count: stats.interview,
      icon: "🎯",
      className: "pipeline-interview",
    },
    {
      label: "Offer",
      count: stats.offer,
      icon: "🎉",
      className: "pipeline-offer",
    },
    {
      label: "Rejected",
      count: stats.rejected,
      icon: "❌",
      className: "pipeline-rejected",
    },
  ];

  // ==========================================
  // CAREER INSIGHTS
  // ==========================================
  const interviewRate =
    stats.total > 0
      ? Math.round(
          (stats.interview / stats.total) * 100
        )
      : 0;

  const offerRate =
    stats.total > 0
      ? Math.round(
          (stats.offer / stats.total) * 100
        )
      : 0;

  const rejectionRate =
    stats.total > 0
      ? Math.round(
          (stats.rejected / stats.total) * 100
        )
      : 0;

  const activeApplications =
    stats.applied + stats.interview;

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="dashboard-page">

      {/* ======================================
          HEADER
      ====================================== */}
      <div className="dashboard-header">
        <div>
          <h1>
            Welcome back,{" "}
            {user?.name?.split(" ")[0] || "there"} 👋
          </h1>

          <p>
            Here's what's happening with your
            job search.
          </p>
        </div>

        <Link
          to="/jobs"
          className="dashboard-primary-button"
        >
          + Add Application
        </Link>
      </div>

      {/* ======================================
          STATS CARDS
      ====================================== */}
      <div className="dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            📋
          </div>

          <div>
            <span>Total Applications</span>
            <h2>{stats.total}</h2>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            📤
          </div>

          <div>
            <span>Applied</span>
            <h2>{stats.applied}</h2>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            🎯
          </div>

          <div>
            <span>Interviews</span>
            <h2>{stats.interview}</h2>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">
            🎉
          </div>

          <div>
            <span>Offers</span>
            <h2>{stats.offer}</h2>
          </div>
        </div>
      </div>

      {/* ======================================
          RECENT APPLICATIONS
      ====================================== */}
      <div className="dashboard-section">

        <div className="dashboard-section-header">
          <div>
            <h2>Recent Applications</h2>
            <p>
              Your latest job applications.
            </p>
          </div>

          <Link
            to="/jobs"
            className="dashboard-view-all"
          >
            View all →
          </Link>
        </div>

        {recentJobs.length > 0 ? (
          <div className="recent-applications-list">

            {recentJobs.map((job) => (
              <div
                className="recent-application-card"
                key={job._id}
              >

                <div className="recent-company-icon">
                  {job.company
                    ?.charAt(0)
                    .toUpperCase() || "C"}
                </div>

                <div className="recent-application-info">

                  <h3>{job.role}</h3>

                  <div className="recent-application-meta">
                    <span>
                      {job.company}
                    </span>

                    {job.location && (
                      <>
                        <span>•</span>
                        <span>
                          {job.location}
                        </span>
                      </>
                    )}
                  </div>

                </div>

                <div>
                  <span
                    className={`recent-status ${getStatusClass(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="recent-application-date">
                  {formatDate(
                    job.applicationDate ||
                      job.createdAt
                  )}
                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="dashboard-empty-state">

            <div className="dashboard-empty-icon">
              📋
            </div>

            <h3>No applications yet</h3>

            <p>
              Start tracking your job applications
              to see them here.
            </p>

            <Link
              to="/jobs"
              className="dashboard-primary-button"
            >
              Add your first application
            </Link>

          </div>
        )}

      </div>

      {/* ======================================
          APPLICATION PIPELINE
      ====================================== */}
      <div className="dashboard-section">

        <div className="dashboard-section-header">
          <div>
            <h2>Application Pipeline</h2>

            <p>
              Track how your applications are
              progressing.
            </p>
          </div>
        </div>

        <div className="application-pipeline">

          {pipelineSteps.map((step) => {

            const percentage =
              stats.total > 0
                ? Math.round(
                    (step.count /
                      stats.total) *
                      100
                  )
                : 0;

            return (
              <div
                className="pipeline-step"
                key={step.label}
              >

                <div className="pipeline-step-top">

                  <div className="pipeline-icon">
                    {step.icon}
                  </div>

                  <span className="pipeline-count">
                    {step.count}
                  </span>

                </div>

                <h3>{step.label}</h3>

                <div className="pipeline-progress">
                  <div
                    className={`pipeline-progress-bar ${step.className}`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  ></div>
                </div>

                <span className="pipeline-percentage">
                  {percentage}% of applications
                </span>

              </div>
            );
          })}

        </div>

      </div>

      {/* ======================================
          CAREER INSIGHTS
      ====================================== */}
      <div className="dashboard-section">

        <div className="dashboard-section-header">
          <div>
            <h2>Career Insights</h2>

            <p>
              A quick look at your application
              performance.
            </p>
          </div>
        </div>

        <div className="career-insights-grid">

          <div className="career-insight-card">

            <div className="career-insight-icon">
              🎯
            </div>

            <div className="career-insight-content">
              <span>Interview Rate</span>
              <h3>{interviewRate}%</h3>

              <p>
                Applications reaching interview
                stage
              </p>
            </div>

          </div>

          <div className="career-insight-card">

            <div className="career-insight-icon">
              🏆
            </div>

            <div className="career-insight-content">
              <span>Offer Rate</span>
              <h3>{offerRate}%</h3>

              <p>
                Applications resulting in offers
              </p>
            </div>

          </div>

          <div className="career-insight-card">

            <div className="career-insight-icon">
              🔥
            </div>

            <div className="career-insight-content">
              <span>Active Applications</span>
              <h3>{activeApplications}</h3>

              <p>
                Applications still in progress
              </p>
            </div>

          </div>

          <div className="career-insight-card">

            <div className="career-insight-icon">
              📊
            </div>

            <div className="career-insight-content">
              <span>Rejection Rate</span>
              <h3>{rejectionRate}%</h3>

              <p>
                Applications marked as rejected
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          QUICK ACTIONS
      ====================================== */}
      <div className="dashboard-section">

        <div className="dashboard-section-header">
          <div>
            <h2>Quick Actions</h2>

            <p>
              Jump straight into your most
              important tasks.
            </p>
          </div>
        </div>

        <div className="dashboard-quick-actions">

          <Link
            to="/jobs"
            className="dashboard-action-card"
          >
            <div className="dashboard-action-icon">
              💼
            </div>

            <div>
              <h3>Track Applications</h3>

              <p>
                Add and manage your job
                applications.
              </p>
            </div>

            <span>→</span>
          </Link>

          <Link
            to="/resume"
            className="dashboard-action-card"
          >
            <div className="dashboard-action-icon">
              📄
            </div>

            <div>
              <h3>Manage Resume</h3>

              <p>
                Upload and manage your latest
                resume.
              </p>
            </div>

            <span>→</span>
          </Link>

          <Link
            to="/ai-analysis"
            className="dashboard-action-card"
          >
            <div className="dashboard-action-icon">
              ✦
            </div>

            <div>
              <h3>Analyze Resume</h3>

              <p>
                Compare your resume with a job
                description.
              </p>
            </div>

            <span>→</span>
          </Link>

        </div>

      </div>

      {/* ======================================
          AI CAREER TOOLS
      ====================================== */}
      <div className="dashboard-section">

        <div className="dashboard-section-header">
          <div>
            <h2>AI Career Tools</h2>

            <p>
              Use AI to prepare smarter for your
              next opportunity.
            </p>
          </div>
        </div>

        <div className="dashboard-ai-grid">

          <Link
            to="/ai-analysis"
            className="dashboard-ai-card"
          >
            <div className="dashboard-ai-icon">
              ✦
            </div>

            <div>
              <h3>
                AI Resume Analysis
              </h3>

              <p>
                Find skill gaps and improve your
                resume for specific jobs.
              </p>
            </div>

            <span>→</span>
          </Link>

          <Link
            to="/ai-interview-prep"
            className="dashboard-ai-card"
          >
            <div className="dashboard-ai-icon">
              🎯
            </div>

            <div>
              <h3>
                AI Interview Prep
              </h3>

              <p>
                Generate personalized interview
                questions and preparation tips.
              </p>
            </div>

            <span>→</span>
          </Link>

        </div>

      </div>

      {/* ======================================
          CAREEROS TIP
      ====================================== */}
      <div className="dashboard-tip">

        <div className="dashboard-tip-icon">
          💡
        </div>

        <div>
          <h3>CareerOS Tip</h3>

          <p>
            Don't just track applications — learn
            from them. Use AI Resume Analysis before
            applying to important roles and prepare
            for interviews using AI Interview Prep.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;