import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from '../pages/Profile';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('axios');

describe('Profile Component', () => {
  const mockProfile = {
    name: 'Saniya',
    email: 'saniya@example.com',
  };

  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
    axios.get.mockResolvedValue({ data: mockProfile });
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('renders profile data after fetch', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile-name')).toHaveTextContent('Name: Saniya');
      expect(screen.getByTestId('profile-email')).toHaveTextContent('Email: saniya@example.com');
    });
  });

  it('opens and closes the change password modal', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const changePasswordBtn = await screen.findByRole('button', { name: /Change Password/i });
    fireEvent.click(changePasswordBtn);

    expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    await waitFor(() => {
      expect(screen.queryByLabelText(/Current Password/i)).not.toBeInTheDocument();
    });
  });

  it('validates empty fields on password change', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const changePasswordBtn = await screen.findByRole('button', { name: /Change Password/i });
    fireEvent.click(changePasswordBtn);
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    expect(await screen.findByText(/All fields are required/i)).toBeInTheDocument();
  });

  it('validates mismatched passwords', async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const changePasswordBtn = await screen.findByRole('button', { name: /Change Password/i });
    fireEvent.click(changePasswordBtn);

    const passwordInputs = screen.getAllByLabelText(/New Password/i);
    fireEvent.change(screen.getByLabelText(/Current Password/i), { target: { value: 'oldpass' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'newpass' } });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), {
      target: { value: 'different' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    expect(await screen.findByText(/do not match/i)).toBeInTheDocument();
  });

  it('sends API request when password is valid', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Password changed' } });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const changePasswordBtn = await screen.findByRole('button', { name: /Change Password/i });
    fireEvent.click(changePasswordBtn);

    const passwordInputs = screen.getAllByLabelText(/New Password/i);

    fireEvent.change(screen.getByLabelText(/Current Password/i), {
      target: { value: 'oldpass' },
    });
    fireEvent.change(passwordInputs[0], { target: { value: 'newpass' } });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), {
      target: { value: 'newpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/change-password'),
        expect.objectContaining({
          currentPassword: 'oldpass',
          newPassword: 'newpass',
          confirmPassword: 'newpass',
        }),
        expect.any(Object)
      )
    );
  });

  it('shows error on profile fetch failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/Failed to load profile/i)).toBeInTheDocument()
    );
  });
});
