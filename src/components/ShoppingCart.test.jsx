import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import ShoppingCart from './ShoppingCart';
import { CartProvider } from '../context/CartContext';

const cartItem = {
  id: 1,
  name: 'Test Artikel',
  label: 'M',
  pricePerDay: 10,
  startDate: '2024-01-01',
  endDate: '2024-01-03',
  image: null
};

describe('ShoppingCart', () => {
  beforeEach(() => {
    localStorage.setItem('cart', JSON.stringify([cartItem]));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('shows empty state when cart is empty', () => {
    localStorage.clear();
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <CartProvider>
          <MemoryRouter>
            <ShoppingCart />
          </MemoryRouter>
        </CartProvider>
      </MockedProvider>
    );

    expect(screen.getByText('Dein Warenkorb ist leer')).toBeInTheDocument();
  });

  test('calculates total price based on date range', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <CartProvider>
          <MemoryRouter>
            <ShoppingCart />
          </MemoryRouter>
        </CartProvider>
      </MockedProvider>
    );

    const totals = await screen.findAllByText('30€');
    expect(totals.length).toBeGreaterThan(0);
  });
});
