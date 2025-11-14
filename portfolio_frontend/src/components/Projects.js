import React from "react";
import Section from "./Section";

/**
 * PUBLIC_INTERFACE
 * Projects - showcases selected projects.
 * Placeholder content to be replaced with real data later.
 */
export default function Projects() {
  const projects = [
    { title: "Project One", description: "A modern web application built with React and Node.js." },
    { title: "Project Two", description: "A scalable API service with robust tests and CI/CD." },
    { title: "Project Three", description: "A data visualization dashboard using D3 and React." },
  ];

  return (
    <Section id="projects" title="Projects" description="Selected work highlighting problem solving and craftsmanship.">
      <div className="grid cards">
        {projects.map((p) => (
          <article key={p.title} className="card" aria-label={p.title}>
            <div className="card-body">
              <h3 className="card-title">{p.title}</h3>
              <p className="card-text">{p.description}</p>
              <div className="card-actions">
                <button className="btn btn-outline" type="button" aria-label={`Open ${p.title} details`}>Details</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
