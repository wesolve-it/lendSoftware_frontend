import {useEffect, useState} from 'react';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ensurePdfWorker } from '../utils/pdfjs';


export default function Invoice({itemId, bookings, onClose}) {
  const [article] = useState(itemId);
  const [groupedBookings, setGroupedBookings] = useState([]);

  var str = "" + article.id;
  var pad = "0000";
  var ans = pad.substring(0, pad.length - str.length) + str;

  // Gruppiere Buchungen nach Zeitraum
  useEffect(() => {
    ensurePdfWorker();
    const groups = groupBookingsByPeriod(bookings, itemId);
    setGroupedBookings(groups);
  }, [bookings, itemId]);

  const calculatePrice = (art) => {
    let actualPrice = 0;
    let currentDate = new Date(art.startDate);
    while (currentDate <= new Date(art.endDate)) {
      if (currentDate.getDay() > 2 || currentDate.getDay() < 1) {
        actualPrice += parseInt(art.size.pricePerDay);
      } else {
        actualPrice += 0;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return actualPrice;
  };

  const calculateGroupPrice = (items) => {
    let price = 0;
    items.forEach((item) => {
      price += calculatePrice(item);
    });
    return price;
  };

  // Gruppierungs-Funktion
  const groupBookingsByPeriod = (bookings, customer) => {
    const groups = {};
    
    bookings
      .filter(item => 
        item.lastName === customer.lastName && 
        item.firstName === customer.firstName
      )
      .forEach(item => {
        const key = `${item.startDate}_${item.endDate}`;
        
        if (!groups[key]) {
          groups[key] = {
            startDate: item.startDate,
            endDate: item.endDate,
            items: []
          };
        }
        
        groups[key].items.push(item);
      });
    
    return Object.values(groups);
  };

  const downloadPDF = async () => {
    // Für jede Gruppe eine separate PDF erstellen
    for (const [index, group] of groupedBookings.entries()) {
      const receiptElement = document.getElementById(`receipt-${index}`);
      
      const canvas = await html2canvas(receiptElement, { scale: 2 });
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      const doc = new jsPDF("p", "mm", "a4");

      doc.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(canvas, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // AGB anhängen
      const pdfjsLib = await ensurePdfWorker();
      if (pdfjsLib) {
        const agbPdf = await pdfjsLib.getDocument("/AGB_Leasing-Verleih.pdf").promise;

        for (let i = 1; i <= agbPdf.numPages; i++) {
          const page = await agbPdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });

          const tempCanvas = document.createElement("canvas");
          const context = tempCanvas.getContext("2d");

          tempCanvas.width = viewport.width;
          tempCanvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          const imgData = tempCanvas.toDataURL("image/png");

          doc.addPage();
          doc.addImage(imgData, "PNG", 0, 0, imgWidth, pageHeight);
        }
      }

      // Speichere mit Zeitraum im Dateinamen
      const startDate = new Date(group.startDate).toLocaleDateString('de-DE');
      const endDate = new Date(group.endDate).toLocaleDateString('de-DE');
      doc.save(`Rechnung ${article.firstName} ${article.lastName} ${startDate}-${endDate}.pdf`);
    }

    // Status Update nur einmal für die erste Buchung
    updateInvoiceDownloaded(article.id);
  };

  const updateInvoiceDownloaded = (id) => {
    const mutation = `
      mutation {
        updateInvoiceDownloaded(id: "${id}") {
          booked {
            id
            invoiceDownloaded
          }
        }
      }
    `;

    window
      .fetch('https://backend.sportweber-schnaittach.de/graphql/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({query: mutation})
      })
      .then((response) => response.json())
      .then(({data, errors}) => {
        if (errors) {
          console.error(errors);
        }
      });
  };

  if(!article) return <p>Loading...</p>

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* Header mit Close Button */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold">Rechnung - {article.firstName} {article.lastName}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Invoice Content */}
        <div className="wrapper font-sans p-4">
          {groupedBookings.map((group, groupIndex) => {
            const groupPrice = calculateGroupPrice(group.items);
            
            return (
              <div key={groupIndex} style={{width: 650, borderWidth: 1, marginLeft: 'auto', marginRight: 'auto', marginBottom: 40}}>
                <div className="pt-10 px-10" id={`receipt-${groupIndex}`}>
                  <div>
                    <img src={require('../assets/SportWeberLogoStartseite.png')} alt="Firmenlogo" id="Logo" />
                  </div>
                  <div className="flex flex-row gap-28 mt-6">
                    <div>
                      <p className="text-left text-[10px]">Nürnberger Straße 51, 91220 Schnaittach</p>
                      <section className="h-[0.5px] w-60 bg-black mt-1" />
                      <div className="mt-3 text-left text-xs">
                        <p>{article?.lastName} {article?.firstName}</p>
                        <p>{article?.street}</p>
                        <p>{article?.local}</p>
                        <p>{article?.phoneNumber || null}</p>
                        <p>DE</p>
                      </div>
                      <div className="mt-6 text-left text-xs">
                        <p>Reservierungsnummer: {ans}-{groupIndex + 1}</p>
                        <p className="font-semibold">Zeitraum: {new Date(group.startDate).toLocaleDateString()} - {new Date(group.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-1 text-[10px]">
                      <div className="text-left">
                        <p>Nürnberger Straße 51</p>
                        <p>91220 Schnaittach</p>
                      </div>
                      <div className="mt-6 text-left">
                        <p>Telefon: 09153 220</p>
                        <p>kontakt@sportweber-schnaittach.de</p>
                        <p>Website: www.sportweber-schnaittach.de</p>
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-xs text-left mt-8">
                    <p>Mietvertrag zwischen Sportweber-Schnaittach und {article.lastName} {article.firstName}</p>
                  </div>

                  {group.items.map((item, index) => {
                    console.log(item);
                    return (
                      <div key={index} className="flex flex-row mt-10 text-xs">
                        {index === 3 ? <section className='h-52' /> : index === 9 ? <section className='h-60' /> : null}
                        <section className="basis-1/12 text-left">
                          <p>Pos.</p>
                          <section className="h-[0.5px] bg-black mt-2 mb-2" />
                          <p>{index+1}</p>
                        </section>
                        <section className="basis-6/12 text-left">
                          <p>Beschreibung</p>
                          <section className="h-[0.5px] bg-black mt-2 mb-2" />
                          <p>{item.size.articleSet[0].name ? item.size.articleSet[0].name : null}, Größe: {item.size ? item.size.label : null}</p>
                          <p className="font-light text-[10px]">{item.size.articleSet[0].name ? item.size.articleSet[0].name : null}</p>
                          <p className="font-light text-[10px]">ID: {item.size.serialNumber ? item.size.serialNumber : null} Bezeichnung: {item.size ? item.size.label : null}cm</p>
                        </section>
                        <section className="basis-1/12">
                          <p>Anzahl</p>
                          <section className="h-[0.5px] bg-black mt-2 mb-2" />
                          <p className="ml-12">1</p>
                        </section>
                        <section className="basis-1/12">
                          <p>Einzelpreis</p>
                          <section className="h-[0.5px] bg-black mt-2 mb-2" />
                          <p className="ml-4">{item.size.pricePerDay ? item.size.pricePerDay : null} €</p>
                        </section>
                        <section className="basis-2/12">
                          <p>USt.-Satz</p>
                          <section className="h-[0.5px] bg-black mt-2 mb-2" />
                          <p>19,00%</p>
                        </section>
                        <section className="basis-1/12 text-right">
                          <p>Gesamtpreis</p>
                          <section className="h-[0.5px] bg-black mt-2 mb-2" />
                          <p>{parseFloat(calculatePrice(item)).toFixed(2)} €</p>
                        </section>
                      </div>
                    )
                  })}

                  <section className='flex-1 text-xs mt-10 text-left'>
                    <p>Notiz:</p>
                    {article.note ? 
                      <p className='font-light mt-1'>{article.note}</p> :
                      <p></p>
                    }
                  </section>

                  <div className="flex flex-row mt-20 text-xs">
                    <section className="basis-1/12 text-left mr-2">
                      <p>Bezahlt</p>
                      <p>0.00€</p>
                    </section>
                    <section className="text-left basis-1/12 mr-2">
                      <p>Offen</p>
                      <p>{parseFloat(groupPrice).toFixed(2)}€</p>
                    </section>
                    <section className="text-left basis-1/12 mr-2">
                      <p>Ust.</p>
                      <p>{(parseFloat(groupPrice/1.19)*0.19).toFixed(2)}€</p>
                    </section>
                    <section className="basis-1/12 text-left mr-2">
                      <p>Netto</p>
                      <p>{parseFloat(groupPrice/1.19).toFixed(2)}€</p>
                    </section>
                    <section className="text-right">
                      <section className="h-0.5 bg-black mb-2 w-64 ml-20" />
                      <p>Rechnungsbetrag: {parseFloat(groupPrice).toFixed(2)}€</p>
                    </section>
                  </div>
                  <div className="mt-20 flex flex-row text-[10px] pb-20">
                    <section className="basis-4/12 text-left">
                      <section className="h-[0.5px] bg-black w-11/12" />
                      <p>(Datum)</p>
                    </section>
                    <section className="basis-4/12 text-left">
                      <section className="h-[0.5px] bg-black w-11/12" />
                      <p>(Mieter)</p>
                    </section>
                    <section className="basis-4/12 text-left">
                      <section className="h-[0.5px] bg-black" />
                      <p>(Vermieter)</p>
                    </section>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Buttons */}
          <div className="flex gap-4 justify-center pb-10">
            <button onClick={downloadPDF} className='bg-red-600 py-2 px-10 rounded-lg text-white'>
              Download {groupedBookings.length > 1 ? `(${groupedBookings.length} Rechnungen)` : ''}
            </button>
            <button onClick={onClose} className='bg-gray-500 py-2 px-10 rounded-lg text-white'>
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
