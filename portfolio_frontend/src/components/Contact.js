import React, { useState, useRef } from "react";
import Section from "./Section";
import { getEnv } from "../config/env";

/**
 * PUBLIC_INTERFACE
 * Contact - accessible contact form with client-side validation and env-driven submission.
 *
 * Behavior:
 * - Validates name, email, and message on client.
 * - If env.apiBase is defined, POSTs JSON to `${apiBase}/contact`.
 * - If no apiBase, gracefully falls back to a mailto: flow with user guidance.
 * - No secrets are hardcoded; no PII is logged.
 */
export default function Contact() {
  const env = getEnv();

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Local state to manage values for validation and potential mailto fallback
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  // Simple email pattern adequate for UI validation (server must re-validate)
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const name = values.name.trim();
    const email = values.email.trim();
    const message = values.message.trim();

    if (!name) {
      setError("Please enter your name.");
      setStatus("");
      nameRef.current?.focus();
      return false;
    }
    if (!email || !emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setStatus("");
      emailRef.current?.focus();
      return false;
    }
    if (!message || message.length < 10) {
      setError("Please provide a message (at least 10 characters).");
      setStatus("");
      messageRef.current?.focus();
      return false;
    }

    setError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    };

    // Do not log payload or PII
    setSubmitting(true);
    setStatus("Sending…");
    setError("");

    const apiBase = env.apiBase;
    if (apiBase) {
      // Attempt JSON POST to `${apiBase}/contact`
      try {
        const res = await fetch(`${apiBase}/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Only send strictly necessary fields; server must perform validation.
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          // Avoid exposing server details; provide a generic message.
          throw new Error(`Request failed with ${res.status}`);
        }

        // Try parse JSON best-effort; ignore body if invalid
        try {
          await res.json();
        } catch {
          // ignore parse errors silently
        }

        setStatus("Thank you! Your message has been sent successfully.");
        setError("");
        setValues({ name: "", email: "", message: "" });
        nameRef.current?.focus();
      } catch (_err) {
        // Avoid leaking details; user-facing, friendly message
        setError("We couldn't submit your message right now. Please try again later or use the email option below.");
        setStatus("");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Fallback: mailto guidance
    try {
      // Build a safe mailto link; no secrets hardcoded.
      // Replace with your public contact email before deploying.
      const publicEmail = "you@example.com"; // Non-secret, illustrative placeholder
      const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`);
      const body = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`);
      const href = `mailto:${publicEmail}?subject=${subject}&body=${body}`;

      // In environments without an API, provide explicit guidance and a mailto action.
      setStatus("No contact API configured. You can send your message via your email client using the button below.");
      setError("");
      // Do not auto-navigate user; instead, render a visible email action.
      // We keep submitting=false so the user can click the email button.
    } catch {
      setError("Unable to prepare email fallback. Please copy your message and email me directly.");
      setStatus("");
    } finally {
      setSubmitting(false);
    }
  };

  // Build mailto href for fallback button (computed each render, safe encodes)
  const mailtoHref = (() => {
    const name = values.name.trim();
    const email = values.email.trim();
    const message = values.message.trim();
    const publicEmail = "you@example.com"; // Non-secret placeholder; replace in deployment
    const subject = encodeURIComponent(name ? `Portfolio contact from ${name}` : "Portfolio contact");
    const bodyPrefix = (name || email) ? `Name: ${name || "(not provided)"}\nEmail: ${email || "(not provided)"}\n\n` : "";
    const body = encodeURIComponent(`${bodyPrefix}${message || ""}`);
    return `mailto:${publicEmail}?subject=${subject}&body=${body}`;
  })();

  return (
    <Section id="contact" title="Contact" description="Interested in working together? Send a message.">
      <form className="form" onSubmit={onSubmit} aria-label="Contact form" noValidate>
        <div className="form-row">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            required
            placeholder="Your name"
            value={values.name}
            onChange={handleChange}
            ref={nameRef}
            aria-invalid={Boolean(error && !values.name.trim())}
          />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            ref={emailRef}
            aria-invalid={Boolean(error && (!values.email.trim() || !emailPattern.test(values.email.trim())))}
          />
        </div>
        <div className="form-row">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            placeholder="Tell me about your project..."
            value={values.message}
            onChange={handleChange}
            ref={messageRef}
            aria-invalid={Boolean(error && (!values.message.trim() || values.message.trim().length < 10))}
          />
        </div>
        <div className="form-actions" style={{ gap: "0.5rem" }}>
          <button
            className="btn btn-primary"
            type="submit"
            aria-label="Send message"
            disabled={submitting}
          >
            {submitting ? "Sending…" : "Send"}
          </button>
          {!env.apiBase && (
            <a
              className="btn btn-outline"
              href={mailtoHref}
              aria-label="Open your email client to send this message"
            >
              Email Instead
            </a>
          )}
        </div>

        {/* Live regions for accessible status and error messaging */}
        {status ? (
          <div role="status" aria-live="polite" className="form-status">
            {status}
          </div>
        ) : null}
        {error ? (
          <div role="alert" aria-live="assertive" className="form-status" style={{ color: "var(--error)" }}>
            {error}
          </div>
        ) : null}
      </form>
    </Section>
  );
}
