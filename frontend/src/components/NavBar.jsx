import "./NavBar.css";
import { useState } from "react";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const NavBar = ({ theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Smooth scroll for sections
  const scrollToSection = (id, e) => {
    e.preventDefault(); // Prevent default link behavior
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false); // Close mobile menu if open
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo-circle">E</div>
          <span className="brand">Engagio</span>
        </div>

        {/* Desktop Menu */}
        <div className="nav-links desktop-only">
          <Link to="/">Home</Link>
          <Link to="/#features" onClick={(e) => scrollToSection("features", e)}>Features</Link>
          <Link to="/#workflow" onClick={(e) => scrollToSection("workflow", e)}>How it Works</Link>
          <Link to="/analyze">Analyze</Link>

          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="hamburger mobile-only" onClick={() => setMenuOpen(true)}>
          <FaBars />
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-header">
              <div className="mobile-brand">
                <div className="logo-circle">E</div>
                <span>Engagio</span>
              </div>
              <FaTimes className="close-icon" onClick={() => setMenuOpen(false)} />
            </div>

            <div className="mobile-links">
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/#features" onClick={(e) => scrollToSection("features", e)}>Features</Link>
              <Link to="/#workflow" onClick={(e) => scrollToSection("workflow", e)}>How it Works</Link>
              <Link to="/analyze" onClick={() => setMenuOpen(false)}>Analyze</Link>
            </div>

            <div className="mobile-theme">
              <span>Appearance</span>
              <button onClick={toggleTheme} className="theme-btn">
                {theme === "dark" ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
