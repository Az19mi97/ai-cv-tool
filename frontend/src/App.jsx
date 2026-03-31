import { useState } from "react";
import "./App.css";
import { marked } from "marked";
import html2pdf from "html2pdf.js";

function App() {
  const [cv, setCv] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const downloadPDF = () => {
  const element = document.querySelector(".cv-output");

  if (!element) return;

  html2pdf()
    .set({
      margin: 10,
      filename: "AI-CV.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(element)
    .save();
};

  const generate = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, job }),
      });

      const data = await res.json();

      setResult(data.result || "");
    } catch (err) {
      setResult("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
  <div className="app">
    <div className="backgroundGlow" />

    <div className="container">
      <header>
        <h1>⚡ AI CV ENGINE</h1>
        <p>Optimize your CV with AI in seconds</p>
      </header>

      <div className="grid">
        <div className="card">
          <h2>Your CV</h2>
          <textarea
            placeholder="Paste your CV..."
            value={cv}
            onChange={(e) => setCv(e.target.value)}
          />
        </div>

        <div className="card">
          <h2>Job Description</h2>
          <textarea
            placeholder="Paste job description..."
            value={job}
            onChange={(e) => setJob(e.target.value)}
          />
        </div>
      </div>

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "⚡ Generate AI CV"}
      </button>

      {result && (
        <div className="output">
          <h2>Result</h2>

          {/* CV DISPLAY */}
          <div
            className="cv-output"
            dangerouslySetInnerHTML={{
              __html: marked.parse(result),
            }}
          />

          {/* ACTIONS */}
          <div className="actions">
            <button onClick={downloadPDF} disabled={!result}>
              📄 Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
export default App;