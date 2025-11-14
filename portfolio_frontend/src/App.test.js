import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navbar brand', () => {
  render(<App />);
  const brand = screen.getByRole('link', { name: /portfolio/i });
  expect(brand).toBeInTheDocument();
});

test('renders hero title', () => {
  render(<App />);
  const title = screen.getByRole('heading', { level: 1, name: /hi, i’m/i });
  expect(title).toBeInTheDocument();
});
