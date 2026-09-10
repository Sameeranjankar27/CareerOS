import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Resume() {
  const { token } = useAuth();

  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [resumes, setResumes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [activatingId, setActivatingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // FETCH RESUMES
  // ==========================================

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResumes(response.data.resumes);
    } catch (error) {
      console.error("Fetch Resumes Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load resumes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchResumes();
    }
  }, [token]);

  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setMessage("");
    setError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);

      setError(
        "Only PDF, DOC and DOCX files are allowed."
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);

      setError(
        "Resume file must be smaller than 5MB."
      );

      return;
    }

    setSelectedFile(file);
  };

  // ==========================================
  // UPLOAD RESUME
  // ==========================================

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setError("");

      const formData = new FormData();

      formData.append("resume", selectedFile);

      const response = await api.post(
        "/resumes/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchResumes();
    } catch (error) {
      console.error("Upload Resume Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to upload resume"
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // SET ACTIVE RESUME
  // ==========================================

  const handleSetActive = async (resumeId) => {
    try {
      setActivatingId(resumeId);
      setMessage("");
      setError("");

      const response = await api.put(
        `/resumes/${resumeId}/active`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      await fetchResumes();
    } catch (error) {
      console.error(
        "Set Active Resume Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to set active resume"
      );
    } finally {
      setActivatingId(null);
    }
  };

  // ==========================================
  // DELETE RESUME
  // ==========================================

  const handleDelete = async (resumeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(resumeId);
      setMessage("");
      setError("");

      const response = await api.delete(
        `/resumes/${resumeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      await fetchResumes();
    } catch (error) {
      console.error("Delete Resume Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete resume"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // VIEW RESUME
  // ==========================================

  const handleViewResume = (resume) => {
    const cleanPath = resume.filePath.replaceAll(
      "\\",
      "/"
    );

    window.open(
      `http://localhost:5000/${cleanPath}`,
      "_blank"
    );
  };

  // ==========================================
  // OPEN FILE PICKER
  // ==========================================

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // ==========================================
  // FORMAT FILE SIZE
  // ==========================================

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    const sizeInKB = bytes / 1024;

    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(1)} KB`;
    }

    return `${(sizeInKB / 1024).toFixed(1)} MB`;
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="resume-page">

      {/* HEADER */}

      <div className="resume-header">

        <div>
          <h1>Resume</h1>

          <p>
            Manage your resumes and keep your career
            documents organized.
          </p>
        </div>

        <button
          className="resume-upload-button"
          onClick={openFilePicker}
        >
          + Upload Resume
        </button>

      </div>

      {/* HIDDEN FILE INPUT */}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* UPLOAD CARD */}

      <div className="resume-upload-card">

        <div className="resume-upload-icon">
          📄
        </div>

        <div className="resume-upload-content">

          <h2>Upload your resume</h2>

          <p>
            Upload your latest resume to keep it ready
            for applications and AI-powered analysis.
          </p>

          <button
            className="resume-upload-secondary"
            onClick={openFilePicker}
          >
            Choose Resume
          </button>

          <span>
            PDF, DOC or DOCX • Max 5MB
          </span>

          {/* SELECTED FILE */}

          {selectedFile && (
            <div className="selected-file">

              <div>
                <strong>
                  {selectedFile.name}
                </strong>

                <span>
                  {formatFileSize(
                    selectedFile.size
                  )}
                </span>
              </div>

              <button
                className="upload-selected-button"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading
                  ? "Uploading..."
                  : "Upload"}
              </button>

            </div>
          )}

        </div>

      </div>

      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="success-message">
          ✓ {message}
        </div>
      )}

      {/* ERROR MESSAGE */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* RESUMES SECTION */}

      <div className="resume-section">

        <div className="resume-section-header">

          <div>
            <h2>Your Resumes</h2>

            <p>
              Manage your uploaded career documents.
            </p>
          </div>

          <span className="resume-count">
            {resumes.length}{" "}
            {resumes.length === 1
              ? "Resume"
              : "Resumes"}
          </span>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="resume-empty-state">
            <p>Loading resumes...</p>
          </div>
        )}

        {/* EMPTY STATE */}

        {!loading && resumes.length === 0 && (
          <div className="resume-empty-state">

            <div className="resume-empty-icon">
              📄
            </div>

            <h3>
              No resumes uploaded yet
            </h3>

            <p>
              Upload your resume to start managing
              your career documents and prepare for
              AI analysis.
            </p>

            <button
              className="resume-empty-button"
              onClick={openFilePicker}
            >
              Upload Your Resume
            </button>

          </div>
        )}

        {/* RESUME LIST */}

        {!loading && resumes.length > 0 && (
          <div className="resume-list">

            {resumes.map((resume) => (

              <div
                className={`resume-card ${
                  resume.isActive
                    ? "resume-card-active"
                    : ""
                }`}
                key={resume._id}
              >

                <div className="resume-card-icon">
                  📄
                </div>

                <div className="resume-card-info">

                  <div className="resume-card-title-row">

                    <h3>
                      {resume.originalName}
                    </h3>

                    {resume.isActive && (
                      <span className="active-resume-badge">
                        Active
                      </span>
                    )}

                  </div>

                  <p>
                    {formatFileSize(
                      resume.fileSize
                    )}

                    {" • Uploaded "}

                    {new Date(
                      resume.createdAt
                    ).toLocaleDateString()}
                  </p>

                </div>

                {/* FILE TYPE */}

                <span className="resume-file-type">
                  {resume.fileType ===
                  "application/pdf"
                    ? "PDF"
                    : "DOC"}
                </span>

                {/* ACTION BUTTONS */}

                <div className="resume-card-actions">

                  <button
                    className="resume-view-button"
                    onClick={() =>
                      handleViewResume(resume)
                    }
                  >
                    View
                  </button>

                  {!resume.isActive && (
                    <button
                      className="set-active-button"
                      onClick={() =>
                        handleSetActive(
                          resume._id
                        )
                      }
                      disabled={
                        activatingId ===
                        resume._id
                      }
                    >
                      {activatingId ===
                      resume._id
                        ? "Setting..."
                        : "Set Active"}
                    </button>
                  )}

                  <button
                    className="resume-delete-button"
                    onClick={() =>
                      handleDelete(resume._id)
                    }
                    disabled={
                      deletingId === resume._id
                    }
                  >
                    {deletingId === resume._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* AI INFO */}

      <div className="resume-info-card">

        <div className="resume-info-icon">
          ✦
        </div>

        <div>
          <h3>AI Resume Analysis</h3>

          <p>
            Soon, CareerOS will analyze your resume
            against job descriptions and help you
            identify missing skills, keywords and
            improvement opportunities.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Resume;