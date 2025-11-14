import React from "react";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

/**
 * PUBLIC_INTERFACE
 * Hero - Intro section with title, subtitle, and CTA to Projects.
 */
export default function Hero() {
  const { scrollToId } = useSmoothScroll({ offset: 72 });

  return (
    <section id="hero" className="hero" aria-label="Introduction">
      <div className="container hero-inner">
        <div className="hero-text">
          <h1 className="title">
            Hi, I’m <span className="highlight">Your Name</span>
          </h1>
          <p className="subtitle">
            Building modern web experiences with React, TypeScript, and Node.js.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary" onClick={(e) => { e.preventDefault(); scrollToId("projects"); }}>
              View Projects
            </a>
            <a href="#contact" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); scrollToId("contact"); }}>
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
