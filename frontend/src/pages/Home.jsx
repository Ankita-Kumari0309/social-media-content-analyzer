import "../pages/Home.css";
import { useState, useEffect } from "react";
import {
  FaCloudUploadAlt, FaRobot, FaChartLine,
  FaBrain, FaCogs, FaMagic, FaSearch, FaBolt
} from "react-icons/fa";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Home = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="home">

      {/* NAVBAR */}
      <NavBar theme={theme} toggleTheme={toggleTheme} />

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-left">
          <h1>Engagio</h1>
          <h2>Social Media Content Intelligence Platform</h2>
          <p>
            Transform content into insights.<br/>
            Optimize engagement.<br/>
            Scale impact intelligently.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Explore Platform</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="ai-core"><FaRobot /></div>

          <div className="floating f1"><FaCloudUploadAlt /></div>
          <div className="floating f2"><FaBrain /></div>
          <div className="floating f3"><FaChartLine /></div>
          <div className="floating f4"><FaBolt /></div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <h2 className="section-title">Platform Capabilities</h2>

        <div className="features-grid">
          <div className="feature-card"><FaCloudUploadAlt /><h3>Upload</h3><p>Secure ingestion</p></div>
          <div className="feature-card"><FaSearch /><h3>OCR</h3><p>Smart extraction</p></div>
          <div className="feature-card"><FaBrain /><h3>Intelligence</h3><p>AI analysis</p></div>
          <div className="feature-card"><FaChartLine /><h3>Metrics</h3><p>Engagement tracking</p></div>
          <div className="feature-card"><FaMagic /><h3>Optimization</h3><p>CTA boosting</p></div>
          <div className="feature-card"><FaCogs /><h3>Automation</h3><p>AI engine</p></div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="workflow" id="workflow">
        <h2 className="section-title">How It Works</h2>

        <div className="workflow-steps">
          <div className="step-card"><FaCloudUploadAlt /><span>Upload</span></div>
          <div className="step-card"><FaSearch /><span>Extract</span></div>
          <div className="step-card"><FaBrain /><span>Analyze</span></div>
          <div className="step-card"><FaMagic /><span>Improve</span></div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Home;
