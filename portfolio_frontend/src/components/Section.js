import React from "react";
import PropTypes from "prop-types";

/**
 * PUBLIC_INTERFACE
 * Section - shared wrapper that provides anchor id, heading, and consistent spacing.
 *
 * Props:
 * - id: anchor id for navigation
 * - title: section title (rendered as h2)
 * - children: section content
 * - description: optional short description
 */
export default function Section({ id, title, description, children }) {
  const labelledBy = `${id}-title`;
  const describedBy = description ? `${id}-desc` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className="section"
      role="region"
      tabIndex="-1"
    >
      <div className="container">
        <header className="section-header">
          <h2 id={labelledBy} className="section-title">
            {title}
          </h2>
          {description ? (
            <p id={describedBy} className="section-description">
              {description}
            </p>
          ) : null}
        </header>
        <div className="section-content">{children}</div>
      </div>
    </section>
  );
}

Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
};
