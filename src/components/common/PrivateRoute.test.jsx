import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PrivateRoute from './PrivateRoute';
import { AUTH_TOKEN } from '../../constants';

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn()
}));

describe('PrivateRoute', () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('redirects to login when no token is present', async () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<div>Admin</div>} />
          </Route>
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    const login = await screen.findByText('Login');
    expect(login).toBeInTheDocument();
  });

  test('renders protected content when token is valid', async () => {
    localStorage.setItem(AUTH_TOKEN, 'valid-token');
    jwtDecode.mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 60 });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<div>Admin</div>} />
          </Route>
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    const admin = await screen.findByText('Admin');
    expect(admin).toBeInTheDocument();
  });
});
