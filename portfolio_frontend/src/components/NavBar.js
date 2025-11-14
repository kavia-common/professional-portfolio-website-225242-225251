import React from "react";
import PropTypes from "prop-types";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { useScrollSpy } from "../hooks/useScrollSpy";

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
  const activeId = useScrollSpy({ sectionSelector: "section[id]", offset: 72 });

  const handleNav = (e, id) => {
    e.preventDefault();
    scrollToId(id);
  };

  const isActive = (id) => activeId === id;

  return (
    <nav className="navbar" role="navigation" aria-label="Primary">
      <div className="container navbar-inner">
        <a
          href="#hero"
          className="brand"
          onClick={(e) => handleNav(e, "hero")}
          aria-label="Go to top"
        >
          <span className="brand-accent">{"<"}</span>Portfolio<span className="brand-accent">{"/>"}</span>
        </a>
        <ul className="nav-links" role="menubar" aria-label="Primary navigation">
          <li role="none">
            <a
              href="#projects"
              role="menuitem"
              onClick={(e) => handleNav(e, "projects")}
              className={isActive("projects") ? "active" : undefined}
              aria-current={isActive("projects") ? "page" : undefined}
              aria-label="Jump to Projects section"
            >
              Projects
            </a>
          </li>
          <li role="none">
            <a
              href="#skills"
              role="menuitem"
              onClick={(e) => handleNav(e, "skills")}
              className={isActive("skills") ? "active" : undefined}
              aria-current={isActive("skills") ? "page" : undefined}
              aria-label="Jump to Skills section"
            >
              Skills
            </a>
          </li>
          <li role="none">
            <a
              href="#experience"
              role="menuitem"
              onClick={(e) => handleNav(e, "experience")}
              className={isActive("experience") ? "active" : undefined}
              aria-current={isActive("experience") ? "page" : undefined}
              aria-label="Jump to Experience section"
            >
              Experience
            </a>
          </li>
          <li role="none">
            <a
              href="#contact"
              role="menuitem"
              onClick={(e) => handleNav(e, "contact")}
              className={isActive("contact") ? "active" : undefined}
              aria-current={isActive("contact") ? "page" : undefined}
              aria-label="Jump to Contact section"
            >
              Contact
            </a>
          </li>
        </ul>
        <button
          className="btn theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${currentTheme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${currentTheme === "light" ? "dark" : "light"} mode`}
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
