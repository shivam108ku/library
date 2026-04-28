import React from 'react';
import { useNavigate } from 'react-router'; 
import { X, Phone, Calendar, Clock, BadgeCheck, CreditCard, FileText, ExternalLink } from 'lucide-react';

const DetailItem = ({ icon, label, value, className = "" }) => (
  <div className={`flex items-start gap-3 p-3 bg-skin-base rounded-lg border border-transparent hover:border-skin-border transition-all ${className}`}>
    <div className="text-skin-muted mt-0.5">{icon}</div>
    <div>
      <p className="text-xs font-bold text-skin-muted uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-skin-text mt-0.5">{value || 'N/A'}</p>
    </div>
  </div>
);

const UserDetailsModal = ({ isOpen, onClose, user, booking }) => {
  const navigate = useNavigate();

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
  const isOneDay = startDateStr === endDateStr;

  const handleProfileNavigation = () => {
    onClose(); 
    navigate(`/users/${user._id}`); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-skin-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gray-900 p-6 flex justify-between items-start text-white dark:bg-black">
          <div className="flex items-center gap-4">
            <div 
                onClick={handleProfileNavigation}
                className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-serif font-bold text-brand-teal border border-white/20 cursor-pointer hover:bg-white/20 transition-all"
            >
                {user.username?.charAt(0).toUpperCase()}
            </div>
            
            <div>
                <div 
                    onClick={handleProfileNavigation}
                    className="flex items-center gap-2 group cursor-pointer"
                >
                    <h3 className="text-xl font-bold font-serif group-hover:text-brand-teal transition-colors">
                        {user.username}
                        <span className="text-md font-sans font-normal ml-2">#{user.libId}</span>
                    </h3>
                    <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-brand-teal transition-colors" />
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm bg-white/20 px-2 py-0.5 rounded text-white/90">Seat #{booking.seatNo}</span>
                    {isTrial ? (
                        <span className="text-xs px-2 py-0.5 rounded font-bold uppercase bg-brand-teal text-white flex items-center gap-1">
                            <BadgeCheck className="w-3 h-3" /> Free Trial
                        </span>
                    ) : (
                        <span className={`text-sm px-2 py-0.5 rounded font-bold uppercase ${isPaid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {booking.payment?.status}
                        </span>
                    )}
                </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-2 gap-4 bg-skin-surface">
            <DetailItem icon={<Phone className="w-4 h-4"/>} label="Phone" value={user.contactNo} />
            <DetailItem icon={<Clock className="w-4 h-4"/>} label="Shift" value={booking.shift} />
            
            {isOneDay ? (
                <div className="col-span-2">
                    <DetailItem icon={<Calendar className="w-4 h-4"/>} label={isTrial ? "Trial Date" : "Booking Date"} value={startDateStr} />
                </div>
            ) : (
                <>
                    <DetailItem icon={<Calendar className="w-4 h-4"/>} label="Start Date" value={startDateStr} />
                    <DetailItem icon={<Calendar className="w-4 h-4"/>} label="End Date" value={endDateStr} />
                </>
            )}

            {!isTrial && (
                <>
                    <DetailItem icon={<CreditCard className="w-4 h-4"/>} label="Payment Method" value={booking.payment?.method?.toUpperCase()} />
                    <DetailItem icon={<BadgeCheck className="w-4 h-4"/>} label="Amount" value={`₹${booking.payment?.amount || 0}`} />
                    
                    {isPaid && booking.payment?.lastUpdated && (
                        <div className="col-span-2">
                             <DetailItem 
                                icon={<Clock className="w-4 h-4 text-green-500"/>} 
                                label="Confirmed On (Payment Time)" 
                                value={formatDateTime(booking.payment.lastUpdated)}
                                className="bg-green-50 border border-green-100 dark:bg-green-900/10 dark:border-green-900/30"
                            />
                        </div>
                    )}
                </>
            )}

            {booking.notes && (
                <div className="col-span-2">
                    <DetailItem 
                        icon={<FileText className="w-4 h-4 text-amber-500"/>} 
                        label="Admin Notes" 
                        value={booking.notes} 
                        className="bg-amber-50 border border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30"
                    />
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-skin-base px-6 py-4 flex justify-between items-center border-t border-skin-border">
            <span className="text-xs text-skin-muted font-mono tracking-tighter uppercase">REF: {booking._id.slice(-8)}</span>
            <div className="flex gap-2">
                <button 
                    onClick={handleProfileNavigation} 
                    className="px-4 py-2 bg-brand-teal/10 text-brand-teal rounded-lg text-sm font-semibold hover:bg-brand-teal hover:text-white transition-all"
                >
                    View Profile
                </button>
                <button onClick={onClose} className="px-4 py-2 bg-skin-surface border border-skin-border rounded-lg text-sm font-semibold text-skin-text hover:bg-skin-base transition-colors shadow-sm">Close</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;