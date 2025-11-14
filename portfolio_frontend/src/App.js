import React from 'react';
import './App.css';
import { useTheme } from './hooks/useTheme';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';

/**
 * PUBLIC_INTERFACE
 * App - Portfolio single-page application root.
 * Renders themed layout with smooth-scrolling sections.
 */
function App() {
  const { theme, toggleTheme } = useTheme('light');

  return (
    <div className="App">
      <a href="#main" className="skip-link">Skip to content</a>
      <NavBar onToggleTheme={toggleTheme} currentTheme={theme} />
      <main id="main" className="main">
        <Hero />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <footer className="footer" role="contentinfo">
        <div className="container footer-inner">
          <span className="muted">© {new Date().getFullYear()} Your Name</span>
          <span className="muted">Built with React</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
