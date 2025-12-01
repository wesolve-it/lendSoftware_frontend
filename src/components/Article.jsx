import React, {useEffect, useState} from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import Alert from './Alert';
import { BookedAlert } from './Alert';
import ArticleBooked from './ArticleBooked';

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



  if (!item) return "Loading...";

  return (
    <div className="mt-10 border-2 w-5/6 mx-auto py-10 lg:w-5/12 xl:w-3/12 rounded-xl px-3">
      {item.image ? 
      <img className="w-52 h-72 mx-auto mb-6 object-contain" src={item.image}
           alt="Bild von dem Objekt"/> : <img className="w-52 h-52 mx-auto mb-6 object-cover" src={require('../assets/bannskirent.webp')}
           alt="Platzhalterbild"/>}
      <div className="flex-col flex mb-4">
        <p className="mb-2 font-semibold">Artikel:</p>
        <p>{item.name}</p>
      </div>
      <div className="flex-col flex mb-4">
        <p className="font-semibold mb-2">Größe: </p>
        <Select className="w-4/6 mx-auto" value={article.size} onChange={setArticle} options={item.sizes}/>
      </div>
      <div className="mb-4">
        <p className="font-semibold mb-2">Preis pro Tag:</p>
        <p>{price} €</p>
      </div>
      <div className="flex-col flex mb-10">
        <p className="font-semibold mb-2">Tage wählen:</p>
        <DatePicker
          className="border-2 rounded-lg w-4/6 py-3 text-center"
          selected={article.startDate}
          onChange={handleChange}
          startDate={article.startDate}
          endDate={article.endDate}
          selectsRange
          dateFormat="dd.M.yy"
          excludeDates={deleteStartDate}
          minDate={new Date()}
        />
      </div>
      {alert ? <Alert /> : null}
      {bookedAlert ? <BookedAlert /> : null}
      {articleBooked ? <ArticleBooked /> : null}
      <button onClick={handleClick} className="bg-red-600 text-white w-4/6 rounded-lg py-3">{booked ? 'Hinzugefügt' : 'In den Warenkorb'}</button>
    </div>
  )
}