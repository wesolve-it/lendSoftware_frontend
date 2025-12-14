import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Article from '../components/Article'
import Select from "react-select";
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkiing, faHelmetSafety, faShoePrints, faChild } from '@fortawesome/free-solid-svg-icons';

export default function OverallPage({data, bookings}) {
  const [filter, setFilter] = useState(null);
  const [sizeOption, setSizeOption] = useState([]);
  const [category, setCategory] = useState("Racecarver")
  const [ski, setSki] = useState([]);
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

  // Custom Styles für React-Select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#dc2626' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(220, 38, 38, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#dc2626'
      },
      borderRadius: '0.75rem',
      padding: '0.5rem',
      minHeight: '3rem'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#dc2626' : state.isFocused ? '#fee2e2' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      '&:hover': {
        backgroundColor: state.isSelected ? '#dc2626' : '#fee2e2'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af'
    })
  };

  if (!data) return (
    <div className="flex justify-center items-center h-screen">
      <div className="spinner"></div>
    </div>
  );

  let helmets = data.filter(item => parseInt(item.category.id) === 5)
  let sticks = data.filter(item => parseInt(item.category.id) === 6)
  let shoes = data.filter(item => parseInt(item.category.id) === 7)
  let kids = data.filter(item => parseInt(item.category.id) === 4)
  let racecarver = ski.filter(item => parseInt(item.drivingProfile?.id) === 1);
  let allround = ski.filter(item => parseInt(item.drivingProfile?.id) === 2);
  let powder = ski.filter(item => parseInt(item.drivingProfile?.id) === 3);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-10">
        <div className="w-10/12 mx-auto max-w-screen-xl">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            SKI & BIKE RENT - Skier, Skischuhe und Bike Verleih bei Sport Weber
          </h1>
          {/* <p className="text-xl text-center text-red-100 mb-8">
            Skier, Skischuhe und Bike Verleih bei Sport Weber
          </p> */}
        </div>
      </div>

      {/* Info Section */}
      <div className="w-10/12 mx-auto max-w-screen-xl py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-6 text-gray-700 leading-relaxed">
          <p>
            Wir kennen das Gefühl nur zu gut, das den Kauf neuer Sportausrüstung begleitet. Das Hin- und Herüberlegen vorher. Das Herzklopfen beim ausprobieren. Die freudige Spannung bei der Fahrt und das unbeschreibliche Glücksgefühl, wenn du noch höher, noch schneller und noch weiter als je zuvor kommst. Trotzdem rechtfertigt nicht jedes Hobby, jeder Ausflug oder jede Urlaubsreise die hohen Anschaffungskosten für Skier, Skieschuhe, Skistöcke und Fahrräder.
          </p>
          <p>
            Machen wir uns nichts vor: Das Leihen von Sportausrüstung ist nicht ganz so aufregend und schüttet womöglich auch weniger Glückshormone aus. Dafür aber schont es Ihren Geldbeutel enorm – und bewahrt Sie vielleicht vor einer teuren Fehlinvestition. Das Ausleihen bei Sport Weber hat zudem noch einen entscheidenden Vorteil:
          </p>
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg">
            <p className="font-semibold text-red-900">
              💡 Kaufoption: Falls Sie sich so sehr in das Leihgerät verlieben, dass Sie es am liebsten gleich behalten möchten, rechnen wir Ihnen innerhalb von sechs Monaten die Leihgebühr auf den Kaufpreis an. Bitte haben jedoch Sie Verständnis dafür, dass wir Ihnen auf diesem Wege nur maximal 10 % des Kaufpreises auf Basis der Leihgebühr erstatten können.
            </p>
          </div>
          <p>
            In unserem Leihservice finden Sie eine große Auswahl an Skier, Skischuhen, Stöcke, E-Bikes und Fahrrädern. Egal ob für Urlaub, Ausflug oder nur zum Test vor dem Kauf. Unser Angebot an Leihgeräten wird stetig erweitert. Falls Sie ein Produkt nicht auf der Liste finden kontaktieren Sie uns einfach.
          </p>
          <p className="text-sm text-gray-600 italic">
            Die angegebenen Leihpreise werden pro Tag berechnet.
          </p>
        </div>
      </div>

      {/* Ski Section */}
      <img className="w-full h-auto" id="ski" src={require('../assets/bannskirent.webp')} alt="Personen beim Skifahren" />
      <div className="w-full bg-white py-16">
        <div className="max-w-screen-2xl mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <FontAwesomeIcon icon={faSkiing} className="text-4xl text-red-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">SKI-RENT</h2>
          </div>

          {/* Filter Section */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-6 md:p-8 mb-12">
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Größe filtern
                </label>
                <Select 
                  className="w-full" 
                  value={filter} 
                  onChange={setFilter} 
                  options={sizeOption}
                  styles={customSelectStyles}
                  placeholder="Alle Größen anzeigen..."
                  isClearable
                />
              </div>

              {/* Category Tabs */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Ski-Kategorie
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      category === "Racecarver" 
                        ? "bg-red-600 text-white shadow-lg scale-105" 
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                    }`}
                    onClick={() => setCategory("Racecarver")}
                  >
                    Racecarver
                  </button>
                  <button
                    className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      category === "Allroundcarver" 
                        ? "bg-red-600 text-white shadow-lg scale-105" 
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                    }`}
                    onClick={() => setCategory("Allroundcarver")}
                  >
                    Pistenski
                  </button>
                  <button
                    className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                      category === "Powder/Allmountain" 
                        ? "bg-red-600 text-white shadow-lg scale-105" 
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                    }`}
                    onClick={() => setCategory("Powder/Allmountain")}
                  >
                    Powder/Allmountain
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Articles Display */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-16">
            {category === "Racecarver" && racecarver.map((item) => (
              <Article item={item} key={item.id} bookings={bookings} />
            ))}
            {category === "Allroundcarver" && allround.map((item) => (
              <Article item={item} key={item.id} bookings={bookings} />
            ))}
            {category === "Powder/Allmountain" && powder.map((item) => (
              <Article item={item} key={item.id} bookings={bookings} />
            ))}
          </div>
        </div>
      </div>

      {/* Accessoires Section */}
      <img className="w-full h-auto" id="accessoires" src={require('../assets/bannskirent.webp')} alt="Personen beim Skifahren" />
      <div className="w-full bg-gray-50 py-16">
        <div className="max-w-screen-2xl mx-auto px-4">
          
          {/* Skistöcke */}
          <div className="mb-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900">SKISTÖCKE</h2>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {sticks.map((item) => (
                <Article item={item} key={item.id} bookings={bookings} />
              ))}
            </div>
          </div>

          {/* Skihelme */}
          <div className="mb-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <FontAwesomeIcon icon={faHelmetSafety} className="text-3xl text-red-600" />
              <h2 className="text-3xl font-bold text-gray-900">SKIHELME</h2>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {helmets.map((item) => (
                <Article item={item} key={item.id} bookings={bookings} />
              ))}
            </div>
          </div>

          {/* Skischuhe */}
          <div className="mb-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <FontAwesomeIcon icon={faShoePrints} className="text-3xl text-red-600" />
              <h2 className="text-3xl font-bold text-gray-900">SKISCHUHE</h2>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {shoes.map((item) => (
                <Article item={item} key={item.id} bookings={bookings} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Kinder Section */}
      <img className="w-full h-auto" id="kinder" src={require('../assets/bannskirent.webp')} alt="Personen beim Skifahren" />
      <div className="w-full bg-white py-16">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-12">
            <FontAwesomeIcon icon={faChild} className="text-4xl text-red-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">KINDER</h2>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-16">
            {kids.map((item) => (
              <Article item={item} key={item.id} bookings={bookings} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}