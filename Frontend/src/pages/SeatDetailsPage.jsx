import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, History, Clock, Calendar, Edit2, Trash2, UserCheck, ShieldCheck } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import axiosClient from '../config/axios';

const SeatDetailsPage = () => {
  const { seatNumber } = useParams();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchSeatHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/seats/bookings/${seatNumber}?page=${page}&limit=10`);
      if (response.data.status === "ok") {
        setBookings(response.data.bookings);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [seatNumber, page]);

  useEffect(() => {
    fetchSeatHistory();
  }, [fetchSeatHistory]);

  // Determine current occupancy status
  const occupancy = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBookings = bookings.filter(b => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return today >= start && today <= end;
    });

    // 1. Check for Full Day first
    const fullDay = activeBookings.find(b => b.shift === 'fullday');
    if (fullDay) return { type: 'full', data: fullDay };

    // 2. Otherwise check for individual slots
    return {
      type: 'split',
      morning: activeBookings.find(b => b.shift === 'first'),
      evening: activeBookings.find(b => b.shift === 'second')
    };
  }, [bookings]);

  if (loading && bookings.length === 0) return <LoadingSpinner />;

  return (
    <main className="p-4 sm:p-8 bg-skin-base min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-skin-muted hover:text-brand-teal font-semibold transition-colors">
          <ArrowLeft size={18} /> Back to Library
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT: SEAT STATUS --- */}
          <div className="space-y-6">
            <div className="bg-skin-surface rounded-3xl shadow-sm border border-skin-border overflow-hidden">
              <div className="bg-brand-teal-dark p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-white"><UserCheck size={80}/></div>
                <p className="text-white/50 text-xs font-black uppercase tracking-widest relative z-10">Library Seat</p>
                <h1 className="text-7xl font-serif font-bold text-white mt-2 relative z-10">#{seatNumber}</h1>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-[11px] font-black text-skin-muted uppercase tracking-widest px-1">Current Occupancy</h3>
                
                {occupancy.type === 'full' ? (
                  /* Show only 1 Block for Full Day */
                  <OccupancyCard 
                    slotTitle="Full Day (Combined)" 
                    occupant={occupancy.data} 
                    color="purple" 
                  />
                ) : (
                  /* Show 2 Blocks for Split/Empty Shifts */
                  <>
                    <OccupancyCard 
                        slotTitle="Morning Slot" 
                        occupant={occupancy.morning} 
                        color="orange" 
                    />
                    <OccupancyCard 
                        slotTitle="Evening Slot" 
                        occupant={occupancy.evening} 
                        color="indigo" 
                    />
                  </>
                )}
              </div>
            </div>

            <div className="bg-skin-surface p-6 rounded-2xl border border-skin-border flex items-center justify-between">
                <div>
                    <p className="text-skin-muted font-bold text-[10px] uppercase tracking-wider">Total Record History</p>
                    <p className="text-3xl font-black text-skin-text">{pagination.totalItems || 0}</p>
                </div>
                <div className="w-12 h-12 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal">
                    <History size={24} />
                </div>
            </div>
          </div>

          {/* --- RIGHT: HISTORY TABLE --- */}
          <div className="lg:col-span-2">
            <div className="bg-skin-surface rounded-3xl shadow-sm border border-skin-border overflow-hidden">
              <div className="p-6 border-b border-skin-border">
                <h3 className="text-xl font-bold text-skin-text flex items-center gap-2">Booking Timeline</h3>
              </div>

              {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-skin-base/50">
                        <th className="p-4 text-[11px] font-black text-skin-muted uppercase tracking-widest">Student</th>
                        <th className="p-4 text-[11px] font-black text-skin-muted uppercase tracking-widest">Shift Type</th>
                        <th className="p-4 text-[11px] font-black text-skin-muted uppercase tracking-widest">Period</th>
                        <th className="p-4 text-[11px] font-black text-skin-muted uppercase tracking-widest">Status</th>
                        <th className="p-4 text-right text-[11px] font-black text-skin-muted uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-skin-border">
                      {bookings.map((booking) => (
                        <BookingRow key={booking._id} booking={booking} />
                      ))}
                    </tbody>
                  </table>
                  
                  {pagination.totalPages > 1 && (
                    <div className="p-4 flex items-center justify-between border-t border-skin-border bg-skin-base/30">
                        <p className="text-xs font-bold text-skin-muted uppercase">Page {page} of {pagination.totalPages}</p>
                        <div className="flex gap-2">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-1.5 bg-skin-surface border border-skin-border rounded-lg text-xs font-bold shadow-sm disabled:opacity-50 text-skin-text hover:bg-skin-base">Prev</button>
                            <button disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-1.5 bg-skin-surface border border-skin-border rounded-lg text-xs font-bold shadow-sm disabled:opacity-50 text-skin-text hover:bg-skin-base">Next</button>
                        </div>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState icon={<Calendar />} title="No History" message="No previous bookings found for this seat." />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// --- Row Component ---
const BookingRow = ({ booking }) => {
  const user = booking.user || {};
  const shiftLabels = {
    first: { text: 'Morning', class: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-500/30' },
    second: { text: 'Evening', class: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-500/30' },
    fullday: { text: 'Full Day', class: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-500/30' }
  };
  const currentShift = shiftLabels[booking.shift] || { text: booking.shift, class: 'bg-skin-base' };

  return (
    <tr className="hover:bg-skin-base transition-colors group">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal font-black text-sm border border-brand-teal/20">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-skin-text leading-none">{user.username}</p>
            <p className="text-[11px] text-skin-muted mt-1.5 font-medium">{user.contactNo}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${currentShift.class}`}>
          {currentShift.text}
        </span>
      </td>
      <td className="p-4">
        <div className="text-[11px] font-bold text-skin-muted space-y-0.5">
            <p className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-green-500"/> {new Date(booking.startDate).toLocaleDateString()}</p>
            <p className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-500"/> {new Date(booking.endDate).toLocaleDateString()}</p>
        </div>
      </td>
      <td className="p-4">
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${booking.payment?.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300'}`}>
            {booking.payment?.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 hover:bg-skin-surface rounded-lg text-skin-muted hover:text-brand-teal border border-transparent hover:border-skin-border"><Edit2 size={14} /></button>
            <button className="p-2 hover:bg-skin-surface rounded-lg text-skin-muted hover:text-red-500 border border-transparent hover:border-skin-border"><Trash2 size={14} /></button>
        </div>
      </td>
    </tr>
  );
};

