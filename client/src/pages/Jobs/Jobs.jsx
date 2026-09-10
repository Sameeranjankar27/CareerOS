import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Jobs() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Applied");
  const [jobDescription, setJobDescription] = useState("");
  const [notes, setNotes] = useState("");

  const [editingJobId, setEditingJobId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH JOBS
  // ==========================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Fetch Jobs Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load job applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token]);

  // ==========================================
  // CLEAR FORM
  // ==========================================

  const clearForm = () => {
    setCompany("");
    setRole("");
    setLocation("");
    setStatus("Applied");
    setJobDescription("");
    setNotes("");
    setEditingJobId(null);
  };

  // ==========================================
  // ADD / UPDATE JOB
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      if (editingJobId) {
        const response = await api.put(
          `/jobs/${editingJobId}`,
          {
            company,
            role,
            location,
            status,
            jobDescription,
            notes,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage(response.data.message);
      } else {
        const response = await api.post(
          "/jobs",
          {
            company,
            role,
            location,
            status,
            jobDescription,
            notes,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage(response.data.message);
      }

      clearForm();
      fetchJobs();
    } catch (error) {
      console.error("Save Job Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to save job application"
      );
    }
  };

  // ==========================================
  // EDIT JOB
  // ==========================================

  const handleEdit = (job) => {
    setEditingJobId(job._id);

    setCompany(job.company);
    setRole(job.role);
    setLocation(job.location || "");
    setStatus(job.status);
    setJobDescription(job.jobDescription || "");
    setNotes(job.notes || "");

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE JOB
  // ==========================================

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await api.delete(
        `/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      fetchJobs();
    } catch (error) {
      console.error("Delete Job Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete job application"
      );
    }
  };

  // ==========================================
  // AI RESUME ANALYSIS
  // ==========================================

  const handleAnalyzeJob = (job) => {
    navigate("/ai-analysis", {
      state: {
        jobDescription: job.jobDescription,
        company: job.company,
        role: job.role,
      },
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="jobs-page">

      {/* PAGE HEADER */}

      <div className="jobs-header">
        <div>
          <h1>Job Applications</h1>

          <p>
            Keep track of every opportunity in one place.
          </p>
        </div>

        <div className="jobs-count">
          {jobs.length}{" "}
          {jobs.length === 1
            ? "Application"
            : "Applications"}
        </div>
      </div>


      {/* ADD / EDIT FORM */}

      <div className="job-form-card">

        <div className="form-card-header">
          <div>
            <h2>
              {editingJobId
                ? "Edit Application"
                : "Add New Application"}
            </h2>

            <p>
              {editingJobId
                ? "Update the details of this application."
                : "Add a job you have applied for."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div>
              <label>Company</label>

              <input
                type="text"
                placeholder="e.g. Google"
                value={company}
                onChange={(e) =>
                  setCompany(e.target.value)
                }
                required
              />
            </div>


            <div>
              <label>Job Role</label>

              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                required
              />
            </div>


            <div>
              <label>Location</label>

              <input
                type="text"
                placeholder="e.g. Pune"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
              />
            </div>


            <div>
              <label>Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="Applied">
                  Applied
                </option>

                <option value="Interview">
                  Interview
                </option>

                <option value="Offer">
                  Offer
                </option>

                <option value="Rejected">
                  Rejected
                </option>
              </select>
            </div>


            <div className="full-width">
              <label>Job Description</label>

              <textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(e.target.value)
                }
              />
            </div>


            <div className="full-width">
              <label>Notes</label>

              <textarea
                placeholder="Add notes about this application..."
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
              />
            </div>

          </div>


          <div className="form-actions">

            <button type="submit">
              {editingJobId
                ? "Update Application"
                : "Add Application"}
            </button>

            {editingJobId && (
              <button
                type="button"
                className="secondary-button"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>


      {/* MESSAGES */}

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* APPLICATION LIST */}

      <div className="applications-section">

        <div className="applications-header">
          <div>
            <h2>Your Applications</h2>

            <p>
              All your tracked job opportunities.
            </p>
          </div>
        </div>


        {loading && (
          <div className="empty-state">
            Loading applications...
          </div>
        )}


        {!loading &&
          !error &&
          jobs.length === 0 && (
            <div className="empty-state">

              <div className="empty-icon">
                📋
              </div>

              <h3>
                No applications yet
              </h3>

              <p>
                Add your first job application above
                to start tracking your job search.
              </p>

            </div>
          )}


        {!loading && jobs.length > 0 && (
          <div className="jobs-grid">

            {jobs.map((job) => (

              <div
                className="job-card"
                key={job._id}
              >

                <div className="job-card-header">

                  <div className="company-avatar">
                    {job.company
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="job-title">

                    <h3>{job.role}</h3>

                    <p>{job.company}</p>

                  </div>

                  <span
                    className={`status-badge status-${job.status.toLowerCase()}`}
                  >
                    {job.status}
                  </span>

                </div>


                <div className="job-details">

                  {job.location && (
                    <div className="job-detail">
                      <span>📍</span>
                      <span>{job.location}</span>
                    </div>
                  )}

                  <div className="job-detail">
                    <span>📅</span>

                    <span>
                      {new Date(
                        job.applicationDate
                      ).toLocaleDateString()}
                    </span>
                  </div>

                </div>


                {job.jobDescription && (
                  <div className="job-description">

                    <h4>
                      Job Description
                    </h4>

                    <p>
                      {job.jobDescription}
                    </p>

                  </div>
                )}


                {job.notes && (
                  <div className="job-notes">

                    <h4>
                      Notes
                    </h4>

                    <p>
                      {job.notes}
                    </p>

                  </div>
                )}


                <div className="job-card-actions">

                  {job.jobDescription && (
                    <button
                      className="ai-analyze-job-button"
                      onClick={() =>
                        handleAnalyzeJob(job)
                      }
                    >
                      ✦ Analyze Resume
                    </button>
                  )}

                  <button
                    className="edit-button"
                    onClick={() =>
                      handleEdit(job)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(job._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Jobs;