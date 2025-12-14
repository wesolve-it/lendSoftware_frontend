import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from "react-router-dom";
import { faBars, faShoppingCart } from '@fortawesome/free-solid-svg-icons'


export default function Navigation() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [cartLength, setCartLength] = useState(0);
  const location = useLocation();
  const targetSki = 'ski';
  const targetAccessoires = 'accessoires';
  const targetKids = 'kinder';

  useEffect(() => {
    setInterval(() => {
      setCartLength(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')).length : 0)
    }, 2000);
  }, [])

  // Funktion zum Schließen der Navigation
  const closeNav = () => {
    setNavbarOpen(false);
  };

  // Funktion zum Scrollen nach oben
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeNav();
  };

  // Funktion um zu prüfen, ob der Link aktiv ist
  const isActive = (path) => {
    // Für die Startseite: nur aktiv wenn kein Hash vorhanden ist
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    // Für Hash-Links: prüfe nur den Hash
    if (path.startsWith('#')) {
      return location.hash === path;
    }
    // Für andere Pfade: normale Pfad-Prüfung
    return location.pathname === path;
  };

  return (
    <>
      <nav className="sticky z-10 top-0 flex flex-wrap items-center justify-between px-2 py-3 bg-red-600 mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link to="https://sportweber-schnaittach.de/"
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
            >
              <img className='h-20 w-44 -my-4' src={require('../assets/SportWeberLogoNeuklein.png')} alt="Logo" />
            </Link>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
            <li className="nav-item">
                <Link
                  className={`px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 ${
                    isActive('/') ? 'bg-red-700 rounded' : ''
                  }`}
                  to="/"
                  onClick={scrollToTop}
                >
                  <i className="text-lg leading-lg text-white opacity-75"></i><span className="ml-0">Übersicht</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 ${
                    isActive(`#${targetSki}`) ? 'bg-red-700 rounded' : ''
                  }`}
                  to={`/#${targetSki}`}
                  onClick={closeNav}
                >
                  <i className="text-lg leading-lg text-white opacity-75"></i><span className="ml-0">Ski</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 ${
                    isActive(`#${targetAccessoires}`) ? 'bg-red-700 rounded' : ''
                  }`}
                  to={`/#${targetAccessoires}`}
                  onClick={closeNav}
                >
                  <i className="text-lg leading-lg text-white opacity-75"></i><span className="ml-0">Zubehör</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 ${
                    isActive(`#${targetKids}`) ? 'bg-red-700 rounded' : ''
                  }`}
                  to={`/#${targetKids}`}
                  onClick={closeNav}
                >
                  <i className="text-lg leading-lg text-white opacity-75"></i><span className="ml-0">Kinder</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75 ${
                    isActive('/warenkorb') ? 'bg-red-700 rounded' : ''
                  }`}
                  to="/warenkorb"
                  onClick={closeNav}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  <span>Warenkorb | {cartLength}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}