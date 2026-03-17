import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import Article from './Article';
import { CartProvider } from '../context/CartContext';

const baseItem = {
  id: 1,
  name: 'Test Artikel',
  image: null,
  sizes: [
    {
      id: 10,
      value: 10,
      label: 'M',
      pricePerDay: 10,
      serialNumber: 'S-10'
    }
  ]
};

describe('Article', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders the article name and price', () => {
    render(
      <CartProvider>
        <Article item={baseItem} bookings={[]} />
      </CartProvider>
    );

    expect(screen.getByText('Test Artikel')).toBeInTheDocument();
    expect(screen.getByText('10€')).toBeInTheDocument();
  });

  test('shows a warning when adding without selecting size', async () => {
    render(
      <CartProvider>
        <Article item={baseItem} bookings={[]} />
      </CartProvider>
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /in den warenkorb/i }));
    });

    expect(screen.getByText('Bitte eine Größe wählen')).toBeInTheDocument();
  });
});
