import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, vi, describe, test, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Login from '../components/Login';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../constants/constant';


vi.mock('axios');


vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    MemoryRouter: actual.MemoryRouter,
  };
});

beforeEach(() => {
  vi.spyOn(window.localStorage.__proto__, 'setItem');
  window.localStorage.setItem = vi.fn();
});

describe('Login Component', () => {
  test('renders login form with email, password input, and login button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('password visibility toggle works correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const toggleButton = screen.getByTestId('password-toggle');
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  test('form validation works when fields are empty', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  
    
    const loginButton = screen.getByTestId('login-button');
    expect(loginButton).toBeDisabled();
    
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });

  test('handles successful login and redirects to dashboard', async () => {
    
    axios.post.mockResolvedValueOnce({ data: { token: 'fake_token' } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${BASE_URL}/login`,
        { email: 'test@example.com', password: 'password123' }
      );
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake_token');
  });

  test('handles login error correctly', async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 401, data: { message: 'Invalid credentials' } },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});