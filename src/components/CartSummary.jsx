import React from 'react';

const CartSummary = ({ cartCount, finalPrice, surcharge, onBooking, loading }) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Zusammenfassung</h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Artikel im Warenkorb:</span>
            <span className="font-semibold">{cartCount}</span>
          </div>

          {surcharge > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Einzel-Tag-Pauschale:</span>
              <span className="font-semibold">{surcharge}€</span>
            </div>
          )}

          <div className="border-t-2 border-gray-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Gesamtpreis:</span>
              <span className="text-3xl font-bold text-red-600">{finalPrice}€</span>
            </div>
          </div>
        </div>

        <button
            onClick={onBooking}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 transform active:scale-95 ${
                loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
            }`}
        >
          {loading ? 'Wird gebucht...' : 'Jetzt verbindlich buchen'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Mit dem Klick auf "Jetzt verbindlich buchen" akzeptieren Sie unsere AGB
        </p>
      </div>
    </div>
  );
};

export default CartSummary;
