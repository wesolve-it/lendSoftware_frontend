import React, { useEffect, useState, useMemo } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Article from '../components/Article'
import Select from "react-select";
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkiing, faHelmetSafety, faShoePrints, faChild } from '@fortawesome/free-solid-svg-icons';

export default function OverallPage({data, bookings}) {
  const [filter, setFilter] = useState(null);
  const [category, setCategory] = useState("Racecarver")
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    }
  }, [location]);

  // Derived state using useMemo to avoid re-calculating on every render
  const { helmets, sticks, shoes, kids, skiItems } = useMemo(() => {
    if (!data) return { helmets: [], sticks: [], shoes: [], kids: [], skiItems: [], bikes: [] };
    
    return {
      helmets: data.filter(item => parseInt(item.category.id) === 5),
      sticks: data.filter(item => parseInt(item.category.id) === 6),
      shoes: data.filter(item => parseInt(item.category.id) === 7),
      kids: data.filter(item => parseInt(item.category.id) === 4),
      skiItems: data.filter(item => parseInt(item.category.id) === 1),
      bikes: data.filter(item => parseInt(item.category.id) === 2)
    };
  }, [data]);

  const sizeOptions = useMemo(() => {
    const sizes = new Set();
    skiItems.forEach(item => {
      item.sizes.forEach(size => sizes.add(size.label));
    });
    
    return Array.from(sizes)
      .sort((a, b) => a - b)
      .map(size => ({ value: size, label: size }));
  }, [skiItems]);

  const filteredSki = useMemo(() => {
    if (!filter) return skiItems;
    
    return skiItems.filter(item => 
      item.sizes.some(size => size.label === filter.label)
    );
  }, [skiItems, filter]);

  // Filter by driving profile (category)
  const displayedSki = useMemo(() => {
    const categoryMap = {
      "Racecarver": 1,
      "Allroundcarver": 2,
      "Powder/Allmountain": 3
    };
    
    const targetProfileId = categoryMap[category];
    if (!targetProfileId) return [];

    return filteredSki.filter(item => parseInt(item.drivingProfile?.id) === targetProfileId);
  }, [filteredSki, category]);

  // Custom Styles for React-Select
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
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 to-red-800 text-white py-10">
        <div className="w-10/12 mx-auto max-w-screen-xl">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            SKI & BIKE RENT - Skier, Skischuhe und Bike Verleih bei Sport Weber
          </h1>
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

      {/* Bike Section */}
      {/* <img className="w-full h-auto" id="bike" src={require('../assets/bannerbikever.webp')} alt="Personen beim Fahrradfahren" /> */}
      {/* <div className="w-full bg-white py-16">
        <div className="w-10/12 mx-auto max-w-screen-xl"> */}
          {/* Section Header */}
          {/* <div className="flex items-center justify-center gap-4 mb-12">
            <FontAwesomeIcon icon={faBicycle} className="text-4xl text-red-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">BIKE-RENT</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {bikes.map((item) => (
              <Article item={item} key={item.id} bookings={bookings} />
            ))}
            {bikes.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                Keine Artikel in dieser Kategorie/Größe verfügbar.
              </div>
            )}
          </div>
          </div>
          </div> */}

      {/* Ski Section */}
      <img className="w-full h-auto" id="ski" src={require('../assets/bannskirent.webp')} alt="Personen beim Skifahren" />
      <div className="w-full bg-white py-16">
        <div className="w-10/12 mx-auto max-w-screen-xl">
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
                  options={sizeOptions}
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
                  {["Racecarver", "Allroundcarver", "Powder/Allmountain"].map((cat) => (
                    <button
                      key={cat}
                      className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                        category === cat 
                          ? "bg-red-600 text-white shadow-lg scale-105" 
                          : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                      }`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat === "Allroundcarver" ? "Pistenski" : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Articles Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {displayedSki.map((item) => (
              <Article item={item} key={item.id} bookings={bookings} />
            ))}
            {displayedSki.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                Keine Artikel in dieser Kategorie/Größe verfügbar.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accessoires Section */}
      <img className="w-full h-auto" id="accessoires" src={require('../assets/bannskirent.webp')} alt="Personen beim Skifahren" />
      <div className="w-full bg-gray-50 py-16">
        <div className="w-10/12 mx-auto max-w-screen-xl">
          
          {/* Skistöcke */}
          <div className="mb-20">
            <div className="flex items-center justify-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900">SKISTÖCKE</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
        <div className="w-10/12 mx-auto max-w-screen-xl">
          <div className="flex items-center justify-center gap-4 mb-12">
            <FontAwesomeIcon icon={faChild} className="text-4xl text-red-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">KINDER</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {kids.map((item) => (
              <Article item={item} key={item.id} bookings={bookings} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
