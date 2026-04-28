import React, { useState } from 'react';
import { Edit2, Trash2, BookOpen, Calendar, Clock, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import BookingDetailsModal from './BookingDetailsModal';

const StatusBadge = ({ status, isMethod = false }) => {
  const styles = {
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-500/30',
    unpaid: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30',
    pending: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-500/30',
    failed: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    first: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-500/30',
    second: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-500/30',
    fullday: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-500/30',
    method: 'bg-skin-base text-skin-muted border-skin-border' 
  };
  const labels = { first: 'Morning', second: 'Evening', fullday: 'Full Day' };
  const currentStyle = isMethod ? styles.method : (styles[status] || styles.failed);

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-tighter ${currentStyle}`}>
      {labels[status] || status}
    </span>
  );
};

const UserBookingHistoryTable = ({ user, bookings, onEditBooking, onDeleteBooking, onMarkPaid }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-skin-border">
          <thead className="bg-skin-base/50">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-black text-skin-muted uppercase tracking-widest">Seat Info</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-skin-muted uppercase tracking-widest">Period</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-skin-muted uppercase tracking-widest hidden md:table-cell">Created</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-skin-muted uppercase tracking-widest">Payment</th>
              <th className="px-6 py-4 text-right text-[11px] font-black text-skin-muted uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-skin-surface divide-y divide-skin-border">
            {bookings.map((booking) => {
              const isActive = new Date(booking.endDate) >= new Date();
              const isPaid = booking.payment?.status === 'paid';
              const canMarkPaid = !booking.isTrial && (booking.payment?.status === 'unpaid' || booking.payment?.status === 'failed');

              return (
                <tr 
                  key={booking._id} 
                  onClick={() => setSelectedBooking(booking)}
                  className="hover:bg-skin-base transition-all group cursor-pointer"
                >
                  {/* Seat Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center text-sm font-black shadow-sm group-hover:bg-brand-teal transition-colors">
                            #{booking.seatNo}
                        </div>
                        <StatusBadge status={booking.shift} />
                    </div>
                  </td>

                  {/* Period */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-skin-muted">
                            <Calendar className="w-3.5 h-3.5 opacity-40" />
                            <span>{new Date(booking.startDate).toLocaleDateString('en-IN')}</span>
                        </div>
                        {!booking.isTrial ? (
                            <div className={`mt-1 text-[11px] font-black flex items-center gap-1.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-400 dark:text-red-300'}`}>
                                <div className="w-1 h-1 rounded-full bg-current" />
                                <span>{new Date(booking.endDate).toLocaleDateString('en-IN')}</span>
                            </div>
                        ) : (
                            <span className="mt-1 text-brand-teal font-black uppercase text-[9px] tracking-widest">Trial Access</span>
                        )}
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4 hidden md:table-cell whitespace-nowrap">
                    <div className="text-[11px] text-skin-muted font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 opacity-50" /> {formatDateTime(booking.createdAt)}
                    </div>
                  </td>

                  {/* Payment Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1">
                        {booking.isTrial ? (
                            <span className="text-[9px] font-black text-brand-teal tracking-widest uppercase">Comped</span>
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={booking.payment?.status} />
                                    {isPaid && booking.payment?.method && (
                                        <StatusBadge status={booking.payment.method} isMethod={true} />
                                    )}
                                    <span className="text-xs font-black text-skin-text">₹{booking.payment?.amount || 0}</span>
                                </div>
                                
                                {isPaid && booking.payment?.lastUpdated && (
                                    <div className="flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold italic">
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                        {formatDateTime(booking.payment.lastUpdated)}
                                    </div>
                                )}

                                {canMarkPaid && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); onMarkPaid(booking); }} 
                                    className="mt-1 px-2 py-0.5 bg-gray-900 text-white text-[9px] font-black rounded uppercase hover:bg-brand-teal transition-all flex items-center gap-1 dark:bg-gray-700"
                                  >
                                    <CreditCard className="w-2.5 h-2.5" /> Mark Paid
                                  </button>
                                )}
                            </>
                        )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end items-center gap-2">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                            <button onClick={(e) => { e.stopPropagation(); onEditBooking(booking); }} className="p-2 text-skin-muted hover:text-brand-teal hover:bg-skin-base rounded-lg border border-transparent hover:border-skin-border shadow-sm transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={(e) => { e.stopPropagation(); onDeleteBooking(booking); }} className="p-2 text-skin-muted hover:text-red-500 hover:bg-skin-base rounded-lg border border-transparent hover:border-skin-border shadow-sm transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                        <ChevronRight className="w-4 h-4 text-skin-muted/50 group-hover:text-brand-teal transition-colors" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="py-20">
          <EmptyState icon={<BookOpen />} title="No Bookings" message="This user hasn't booked any seats yet." />
        </div>
      )}

      {/* Detail Modal */}
      <BookingDetailsModal isOpen={!!selectedBooking} onClose={() => setSelectedBooking(null)} user={user} booking={selectedBooking} />
    </div>
  );
};

export default UserBookingHistoryTable;