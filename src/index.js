import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloProvider, ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

const httpLink = createHttpLink({
  // uri: 'https://coral-app-2rbal.ondigitalocean.app/graphql/'
  uri: 'https://backend.sportweber-schnaittach.de/graphql/'
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
