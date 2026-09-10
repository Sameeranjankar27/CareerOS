import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function AIInterviewPrep() {
  const { token } = useAuth();

  const [jobDescription, setJobDescription] = useState("");
  const [preparation, setPreparation] = useState(null);
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPreparation(null);

      const response = await api.post(
        "/ai-interview/generate",
        {
          jobDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPreparation(response.data.preparation);
      setResume(response.data.resume);
    } catch (error) {
      console.error(
        "Interview Preparation Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to generate interview preparation."
      );
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyClass = (difficulty) => {
    if (difficulty === "Easy") {
      return "difficulty-easy";
    }

    if (difficulty === "Medium") {
      return "difficulty-medium";
    }

    return "difficulty-hard";
  };

  return (
    <div className="ai-interview-page">

      {/* HEADER */}

      <div className="ai-interview-header">

        <div className="ai-interview-title-row">

          <div className="ai-interview-title-icon">
            ?
          </div>

          <div>
            <h1>AI Interview Prep</h1>

            <p>
              Prepare for your next interview with
              personalized questions and topics.
            </p>
          </div>

        </div>

      </div>


      {/* INPUT */}

      <div className="interview-input-card">

        <div className="interview-card-header">

          <div>
            <h2>
              Job Description
            </h2>

            <p>
              Paste the job description to generate
              personalized interview preparation.
            </p>
          </div>

          <span className="interview-step-badge">
            Step 1
          </span>

        </div>


        <textarea
          className="interview-job-input"
          placeholder="Paste the complete job description here..."
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(e.target.value)
          }
        />


        <div className="interview-input-footer">

          <span>
            {jobDescription.length} characters
          </span>

          <button
            className="generate-interview-button"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="interview-spinner"></span>
                Preparing...
              </>
            ) : (
              <>
                ✦ Generate Interview Prep
              </>
            )}
          </button>

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="error-message interview-error">
          {error}
        </div>
      )}


      {/* LOADING */}

      {loading && (
        <div className="interview-loading-card">

          <div className="interview-loading-icon">
            ✦
          </div>

          <h3>
            Preparing your interview...
          </h3>

          <p>
            CareerOS is creating questions based on
            your resume and the job description.
          </p>

        </div>
      )}


      {/* RESULTS */}

      {preparation && !loading && (
        <div className="interview-results">

          {/* RESULT HEADER */}

          <div className="interview-result-header">

            <div>

              <span className="interview-result-label">
                PREPARATION READY
              </span>

              <h2>
                {preparation.role ||
                  "Interview Preparation"}
              </h2>

              {resume && (
                <p>
                  Based on{" "}
                  <strong>
                    {resume.name}
                  </strong>
                </p>
              )}

            </div>

            <div className="interview-ready-badge">
              ✦ Ready
            </div>

          </div>


          {/* OVERVIEW */}

          <div className="interview-overview-card">

            <div className="interview-overview-icon">
              ✦
            </div>

            <div>

              <h3>
                Preparation Overview
              </h3>

              <p>
                {preparation.overview}
              </p>

            </div>

          </div>


          {/* TECHNICAL QUESTIONS */}

          <div className="interview-section-card">

            <div className="interview-section-header">

              <div>

                <div className="interview-section-title">

                  <span className="section-title-icon">
                    #
                  </span>

                  <div>
                    <h2>
                      Technical Questions
                    </h2>

                    <p>
                      Questions you should be ready
                      to answer technically.
                    </p>
                  </div>

                </div>

              </div>

              <span className="question-count">
                {preparation.technicalQuestions?.length ||
                  0}{" "}
                Questions
              </span>

            </div>


            <div className="technical-question-list">

              {preparation.technicalQuestions?.map(
                (item, index) => (

                  <div
                    className="technical-question"
                    key={index}
                  >

                    <div className="question-number">
                      {index + 1}
                    </div>

                    <div className="question-content">

                      <div className="question-top-row">

                        <span className="question-topic">
                          {item.topic}
                        </span>

                        <span
                          className={`question-difficulty ${getDifficultyClass(
                            item.difficulty
                          )}`}
                        >
                          {item.difficulty}
                        </span>

                      </div>

                      <h3>
                        {item.question}
                      </h3>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>


          {/* BEHAVIORAL QUESTIONS */}

          <div className="interview-section-card">

            <div className="interview-section-title">

              <span className="section-title-icon">
                ♟
              </span>

              <div>
                <h2>
                  Behavioral Questions
                </h2>

                <p>
                  Prepare clear stories and examples
                  for these questions.
                </p>
              </div>

            </div>


            <div className="behavioral-question-list">

              {preparation.behavioralQuestions?.map(
                (item, index) => (

                  <div
                    className="behavioral-question"
                    key={index}
                  >

                    <span className="behavioral-number">
                      {index + 1}
                    </span>

                    <span>
                      {item.question}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>


          {/* PREPARATION TOPICS */}

          <div className="interview-section-card">

            <div className="interview-section-title">

              <span className="section-title-icon">
                📚
              </span>

              <div>
                <h2>
                  Preparation Topics
                </h2>

                <p>
                  Key areas to revise before your interview.
                </p>
              </div>

            </div>


            <div className="preparation-topic-grid">

              {preparation.preparationTopics?.map(
                (topic, index) => (

                  <div
                    className="preparation-topic"
                    key={index}
                  >

                    <span>
                      ✓
                    </span>

                    <span>
                      {topic}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>


          {/* TIPS */}

          <div className="interview-tips-card">

            <div className="interview-tips-title">

              <span>
                💡
              </span>

              <div>

                <h2>
                  Interview Tips
                </h2>

                <p>
                  Keep these things in mind during
                  your preparation.
                </p>

              </div>

            </div>


            <div className="interview-tips-list">

              {preparation.tips?.map(
                (tip, index) => (

                  <div
                    className="interview-tip"
                    key={index}
                  >

                    <span className="tip-number">
                      {index + 1}
                    </span>

                    <span>
                      {tip}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>


          {/* GENERATE AGAIN */}

          <div className="generate-again-card">

            <div>

              <h3>
                Preparing for another role?
              </h3>

              <p>
                Paste another job description and
                generate a fresh preparation plan.
              </p>

            </div>

            <button
              onClick={() => {
                setPreparation(null);
                setResume(null);
                setError("");

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              Prepare for Another Job
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default AIInterviewPrep;