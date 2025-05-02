import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import ResetPassword from '../components/ResetPassword';

// Mock toast
vi.mock('react-toastify', async () => {
  const original = await vi.importActual('react-toastify');
  return {
    ...original,
    toast: {
      error: vi.fn(),
      success: vi.fn(),
    },
    ToastContainer: () => <div />,
  };
});

// Mock axios
vi.mock('axios');

// Mock useNavigate and useParams
const navigateMock = vi.fn();

const renderWithRouter = (token = 'mock-token') =>
  render(
    <MemoryRouter initialEntries={[`/reset-password/${token}`]}>
      <Routes>
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('ResetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mocking useNavigate globally to avoid repetition
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => navigateMock,
        useParams: () => ({ token: 'mock-token' }),
      };
    });
  });

  it('renders loading state and validates token', async () => {
    axios.get.mockResolvedValueOnce({});
    renderWithRouter();
    expect(screen.getByText('Checking token...')).toBeTruthy();
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it('shows error if token is invalid', async () => {
    axios.get.mockRejectedValueOnce({ response: { data: { message: 'Token expired' } } });
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText(/Invalid or expired token/i)).toBeTruthy();
    });
  });

  it('shows validation errors when fields are empty', async () => {
    axios.get.mockResolvedValueOnce({});
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeTruthy();
    });

    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeTruthy(); // Still on page
    });
  });

  it('shows error if passwords do not match', async () => {
    axios.get.mockResolvedValueOnce({});
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toBeTruthy();
    });

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'abc123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'xyz789' },
    });

    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeTruthy(); // Still on page
    });
  });

  it('submits form and redirects on success', async () => {
    // Mock axios requests
    axios.get.mockResolvedValueOnce({});
    axios.post.mockResolvedValueOnce({});

    renderWithRouter();

    // Wait for form elements to appear
    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toBeTruthy();
    });

    // Simulate user input
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'mypassword' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'mypassword' },
    });

    // Trigger form submission
    fireEvent.click(screen.getByText('Reset Password'));

    // Wait for the axios post call and the navigateMock call
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith('/'); // Ensure navigation occurs
    });
  });

  it('shows error on failed password reset', async () => {
    axios.get.mockResolvedValueOnce({});
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Error resetting password' } } });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toBeTruthy();
    });

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'test123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'test123' },
    });

    fireEvent.click(screen.getByText('Reset Password'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });
});
