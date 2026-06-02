# Developer Documentation: LendSoftware (SportWeber-Schnaittach)

This documentation provides an overview of the LendSoftware project, designed for managing and booking rental sports equipment (Skis, Bikes, etc.) for Sport Weber.

## 🚀 Core Technologies

- **Frontend Framework**: [React (v18)](https://react.dev/)
- **Data Fetching & API**: [Apollo Client (GraphQL)](https://www.apollographql.com/docs/react/)
- **State Management**: [React Context API](https://react.dev/learn/passing-data-deeply-with-context)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router (v6)](https://reactrouter.com/)
- **UI Components**: 
    - [React Select](https://react-select.com/) (Customizable dropdowns)
    - [React DatePicker](https://reactdatepicker.com/) (Rental range selection)
    - [FontAwesome](https://fontawesome.com/) (Icons)
- **PDF Generation**: [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/index.html) & [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)

---

## 📁 Project Structure

```text
src/
├── assets/             # Images, logos, and banners (WebP/PNG)
├── components/         # Reusable UI components
│   ├── common/         # Generic inputs, routes, etc.
│   ├── Article.jsx     # Main product card logic (dates/sizes)
│   ├── ShoppingCart.jsx# Checkout flow container
│   └── ...             # Extracted sub-components (Summary, Form, etc.)
├── context/            # Global state (CartContext)
├── data/               # (Legacy) Static data files (mostly unused now)
├── pages/              # Page-level components (Route targets)
│   ├── OverallPage.jsx # Main product listing & filtering
│   ├── AdminPage.jsx   # Restricted administration area
│   └── ...
├── utils/              # Helper functions (PDF generation, etc.)
├── App.js              # Routing, Code Splitting, & Global Data Fetch
├── index.js            # Apollo/Context Provider setup
└── App.css             # Global styles and custom component overrides
```

---

## 🏗️ Architecture & Data Flow

### 1. Data Fetching (GraphQL)
The application uses **Apollo Client** to communicate with a GraphQL backend (hosted on DigitalOcean/SportWeber).
- **Global Data**: `App.js` fetches all `articles` and `bookings` upfront using the `useQuery` hook. This data is passed down to `OverallPage` for performance (avoiding multiple smaller requests).
- **Mutations**: Booking creation is handled via GraphQL mutations in `ShoppingCart.jsx`.

### 2. State Management (Cart)
Global cart state is managed in `src/context/CartContext.js`.
- **Functionality**: Add/Remove items, Clear cart.
- **Persistence**: Automatically syncs the cart to `localStorage` for session persistence.
- **Optimization**: Uses `useCallback` and `useMemo` to prevent unnecessary re-renders in consumers.

### 3. Routing & Code Splitting
Routes are defined in `App.js`.
- **Lazy Loading**: Major routes (`ShoppingCart`, `AdminPage`, `LoginPage`) are lazy-loaded using `React.lazy` and `Suspense` to improve initial load speed.
- **Private Routes**: The `/admin` route is protected by `PrivateRoute.jsx`, which checks for a valid JWT token in `localStorage`.

### 4. Component Patterns
- **OverallPage**: Uses `useMemo` for heavy filtering of the `articles` list based on category and size.
- **Article Component**: Handles complex availability logic by calculating blocked dates from the `bookings` prop and displaying them in a `DatePicker`.

---

## 🛠️ Development Workflow

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Deployment
- Build for production:
   ```bash
   npm run build
   ```
- The project is configured with `_redirects` in the `public` folder for compatibility with SPA hosting (e.g., Netlify).

### Backend Configuration
The API endpoint is configured in `src/index.js`.
```javascript
const httpLink = createHttpLink({
  uri: 'https://backend.sportweber-schnaittach.de/graphql/'
});
```

---

## 🎨 Styling Guidelines
- **Utility First**: Use Tailwind CSS for almost all styling.
- **Responsive Design**: Follow the `grid` and `flex` patterns established in `OverallPage` for consistent layout (centered max-width container with left-aligned grid items).
- **Global Overrides**: Custom component styles (like DatePicker or React-Select) are located in `src/App.css`.

---

## 🔒 Security
- **Authentication**: JWT-based. Tokens are stored in `localStorage` (`AUTH_TOKEN`).
- **Authorization**: Protected via `PrivateRoute` on the frontend. The backend should also validate tokens for admin operations.

---

## 📝 Troubleshooting & Best Practices
1. **Performance**: Always use `useMemo` for filtering large datasets in `OverallPage`.
2. **Re-renders**: Ensure context functions are wrapped in `useCallback`.
3. **Lazy Loading**: Keep the home page (`OverallPage`) eager for SEO/LCP, but lazy-load other complex pages.
