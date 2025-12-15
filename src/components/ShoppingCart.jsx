import React, { useEffect, useState } from 'react'
import CartItem from "./CartItem";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faEnvelope, faPhone, faMapMarkerAlt, faNoteSticky } from '@fortawesome/free-solid-svg-icons';

const BOOK_CART = gql`
    mutation CreateBooking($firstName: String, $lastName: String, $email: String, $phoneNumber: String, $startDate: Date, $endDate: Date, $bookingDate: Date, $size: Int, $street: String, $local: String, $note: String) {
        createBooking(firstName: $firstName, lastName: $lastName, email: $email, phoneNumber: $phoneNumber, startDate: $startDate, endDate: $endDate, bookingDate: $bookingDate, sizeId: $size, street: $street, local: $local, note: $note) {
            id
            email
            firstName
            lastName
            startDate
            endDate
            sizeId
            street
            local
            note
        }
    }
`;

// **WICHTIGE KORREKTUR:**
// Die InputField-Komponente wurde hierher verschoben,
// damit sie nicht bei jedem Re-Render neu erstellt wird.
const InputField = ({ label, icon, error, ...props }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <FontAwesomeIcon icon={icon} className="text-red-600" />
        {label}
      </label>
      <input
          className={`w-full border-2 rounded-lg px-4 py-3 transition-colors focus:outline-none focus:border-red-600 ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          {...props}
      />
      {error && (
          <p className="text-red-600 text-sm flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
      )}
    </div>
);
// **ENDE DER KORREKTUR**

export default function ShoppingCart() {
  const [finalPrice, setFinalPrice] = useState(0)
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [street, setStreet] = useState('');
  const [local, setLocal] = useState('');
  const [note, setNote] = useState('');
  const [actualCart, setActualCart] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []);
  const [mutation, { loading }] = useMutation(BOOK_CART);
  const navigate = useNavigate();
  const [deleted, setDeleted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let price = 0;
    if (actualCart) {
      actualCart.forEach((item) => {
        let currentDate = new Date(item.startDate);
        while (currentDate <= new Date(item.endDate)) {
          price += parseInt(item.pricePerDay);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      })
      setFinalPrice(price);
    }
  }, [actualCart]);

  const handleBooking = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "Vorname ist erforderlich";
    if (!lastName) newErrors.lastName = "Nachname ist erforderlich";
    if (!phoneNumber) newErrors.phoneNumber = "Telefonnummer ist erforderlich";
    if (!street) newErrors.street = "Straße ist erforderlich";
    if (!local) newErrors.local = "Ort ist erforderlich";
    if (!email) newErrors.email = "Email ist erforderlich";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll zum ersten Fehler
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    // Keine Fehler - Mutation ausführen
    JSON.parse(localStorage.getItem('cart')).forEach((item) => {
      const startDate = item.startDate;
      const endDate = item.endDate;
      mutation({
        variables: {
          firstName,
          lastName,
          email,
          phoneNumber,
          startDate: startDate,
          endDate: endDate,
          bookingDate: new Date().toISOString().slice(0, 10),
          size: item.id,
          street,
          local,
          note,
        },
      });
      localStorage.removeItem('cart');
      navigate("/thank-you");
    });
  }

  const handleDelete = () => {
    setDeleted(!deleted);
  }

  useEffect(() => {
    setActualCart(JSON.parse(localStorage.getItem('cart')))
  }, [deleted]);

  return (
      <div className="bg-gray-50 min-h-screen pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-4">
              <FontAwesomeIcon icon={faShoppingCart} className="text-4xl" />
              <h1 className="text-4xl md:text-5xl font-bold">Warenkorb</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {actualCart && actualCart.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Deine Artikel</h2>
                    <div className="space-y-4">
                      {actualCart.map((item) => (
                          <CartItem item={item} key={item.id} deleted={handleDelete} />
                      ))}
                    </div>
                  </div>

                  {/* Kontaktformular */}
                  <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Kontaktdaten</h2>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField
                            label="Vorname*"
                            icon={faUser}
                            placeholder="Max"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            error={errors.firstName}
                        />
                        <InputField
                            label="Nachname*"
                            icon={faUser}
                            placeholder="Mustermann"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            error={errors.lastName}
                        />
                      </div>

                      <InputField
                          label="Email*"
                          icon={faEnvelope}
                          placeholder="max@beispiel.de"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          error={errors.email}
                      />

                      <InputField
                          label="Telefonnummer*"
                          icon={faPhone}
                          placeholder="+49 123 456789"
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          error={errors.phoneNumber}
                      />

                      <InputField
                          label="Straße + Hausnummer*"
                          icon={faMapMarkerAlt}
                          placeholder="Musterstraße 123"
                          type="text"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          error={errors.street}
                      />

                      <InputField
                          label="Postleitzahl + Ort*"
                          icon={faMapMarkerAlt}
                          placeholder="12345 Musterstadt"
                          type="text"
                          value={local}
                          onChange={(e) => setLocal(e.target.value)}
                          error={errors.local}
                      />

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <FontAwesomeIcon icon={faNoteSticky} className="text-red-600" />
                          Weitere Anmerkungen (optional)
                        </label>
                        <textarea
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 transition-colors focus:outline-none focus:border-red-600 hover:border-gray-300 min-h-[100px]"
                            placeholder="Besondere Wünsche oder Anmerkungen..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zusammenfassung - 1/3 width - Sticky */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Zusammenfassung</h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Artikel im Warenkorb:</span>
                        <span className="font-semibold">{actualCart.length}</span>
                      </div>

                      <div className="border-t-2 border-gray-100 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Gesamtpreis:</span>
                          <span className="text-3xl font-bold text-red-600">{finalPrice}€</span>
                        </div>
                      </div>
                    </div>

                    <button
                        onClick={handleBooking}
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
              </div>
          ) : (
              // Leerer Warenkorb
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
          )}
        </div>
      </div>
  )
}