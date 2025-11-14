import { render, screen } from '@testing-library/react';
import App from './App';

// Keep a small smoke test that aligns with the current UI and avoids duplication
test('App renders primary navigation and hero', () => {
  render(<App />);
  expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1, name: /hi, i’m/i })).toBeInTheDocument();
});
