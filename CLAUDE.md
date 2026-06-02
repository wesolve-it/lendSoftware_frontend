# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server at http://localhost:3000
npm run build    # Production build
npm test         # Run tests (interactive watch mode)
npm test -- --watchAll=false  # Run tests once (CI mode)
npm test -- --testPathPattern=Article  # Run a single test file
```

## Architecture Overview

This is a React 18 SPA (Create React App) for managing rental sports equipment bookings at Sport Weber Schnaittach.

### Provider hierarchy (`src/index.js`)
```
ApolloProvider → CartProvider → BrowserRouter → App
```

### Data flow
- `App.js` fetches all `articles` and `bookings` in a single upfront GraphQL query (`GET_DATA`) and passes them as props to `OverallPage`. This avoids N+1 requests as the user browses.
- The GraphQL backend is at `https://backend.sportweber-schnaittach.de/graphql/`.
- Mutations (booking creation, deletion) happen locally in the components that need them (`ShoppingCart.jsx`, `AdminPage.jsx`).

### State management
- **Cart**: `src/context/CartContext.js` — exposes `{ cart, addItem, removeItem, clearCart }` via `useCart()`. Persists to `localStorage` under the key `cart` and syncs across tabs.
- **Auth**: JWT token stored in `localStorage` under `AUTH_TOKEN` (defined in `src/constants.js`). `PrivateRoute` checks for this token to guard `/admin`.

### Routing (`App.js`)
| Path | Component | Notes |
|---|---|---|
| `/` | `OverallPage` | Eager-loaded (home/LCP) |
| `/warenkorb` | `ShoppingCart` | Lazy |
| `/thank-you` | `ThanksForBooking` | Lazy |
| `/invoice` | `Invoice` | Lazy |
| `/login` | `LoginPage` | Lazy |
| `/admin` | `AdminPage` | Lazy + `PrivateRoute` |

### Key components
- **`OverallPage`** — Article listing with category/size filtering. Uses `useMemo` for filtering to avoid re-computing on every render.
- **`Article.jsx`** — Individual product card. Calculates blocked date ranges from `bookings` prop and feeds them to `react-datepicker` for availability display.
- **`ShoppingCart.jsx`** — Checkout flow: renders `CartItemList`, `CartSummary`, and `ContactForm`, then fires the `createBooking` GraphQL mutation.
- **`AdminPage.jsx`** — Protected view listing all bookings with search, date filtering, pagination, and deletion. Fetches its own bookings via REST/GraphQL directly (not from `App.js`).
- **`Invoice.jsx`** — Generates a printable PDF invoice from booking data using `html2canvas` + `jsPDF`. Groups bookings by customer and period. Pricing logic: only Thu–Mon days count (`getDay() > 2 || getDay() < 1`).

### Styling
- Tailwind CSS for almost all styling; no custom theme extensions in `tailwind.config.js`.
- Third-party component overrides (DatePicker, React-Select) live in `src/App.css`.
- Custom component styles (React-Select, react-datepicker) must be targeted via `src/App.css` global selectors, not inline Tailwind, because those libraries inject their own class names.
