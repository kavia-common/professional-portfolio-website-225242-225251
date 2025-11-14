import React from "react";
import Section from "./Section";

/**
 * PUBLIC_INTERFACE
 * Experience - work history in a simple timeline/list.
 */
export default function Experience() {
  const roles = [
    { company: "Tech Corp", role: "Senior Frontend Engineer", period: "2023 — Present", summary: "Lead UI developer building design systems and performance-focused SPA features." },
    { company: "Startup Inc.", role: "Full-stack Engineer", period: "2021 — 2023", summary: "Delivered end-to-end features across React, Node.js, and PostgreSQL." },
  ];

  return (
    <Section id="experience" title="Experience" description="A quick look at my professional journey.">
      <ul className="timeline" aria-label="Work History">
        {roles.map((r) => (
          <li className="timeline-item" key={`${r.company}-${r.role}`}>
            <div className="timeline-marker" aria-hidden="true" />
            <div className="timeline-content">
              <h3 className="timeline-title">{r.role} · <span className="muted">{r.company}</span></h3>
              <span className="timeline-period">{r.period}</span>
              <p className="timeline-summary">{r.summary}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
