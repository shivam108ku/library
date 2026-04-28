import React from 'react';
import { X, Calendar, Clock, BadgeCheck, CreditCard, FileText, Hash, Info } from 'lucide-react';

const DetailItem = ({ icon, label, value, className = "" }) => (
  <div className={`flex items-start gap-3 p-3 bg-skin-base rounded-xl border border-transparent transition-all hover:border-skin-border ${className}`}>
    <div className="text-skin-muted mt-0.5">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-skin-muted uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-skin-text leading-tight">{value || 'N/A'}</p>
    </div>
  </div>
);

const BookingDetailsModal = ({ isOpen, onClose, user, booking }) => {
  if (!isOpen || !user || !booking) return null;

  const isTrial = booking.isTrial;
  const isPaid = booking.payment?.status === 'paid';
  
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const startDateStr = new Date(booking.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const endDateStr = new Date(booking.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-skin-surface rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gray-900 p-6 text-white dark:bg-black">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-brand-teal flex items-center justify-center text-2xl font-black shadow-lg shadow-brand-teal/20">
                #{booking.seatNo}
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold tracking-tight">Booking Details</h3>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 mt-6">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isTrial ? 'bg-brand-teal text-white' : (isPaid ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white')}`}>
              {isTrial ? 'Free Trial' : booking.payment?.status}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-white">
              {booking.shift} Shift
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 bg-skin-surface">
          <div className="grid grid-cols-2 gap-3">
            <DetailItem icon={<Calendar className="w-4 h-4"/>} label="Start Date" value={startDateStr} />
            <DetailItem icon={<Calendar className="w-4 h-4"/>} label="End Date" value={isTrial ? "Same Day" : endDateStr} />
            
            {!isTrial && (
              <>
                <DetailItem icon={<CreditCard className="w-4 h-4"/>} label="Method" value={booking.payment?.method?.toUpperCase() || 'Pending'} />
                <DetailItem icon={<Info className="w-4 h-4"/>} label="Amount" value={`₹${booking.payment?.amount || 0}`} />
                
                {isPaid && booking.payment?.lastUpdated && (
                  <div className="col-span-2">
                    <DetailItem 
                      icon={<Clock className="w-4 h-4 text-emerald-500"/>} 
                      label="Payment Confirmation Time" 
                      value={formatDateTime(booking.payment.lastUpdated)}
                      className="bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30"
                    />
                  </div>
                )}
              </>
            )}

            <div className="col-span-2">
              <DetailItem icon={<Clock className="w-4 h-4"/>} label="Booking Created" value={formatDateTime(booking.createdAt)} />
            </div>

            {booking.notes && (
              <div className="col-span-2">
                <DetailItem 
                  icon={<FileText className="w-4 h-4 text-amber-500"/>} 
                  label="Admin Notes" 
                  value={booking.notes} 
                  className="bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-skin-base border-t border-skin-border flex justify-end">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-skin-surface border border-skin-border rounded-xl text-sm font-bold text-skin-text hover:bg-skin-base transition-all shadow-sm active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;