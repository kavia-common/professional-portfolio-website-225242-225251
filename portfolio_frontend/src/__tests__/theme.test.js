import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Theme toggle', () => {
  beforeEach(() => {
    // Reset storage and document attribute before each test
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  test('initial theme sets data-theme and toggles to dark then persists', async () => {
    const user = userEvent.setup();

    render(<App />);

    // useTheme defaultTheme = "light", so data-theme should be "light"
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    const toggleBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(toggleBtn).toBeInTheDocument();

    await user.click(toggleBtn);

    // After toggle, theme should be dark
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');

    // Re-render app to simulate reload, it should read from localStorage
    // Note: jsdom keeps localStorage across renders in same test
    render(<App />);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('toggling back to light updates storage', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toDark = screen.getByRole('button', { name: /switch to dark mode/i });
    await user.click(toDark);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');

    const toLight = screen.getByRole('button', { name: /switch to light mode/i });
    await user.click(toLight);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(window.localStorage.getItem('theme')).toBe('light');
  });
});
