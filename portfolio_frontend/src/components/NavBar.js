import React from "react";
import PropTypes from "prop-types";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

/**
 * PUBLIC_INTERFACE
 * NavBar - Top navigation with anchor links and theme toggle.
 *
 * Props:
 * - onToggleTheme: function to toggle theme
 * - currentTheme: "light" | "dark"
 */
export default function NavBar({ onToggleTheme, currentTheme }) {
  const { scrollToId } = useSmoothScroll({ offset: 72 });

  const handleNav = (e, id) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Primary">
      <div className="container navbar-inner">
        <a href="#hero" className="brand" onClick={(e) => handleNav(e, "hero")} aria-label="Go to top">
          <span className="brand-accent">{"<"}</span>Portfolio<span className="brand-accent">{"/>"}</span>
        </a>
        <ul className="nav-links">
          <li><a href="#projects" onClick={(e) => handleNav(e, "projects")}>Projects</a></li>
          <li><a href="#skills" onClick={(e) => handleNav(e, "skills")}>Skills</a></li>
          <li><a href="#experience" onClick={(e) => handleNav(e, "experience")}>Experience</a></li>
          <li><a href="#contact" onClick={(e) => handleNav(e, "contact")}>Contact</a></li>
        </ul>
        <button
          className="btn theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${currentTheme === "light" ? "dark" : "light"} mode`}
        >
          {currentTheme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}

NavBar.propTypes = {
  onToggleTheme: PropTypes.func.isRequired,
  currentTheme: PropTypes.oneOf(["light", "dark"]).isRequired,
};
