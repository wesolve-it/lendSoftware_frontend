import './App.css';
import Navigation from "./components/Navigation";
import OverallPage from "./pages/OverallPage";
import {useEffect, useState} from "react";
import { Route, Routes } from 'react-router-dom';
import ShoppingCart from "./components/ShoppingCart";
import ThanksForBooking from "./pages/ThanksForBooking";
import AdminPage from "./pages/AdminPage";
import Invoice from "./components/Invoice";
import PrivateRoute from './components/common/PrivateRoute';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';

function App() {
  const [articles, setArticles] = useState(null);
  const [bookings, setBookings] = useState(null);

  const query = `
    {
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

  useEffect(() => {
    window
    // .fetch('https://coral-app-2rbal.ondigitalocean.app/graphql/', {
    // .fetch('https://87.166.5.20:8000/graphql/', {
    .fetch('https://backend.sportweber-schnaittach.de/graphql/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({query}),
        // mode: 'cors'
      })
      .then((response) => response.json())
      .then(({data, errors}) => {
        if (errors) {
          console.error(errors);
        }
        // const articlesWithImages = data.articles.map(article => {
        //   // Für jedes Bild eine Fetch-Anfrage mit Header machen
        //   return fetch(article.image, {
        //     headers: {
        //       "ngrok-skip-browser-warning": "true"
        //     },
        //     cache: "no-store"
        //   })
        //   .then(response => response.blob())
        //   .then(imageBlob => {
        //     const imageObjectURL = URL.createObjectURL(imageBlob);
        //     return { ...article, imageSrc: imageObjectURL }; // Bild-URL als 'imageSrc' speichern
        //   })
        // })

        // Warte darauf, dass alle Bilder geladen sind
        // Promise.all(articlesWithImages).then(articlesWithImages => {
          // articlesWithImages().then(setArticles(articlesWithImages))
          // setArticles(articlesWithImages)
          setArticles(data.articles);
          // setArticles(articlesWithImages); // Setze die Artikel mit den geladenen Bilderna
          // articlesWithImages()
          setBookings(data.bookings);
        // });
      });
  }, [query]);

  if (!articles) return (
    <div className="flex justify-center items-center h-screen">
      <div className="spinner"></div>
    </div>
  );

  // const articlesWithImages = articles.map(article => {
  //   return fetch(article.image, {
  //     headers: {
  //       "ngrok-skip-browser-warning": "true"
  //     },
  //     cache: "no-store"
  //   })
  //   .then(response => response.blob())
  //   .then(imageBlob => {
  //     const imageObjectURL = URL.createObjectURL(imageBlob);
  //     setArticles({ ...article, imageSrc: imageObjectURL });
  //   })
  // })

  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" exact element={<OverallPage data={articles} bookings={bookings} />} />
        <Route path="/warenkorb" exact element={<ShoppingCart />} />
        <Route path="/thank-you" exact element={<ThanksForBooking />} />
        <Route path="/invoice" exact element={<Invoice />} />
        <Route path="/login" exact element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
