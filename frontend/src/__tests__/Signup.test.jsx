import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../components/Signup';
import { describe, vi, test, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';  
import '@testing-library/jest-dom';


vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

vi.mock('axios');
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
  ToastContainer: () => <div />,
}));

describe('Signup Component', () => {
  
  let mockNavigate;
  
  beforeEach(() => {
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
    vi.clearAllMocks();
  });

  test('renders the signup form correctly', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/)).toBeInTheDocument();
  });

  test('validates form inputs and shows error for empty fields', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
  
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please fill in all fields.');
    });
  });

  test('validates email format and shows error for invalid email', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    
    
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'password123' } });
    
    
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'invalid-email' } });
    
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid email format.');
    });
  });

  test('handles API success and redirects to dashboard', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'password123' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Signup successful! Redirecting to dashboard...');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles API failure when user already exists', async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 409, data: { message: 'User already exists' } },
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'password123' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Email already registered.'));
  });

  test('navigates to dashboard after successful signup', async () => {
    axios.post.mockResolvedValueOnce({ status: 201 });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'password123' } });
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});