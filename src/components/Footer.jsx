import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faClock,
  faSkiing,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FontAwesomeIcon icon={faSkiing} className="text-red-600 text-2xl" />
              <h3 className="text-xl font-bold text-white text-left">Sport Weber Schnaittach</h3>
            </div>
            <p className="text-sm leading-relaxed text-left">
              Ihr Spezialist für Ski- und Bike-Verleih in Schnaittach. 
              Qualität, Service und faire Preise seit vielen Jahren.
            </p>
            <div className="mt-4 text-left">
              <a 
                href="https://sportweber-schnaittach.de" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm hover:text-red-600 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faGlobe} />
                Onlineshop besuchen
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 text-left">Schnellzugriff</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="hover:text-red-600 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="text-red-600">›</span>
                  Startseite
                </Link>
              </li>
              <li>
                <Link 
                  to="/#ski" 
                  className="hover:text-red-600 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="text-red-600">›</span>
                  Ski Verleih
                </Link>
              </li>
              <li>
                <Link 
                  to="/#accessoires" 
                  className="hover:text-red-600 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="text-red-600">›</span>
                  Zubehör
                </Link>
              </li>
              <li>
                <Link 
                  to="/#kinder" 
                  className="hover:text-red-600 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="text-red-600">›</span>
                  Kinder
                </Link>
              </li>
              <li>
                <Link 
                  to="/warenkorb" 
                  className="hover:text-red-600 transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="text-red-600">›</span>
                  Warenkorb
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 text-left">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-600 mt-1" />
                <div className='text-left'>
                  <p>Nürnberger Straße 51</p>
                  <p>91220 Schnaittach</p>
                  <p>Deutschland</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="text-red-600" />
                <a href="tel:09153220" className="hover:text-red-600 transition-colors text-left">
                  09153 220
                </a>
              </li>
              <li className="flex items-center gap-3 text-left">
                <FontAwesomeIcon icon={faEnvelope} className="text-red-600" />
                <a href="mailto:kontakt@sportweber-schnaittach.de" className="hover:text-red-600 transition-colors break-all xl:text-sm">
                  kontakt@sportweber-schnaittach.de
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 text-left">Öffnungszeiten</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faClock} className="text-red-600 mt-1" />
                <div>
                  <p className="font-semibold text-white text-left">Mittwoch - Freitag</p>
                  <p className="text-sm text-left">10:00 - 12:00 Uhr</p>
                  <p className="text-sm text-left">14:00 - 18:00 Uhr</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faClock} className="text-red-600 mt-1" />
                <div>
                  <p className="font-semibold text-white text-left">Samstag</p>
                  <p className="text-sm text-left">9:00 - 13:00 Uhr</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FontAwesomeIcon icon={faClock} className="text-red-600 mt-1" />
                <div>
                  <p className="font-semibold text-white text-left">Sonntag & Montag</p>
                  <p className="text-sm text-left">Geschlossen</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {currentYear} Sport Weber Schnaittach. Alle Rechte vorbehalten.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link 
                to="/impressum" 
                className="hover:text-red-600 transition-colors duration-300"
              >
                Impressum
              </Link>
              <Link 
                to="/datenschutz" 
                className="hover:text-red-600 transition-colors duration-300"
              >
                Datenschutz
              </Link>
              <Link 
                to="/agb" 
                className="hover:text-red-600 transition-colors duration-300"
              >
                AGB
              </Link>
              <Link 
                to="/widerruf" 
                className="hover:text-red-600 transition-colors duration-300"
              >
                Widerrufsrecht
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-40"
        aria-label="Nach oben scrollen"
      >
        <span className="text-2xl">↑</span>
      </button>
    </footer>
  );
}