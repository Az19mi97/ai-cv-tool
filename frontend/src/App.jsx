import { useState } from "react";
import "./App.css";
import { marked } from "marked";
import html2pdf from "html2pdf.js";

function App() {
  const [cvInput, setCvInput] = useState("");
  const [job, setJob] = useState("");

  const [cv, setCv] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const [view, setView] = useState("cv"); // cv | letter
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  marked.setOptions({ breaks: true });

  /** GENERATE BOTH **/
  const generate = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv: cvInput, job }),
      });

      const data = await res.json();

      setCv(data.cv || "");
      setCoverLetter(data.coverLetter || "");
      setHasGenerated(true);
      setView("cv");
    } catch (err) {
      setCv("Error: " + err.message);
    }

    setLoading(false);
  };

  /** IMPROVE BOTH **/
  const improveAgain = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv: `
Improve BOTH documents.

CV:
${cv}

COVER LETTER:
${coverLetter}

JOB:
${job}

Return JSON:
{
  "cv": "...",
  "coverLetter": "..."
}
          `,
          job: "",
        }),
      });

      const data = await res.json();

      setCv(data.cv || "");
      setCoverLetter(data.coverLetter || "");
    } catch (err) {
      setCv("Error: " + err.message);
    }

    setLoading(false);
  };

  /** PDF DOWNLOAD (ACTIVE VIEW ONLY) **/
  const downloadPDF = () => {
    const element = document.querySelector(".cv-output");
    if (!element) return;

    html2pdf()
      .set({
        margin: 0,
        filename:
          view === "cv" ? "AI-CV.pdf" : "AI-CoverLetter.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  const activeContent = view === "cv" ? cv : coverLetter;

  return (
    <div className="app">
      <div className="backgroundGlow" />

      <div className="container">
        <header>
          <h1>⚡ AI CV ENGINE</h1>
          <p>CV + Cover Letter Generator</p>
        </header>

        {/* INPUTS */}
        <div className="grid">
          <div className="card">
            <h2>Your CV</h2>
            <textarea
              value={cvInput}
              onChange={(e) => setCvInput(e.target.value)}
              placeholder="Paste your CV..."
            />
          </div>

          <div className="card">
            <h2>Job Description</h2>
            <textarea
              value={job}
              onChange={(e) => setJob(e.target.value)}
              placeholder="Paste job description..."
            />
          </div>
        </div>

        {/* GENERATE */}
        {!hasGenerated && (
          <button onClick={generate} disabled={loading || !cvInput || !job}>
            {loading ? "Generating..." : "⚡ Generate CV + Cover Letter"}
          </button>
        )}

        {/* OUTPUT */}
        {hasGenerated && (
          <div className="output">
            <h2>Result</h2>

            {/* SWIPE / TOGGLE */}
            <div className="toggle">
              <button
                className={view === "cv" ? "active" : ""}
                onClick={() => setView("cv")}
              >
                CV
              </button>

              <button
                className={view === "letter" ? "active" : ""}
                onClick={() => setView("letter")}
              >
                Cover Letter
              </button>
            </div>

            {/* ACTIVE DOCUMENT */}
            <div
              className="cv-output"
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{
                __html: marked.parse(activeContent),
              }}
            />

            {/* ACTIONS */}
            <div className="actions">
              <button onClick={downloadPDF} disabled={loading}>
                📄 Download PDF
              </button>

              <button onClick={improveAgain} disabled={loading}>
                🧠 Improve Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;