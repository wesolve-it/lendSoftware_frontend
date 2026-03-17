import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md p-12 text-center">
      <FontAwesomeIcon icon={faShoppingCart} className="text-6xl text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Dein Warenkorb ist leer</h2>
      <p className="text-gray-600 mb-6">Füge Artikel hinzu, um mit der Buchung zu beginnen</p>
      <button
          onClick={() => navigate('/')}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
      >
        Zur Übersicht
      </button>
    </div>
  );
};

export default EmptyCart;
