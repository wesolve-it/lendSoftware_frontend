import React, {useMemo, useState} from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import Alert, { BookedAlert } from './Alert';
import ArticleBooked from './ArticleBooked';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCheck, faCalendar, faRuler } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';

export default function Article({item, bookings}) {
  const [booked, setBooked] = useState(false);
  const [alert, setAlert] = useState(false);
  const [bookedAlert, setBookedAlert] = useState(false);
  const [articleBooked, setArticleBooked] = useState(false);
  const { cart, addItem } = useCart();
  
  const [selection, setSelection] = useState({
    startDate: new Date(),
    endDate: new Date(),
    size: null
  });

  const currentPrice = selection.size ? selection.size.pricePerDay : item.sizes[0]?.pricePerDay;
  const selectedSizeId = selection.size?.id;

  const deleteStartDate = useMemo(() => {
    if (!selectedSizeId || !bookings) return [];
    const array = [];
    bookings.forEach((booking) => {
      if (booking.size && booking.size.id === selectedSizeId) {
        let currentDate = new Date(booking.startDate);
        currentDate.setHours(0, 0, 0, 0);
        let endDate = new Date(booking.endDate);
        endDate.setHours(0, 0, 0, 0);
        while (currentDate <= endDate) {
          const d = new Date(currentDate);
          d.setHours(0, 0, 0, 0);
          array.push(d);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
    return array;
  }, [bookings, selectedSizeId]);

  const handleChange = (range) => {
    const [startDate, endDate] = range;
    if (endDate) {
      const isOverlapping = deleteStartDate.some(date => (date >= startDate && date <= endDate));
      if (isOverlapping) {
        setBookedAlert(true);
        setTimeout(() => setBookedAlert(false), 2000);
        return;
      }
    }
    setSelection(prev => ({ ...prev, startDate, endDate }));
  };

  function toLocalDateString(date) {
    if (!date) return "";
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  }

  const handleClick = () => {
    if (selection.size) {
      const cartItem = {
        ...selection,
        id: item.id,
        startDate: toLocalDateString(selection.startDate),
        endDate: toLocalDateString(selection.endDate),
        name: item.name,
        image: item.image,
        pricePerDay: currentPrice,
        size: selection.size
      };
      const checkCart = cart.filter(c => c.id === item.id);
      if (checkCart.length > 0) {
        setArticleBooked(true);
        setTimeout(() => setArticleBooked(false), 2000);
      } else {
        addItem(cartItem);
        setBooked(true);
        setTimeout(() => setBooked(false), 2000);
      }
    } else {
      setAlert(true);
      setTimeout(() => setAlert(false), 2000);
    }
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#dc2626' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 1px #dc2626' : 'none',
      '&:hover': { borderColor: '#dc2626' },
      borderRadius: '0.5rem',
      padding: '0.25rem'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#dc2626' : state.isFocused ? '#fee2e2' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      '&:hover': { backgroundColor: state.isSelected ? '#dc2626' : '#fee2e2' }
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 9999 })
  };

  if (!item) return <div className="animate-pulse bg-gray-200 h-80 rounded-2xl"></div>;

  return (
    <div className="group transition-all duration-300 hover:scale-105 h-full">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-visible flex flex-col h-full relative z-10 hover:z-30">
        <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100 h-80 flex-shrink-0">
          {item.image ? 
            <img className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-110" src={item.image} alt={item.name} /> : 
            <img className="w-full h-full object-cover" src={require('../assets/bannskirent.webp')} alt="Placeholder" />
          }
        </div>
        <div className="p-6 space-y-5 flex flex-col flex-grow">
          <div className="flex items-start justify-between border-b-2 border-gray-100 pb-4 gap-4">
            <div className="border-l-4 border-red-600 pl-4 flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-800 leading-tight">{item.name}</h3>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm text-gray-500 font-medium">Preis/Tag</p>
              <p className="text-2xl font-bold text-red-600 whitespace-nowrap">{currentPrice}€</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FontAwesomeIcon icon={faRuler} className="text-red-600" />
              Größe wählen
            </label>
            <Select 
              className="w-full" 
              value={selection.size} 
              onChange={(o) => setSelection(p => ({ ...p, size: o }))} 
              options={item.sizes}
              styles={customSelectStyles}
              placeholder="Größe auswählen..."
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FontAwesomeIcon icon={faCalendar} className="text-red-600" />
              Zeitraum wählen
            </label>
            <DatePicker
              className="border-2 border-gray-200 rounded-lg w-full py-3 px-4 text-center focus:border-red-600 focus:outline-none transition-colors"
              selected={selection.startDate}
              onChange={handleChange}
              startDate={selection.startDate}
              endDate={selection.endDate}
              selectsRange
              dateFormat="dd.MM.yyyy"
              excludeDates={deleteStartDate}
              minDate={new Date()}
              placeholderText="Zeitraum auswählen"
              calendarClassName="modern-datepicker"
              portalId="datepicker-portal"
            />
          </div>
          <div className="min-h-[40px]">
            {alert && <Alert />}
            {bookedAlert && <BookedAlert />}
            {articleBooked && <ArticleBooked />}
          </div>
          <div className="mt-auto">
            <button onClick={handleClick} className={`w-full py-4 rounded-lg font-bold text-white transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 shadow-md hover:shadow-lg ${booked ? 'bg-green-600' : 'bg-red-600'}`}>
              <FontAwesomeIcon icon={booked ? faCheck : faShoppingCart} />
              <span>{booked ? 'Hinzugefügt' : 'In den Warenkorb'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
