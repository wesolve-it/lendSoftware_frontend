import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCalendar, faRuler, faEuroSign } from '@fortawesome/free-solid-svg-icons';

export default function CartItem({item, deleted}) {
  const [finalPrice, setFinalPrice] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const diffTime = Math.abs(new Date(item.startDate) - new Date(item.endDate));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const startDate = new Date(item.startDate).toLocaleDateString('de-DE');
  const endDate = new Date(item.endDate).toLocaleDateString('de-DE');

  useEffect(() => {
    let price = 0;
    let currentDate = new Date(item.startDate);
    while (currentDate <= new Date(item.endDate)) {
      price += parseInt(item.pricePerDay);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setFinalPrice(price);
  }, [item])

  const deleteItem = () => {
    setIsDeleting(true);
    
    // Kleine Verzögerung für die Animation
    setTimeout(() => {
      let items = JSON.parse(localStorage.getItem('cart'));

      items = items.filter(article => article.id !== item.id);
      
      localStorage.setItem('cart', JSON.stringify(items));
      deleted();
    }, 300);
  }

  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 ${
      isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      <div className="flex flex-col md:flex-row p-6 gap-6">
        {/* Image Section */}
        <div className="md:w-1/3 flex items-center justify-center bg-white rounded-lg p-4">
          {item.image ? (
            <img 
              className="h-48 w-48 object-contain" 
              src={item.image} 
              alt="Objektbild" 
            />
          ) : (
            <img 
              className="h-48 w-48 object-cover rounded-lg" 
              src={require('../assets/bannskirent.webp')} 
              alt="Platzhalterbild" 
            />
          )}
        </div>

        {/* Info Section */}
        <div className="md:w-2/3 flex flex-col justify-between">
          <div>
            {/* Artikel Name */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-red-600 pl-4">
              {item.name}
            </h3>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <FontAwesomeIcon icon={faRuler} className="text-red-600" />
                <span className="font-semibold">Größe:</span>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <FontAwesomeIcon icon={faEuroSign} className="text-red-600" />
                <span className="font-semibold">Preis/Tag:</span>
                <span>{parseInt(item.pricePerDay)}€</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <FontAwesomeIcon icon={faCalendar} className="text-red-600" />
                <span className="font-semibold">Von:</span>
                <span>{startDate}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <FontAwesomeIcon icon={faCalendar} className="text-red-600" />
                <span className="font-semibold">Bis:</span>
                <span>{endDate}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-semibold">Anzahl Tage:</span>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
                  {diffDays + 1}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Section - Preis & Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-semibold">Gesamtpreis:</span>
              <span className="text-3xl font-bold text-red-600">{finalPrice}€</span>
            </div>

            <button 
              onClick={deleteItem}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>Entfernen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}