// --- Occupancy Card (Dynamic UI) ---
const OccupancyCard = ({ slotTitle, occupant, color }) => {
    const isPurple = color === 'purple';
    const isOrange = color === 'orange';
    
    // Updated color themes to be dark mode compatible (using dark: modifiers and semantic opacity)
    const theme = {
        purple: 'bg-purple-50 border-purple-100 text-purple-600 dark:bg-purple-900/20 dark:border-purple-500/30 dark:text-purple-300',
        orange: 'bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-900/20 dark:border-orange-500/30 dark:text-orange-300',
        indigo: 'bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-500/30 dark:text-indigo-300'
    };

    return (
        <div className={`p-5 rounded-2xl border transition-all ${occupant ? theme[color] : 'bg-skin-base border-dashed border-skin-border opacity-60'}`}>
            <div className="flex justify-between items-center mb-4">
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-wider ${occupant ? '' : 'text-skin-muted'}`}>
                    <Clock size={14} /> {slotTitle}
                </div>
                {occupant && <div className={`w-2 h-2 rounded-full animate-pulse ${isPurple ? 'bg-purple-500' : isOrange ? 'bg-orange-500' : 'bg-indigo-500'}`} />}
            </div>
            
            {occupant ? (
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md ring-4 ring-white dark:ring-gray-700 ${isPurple ? 'bg-purple-500' : isOrange ? 'bg-orange-500' : 'bg-indigo-500'}`}>
                        {occupant.user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className={`text-base font-black leading-tight ${theme[color].split(' ').pop()}`}>{occupant.user?.username}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <ShieldCheck size={12} className="text-green-600 dark:text-green-400" />
                            <p className="text-[10px] opacity-70 font-bold uppercase tracking-tight">
                                Valid until {new Date(occupant.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-2">
                    <p className="text-xs text-skin-muted font-bold uppercase tracking-tight italic text-center">Empty Slot</p>
                </div>
            )}
        </div>
    );
};

export default SeatDetailsPage;