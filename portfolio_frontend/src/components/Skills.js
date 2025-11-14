import React from "react";
import Section from "./Section";

/**
 * PUBLIC_INTERFACE
 * Skills - highlights core technologies and tools.
 */
export default function Skills() {
  const skills = {
    "Frontend": ["React", "TypeScript", "Redux", "CSS Modules"],
    "Backend": ["Node.js", "Express", "REST", "GraphQL"],
    "DevOps": ["Docker", "GitHub Actions", "Vercel/Netlify"],
  };

  return (
    <Section id="skills" title="Skills" description="Technologies I use to craft performant and accessible web applications.">
      <div className="skills">
        {Object.entries(skills).map(([group, items]) => (
          <div className="skill-group" key={group}>
            <h3 className="skill-title">{group}</h3>
            <ul className="skill-list">
              {items.map((s) => <li key={s} className="skill-item">{s}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
