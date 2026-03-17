import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from "react-router-dom";
import { faBars, faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useCart } from '../context/CartContext';


export default function Navigation() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { cart } = useCart();
  const cartLength = cart.length;
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const targetSki = 'ski';
  const targetAccessoires = 'accessoires';
  const targetKids = 'kinder';

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <nav className={`sticky z-[9999] top-0 flex flex-wrap items-center justify-between px-2 transition-all duration-300 ${
        scrolled ? 'py-2 bg-red-600 shadow-xl' : 'py-3 bg-red-600 shadow-lg'
      }`}>
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link 
              to="https://sportweber-schnaittach.de/"
              className="text-sm font-bold leading-relaxed inline-block py-2 whitespace-nowrap uppercase text-white transition-transform duration-300 hover:scale-105"
            >
              <img 
                className={`transition-all duration-300 ${scrolled ? 'h-16 w-36' : 'h-20 w-44'} -my-4`} 
                src={require('../assets/SportWeberLogoNeuklein.png')} 
                alt="Logo" 
              />
            </Link>
            <button
              className="text-white cursor-pointer text-2xl leading-none px-3 py-1 border border-solid border-transparent rounded-lg bg-transparent hover:bg-red-700 transition-colors block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <FontAwesomeIcon icon={navbarOpen ? faTimes : faBars} />
            </button>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex flex-grow items-center">
            <ul className="flex flex-row list-none ml-auto gap-2">
              <li className="nav-item">
                <Link
                  className={`px-4 py-2 flex items-center text-sm font-semibold leading-snug rounded-lg transition-all duration-300 ${
                    isActive('/') 
                      ? 'bg-white text-red-600 shadow-md' 
                      : 'hover:bg-red-700 text-white'
                  }`}
                  to="/"
                  onClick={scrollToTop}
                >
                  Übersicht
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`px-4 py-2 flex items-center text-sm font-semibold leading-snug rounded-lg transition-all duration-300 ${
                    isActive(`#${targetSki}`) 
                      ? 'bg-white text-red-600 shadow-md' 
                      : 'hover:bg-red-700 text-white'
                  }`}
                  to={`/#${targetSki}`}
                  onClick={closeNav}
                >
                  Ski
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`px-4 py-2 flex items-center text-sm font-semibold leading-snug rounded-lg transition-all duration-300 ${
                    isActive(`#${targetAccessoires}`) 
                      ? 'bg-white text-red-600 shadow-md' 
                      : 'hover:bg-red-700 text-white'
                  }`}
                  to={`/#${targetAccessoires}`}
                  onClick={closeNav}
                >
                  Zubehör
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`px-4 py-2 flex items-center text-sm font-semibold leading-snug rounded-lg transition-all duration-300 ${
                    isActive(`#${targetKids}`) 
                      ? 'bg-white text-red-600 shadow-md' 
                      : 'hover:bg-red-700 text-white'
                  }`}
                  to={`/#${targetKids}`}
                  onClick={closeNav}
                >
                  Kinder
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`px-4 py-2 flex items-center gap-2 text-sm font-semibold leading-snug rounded-lg transition-all duration-300 relative ${
                    isActive('/warenkorb') 
                      ? 'bg-white text-red-600 shadow-md' 
                      : 'hover:bg-red-700 text-white'
                  }`}
                  to="/warenkorb"
                  onClick={closeNav}
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span>Warenkorb</span>
                  {cartLength > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md animate-pulse">
                      {cartLength}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden fixed top-0 right-0 h-screen w-72 bg-red-600 shadow-2xl transform transition-transform duration-300 ease-in-out ${
              navbarOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b border-red-700">
              <h3 className="text-white font-bold text-lg">Menü</h3>
              <button
                onClick={closeNav}
                className="text-white text-2xl hover:text-red-200 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <ul className="flex flex-col p-4 space-y-2">
              <li>
                <Link
                  className={`px-4 py-3 flex items-center text-sm font-semibold rounded-lg transition-all duration-300 ${
                    isActive('/') 
                      ? 'bg-white text-red-600 shadow-md' 
                      : 'hover:bg-red-700 text-white'
                  }`}
                  to="/"
                  onClick={scrollToTop}
                >
                  Übersicht
                </Link>
              </li>
              <li>
                <Link
                  className={`px-4 py-3 flex items-center text-sm font-semibold rounded-lg transition-all duration-300 ${
                    isActive(`#${targetSki}`) 
                      ? 'bg-white text-red-600 shadow-md' 
                      : 'hover:bg-red-700 text-white'
                  }`}
                  to={`/#${targetSki}`}
                  onClick={closeNav}
                >
                  Ski
                </Link>
              </li>
              <li>
                <Link
                  className={`px-4 py-3 flex items-center text-sm font-semibold rounded-lg transition-all duration-300 ${
                    isActive(`#${targetAccessoires}`) 
                      ? 'bg-white text-red-600 shadow-md' 
                      : 'hover:bg-red-700 text-white'
                  }`}
                  to={`/#${targetAccessoires}`}
                  onClick={closeNav}
                >
                  Zubehör
                </Link>
              </li>
              <li>
                <Link
                  className={`px-4 py-3 flex items-center text-sm font-semibold rounded-lg transition-all duration-300 ${
                    isActive(`#${targetKids}`) 
                      ? 'bg-white text-red-600 shadow-md' 
                      : 'hover:bg-red-700 text-white'
                  }`}
                  to={`/#${targetKids}`}
                  onClick={closeNav}
                >
                  Kinder
                </Link>
              </li>
              <li>
                <Link
                  className={`px-4 py-3 flex items-center gap-2 text-sm font-semibold rounded-lg transition-all duration-300 relative ${
                    isActive('/warenkorb') 
                      ? 'bg-white text-red-600 shadow-md' 
                      : 'hover:bg-red-700 text-white'
                  }`}
                  to="/warenkorb"
                  onClick={closeNav}
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <span>Warenkorb</span>
                  {cartLength > 0 && (
                    <span className="ml-auto bg-yellow-400 text-red-600 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                      {cartLength}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile Overlay */}
          {navbarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[-1]"
              onClick={closeNav}
            />
          )}
        </div>
      </nav>
    </>
  )
}
