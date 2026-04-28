import React, { useState, useCallback, useMemo, useEffect } from 'react';
import axiosClient from '../config/axios';
import BookingFormModal from '../components/BookingsPage/BookingFormModal'; 
import ConfirmationModal from '../components/common/ConfirmationModal';
import SeatChart from '../components/SeatMatrixPage/SeatChart';
import UserDetailsModal from '../components/SeatMatrixPage/UserDetailsModal';
import FilterControls from '../components/SeatMatrixPage/FilterControls';
import UserTable from '../components/SeatMatrixPage/UserTable';
import { getRenewalStatus } from '../utils/helperFunctions';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { LayoutGrid, List, AlertCircle } from 'lucide-react';

const TOTAL_LIBRARY_SEATS = 109;

const SeatMatrixPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Selection
  const [currentBooking, setCurrentBooking] = useState(undefined);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [userForDetails, setUserForDetails] = useState(null);
  const [bookingForDetails, setBookingForDetails] = useState(null);

  // View & Filters
  const [view, setView] = useState('map'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [filterRenewal, setFilterRenewal] = useState('All');
  const [filterAvailable, setFilterAvailable] = useState(false);

  const fetchSeats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/seats/list');
      if (response.data.status === 'ok') {
        setBookings(response.data.seats);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Error fetching seats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  // Calculate active user IDs to exclude them in modal
  const activeUserIds = useMemo(() => {
    const ids = new Set();
    bookings.forEach(b => {
        if (b.user && b.user._id) {
            ids.add(b.user._id);
        }
    });
    return ids;
  }, [bookings]);

  const { filteredTableData, isFiltering, occupiedSlots } = useMemo(() => {
    const currentOccupiedSlots = bookings.map(b => ({
        booking: b,
        user: b.user
    }));

    const seatMap = new Map();

    currentOccupiedSlots.forEach(slot => {
      const { booking } = slot;
      if (booking.shift === 'fullday') {
        seatMap.set(`${booking.seatNo}-first`, slot);
        seatMap.set(`${booking.seatNo}-second`, slot);
      } else {
        seatMap.set(`${booking.seatNo}-${booking.shift}`, slot);
      }
    });

    const allSlots = [];

    for (let i = 1; i <= TOTAL_LIBRARY_SEATS; i++) {
        const morningKey = `${i}-first`;
        const eveningKey = `${i}-second`;
        
        const morningSlot = seatMap.get(morningKey);
        const eveningSlot = seatMap.get(eveningKey);

        if (morningSlot) {
            allSlots.push({ ...morningSlot, visualShift: 'first' });
        } else {
            allSlots.push({ isAvailable: true, seatNo: i, shift: 'first', visualShift: 'first' });
        }

        if (eveningSlot) {
            allSlots.push({ ...eveningSlot, visualShift: 'second' });
        } else {
            allSlots.push({ isAvailable: true, seatNo: i, shift: 'second', visualShift: 'second' });
        }
    }

    const isFilteringActive = searchTerm.trim() !== '' || filterShift !== 'All' || filterPayment !== 'All' || filterRenewal !== 'All' || filterAvailable;
    
    if (!isFilteringActive) {
        return { filteredTableData: allSlots, isFiltering: false, occupiedSlots: currentOccupiedSlots };
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    const filteredRows = allSlots.filter(item => {
        const isAvailable = 'isAvailable' in item;
        const seatNo = isAvailable ? item.seatNo : item.booking.seatNo;
        
        if (filterAvailable && !isAvailable) return false;

        if (lowerSearchTerm) {
            const seatMatch = seatNo.toString().includes(lowerSearchTerm);
            let userMatch = false;
            if (!isAvailable) {
                userMatch = 
                    (item.user.username && item.user.username.toLowerCase().includes(lowerSearchTerm)) ||
                    (item.user.contactNo && item.user.contactNo.includes(lowerSearchTerm));
            }
            if (!seatMatch && !userMatch) return false;
        }

        if (filterShift !== 'All') {
            if (filterShift === 'fullday') {
                if (isAvailable) return false;
                if (item.booking.shift !== 'fullday') return false;
            } else {
                if (item.visualShift !== filterShift) return false;
            }
        }

        if (!isAvailable) {
            if (filterPayment !== 'All' && item.booking.payment.status !== filterPayment) return false;
            if (filterRenewal !== 'All' && getRenewalStatus(item.booking.endDate) !== filterRenewal) return false;
        }

        return true;
    });

    return { filteredTableData: filteredRows, isFiltering: true, occupiedSlots: currentOccupiedSlots };
  }, [bookings, searchTerm, filterShift, filterPayment, filterRenewal, filterAvailable]);

  const seatsToHighlight = useMemo(() => {
    return new Set(filteredTableData.map(item => 'isAvailable' in item ? item.seatNo : item.booking.seatNo));
  }, [filteredTableData]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm(''); setFilterShift('All'); setFilterPayment('All'); setFilterRenewal('All'); setFilterAvailable(false);
  }, []);

  const handleFilterAvailableChange = useCallback((value) => {
    setFilterAvailable(value);
    if (value) { setFilterPayment('All'); setFilterRenewal('All'); }
  }, []);

  const handleAddUserToSeat = useCallback((seatNo, shift) => {
    setCurrentBooking({ seatNo, shift });
    setIsBookingModalOpen(true);
  }, []);
  
  const handleEditBooking = useCallback((user, booking) => {
    setCurrentBooking(booking);
    setIsBookingModalOpen(true);
  }, []);
  
  const handleShowDetails = useCallback((user, booking) => {
    setUserForDetails(user); 
    setBookingForDetails(booking);
    setIsDetailsModalOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((booking) => {
    setBookingToDelete(booking); 
    setIsDeleteModalOpen(true);
  }, []);
  
  const handleConfirmDelete = useCallback(async () => {
    if (bookingToDelete) {
      try {
        await axiosClient.delete(`/bookings/${bookingToDelete._id}`);
        setBookings(prev => prev.filter(b => b._id !== bookingToDelete._id));
      } catch (e) {
        console.error("Delete failed", e);
      }
      setIsDeleteModalOpen(false); 
      setBookingToDelete(null);
    }
  }, [bookingToDelete]);

  const handleBookingFormSubmit = useCallback(async (bookingData) => {
    try {
        if (bookingData._id) {
            await axiosClient.put(`/bookings/${bookingData._id}`, bookingData);
        } else {
            // Use New API Endpoint
            await axiosClient.post('/bookings/add', bookingData);
        }
        
        // Refetch to get new layout
        fetchSeats();
        
        setIsBookingModalOpen(false);
        setCurrentBooking(undefined);
    } catch (err) {
        console.error("Save failed", err);
        alert(err.response?.data?.message || err.response?.data?.error || "Failed to save booking");
    }
  }, [fetchSeats]);

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-skin-base min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-skin-text">Seat Management</h1>
            <p className="text-skin-muted mt-1">Manage seat allocation, shifts, and occupancy.</p>
          </div>
          
          <div className="bg-skin-surface p-1 rounded-lg border border-skin-border shadow-sm flex items-center transition-colors duration-300">
            <button 
                onClick={() => setView('map')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'map' ? 'bg-brand-teal text-white shadow' : 'text-skin-muted hover:bg-skin-base'}`}
            >
                <LayoutGrid className="w-4 h-4" /> Map View
            </button>
            <button 
                onClick={() => setView('table')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'table' ? 'bg-brand-teal text-white shadow' : 'text-skin-muted hover:bg-skin-base'}`}
            >
                <List className="w-4 h-4" /> Table View
            </button>
          </div>
        </div>

        {error && (
            <div className="p-4 mb-6 flex items-center gap-3 text-red-700 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30 rounded-xl">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
            </div>
        )}
        
        <FilterControls
            searchTerm={searchTerm} onSearchTermChange={setSearchTerm}
            filterShift={filterShift} onFilterShiftChange={setFilterShift}
            filterPayment={filterPayment} onFilterPaymentChange={setFilterPayment}
            filterRenewal={filterRenewal} onFilterRenewalChange={setFilterRenewal}
            onClearFilters={handleClearFilters}
            filterAvailable={filterAvailable} onFilterAvailableChange={handleFilterAvailableChange}
        />

        {isLoading ? (
           <LoadingSpinner />
        ) : view === 'map' ? (
          <SeatChart
            occupiedSlots={occupiedSlots} 
            totalSeats={TOTAL_LIBRARY_SEATS}
            onAddUser={handleAddUserToSeat} 
            onEditBooking={handleEditBooking}
            onDeleteBooking={handleDeleteRequest} 
            onShowDetails={handleShowDetails}
            isFiltering={isFiltering} 
            seatsToHighlight={seatsToHighlight}
          />
        ) : (
          <UserTable 
            data={filteredTableData} 
            onEditBooking={handleEditBooking}
            onDeleteBooking={handleDeleteRequest} 
            onShowDetails={handleShowDetails}
            onAddUserToSeat={handleAddUserToSeat}
          />
        )}
      </div>

      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => { setIsBookingModalOpen(false); setCurrentBooking(undefined); }}
        onSubmit={handleBookingFormSubmit}
        initialBooking={currentBooking}
        activeUserIds={activeUserIds} // Pass active user IDs
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete} title="Release Seat"
        message={`Are you sure you want to cancel this booking?`}
      />

      <UserDetailsModal
        isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}
        user={userForDetails} booking={bookingForDetails}
      />
    </main>
  );
};

export default SeatMatrixPage;