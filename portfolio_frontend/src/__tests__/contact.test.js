import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Helper to find form controls
const getControls = () => {
  const form = screen.getByRole('form', { name: /contact form/i });
  const nameInput = within(form).getByLabelText(/name/i);
  const emailInput = within(form).getByLabelText(/email/i);
  const messageInput = within(form).getByLabelText(/message/i);
  const submitBtn = within(form).getByRole('button', { name: /send message/i });
  return { form, nameInput, emailInput, messageInput, submitBtn };
};

describe('Contact form validation and submission', () => {
  beforeEach(() => {
    // Clear any previous env and fetch mocks
    process.env.REACT_APP_API_BASE = '';
    global.fetch = undefined;
  });

  test('shows required field errors and email format validation', async () => {
    const user = userEvent.setup();
    render(<App />);

    const { submitBtn } = getControls();

    await user.click(submitBtn);

    // Should show first error for name
    expect(await screen.findByRole('alert')).toHaveTextContent(/please enter your name/i);

    // Fill invalid email and too short message after name
    const { nameInput, emailInput, messageInput } = getControls();
    await user.type(nameInput, 'John');
    await user.type(emailInput, 'invalid-email');
    await user.type(messageInput, 'short');

    await user.click(submitBtn);

    // Email error first
    expect(await screen.findByRole('alert')).toHaveTextContent(/valid email/i);

    // Fix email but message too short
    await user.clear(emailInput);
    await user.type(emailInput, 'john@example.com');
    await user.click(submitBtn);
    expect(await screen.findByRole('alert')).toHaveTextContent(/at least 10 characters/i);

    // Fix message removes error and shows sending or fallback status
    await user.clear(messageInput);
    await user.type(messageInput, 'This is a long enough message.');
    await user.click(submitBtn);

    // Since no API base is provided, status should show fallback guidance, not error
    await waitFor(() => {
      const statuses = screen.getAllByRole('status');
      expect(statuses.some(s => /no contact api configured|sending/i.test(s.textContent || ''))).toBeTruthy();
    });
  });

  test('successful submission when API base is set (mocked fetch)', async () => {
    const user = userEvent.setup();

    // Provide API base to go down fetch path
    process.env.REACT_APP_API_BASE = 'https://api.example.com';

    // Mock fetch success
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    global.fetch = mockFetch;

    render(<App />);

    const { nameInput, emailInput, messageInput, submitBtn } = getControls();

    await user.type(nameInput, 'Jane Doe');
    await user.type(emailInput, 'jane@example.com');
    await user.type(messageInput, 'Hello, I would like to hire you.');

    await user.click(submitBtn);

    // Should call fetch with correct URL and method
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    const call = mockFetch.mock.calls[0];
    expect(call[0]).toBe('https://api.example.com/contact');
    expect(call[1].method).toBe('POST');
    expect(call[1].headers['Content-Type']).toBe('application/json');

    // Status success message should appear and inputs cleared
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/thank you! your message has been sent successfully/i);
    });
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(messageInput).toHaveValue('');
  });

  test('server error shows friendly error state (mocked fetch failure)', async () => {
    const user = userEvent.setup();

    process.env.REACT_APP_API_BASE = 'https://api.example.com';

    // Mock fetch failure (non-ok)
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'server' }),
    });

    render(<App />);

    const { nameInput, emailInput, messageInput, submitBtn } = getControls();

    await user.type(nameInput, 'Jane Doe');
    await user.type(emailInput, 'jane@example.com');
    await user.type(messageInput, 'Hello, message for error case.');

    await user.click(submitBtn);

    // Should show user-friendly error (role="alert")
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/we couldn't submit your message/i);
    });
  });
});
