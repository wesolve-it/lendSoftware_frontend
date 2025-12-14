import React, {useEffect, useState} from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import Alert from './Alert';
import { BookedAlert } from './Alert';
import ArticleBooked from './ArticleBooked';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCheck, faCalendar, faRuler } from '@fortawesome/free-solid-svg-icons';

export default function Article({item, bookings}) {
  const [price] = useState(item.sizes[0].pricePerDay);
  const [deleteStartDate, setDeleteStartDate] = useState([]);
  const [booked, setBooked] = useState(false);
  const [alert, setAlert] = useState(false);
  const [bookedAlert, setBookedAlert] = useState(false);
  const [articleBooked, setArticleBooked] = useState(false);
  let cart = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];

  const [article, setArticle] = useState({
    endDate: new Date(),
    startDate: new Date(),
    size: 0
  })

  useEffect(() => {
    let array = [];
    bookings.map((booking) => {
      if (booking.size.id === article.id) {
        let currentDate = new Date(booking.startDate);
        currentDate.setHours(0,0,0,0);

        let endDate = new Date(booking.endDate);
        endDate.setHours(0,0,0,0);

        while (currentDate <= endDate) {
          let d = new Date(currentDate);
          d.setHours(0,0,0,0);
          array.push(d);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      return array;
    })
    setDeleteStartDate(array);
  }, [article, bookings]);

  const handleChange = (range) => {
    const [startDate, endDate] = range;
    const isOverlapping = deleteStartDate.some(date => 
      (date >= startDate && date <= endDate)
    );

    if (!isOverlapping) {
      setArticle({...article, startDate: startDate, endDate: endDate, name: item.name, image: item.image, pricePerDay: price});
    } else {
      setBookedAlert(true);
      setTimeout(() => {
        setBookedAlert(false);
      }, 2000);
    }
  }

  function toLocalDateString(date) {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  }

  const handleClick = () => {
    if (article.size !== 0) {
      
      const normalizedArticle = {
        ...article,
        startDate: toLocalDateString(article.startDate),
        endDate: toLocalDateString(article.endDate)
      };

      if (cart.length > 0) {
        var checkCart = cart.filter(item => item.id === article.id);
        if (checkCart.length > 0) {
          setArticleBooked(true);
        } else {
          cart.push(normalizedArticle);
        }
      } else {
        cart.push(normalizedArticle);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setBooked(true);

    } else {
      setAlert(true);
      setTimeout(() => setAlert(false), 2000);
    }
  };

  // Custom Styles für React-Select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#dc2626' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 1px #dc2626' : 'none',
      '&:hover': {
        borderColor: '#dc2626'
      },
      borderRadius: '0.5rem',
      padding: '0.25rem'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#dc2626' : state.isFocused ? '#fee2e2' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      '&:hover': {
        backgroundColor: state.isSelected ? '#dc2626' : '#fee2e2'
      }
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999
    })
  };

  if (!item) return "Loading...";

  return (
    <div className="group mt-10 w-5/6 mx-auto lg:w-5/12 xl:w-3/12 transition-all duration-300 hover:scale-105">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-visible flex flex-col h-full relative z-10 hover:z-30">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 h-80 flex-shrink-0">
          {item.image ? 
            <img 
              className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-110" 
              src={item.image}
              alt="Bild von dem Objekt"
            /> : 
            <img 
              className="w-full h-full object-cover" 
              src={require('../assets/bannskirent.webp')}
              alt="Platzhalterbild"
            />
          }
        </div>

        {/* Content Container */}
        <div className="p-6 space-y-5 flex flex-col flex-grow">
          {/* Artikel Name & Preis */}
          <div className="flex items-start justify-between border-b-2 border-gray-100 pb-4 gap-4">
            <div className="border-l-4 border-red-600 pl-4 flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-800 leading-tight">{item.name}</h3>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm text-gray-500 font-medium">Preis/Tag</p>
              <p className="text-2xl font-bold text-red-600 whitespace-nowrap">{price}€</p>
            </div>
          </div>

          {/* Größenauswahl */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FontAwesomeIcon icon={faRuler} className="text-red-600" />
              Größe wählen
            </label>
            <Select 
              className="w-full" 
              value={article.size} 
              onChange={setArticle} 
              options={item.sizes}
              styles={customSelectStyles}
              placeholder="Größe auswählen..."
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
          </div>

          {/* Datumsauswahl */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FontAwesomeIcon icon={faCalendar} className="text-red-600" />
              Zeitraum wählen
            </label>
            <div className="relative">
              <DatePicker
                className="border-2 border-gray-200 rounded-lg w-full py-3 px-4 text-center focus:border-red-600 focus:outline-none transition-colors"
                selected={article.startDate}
                onChange={handleChange}
                startDate={article.startDate}
                endDate={article.endDate}
                selectsRange
                dateFormat="dd.MM.yyyy"
                excludeDates={deleteStartDate}
                minDate={new Date()}
                placeholderText="Zeitraum auswählen"
                calendarClassName="modern-datepicker"
                portalId="datepicker-portal"
                popperClassName="datepicker-popper"
                popperPlacement="auto"
                popperModifiers={[
                  {
                    name: 'preventOverflow',
                    options: {
                      rootBoundary: 'viewport',
                      padding: 8,
                    },
                  },
                  {
                    name: 'flip',
                    options: {
                      fallbackPlacements: ['top', 'bottom', 'left', 'right'],
                    },
                  },
                ]}
              />
            </div>
          </div>

          {/* Alerts */}
          <div className="min-h-[40px]">
            {alert && <Alert />}
            {bookedAlert && <BookedAlert />}
            {articleBooked && <ArticleBooked />}
          </div>

          {/* Action Button - am Ende der Card */}
          <div className="mt-auto">
            <button 
              onClick={handleClick} 
              className={`w-full py-4 rounded-lg font-bold text-white transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 shadow-md hover:shadow-lg ${
                booked 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <FontAwesomeIcon icon={booked ? faCheck : faShoppingCart} />
              <span>{booked ? 'Hinzugefügt' : 'In den Warenkorb'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Inline Styles für DatePicker */}
      <style>{`
        .datepicker-popper {
          z-index: 10000 !important;
        }

        .modern-datepicker {
          font-family: inherit;
          border-radius: 1rem !important;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2) !important;
          border: 1px solid #e5e7eb !important;
          overflow: hidden;
        }

        .react-datepicker-popper {
          z-index: 10000 !important;
        }

        .react-datepicker-popper[data-placement^="bottom"] {
          padding-top: 8px;
        }

        .react-datepicker-popper[data-placement^="top"] {
          padding-bottom: 8px;
        }

        .react-datepicker {
          border: none !important;
          border-radius: 1rem !important;
          font-family: inherit !important;
        }

        .react-datepicker__header {
          background-color: #dc2626 !important;
          border-bottom: none !important;
          border-radius: 1rem 1rem 0 0 !important;
          padding-top: 1rem !important;
        }

        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: white !important;
          font-weight: 600 !important;
        }

        .react-datepicker__day {
          color: #374151 !important;
          border-radius: 0.5rem !important;
          transition: all 0.2s !important;
          margin: 0.2rem !important;
        }

        .react-datepicker__day:hover {
          background-color: #fee2e2 !important;
          color: #dc2626 !important;
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--in-range,
        .react-datepicker__day--in-selecting-range {
          background-color: #dc2626 !important;
          color: white !important;
          border-radius: 0.5rem !important;
        }

        .react-datepicker__day--keyboard-selected {
          background-color: #fee2e2 !important;
          color: #dc2626 !important;
        }

        .react-datepicker__day--disabled,
        .react-datepicker__day--excluded {
          color: #d1d5db !important;
          cursor: not-allowed !important;
        }

        .react-datepicker__day--excluded {
          text-decoration: line-through !important;
        }

        .react-datepicker__navigation {
          top: 1rem !important;
        }

        .react-datepicker__navigation-icon::before {
          border-color: white !important;
        }

        .react-datepicker__navigation:hover *::before {
          border-color: #fee2e2 !important;
        }

        .react-datepicker__month-container {
          padding: 0.5rem !important;
        }

        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end {
          background-color: #b91c1c !important;
          font-weight: 600 !important;
        }

        .react-datepicker__triangle {
          display: none !important;
        }

        @media (max-width: 768px) {
          .react-datepicker {
            font-size: 0.9rem !important;
          }
          
          .react-datepicker__day {
            width: 2.2rem !important;
            line-height: 2.2rem !important;
            margin: 0.15rem !important;
          }

          .react-datepicker__day-name {
            width: 2.2rem !important;
            line-height: 2.2rem !important;
          }
        }
      `}</style>
    </div>
  )
}