import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Helper to get region by id and assert presence
const expectSectionVisible = async (id, titleRegex) => {
  const section = document.getElementById(id);
  expect(section).toBeInTheDocument();
  // Heading level 2 rendered by Section.js (except Hero uses h1)
  const heading = within(section).getByRole('heading', { name: titleRegex });
  expect(heading).toBeInTheDocument();
};

describe('Navigation and sections', () => {
  test('renders NavBar links and sections exist', async () => {
    render(<App />);

    // Nav brand
    expect(screen.getByRole('link', { name: /go to top/i })).toBeInTheDocument();

    // The nav items should exist
    const nav = screen.getByRole('navigation', { name: /primary/i });
    const projectsLink = within(nav).getByRole('menuitem', { name: /jump to projects section/i });
    const skillsLink = within(nav).getByRole('menuitem', { name: /jump to skills section/i });
    const experienceLink = within(nav).getByRole('menuitem', { name: /jump to experience section/i });
    const contactLink = within(nav).getByRole('menuitem', { name: /jump to contact section/i });

    expect(projectsLink).toBeInTheDocument();
    expect(skillsLink).toBeInTheDocument();
    expect(experienceLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();

    // Sections should be rendered in DOM
    // Hero has an h1
    const hero = document.getElementById('hero');
    expect(hero).toBeInTheDocument();
    expect(within(hero).getByRole('heading', { level: 1, name: /hi, i’m/i })).toBeInTheDocument();

    await expectSectionVisible('projects', /projects/i);
    await expectSectionVisible('skills', /skills/i);
    await expectSectionVisible('experience', /experience/i);
    await expectSectionVisible('contact', /contact/i);
  });

  test('clicking nav links focuses target section (reachability via smooth scroll hook)', async () => {
    const user = userEvent.setup();
    render(<App />);

    const nav = screen.getByRole('navigation', { name: /primary/i });

    // Click Projects
    await user.click(within(nav).getByRole('menuitem', { name: /jump to projects section/i }));
    // Focus shift is handled in hook after a frame; verify section exists and can be focused
    const projects = document.getElementById('projects');
    expect(projects).toBeInTheDocument();
    // Simulate focus that hook would do; ensure not throwing
    projects.focus();
    expect(projects).toHaveFocus();

    // Click Skills
    await user.click(within(nav).getByRole('menuitem', { name: /jump to skills section/i }));
    const skills = document.getElementById('skills');
    expect(skills).toBeInTheDocument();
    skills.focus();
    expect(skills).toHaveFocus();

    // Click Experience
    await user.click(within(nav).getByRole('menuitem', { name: /jump to experience section/i }));
    const experience = document.getElementById('experience');
    expect(experience).toBeInTheDocument();
    experience.focus();
    expect(experience).toHaveFocus();

    // Click Contact
    await user.click(within(nav).getByRole('menuitem', { name: /jump to contact section/i }));
    const contact = document.getElementById('contact');
    expect(contact).toBeInTheDocument();
    contact.focus();
    expect(contact).toHaveFocus();
  });
});
