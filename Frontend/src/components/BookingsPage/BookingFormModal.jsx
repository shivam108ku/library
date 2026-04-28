import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Search, Clock, BadgeCheck, CalendarDays, FileText, Armchair, User, CreditCard, Calendar } from 'lucide-react';
import axiosClient from '../../config/axios';

const SHIFT_PRICES = {
  first: 700,
  second: 700,
  fullday: 1300
};

const BookingFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialBooking,
  activeUserIds = new Set() 
}) => {
  const isEditing = !!initialBooking?._id;
  
  const initialUserId = initialBooking?.user?._id || initialBooking?.user || '';
  const initialUserName = initialBooking?.user?.username || '';

  const [usersList, setUsersList] = useState([]); 
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getInitialState = () => {
    const defaultStartDate = new Date().toISOString().split('T')[0];
    const defaultEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const shift = initialBooking?.shift || 'first';
    const isTrial = initialBooking?.isTrial || false;
    
    let amount = initialBooking?.payment?.amount;
    if (amount === undefined || amount === null) {
        amount = isTrial ? 0 : SHIFT_PRICES[shift];
    }

    let initialMethod = initialBooking?.payment?.method || '';
    if (isTrial) initialMethod = null; 
    else if (initialBooking?.payment?.status === 'paid' && !initialMethod) initialMethod = 'cash'; 

    return {
      user: initialUserId, 
      seatNo: initialBooking?.seatNo || '',
      shift: shift,
      isTrial: isTrial, 
      status: initialBooking?.payment?.status || 'unpaid',
      method: initialMethod, 
      amount: amount,
      notes: initialBooking?.notes || '', 
      startDate: initialBooking?.startDate ? new Date(initialBooking.startDate).toISOString().split('T')[0] : defaultStartDate,
      endDate: initialBooking?.endDate ? new Date(initialBooking.endDate).toISOString().split('T')[0] : defaultEndDate,
    };
  };
  
  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        setIsFetchingUsers(true);
        try {
          const response = await axiosClient.get('/users/all');
          if (response.data.status === 'ok') {
            setUsersList(response.data.users);
          }
        } catch (error) {
          console.error("Failed to fetch users", error);
        } finally {
          setIsFetchingUsers(false);
        }
      };

      fetchUsers();
      setFormData(getInitialState());
      if (isEditing && initialUserName) {
        setUserSearchTerm(initialUserName);
      } else {
        setUserSearchTerm('');
      }
    }
  }, [isOpen, initialBooking]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'isTrial') {
      const isTrialMode = checked;
      setFormData(prev => ({
        ...prev,
        isTrial: isTrialMode,
        endDate: isTrialMode 
            ? prev.startDate 
            : new Date(new Date(prev.startDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: isTrialMode ? 0 : SHIFT_PRICES[prev.shift],
        status: isTrialMode ? 'paid' : 'unpaid',
        method: isTrialMode ? null : '' 
      }));

    } else if (name === 'status') {
        const newStatus = value;
        setFormData(prev => ({
            ...prev,
            status: newStatus,
            method: newStatus === 'paid' ? 'cash' : ''
        }));

    } else if (name === 'shift') {
        const newShift = value;
        setFormData(prev => ({
            ...prev,
            shift: newShift,
            amount: prev.isTrial ? 0 : SHIFT_PRICES[newShift]
        }));

    } else if (name === 'startDate') {
        const newStartDate = value;
        let newEndDate;
        if (formData.isTrial) {
            newEndDate = newStartDate;
        } else {
            const dateObj = new Date(newStartDate);
            dateObj.setDate(dateObj.getDate() + 30);
            newEndDate = !isNaN(dateObj.getTime()) ? dateObj.toISOString().split('T')[0] : newStartDate;
        }
        setFormData(prev => ({ ...prev, [name]: newStartDate, endDate: newEndDate }));

    } else {
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const eligibleUsers = useMemo(() => {
    return usersList.filter(user => {
        if (isEditing && user._id === initialUserId) return true;
        return !activeUserIds.has(user._id);
    });
  }, [usersList, activeUserIds, isEditing, initialUserId]);

  const suggestedUsers = useMemo(() => {
    if (userSearchTerm.trim()) {
        const lowerCaseSearch = userSearchTerm.toLowerCase();
        return eligibleUsers.filter(user => 
            user.username.toLowerCase().includes(lowerCaseSearch) ||
            user.contactNo.includes(lowerCaseSearch)
        ).slice(0, 5);
    }
    return [...eligibleUsers].reverse().slice(0, 10);
  }, [userSearchTerm, eligibleUsers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.user) return alert('Please select a student.');
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
        return alert('End Date cannot be before Start Date');
    }
    
    if (!formData.isTrial && formData.status === 'paid' && !formData.method) {
        return alert('Please select a payment method.');
    }

    const paymentData = {
        status: formData.isTrial ? 'paid' : formData.status,
        amount: parseFloat(formData.amount) || 0,
        screenshotUrl: initialBooking?.payment?.screenshotUrl,
    };

    if (formData.method) {
        paymentData.method = formData.method;
    }

    // BASE SUBMISSION DATA
    const submissionData = {
        _id: initialBooking?._id,
        userId: formData.user, 
        seatNo: parseInt(formData.seatNo),
        shift: formData.shift,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isTrial: formData.isTrial, 
        payment: paymentData
    };

    // ONLY ADD NOTES IF THEY ARE NON-EMPTY
    const trimmedNotes = formData.notes.trim();
    if (trimmedNotes.length > 0) {
        submissionData.notes = trimmedNotes;
    }

    onSubmit(submissionData);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-skin-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-brand-teal p-6 flex justify-between items-center text-white shrink-0">
          <h3 className="text-xl font-serif font-bold">{isEditing ? 'Edit Booking' : 'Assign Seat'}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-white" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-skin-surface">
            {/* Trial Toggle */}
            <div className="bg-brand-teal/5 border border-brand-teal/20 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${formData.isTrial ? 'bg-brand-teal text-white' : 'bg-skin-base text-skin-muted'}`}>
                        {formData.isTrial ? <BadgeCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-skin-text">Booking Type</p>
                        <p className="text-xs text-skin-muted">{formData.isTrial ? '1 Day Free Trial' : 'Regular Paid Booking'}</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isTrial" checked={formData.isTrial} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-skin-base border border-skin-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                </label>
            </div>

            {/* User Search */}
            <div className="relative">
              <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Select Student</label>
              <div className="relative">
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={(e) => {
                        setUserSearchTerm(e.target.value);
                        setIsUserDropdownOpen(true);
                        setFormData(prev => ({ ...prev, user: '' })); 
                    }}
                    onFocus={() => setIsUserDropdownOpen(true)}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm bg-skin-base text-skin-text border-skin-border focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none"
                    placeholder={isFetchingUsers ? "Loading users..." : "Search name or phone..."}
                    disabled={isEditing || isFetchingUsers} 
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skin-muted" />
              </div>
              
              {isUserDropdownOpen && !isEditing && (
                <div className="absolute z-50 w-full bg-skin-surface border border-skin-border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
                  {suggestedUsers.map(user => (
                      <div 
                        key={user._id}
                        className="px-4 py-3 hover:bg-brand-teal/5 cursor-pointer border-b border-skin-border flex items-center gap-3"
                        onClick={() => {
                            setFormData(prev => ({ ...prev, user: user._id }));
                            setUserSearchTerm(user.username);
                            setIsUserDropdownOpen(false);
                        }}
                      >
                        <div className="text-sm font-semibold text-skin-text">{user.username}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Seat & Shift */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Seat No.</label>
                    <input type="number" name="seatNo" value={formData.seatNo} onChange={handleChange} required min="1" className="w-full bg-skin-base border border-skin-border rounded-lg p-2.5 text-sm text-skin-text focus:border-brand-teal outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Shift</label>
                    <select name="shift" value={formData.shift} onChange={handleChange} className="w-full bg-skin-base border border-skin-border rounded-lg p-2.5 text-sm text-skin-text focus:border-brand-teal outline-none">
                        <option value="first">Morning</option>
                        <option value="second">Evening</option>
                        <option value="fullday">Full Day</option>
                    </select>
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full bg-skin-base border border-skin-border rounded-lg p-2.5 text-sm text-skin-text focus:border-brand-teal outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">End Date</label>
                    <input 
                        type="date" 
                        name="endDate" 
                        value={formData.endDate} 
                        onChange={handleChange} 
                        required 
                        min={formData.startDate}
                        className={`w-full border rounded-lg p-2.5 text-sm outline-none text-skin-text ${formData.isTrial ? 'bg-skin-base/50 cursor-not-allowed border-skin-border' : 'bg-skin-base border-skin-border focus:border-brand-teal'}`} 
                        readOnly={formData.isTrial}
                    />
                </div>
            </div>

            {/* Payment Details */}
            {!formData.isTrial && (
                <div className="p-4 bg-skin-base rounded-xl border border-skin-border space-y-4">
                    <div className="flex justify-between items-center border-b border-skin-border pb-2">
                         <h4 className="text-sm font-bold text-skin-text">Payment Details</h4>
                         {isEditing && 
                          initialBooking?.payment?.status === 'paid' && 
                          formData.status === 'paid' && 
                          initialBooking?.payment?.lastUpdated && (
                             <div className="flex items-center gap-1.5 text-[10px] bg-skin-surface px-2 py-1 rounded-md border border-skin-border text-skin-muted font-medium shadow-sm">
                                 <CalendarDays className="w-3 h-3 text-brand-teal" />
                                 <span>Paid: {formatDateTime(initialBooking.payment.lastUpdated)}</span>
                             </div>
                         )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-skin-border rounded-lg p-2.5 text-sm focus:border-brand-teal outline-none bg-skin-surface text-skin-text">
                                <option value="unpaid">Unpaid</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Amount (₹)</label>
                            <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="w-full border border-skin-border rounded-lg p-2.5 text-sm focus:border-brand-teal outline-none font-bold text-brand-teal bg-skin-surface" placeholder="0" />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wide mb-1 ${formData.status !== 'paid' ? 'text-skin-border' : 'text-skin-muted'}`}>
                            Payment Method {formData.status !== 'paid' && <span className="text-[10px] font-normal italic">(Enabled for Paid Status)</span>}
                        </label>
                        <select 
                            name="method" 
                            value={formData.method || ''} 
                            onChange={handleChange} 
                            disabled={formData.status !== 'paid'}
                            className={`w-full border rounded-lg p-2.5 text-sm outline-none bg-skin-surface text-skin-text transition-all ${formData.status !== 'paid' ? 'border-skin-border bg-skin-base text-skin-muted cursor-not-allowed' : 'border-skin-border focus:border-brand-teal shadow-sm'}`}
                        >
                            <option value="">-- Select Method --</option>
                            <option value="cash">Cash</option>
                            <option value="upi">UPI</option>
                            <option value="netbanking">Net Banking</option>
                            <option value="card">Card</option>
                            <option value="wallet">Wallet</option>
                        </select>
                    </div>
                </div>
            )}

            {/* NOTES SECTION */}
            <div className="space-y-1.5 pb-2">
                <div className="flex items-center gap-1.5 text-skin-muted mb-1">
                    <FileText className="w-4 h-4 text-brand-teal" />
                    <label className="text-xs font-bold uppercase tracking-wide">Notes (Optional)</label>
                </div>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    maxLength="100"
                    placeholder="E.g. Student requested front row..."
                    className="w-full border border-skin-border rounded-lg p-2.5 text-sm focus:border-brand-teal outline-none bg-skin-base text-skin-text resize-none h-20 placeholder:text-skin-muted/50 transition-all focus:ring-2 focus:ring-brand-teal/5"
                />
                <div className="flex justify-end">
                    <span className={`text-[10px] font-bold ${formData.notes.length >= 100 ? 'text-red-500' : 'text-skin-muted'}`}>
                        {formData.notes.length}/100
                    </span>
                </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-5 py-2.5 border border-skin-border rounded-lg text-sm font-medium text-skin-text hover:bg-skin-base transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-brand-teal text-white rounded-lg text-sm font-medium hover:bg-brand-teal-hover shadow-md flex items-center gap-2 transition-colors">
                    <Save className="w-4 h-4" /> Save {formData.isTrial ? 'Trial' : 'Booking'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default BookingFormModal;