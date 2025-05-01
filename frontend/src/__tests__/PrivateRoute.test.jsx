import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';

const DummyComponent = () => <div>Protected Content</div>;

describe('PrivateRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('redirects to /login when token is not present', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <DummyComponent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(container.innerHTML).toContain('Login Page');
  });

  it('renders children when token is present', () => {
    localStorage.setItem('token', 'fake-token');

    const { getByText } = render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <DummyComponent />
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Protected Content')).toBeTruthy();
  });
});
