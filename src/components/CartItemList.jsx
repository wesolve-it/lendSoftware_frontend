import React from 'react';
import CartItem from './CartItem';

const CartItemList = ({ cart }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Deine Artikel</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <CartItem item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default CartItemList;
