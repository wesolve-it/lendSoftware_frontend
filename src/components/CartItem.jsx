import React, {useEffect, useState} from 'react'

export default function CartItem({item, deleted}) {
  const [finalPrice, setFinalPrice] = useState(0);

  const diffTime = Math.abs(new Date(item.startDate) - new Date(item.endDate));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const startDate = new Date(item.startDate).toLocaleDateString();
  const endDate = new Date(item.endDate).toLocaleDateString();

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
    let items = JSON.parse(localStorage.getItem('cart'));

    items.map((article, index) => {
      if (article.id === item.id) {
        items.splice(index, 1);
      }
      return true;
    })
    items = JSON.stringify(items);
    localStorage.setItem('cart', items);
  }


  return (
    <div className="flex flex-col lg:flex-row border-2 p-10 lg:relative">
      <div className="basis-1/2">
        {item.image ? <img className="h-56 w-56 mb-6 object-contain mx-auto" src={item.image} alt="Objektbild" /> : <img className="h-56 w-56 mb-6 lg:ml-20 object-cover" src={require('../assets/bannskirent.webp')} alt="Platzhalterbild" /> }
      </div>
      <div className="flex flex-col text-left leading-8">
        <p><span className="font-bold text-xl">{item.name}</span></p>
        <p><span className="font-semibold">Größe:</span> {item.label}</p>
        <p><span className="font-semibold">Preis pro Tag:</span> {parseInt(item.pricePerDay)} €</p>
        <p><span className="font-semibold">Von:</span> {startDate}</p>
        <p><span className="font-semibold">Bis:</span> {endDate}</p>
        <p><span className="font-semibold">Tage gebucht:</span> {diffDays+1}</p>
        <p><span className="font-semibold">Gesamtpreis:</span> {finalPrice} €</p>
      </div>
      <button className="bg-red-600 mt-6 py-1 lg:h-10 lg:px-4 lg:absolute lg:right-4 lg:bottom-4" onClick={() => {deleteItem(); deleted()}}><span className="text-white">Löschen</span></button>
    </div>
  )
}
