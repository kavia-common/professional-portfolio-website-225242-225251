import React, { useState } from "react";
import Section from "./Section";

/**
 * PUBLIC_INTERFACE
 * Contact - basic contact form (placeholder - no backend wired).
 *
 * Note: For integration, use env vars like:
 * - REACT_APP_API_BASE / REACT_APP_BACKEND_URL for API endpoint
 * Avoid hardcoding URLs. See .env.example for details.
 */
export default function Contact() {
  const [status, setStatus] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit handler: could POST to `${process.env.REACT_APP_API_BASE}/contact`
    setStatus("Thank you! Your message has been noted.");
  };

  return (
    <Section id="contact" title="Contact" description="Interested in working together? Send a message.">
      <form className="form" onSubmit={onSubmit} aria-label="Contact form">
        <div className="form-row">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required placeholder="Your name" />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
        <div className="form-row">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={4} required placeholder="Tell me about your project..." />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">Send</button>
        </div>
        {status ? <div role="status" className="form-status">{status}</div> : null}
      </form>
    </Section>
  );
}
