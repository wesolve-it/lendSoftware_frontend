import './App.css';
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import Navigation from "./components/Navigation";
import OverallPage from "./pages/OverallPage";
import Footer from './components/Footer';
import PrivateRoute from './components/common/PrivateRoute';

// Lazy loaded components
const ShoppingCart = lazy(() => import("./components/ShoppingCart"));
const ThanksForBooking = lazy(() => import("./pages/ThanksForBooking"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const Invoice = lazy(() => import("./components/Invoice"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

const GET_DATA = gql`
  query GetData {
    articles {
      name
      id
      image
      description
      category {
        categoryName
        id
      }
      drivingProfile {
        name
        id
      }
      sizes {
        id
        value
        label
        pricePerDay
        serialNumber
      }
    }
    bookings {
      startDate
      endDate
      size {
        id
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return <div className="text-center p-10 text-red-600">Error loading data: {error.message}</div>;

  return (
    <div className="App flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-grow">
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<OverallPage data={data.articles} bookings={data.bookings} />} />
            <Route path="/warenkorb" element={<ShoppingCart />} />
            <Route path="/thank-you" element={<ThanksForBooking />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}

export default App;
