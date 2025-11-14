import React, { useEffect, useState } from "react";
import Section from "./Section";

/**
 * PUBLIC_INTERFACE
 * Projects - showcases selected projects loaded from local JSON data.
 *
 * The component imports a JSON file (src/data/projects.json) and renders:
 * - title (string, required)
 * - description (string, required)
 * - tags (string[], optional)
 * - links (object with demo/repo keys, optional)
 * - image (string URL, optional)
 *
 * Graceful handling:
 * - If the JSON is empty or invalid, show a friendly placeholder message.
 * - Missing optional fields are simply omitted from the UI.
 */
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setStatus("loading");
      try {
        // Dynamic import allows code-splitting and ensures JSON is bundled.
        const data = await import("../data/projects.json");
        const items = Array.isArray(data.default) ? data.default : [];
        if (isMounted) {
          setProjects(items);
          setStatus("ready");
        }
      } catch (e) {
        if (process.env.REACT_APP_NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.error("[Projects] Failed to load projects.json", e);
        }
        if (isMounted) {
          setProjects([]);
          setStatus("error");
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const renderLinks = (links) => {
    if (!links || typeof links !== "object") return null;
    const demo = links.demo && String(links.demo).trim();
    const repo = links.repo && String(links.repo).trim();

    if (!demo && !repo) return null;

    return (
      <div className="card-actions">
        {demo ? (
          <a
            className="btn btn-primary"
            href={demo}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open live demo"
          >
            Live Demo
          </a>
        ) : null}
        {repo ? (
          <a
            className="btn btn-outline"
            href={repo}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open source code repository"
            style={{ marginLeft: demo ? "0.5rem" : 0 }}
          >
            Source
          </a>
        ) : null}
      </div>
    );
  };

  const renderTags = (tags) => {
    if (!Array.isArray(tags) || tags.length === 0) return null;
    return (
      <ul
        className="skill-list"
        aria-label="Project tags"
        style={{ marginTop: "0.5rem", marginBottom: "0.25rem" }}
      >
        {tags.map((t) => (
          <li key={t} className="skill-item">
            {t}
          </li>
        ))}
      </ul>
    );
  };

  const renderImage = (image, title) => {
    const src = image && String(image).trim();
    if (!src) return null;
    return (
      <img
        src={src}
        alt={`${title} preview`}
        style={{ width: "100%", height: "auto", aspectRatio: "16/9", objectFit: "cover" }}
      />
    );
  };

  const content = (() => {
    if (status === "loading") {
      return <p className="muted">Loading projects…</p>;
    }
    if (status === "error") {
      return (
        <p className="muted">
          Projects are temporarily unavailable. Please check back later.
        </p>
      );
    }
    if (!projects || projects.length === 0) {
      return (
        <p className="muted">
          No projects to display yet. Add entries to src/data/projects.json to populate this section.
        </p>
      );
    }

    return (
      <div className="grid cards">
        {projects.map((p, idx) => {
          const title = p?.title || `Untitled Project ${idx + 1}`;
          const description =
            p?.description || "No description provided for this project.";
          const tags = p?.tags;
          const links = p?.links;
          const image = p?.image;

          return (
            <article key={`${title}-${idx}`} className="card" aria-label={title}>
              {renderImage(image, title)}
              <div className="card-body">
                <h3 className="card-title">{title}</h3>
                <p className="card-text">{description}</p>
                {renderTags(tags)}
                {renderLinks(links)}
              </div>
            </article>
          );
        })}
      </div>
    );
  })();

  return (
    <Section
      id="projects"
      title="Projects"
      description="Selected work highlighting problem solving and craftsmanship."
    >
      {content}
    </Section>
  );
}
