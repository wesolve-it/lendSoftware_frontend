/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import Invoice from '../components/Invoice';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation, gql } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendar, faUndo, faFileInvoice, faTrash, faFilter, faChartLine } from '@fortawesome/free-solid-svg-icons';

// GraphQL Mutation definieren
const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id) {
      success
      message
    }
  }
`;

export default function AdminPage() {
  const [bookings, setBookings] = useState(null);
  const [sortedBookings, setSortedBookings] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [nameSearch, setNameSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 10;

  const [time, setTime] = useState({
    endDate: new Date(),
    startDate: new Date(),
  })

  // useMutation Hook
  const [deleteBooking, { loading: deleteLoading }] = useMutation(DELETE_BOOKING, {
    onCompleted: (data) => {
      if (data.deleteBooking.success) {
        alert('Buchung erfolgreich gelöscht!');
        closeInvoice();
        fetchBookings();
      } else {
        alert(`Fehler: ${data.deleteBooking.message}`);
      }
    },
    onError: (error) => {
      alert(`Fehler beim Löschen: ${error.message}`);
    }
  });

  const query = `
    {
      bookings {
        id
        firstName
        lastName
        email
        phoneNumber
        size {
          label
          articleSet {
            name
          }
          serialNumber
          pricePerDay
        }
        bookingDate
        startDate
        endDate
        street
        local
        note
        invoiceDownloaded
      }
    }
  `;

  const fetchBookings = () => {
    setIsRefreshing(true);
    window
      .fetch('https://backend.sportweber-schnaittach.de/graphql/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({query})
      })
      .then((response) => response.json())
      .then(({data, errors}) => {
        if (errors) {
          console.error(errors);
        }
        if (data && data.bookings && data.bookings.length !== 0) {
          const sorted = [...data.bookings].sort((a, b) => b.id - a.id);
          setBookings(data.bookings);
          setSortedBookings(sorted);
        } else {
          setBookings([]);
          setSortedBookings([]);
        }
      })
      .catch((error) => {
        console.error('Fehler beim Laden der Buchungen:', error);
        alert('Fehler beim Laden der Buchungen');
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSetback = () => {
    setNameSearch('');
    setTime({ endDate: new Date(), startDate: new Date() });
    fetchBookings();
  }

  const getVisiblePages = (currentPage, totalPages, maxVisible = 3) => {
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible -1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) {
      if (startPage > 2) pages.unshift("...");
      pages.unshift(1);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const handleChange = (range) => {
    const [startDate, endDate] = range;
    setTime({startDate: startDate, endDate: endDate})
  }

  const searchForName = () => {
    var newArray = sortedBookings.filter(item => item.lastName.toLowerCase() === nameSearch.toLowerCase());
    if (nameSearch === null || nameSearch === '') {
      fetchBookings();
    } else if (newArray.length > 0) {
      setSortedBookings(newArray);
    } else {
      alert('Dieser Name ist nicht vorhanden!')
    }
  }

  const searchForDate = () => {
    const startDate = new Date(time.startDate);
    const endDate = new Date(time.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("Bitte geben Sie ein gültiges Datum ein.");
      return;
    }

    const newArray = sortedBookings.filter((item) => {
      const itemStart = new Date(item.startDate);
      const itemEnd = new Date(item.endDate);
      return (itemStart <= endDate && itemEnd >= startDate);
    });

    if (newArray.length > 0) {
      setSortedBookings(newArray);
    } else {
      alert('Für den Zeitraum sind keine Daten vorhanden!');
    } 
  };

  const handleInvoice = (group) => {
    if (showInvoice && selectedGroup === group) {
      setShowInvoice(false);
      setSelectedGroup(null);
      setItemId(null);
    } else {
      setSelectedGroup(group);
      setItemId(group[0]);
      setShowInvoice(true);
    }
  }
  
  const closeInvoice = () => {
    setShowInvoice(false);
    setSelectedGroup(null);
    setItemId(null);
  }

  const handleDelete = (bookingId) => {
    if (window.confirm('Möchtest du diese Buchung wirklich löschen?')) {
      deleteBooking({
        variables: { id: bookingId }
      });
    }
  };

  const renderPagination = () => {
    const visiblePages = getVisiblePages(currentPage, totalPages);

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        {visiblePages.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                page === currentPage 
                  ? "bg-red-600 text-white shadow-lg scale-110" 
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 text-gray-400">
              ...
            </span>
          )
        )}
      </div>
    );
  };

  if (!bookings) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600 font-semibold">Lade Buchungen...</p>
      </div>
    </div>
  );

  const groupedBookings = sortedBookings.reduce((acc, booking) => {
    const key = `${booking.firstName}-${booking.lastName}-${booking.bookingDate}-${booking.startDate}-${booking.endDate}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(booking);
    return acc;
  }, {});

  const groupedItems = Object.values(groupedBookings);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = groupedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(groupedItems.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faChartLine} className="text-4xl" />
              <div>
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                {/* <p className="text-red-100 mt-1">Buchungsverwaltung</p> */}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
              <p className="text-sm text-red-100">Gesamt Buchungen</p>
              <p className="text-3xl font-bold">{groupedItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon icon={faFilter} className="text-red-600 text-xl" />
            <h2 className="text-2xl font-bold text-gray-900">Filter</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Nach Nachname suchen
              </label>
              <div className="flex gap-2">
                <input 
                  onChange={(e) => setNameSearch(e.target.value)} 
                  value={nameSearch}
                  placeholder='Nachname eingeben...' 
                  type='text' 
                  className='flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-red-600 focus:outline-none transition-colors' 
                />
                <button 
                  onClick={searchForName} 
                  className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md'
                >
                  <FontAwesomeIcon icon={faSearch} />
                  Suchen
                </button>
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Nach Zeitraum filtern
              </label>
              <div className="flex gap-2">
                <DatePicker
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-red-600 focus:outline-none transition-colors"
                  selected={time.startDate}
                  onChange={handleChange}
                  startDate={time.startDate}
                  endDate={time.endDate}
                  selectsRange
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Zeitraum wählen..."
                />
                <button 
                  className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md' 
                  onClick={searchForDate}
                >
                  <FontAwesomeIcon icon={faCalendar} />
                  Filtern
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button 
              className='bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md' 
              onClick={handleSetback}
            >
              <FontAwesomeIcon icon={faUndo} />
              Alle Filter zurücksetzen
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isRefreshing && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
              <div className="spinner mb-4"></div>
              <p className="text-gray-700 font-semibold text-lg">Daten werden aktualisiert...</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <Thead>
                <Tr className="bg-gray-50">
                  <Th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Name</Th>
                  <Th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Email</Th>
                  <Th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Telefon</Th>
                  <Th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Buchungsdatum</Th>
                  <Th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Zeitraum</Th>
                  <Th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Notiz</Th>
                  <Th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Rechnung</Th>
                  <Th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Aktionen</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((group, index) => (
                    <Tr 
                      key={index} 
                      className={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${
                        group[0].invoiceDownloaded ? 'bg-green-50' : ''
                      }`}
                    >
                      <Td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {group[0].firstName} {group[0].lastName}
                      </Td>
                      <Td className="px-6 py-4 text-sm text-gray-600">{group[0].email}</Td>
                      <Td className="px-6 py-4 text-sm text-gray-600">{group[0].phoneNumber}</Td>
                      <Td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(group[0].bookingDate).toLocaleDateString('de-DE')}
                      </Td>
                      <Td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(group[0].startDate).toLocaleDateString('de-DE')} - {new Date(group[0].endDate).toLocaleDateString('de-DE')}
                      </Td>
                      <Td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {group[0].note || '-'}
                      </Td>
                      <Td className="px-6 py-4 text-center">
                        <button 
                          className={`px-4 py-2 rounded-lg text-white font-semibold transition-all flex items-center gap-2 mx-auto ${
                            group[0].invoiceDownloaded 
                              ? 'bg-gray-400 hover:bg-gray-500' 
                              : 'bg-blue-600 hover:bg-blue-700 shadow-md'
                          }`} 
                          onClick={() => handleInvoice(group)}
                        >
                          <FontAwesomeIcon icon={faFileInvoice} />
                          Rechnung
                        </button>
                      </Td>
                      <Td className="px-6 py-4 text-center">
                        <button 
                          className={`px-4 py-2 rounded-lg text-white font-semibold transition-all flex items-center gap-2 mx-auto ${
                            deleteLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-md'
                          }`}
                          onClick={() => handleDelete(group[0].id)}
                          disabled={deleteLoading}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          {deleteLoading ? 'Löschen...' : 'Löschen'}
                        </button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-4">
                        <FontAwesomeIcon icon={faSearch} className="text-5xl text-gray-300" />
                        <p className="text-lg font-semibold">Keine Buchungen gefunden</p>
                        <p className="text-sm">Versuche andere Suchkriterien</p>
                      </div>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && renderPagination()}
      </div>

      {/* Invoice Modal */}
      {showInvoice && selectedGroup && (
        <Invoice itemId={itemId} bookings={selectedGroup} onClose={closeInvoice} />
      )}
    </div>
  )
}