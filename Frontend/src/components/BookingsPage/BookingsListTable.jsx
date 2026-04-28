import React from 'react';
import { useNavigate } from 'react-router'; 
import { Edit2, Trash2, BookOpen, ExternalLink, Calendar, CheckCircle2, BadgeCheck, Clock, User, CreditCard } from 'lucide-react';
import EmptyState from '../common/EmptyState';

const StatusBadge = ({ status, isMethod = false }) => {
  const styles = {
    paid: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-500/30',
    unpaid: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30',
    pending: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-500/30',
    failed: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    first: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-500/30',
    second: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-500/30',
    fullday: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-500/30',
    method: 'bg-skin-base text-skin-muted border-skin-border' 
  };

  const labels = {
    first: 'Morning',
    second: 'Evening',
    fullday: 'Full Day'
  };

  const currentStyle = isMethod ? styles.method : (styles[status] || styles.failed);

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-tight ${currentStyle}`}>
      {labels[status] || status}
    </span>
  );
};

const BookingsListTable = ({ bookings, onEditBooking, onDeleteBooking, onMarkPaid }) => {
  const navigate = useNavigate(); 

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDriveImgUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('data:') || (!url.includes('drive.google.com') && !url.includes('docs.google.com'))) return url;
    const idMatch = url.match(/[-\w]{25,}/);
    return idMatch ? `https://drive.google.com/uc?export=view&id=${idMatch[0]}` : url;
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl">
      <table className="min-w-full divide-y divide-skin-border">
        <thead className="bg-skin-base/50">
          <tr>
            <th className="px-6 py-4 text-left text-[11px] font-black text-skin-muted uppercase tracking-widest">Student</th>
            <th className="px-6 py-4 text-left text-[11px] font-black text-skin-muted uppercase tracking-widest">Seat</th>
            <th className="px-6 py-4 text-left text-[11px] font-black text-skin-muted uppercase tracking-widest hidden md:table-cell">Period</th>
            <th className="px-6 py-4 text-left text-[11px] font-black text-skin-muted uppercase tracking-widest">Payment</th>
            <th className="px-6 py-4 text-left text-[11px] font-black text-skin-muted uppercase tracking-widest hidden lg:table-cell">Proof</th>
            <th className="px-6 py-4 text-right text-[11px] font-black text-skin-muted uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-skin-surface divide-y divide-skin-border">
          {bookings.length > 0 && bookings.map((booking) => {
              const user = booking.user || {}; 
              const isActive = new Date(booking.endDate) >= new Date();
              const screenshotUrl = booking.payment?.screenshotUrl ? getDriveImgUrl(booking.payment.screenshotUrl) : null;
              const canMarkPaid = !booking.isTrial && (booking.payment?.status === 'unpaid' || booking.payment?.status === 'failed');

              return (
                <tr key={booking._id} className="hover:bg-brand-teal/5 transition-all group">
                  
                  {/* Student & Navigation */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                        {/* Clickable Avatar */}
                        <div 
                          onClick={() => navigate(`/users/${user._id}`)}
                          className="h-10 w-10 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center text-sm font-black border border-brand-teal/20 cursor-pointer hover:bg-brand-teal hover:text-white transition-all"
                        >
                            {user.username?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col">
                            {/* Clickable Name */}
                            <span 
                              onClick={() => navigate(`/users/${user._id}`)}
                              className="text-sm font-bold text-skin-text leading-tight cursor-pointer hover:text-brand-teal hover:underline decoration-brand-teal/30 transition-all"
                            >
                              {user.username || 'Unknown'}
                            </span>
                            <span 
                              onClick={() => navigate(`/users/${user._id}`)} 
                              className="text-[13px] text-skin-muted mt-1 flex items-center gap-1 font-bold cursor-pointer hover:text-brand-teal decoration-brand-teal/30 transition-all"
                            >
                              {user.contactNo}
                              </span>
                            <span className="text-[10px] text-skin-muted mt-1 flex items-center gap-1 font-semibold">
                              {formatDateTime(booking.createdAt)}
                            </span>
                        </div>
                    </div>
                  </td>

                  {/* Seat & Shift */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-black text-skin-text">#{booking.seatNo}</span>
                        <StatusBadge status={booking.shift} />
                    </div>
                  </td>

                  {/* Duration Period */}
                  <td className="px-6 py-4 hidden md:table-cell whitespace-nowrap">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-skin-muted">
                            <Calendar className="w-3.5 h-3.5 opacity-40" />
                            <span>{new Date(booking.startDate).toLocaleDateString('en-IN')}</span>
                        </div>
                        {!booking.isTrial ? (
                            <div className={`mt-1 text-[11px] font-black flex items-center gap-1.5 ${isActive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                                <span>{new Date(booking.endDate).toLocaleDateString('en-IN')}</span>
                            </div>
                        ) : (
                            <span className="mt-1 text-blue-500 font-black uppercase text-[9px] tracking-tighter">1-Day Trial</span>
                        )}
                    </div>
                  </td>

                  {/* Payment Details & Method */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1.5">
                        {booking.isTrial ? (
                            <span className="px-2 py-0.5 bg-brand-teal/10 text-brand-teal rounded text-[10px] font-black uppercase border border-brand-teal/20">
                                FREE TRIAL
                            </span>
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={booking.payment?.status} />
                                    {booking.payment?.status === 'paid' && booking.payment?.method && (
                                        <StatusBadge status={booking.payment.method} isMethod={true} />
                                    )}
                                </div>
                                {booking.payment?.status === 'paid' && booking.payment?.lastUpdated && (
                                    <span className="text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1 italic">
                                        <CheckCircle2 className="w-3 h-3" /> {formatDateTime(booking.payment.lastUpdated)}
                                    </span>
                                )}
                            </>
                        )}
                        
                        {canMarkPaid && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onMarkPaid(booking); }}
                            className="mt-1 px-2.5 py-1 bg-brand-teal text-white text-[10px] font-black rounded hover:bg-brand-teal-hover transition-all shadow-sm active:scale-95 flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" /> MARK PAID
                          </button>
                        )}
                    </div>
                  </td>

                  {/* Proof Thumbnail */}
                  <td className="px-6 py-4 hidden lg:table-cell whitespace-nowrap">
                    {!booking.isTrial && screenshotUrl ? (
                        <a href={screenshotUrl} target="_blank" rel="noopener noreferrer" className="relative block w-10 h-10 rounded-lg overflow-hidden border border-skin-border group/img ring-2 ring-transparent hover:ring-brand-teal/30 transition-all">
                            <img src={screenshotUrl} alt="Proof" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-brand-teal/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                <ExternalLink className="w-4 h-4 text-white" />
                            </div>
                        </a>
                    ) : (
                        <span className="text-[10px] text-skin-muted font-bold italic tracking-tighter">NO PROOF</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => onEditBooking(booking)}
                        className="p-2 text-skin-muted hover:text-brand-teal hover:bg-skin-surface rounded-lg transition-all shadow-none hover:shadow-sm border border-transparent hover:border-skin-border"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteBooking(booking)}
                        className="p-2 text-skin-muted hover:text-red-500 hover:bg-skin-surface rounded-lg transition-all shadow-none hover:shadow-sm border border-transparent hover:border-skin-border"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {bookings.length === 0 && (
        <EmptyState
          icon={<BookOpen />}
          title="No Bookings Found"
          message="Adjust filters or create a new booking."
        />
      )}
    </div>
  );
};

export default BookingsListTable;