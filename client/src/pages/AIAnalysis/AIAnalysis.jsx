import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function AIAnalysis() {
  const { token } = useAuth();
  const location = useLocation();

  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const [analysis, setAnalysis] = useState(null);
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD JOB DATA FROM JOBS PAGE
  // ==========================================

  useEffect(() => {
    const jobData = location.state;

    if (jobData) {
      setJobDescription(
        jobData.jobDescription || ""
      );

      setCompany(jobData.company || "");
      setRole(jobData.role || "");
    }
  }, [location.state]);

  // ==========================================
  // ANALYZE RESUME
  // ==========================================

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError(
        "Please enter a job description first."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const response = await api.post(
        "/ai/resume-vs-job",
        {
          jobDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(response.data.analysis);
      setResume(response.data.resume);

    } catch (error) {
      console.error(
        "AI Analysis Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to analyze resume. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SCORE CLASS
  // ==========================================

  const getScoreClass = (score) => {
    if (score >= 80) {
      return "score-high";
    }

    if (score >= 60) {
      return "score-medium";
    }

    return "score-low";
  };

  // ==========================================
  // CLEAR ANALYSIS
  // ==========================================

  const handleAnalyzeAnother = () => {
    setJobDescription("");
    setCompany("");
    setRole("");
    setAnalysis(null);
    setResume(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="ai-analysis-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="ai-analysis-header">

        <div className="ai-title-row">

          <div className="ai-title-icon">
            ✦
          </div>

          <div>

            <h1>
              AI Resume Analysis
            </h1>

            <p>
              Compare your active resume with a job
              description and discover how well you match.
            </p>

          </div>

        </div>

      </div>


      {/* ==========================================
          SELECTED JOB
      ========================================== */}

      {(company || role) && (
        <div className="ai-selected-job-card">

          <div className="ai-selected-job-icon">
            💼
          </div>

          <div>

            <span>
              ANALYZING JOB APPLICATION
            </span>

            <h2>
              {role || "Job Role"}
            </h2>

            {company && (
              <p>
                {company}
              </p>
            )}

          </div>

        </div>
      )}


      {/* ==========================================
          JOB DESCRIPTION
      ========================================== */}

      <div className="ai-input-card">

        <div className="ai-card-header">

          <div>

            <h2>
              Job Description
            </h2>

            <p>
              Paste the job description you want to
              analyze against your active resume.
            </p>

          </div>

          <span className="ai-step-badge">
            Step 1
          </span>

        </div>


        <textarea
          className="job-description-input"
          placeholder="Paste the complete job description here..."
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(e.target.value)
          }
        />


        <div className="ai-input-footer">

          <span>
            {jobDescription.length} characters
          </span>

          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="button-spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                ✦ Analyze Resume
              </>
            )}

          </button>

        </div>

      </div>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="error-message ai-error">
          {error}
        </div>
      )}


      {/* ==========================================
          LOADING
      ========================================== */}

      {loading && (
        <div className="ai-loading-card">

          <div className="ai-loading-icon">
            ✦
          </div>

          <h3>
            Analyzing your resume...
          </h3>

          <p>
            CareerOS is comparing your resume with the
            job requirements.
          </p>

        </div>
      )}


      {/* ==========================================
          RESULTS
      ========================================== */}

      {analysis && !loading && (
        <div className="ai-results">

          {/* RESULT HEADER */}

          <div className="ai-result-header">

            <div>

              <span className="ai-result-label">
                ANALYSIS COMPLETE
              </span>

              <h2>
                Resume Match Analysis
              </h2>

              {resume && (
                <p>
                  Analyzed against{" "}
                  <strong>
                    {resume.name}
                  </strong>
                </p>
              )}

            </div>

            <div
              className={`match-score-circle ${getScoreClass(
                analysis.matchScore
              )}`}
            >

              <span>
                {analysis.matchScore}%
              </span>

              <small>
                Match
              </small>

            </div>

          </div>


          {/* SUMMARY */}

          <div className="ai-summary-card">

            <div className="ai-section-icon">
              ✦
            </div>

            <div>

              <h3>
                Overall Assessment
              </h3>

              <p>
                {analysis.summary}
              </p>

            </div>

          </div>


          {/* MATCHING + MISSING SKILLS */}

          <div className="ai-analysis-grid">

            {/* MATCHING */}

            <div className="ai-result-card">

              <div className="result-card-title">

                <div className="result-icon">
                  ✓
                </div>

                <div>

                  <h3>
                    Matching Skills
                  </h3>

                  <span>
                    Skills found in your resume
                  </span>

                </div>

              </div>


              <div className="tag-list">

                {analysis.matchingSkills?.map(
                  (skill, index) => (

                    <span
                      className="skill-tag matching-tag"
                      key={index}
                    >
                      ✓ {skill}
                    </span>

                  )
                )}

              </div>

            </div>


            {/* MISSING */}

            <div className="ai-result-card">

              <div className="result-card-title">

                <div className="result-icon">
                  !
                </div>

                <div>

                  <h3>
                    Missing Skills
                  </h3>

                  <span>
                    Skills mentioned in the job
                  </span>

                </div>

              </div>


              <div className="tag-list">

                {analysis.missingSkills?.map(
                  (skill, index) => (

                    <span
                      className="skill-tag missing-tag"
                      key={index}
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </div>

          </div>


          {/* KEYWORD GAPS */}

          <div className="ai-result-card full-width-card">

            <div className="result-card-title">

              <div className="result-icon">
                #
              </div>

              <div>

                <h3>
                  Keyword Gaps
                </h3>

                <span>
                  Keywords that could improve your resume match
                </span>

              </div>

            </div>


            <div className="tag-list">

              {analysis.keywordGaps?.map(
                (keyword, index) => (

                  <span
                    className="skill-tag keyword-tag"
                    key={index}
                  >
                    {keyword}
                  </span>

                )
              )}

            </div>

          </div>


          {/* STRENGTHS + IMPROVEMENTS */}

          <div className="ai-analysis-grid">

            {/* STRENGTHS */}

            <div className="ai-result-card">

              <div className="result-card-title">

                <div className="result-icon">
                  ★
                </div>

                <div>

                  <h3>
                    Your Strengths
                  </h3>

                  <span>
                    What already works in your resume
                  </span>

                </div>

              </div>


              <div className="result-list">

                {analysis.strengths?.map(
                  (strength, index) => (

                    <div
                      className="result-list-item"
                      key={index}
                    >

                      <span className="list-check">
                        ✓
                      </span>

                      <span>
                        {strength}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* IMPROVEMENTS */}

            <div className="ai-result-card">

              <div className="result-card-title">

                <div className="result-icon">
                  ↑
                </div>

                <div>

                  <h3>
                    Improvements
                  </h3>

                  <span>
                    Recommendations to improve your match
                  </span>

                </div>

              </div>


              <div className="result-list">

                {analysis.improvements?.map(
                  (improvement, index) => (

                    <div
                      className="result-list-item"
                      key={index}
                    >

                      <span className="list-arrow">
                        →
                      </span>

                      <span>
                        {improvement}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>


          {/* INTERVIEW TOPICS */}

          <div className="ai-result-card full-width-card">

            <div className="result-card-title">

              <div className="result-icon">
                ?
              </div>

              <div>

                <h3>
                  Interview Preparation Topics
                </h3>

                <span>
                  Topics you should prepare based on this job
                </span>

              </div>

            </div>


            <div className="interview-topic-list">

              {analysis.interviewTopics?.map(
                (topic, index) => (

                  <div
                    className="interview-topic"
                    key={index}
                  >

                    <span className="topic-number">
                      {index + 1}
                    </span>

                    <span>
                      {topic}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>


          {/* ANALYZE AGAIN */}

          <div className="ai-analyze-again">

            <div>

              <h3>
                Want to analyze another job?
              </h3>

              <p>
                Paste a different job description above
                and run the analysis again.
              </p>

            </div>

            <button
              onClick={handleAnalyzeAnother}
            >
              Analyze Another Job
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default AIAnalysis;