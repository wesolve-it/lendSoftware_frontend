import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

describe('LoginPage', () => {
  test('shows an error message on invalid credentials', async () => {
    const errorMock = {
      request: {
        query: LOGIN_MUTATION,
        variables: {
          username: 'bad@example.com',
          password: 'wrong-password'
        }
      },
      error: new Error('Invalid credentials')
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </MockedProvider>
    );

    await act(async () => {
      await userEvent.type(screen.getByLabelText('Username'), 'bad@example.com');
      await userEvent.type(screen.getByLabelText('Passwort'), 'wrong-password');
      await userEvent.click(screen.getByRole('button', { name: 'Einloggen' }));
    });

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Benutzername oder Passwort ist ungültig.');
  });
});
