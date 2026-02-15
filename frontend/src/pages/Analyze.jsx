// Analyze.jsx
import "./Analyze.css";
import { useState, useRef } from "react";
import {
  FaCloudUploadAlt,
  FaRobot,
  FaCogs,
  FaArrowLeft,
  FaDownload,
  FaCopy,
  FaFileAlt,
  FaHashtag,
  FaLink,
  FaCheck,
  FaChartLine,
} from "react-icons/fa";

// Metric Card Component
const MetricCard = ({ title, value, icon, color }) => (
  <div className={`metric-card ${color}`}>
    <div className="icon">{icon}</div>
    <div className="title">{title}</div>
    <div className="value">{value}</div>
  </div>
);

const Analyze = () => {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("rule");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [result, setResult] = useState("");
  const [metricsData, setMetricsData] = useState([]);

  const fileInputRef = useRef();

  // --- Reset all states (Start New Analysis) ---
  const resetAnalysis = () => {
    setFile(null);
    setError("");
    setExtractedText("");
    setResult("");
    setMetricsData([]);
  };

  // --- File Handling ---
  const handleFile = (selectedFile) => {
    setError("");
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Unsupported file type. Please upload PDF, DOCX, or image.");
      return;
    }

    resetAnalysis(); // Clear previous analysis on new file upload
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  // --- Analyze File ---
  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a file first.");
      return;
    }

    setLoading(true);
    setError("");
    setExtractedText("");
    setResult("");
    setMetricsData([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", mode);

      const response = await fetch("http://127.0.0.1:8000/analyze/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Analysis failed");
      }

      const data = await response.json();

      setExtractedText(data.analysis.result || "Text extracted successfully.");

      if (data.analysis.analysis_type === "rule-based") {
        const metrics = data.analysis.metrics;
        const engagement = data.analysis.engagement_score;

        setMetricsData([
          { title: "Engagement Score", value: engagement + "/100", icon: <FaChartLine />, color: "purple" },
          { title: "Word Count", value: metrics.word_count, icon: <FaFileAlt />, color: "blue" },
          { title: "Hashtags", value: metrics.hashtag_count, icon: <FaHashtag />, color: "green" },
          { title: "URLs", value: metrics.url_count, icon: <FaLink />, color: "orange" },
          { title: "CTA Present", value: metrics.cta_present ? "Yes" : "No", icon: <FaCheck />, color: "teal" },
        ]);

        const suggestions = data.analysis.suggestions.join("\n- ");
        setResult(`Suggestions:\n- ${suggestions}`);
      } else {
        setMetricsData([]);
        setResult(`AI Analysis:\n${data.analysis.result}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Back Button ---
  const handleBack = () => window.history.back();

  // --- Download Function ---
  const handleDownload = (text, filename) => {
    if (!text) return;
    const element = document.createElement("a");
    const fileBlob = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
  };

  // --- Copy to Clipboard ---
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
  };

  return (
    <div className="analyze-page">
      <div className="header">
        <button className="back-btn" onClick={handleBack}>
          <FaArrowLeft /> Back
        </button>
        <h1 className="analyze-title">Content Analyzer</h1>
      </div>

      {/* MODE TOGGLE */}
      <div className="mode-toggle">
        <button className={mode === "rule" ? "active" : ""} onClick={() => setMode("rule")}>
          <FaCogs /> Rule-Based
        </button>
        <button className={mode === "ai" ? "active" : ""} onClick={() => setMode("ai")}>
          <FaRobot /> AI Mode
        </button>
      </div>

      {/* Start New Analysis */}
      <button className="new-analysis-btn" onClick={resetAnalysis}>
        Start New Analysis
      </button>

      {/* UPLOAD SECTION */}
      <div
        className="upload-box"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <FaCloudUploadAlt className="upload-icon" />
        <p>Drag & Drop PDF, DOCX or Image here</p>
        <span>or click to browse</span>

        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept=".pdf,.docx,image/*"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {file && <div className="file-info">Selected File: <strong>{file.name}</strong></div>}
      {error && <div className="error">{error}</div>}

      {/* ANALYZE BUTTON */}
      <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
        {loading ? "Processing..." : "Analyze Content"}
      </button>

      {/* METRICS DASHBOARD */}
      {metricsData.length > 0 && (
        <div className="metrics-dashboard">
          {metricsData.map((metric, idx) => (
            <MetricCard key={idx} {...metric} />
          ))}
        </div>
      )}

      {/* EXTRACTED TEXT */}
      {extractedText && (
        <div className="text-preview card">
          <h3>Extracted Text</h3>
          <pre>{extractedText}</pre>
          <button className="download-btn" onClick={() => handleDownload(extractedText, "extracted_text.txt")}>
            <FaDownload /> Download Text
          </button>
          <button className="copy-btn" onClick={() => copyToClipboard(extractedText)}>
            <FaCopy /> Copy Text
          </button>
        </div>
      )}

      {/* RESULT / SUGGESTIONS */}
      {result && (
        <div className="result-box card">
          <h3>Analysis Suggestions</h3>
          <pre>{result}</pre>
          <button className="download-btn" onClick={() => handleDownload(result, "analysis_result.txt")}>
            <FaDownload /> Download Result
          </button>
          <button className="copy-btn" onClick={() => copyToClipboard(result)}>
            <FaCopy /> Copy Result
          </button>
        </div>
      )}
    </div>
  );
};

export default Analyze;
