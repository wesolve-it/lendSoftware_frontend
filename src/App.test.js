import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: {
            articles: [],
            bookings: []
          }
        })
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders navigation after data loads', async () => {
  render(
    <CartProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </CartProvider>
  );

  const overviewLinks = await screen.findAllByText('Übersicht');
  expect(overviewLinks.length).toBeGreaterThan(0);
});
