import React, { useEffect, useState } from 'react'
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import ContactForm from './ContactForm';
import CartItemList from './CartItemList';

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

export default function ShoppingCart() {
  const [finalPrice, setFinalPrice] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    street: '',
    local: '',
    note: ''
  });
  const [errors, setErrors] = useState({});
  
  const { cart, clearCart } = useCart();
  const [mutation, { loading }] = useMutation(BOOK_CART);
  const navigate = useNavigate();

  useEffect(() => {
    let price = 0;
    const msPerDay = 24 * 60 * 60 * 1000;
    if (cart) {
      cart.forEach((item) => {
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        const dayCount = Math.max(1, Math.floor((endDay - startDay) / msPerDay) + 1);
        price += parseInt(item.pricePerDay) * dayCount;
      })
      setFinalPrice(price);
    }
  }, [cart]);

  const validate = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'street', 'local', 'email'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field} ist erforderlich`; // Improved slightly, though original had German labels
      }
    });

    // Translate technical field names to user-friendly German errors
    if (!formData.firstName) newErrors.firstName = "Vorname ist erforderlich";
    if (!formData.lastName) newErrors.lastName = "Nachname ist erforderlich";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Telefonnummer ist erforderlich";
    if (!formData.street) newErrors.street = "Straße ist erforderlich";
    if (!formData.local) newErrors.local = "Ort ist erforderlich";
    if (!formData.email) newErrors.email = "Email ist erforderlich";

    return newErrors;
  };

  const handleBooking = async () => {
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    const items = cart || [];
    await Promise.all(items.map((item) => {
      return mutation({
        variables: {
          ...formData,
          startDate: item.startDate,
          endDate: item.endDate,
          bookingDate: new Date().toISOString().slice(0, 10),
          size: item.id,
        },
      });
    }));
    clearCart();
    navigate("/thank-you");
  }

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
          {cart && cart.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items & Form - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                  <CartItemList cart={cart} />

                  <ContactForm 
                    formData={formData} 
                    setFormData={setFormData} 
                    errors={errors} 
                  />
                </div>

                {/* Zusammenfassung - 1/3 width - Sticky */}
                <CartSummary 
                  cartCount={cart.length} 
                  finalPrice={finalPrice} 
                  onBooking={handleBooking} 
                  loading={loading} 
                />
              </div>
          ) : (
              <EmptyCart />
          )}
        </div>
      </div>
  )
}
