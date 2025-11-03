import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Article from '../components/Article'
import Select from "react-select";
import { useLocation } from 'react-router-dom';

export default function OverallPage({data, bookings}) {
  const [filter, setFilter] = useState(null);
  const [sizeOption, setSizeOption] = useState([]);
  const [category, setCategory] = useState("Racecarver")
  const [ski, setSki] = useState([]);
  //const [bike, setBike] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const elementId = location.hash.substring(1);
    scrollToElement(elementId);
  }, [location]);

  useEffect(() => {
    let sizes = [];
    let endSizes = [];
    const ski = data.filter(item => parseInt(item.category.id) === 1);
    Object.entries(ski).forEach(([key, value]) => value.sizes.forEach((item) => sizes.push(item.label)));
    sizes = [...new Set(sizes)].slice().sort((a, b) => a - b);
    sizes.forEach((size) => endSizes.push({value: size, label: size}))
    setSizeOption(endSizes);
    setSki(data.filter(item => parseInt(item.category.id) === 1))
    //setBike(data.filter(item => parseInt(item.category.id) === 2))
  }, [data])

  useEffect(() => {
    let array = [];
    let newArray = data.filter(item => parseInt(item.category.id) === 1)
    if (filter) {
      newArray.map((item) => {
        item.sizes.forEach((size) => {
          if (size.label === filter.label) {
            array.push(item);
          }
        })
        return true;
      })
      setSki(array);
    }
  }, [filter, data]);

  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }

  if (!data) return "Loading...";

  let bikes = data.filter(item => parseInt(item.category.id) === 2)
  let helmets = data.filter(item => parseInt(item.category.id) === 5)
  let sticks = data.filter(item => parseInt(item.category.id) === 6)
  let shoes = data.filter(item => parseInt(item.category.id) === 7)
  let kids = data.filter(item => parseInt(item.category.id) === 4)
  let racecarver = ski.filter(item => parseInt(item.drivingProfile?.id) === 1);
  let allround = ski.filter(item => parseInt(item.drivingProfile?.id) === 2);
  let powder = ski.filter(item => parseInt(item.drivingProfile?.id) === 3);

  return (
    <>
      <div className="w-10/12 text-left mx-auto mt-12 max-w-screen-xl">
        <h1 className="text-center text-2xl font-bold text-gray-900 mb-8">SKI & BIKE RENT - Skier, Skischuhe und Bike Verleih bei Sport Weber</h1>
        <p className="mb-8">Wir kennen das Gefühl nur zu gut, das den Kauf neuer Sportausrüstung begleitet. Das Hin- und Herüberlegen vorher. Das Herzklopfen beim ausprobieren. Die freudige Spannung bei der Fahrt und das unbeschreibliche Glücksgefühl, wenn du noch höher, noch schneller und noch weiter als je zuvor kommst. Trotzdem rechtfertigt nicht jedes Hobby, jeder Ausflug oder jede Urlaubsreise die hohen Anschaffungskosten für Skier, Skieschuhe, Skistöcke und Fahrräder. Machen wir uns nichts vor: Das Leihen von Sportausrüstung ist nicht ganz so aufregend und schüttet womöglich auch weniger Glückshormone aus. Dafür aber schont es Ihren Geldbeutel enorm – und bewahrt Sie vielleicht vor einer teuren Fehlinvestition. Das Ausleihen bei Sport Weber hat zudem noch einen entscheidenden Vorteil:</p>
        <p className="mb-8">Falls Sie sich so sehr in das Leihgerät verlieben, dass Sie es am liebsten gleich behalten möchten, rechnen wir Ihnen innerhalb von sechs Monaten die Leihgebühr auf den Kaufpreis an. Bitte haben jedoch Sie Verständnis dafür, dass wir Ihnen auf diesem Wege nur maximal 10 % des Kaufpreises auf Basis der Leihgebühr erstatten können.</p>
        <p className="mb-8">In unserem Leihservice finden Sie eine große Auswahl an Skier, Skischuhen, Stöcke, E-Bikes und Fahrrädern. Egal ob für Urlaub, Ausflug oder nur zum Test vor dem Kauf. Unser Angebot an Leihgeräten wird stetig erweitert. Falls Sie ein Produkt nicht auf der Liste finden kontaktieren Sie uns einfach.</p>
        <p className="mb-2">Die angegebenen Leihpreise werden pro Tag berechnet.</p>
        <p className="text-red-600 font-bold">Wir berechnen den Montag und Dienstag nicht, da hier unser Geschäft auch nicht geöffnet ist.</p>
      </div>
      <img className="w-full h-auto mt-10" id="ski" src={require('../assets/bannskirent.webp')} alt="Personen beim  Skifahren" />
      <div className="mt-16 max-w-screen-2xl mx-auto">
        <h2 className="uppercase font-bold text-2xl">Ski-Rent</h2>
        <p className='mt-10 mb-4 font-semibold'>Größe wählen</p>
        <Select className="w-4/6 md:w-1/3 lg:w-1/4 mx-auto" value={sizeOption.value} onChange={setFilter} options={sizeOption}/>
        <div>
        <div>
      {/* Zentral ausgerichteter Selektor */}
      <div className="flex flex-col lg:flex-row justify-center space-y-4 w-2/3 mx-auto lg:w-full lg:space-x-4 py-4 mb-2 mt-6">
        <button
          className={`px-6 h-11 mt-4 py-2 border rounded-lg ${
            category === "Racecarver" ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setCategory("Racecarver")}
        >
          Racecarver
        </button>
        <button
          className={`px-4 py-2 border rounded-lg ${
            category === "Allroundcarver" ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setCategory("Allroundcarver")}
        >
          Allroundcarver
        </button>
        <button
          className={`px-4 py-2 border rounded-lg ${
            category === "Powder/Allmountain" ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setCategory("Powder/Allmountain")}
        >
          Powder/Allmountain
        </button>
      </div>

      {/* Artikelanzeige */}
      <div className="flex flex-col lg:flex-row lg:w-11/12 mx-auto lg:flex-wrap lg:gap-2 mb-32 justify-start">
        {category === "Racecarver" && (
          <>
            {racecarver.map((item) => (
              <Article item={item} key={item.id} bookings={bookings} />
            ))}
          </>
        )}
        {category === "Allroundcarver" && (
          <>
            {allround.map((item) => (
              <Article item={item} key={item.id} bookings={bookings} />
            ))}
          </>
        )}
        {category === "Powder/Allmountain" && (
          <>
            {powder.map((item) => (
              <Article item={item} key={item.id} bookings={bookings} />
            ))}
          </>
        )}
      </div>
    </div>
</div>
      </div>
      <img className="w-full h-auto mt-10" id="accessoires" src={require('../assets/bannskirent.webp')} alt="Personen beim  Skifahren" />
      <div className="mt-16">
        <h2 className="uppercase font-bold text-2xl mt-12">Skistecken</h2>
        <div className="flex flex-col lg:flex-row lg:w-11/12 mx-auto max-w-screen-xl lg:flex-wrap mb-32 lg:gap-2 justify-start">
          {sticks.map((item) => (<Article item={item} key={item.id} bookings={bookings} />))}
        </div>
        <h2 className="uppercase font-bold text-2xl mt-12">Skihelme</h2>
        <div className="flex flex-col lg:flex-row lg:w-11/12 mx-auto max-w-screen-2xl lg:flex-wrap mb-32 lg:gap-2">
          {helmets.map((item) => (<Article item={item} key={item.id} bookings={bookings} />))}
        </div>
        <h2 className="uppercase font-bold text-2xl mt-12">Skischuhe</h2>
        <div className="flex flex-col lg:flex-row lg:w-11/12 mx-auto max-w-screen-2xl lg:flex-wrap mb-32 lg:gap-2">
          {shoes.map((item) => (<Article item={item} key={item.id} bookings={bookings} />))}
        </div>
        <img className="w-full h-auto mt-10" id="kinder" src={require('../assets/bannskirent.webp')} alt="Personen beim  Skifahren" />
        <div className="mt-16">
        <h2 className="uppercase font-bold text-2xl mt-12">Kinder</h2>
        <div className="flex flex-col lg:flex-row lg:w-11/12 mx-auto max-w-screen-2xl lg:flex-wrap mb-32 lg:gap-2 justify-items-start">
          {kids.map((item) => (<Article item={item} key={item.id} bookings={bookings} />))}
        </div>
        </div>
        {/* <img className="w-full h-auto mt-10" src={require('../assets/bannerbikever.webp')} alt="Personen beim Fahrradfahren"/>
        <div className="mt-16">
          <h2 className="uppercase font-bold text-2xl">Bike-Rent</h2>
        <div className="flex flex-col lg:flex-row lg:w-11/12 mx-auto max-w-screen-2xl lg:flex-wrap mb-32 lg:gap-2">
            {bikes.map((item) => (<Article item={item} key={item.id} bookings={bookings} />))}
        </div>
        </div> */}
      </div>
    </>
  )
}
