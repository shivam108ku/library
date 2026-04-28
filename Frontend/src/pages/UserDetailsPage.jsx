import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
    ArrowLeft, User, Phone, MapPin, Calendar, Clock, Lock, 
    Eye, EyeOff, X, IdCard, ClipboardList, CheckCircle, 
    Edit, Save, Cake, ChevronRight
} from 'lucide-react';
import QRCode from "react-qr-code"; 
import axiosClient from '../config/axios';

// Components
import UserBookingHistoryTable from '../components/UserDetailsPage/UserBookingHistoryTable';
import UserAttendanceTable from '../components/UserDetailsPage/UserAttendanceTable';
import BookingFormModal from '../components/BookingsPage/BookingFormModal';
import PaymentModal from '../components/BookingsPage/PaymentModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import PaginationControls from '../components/common/PaginationControls';

const ITEMS_PER_PAGE = 5;

/**
 * FIXED: Moved EditField OUTSIDE the main component to prevent focus loss
 */
const EditField = ({ name, value, onChange, type = "text", options = null, rows = 1 }) => (
    <div className="w-full">
        {options ? (
            <select 
                name={name} 
                value={value} 
                onChange={onChange} 
                className="w-full bg-skin-base border border-skin-border text-skin-text rounded-xl px-3 py-2 text-sm font-bold focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 outline-none transition-all cursor-pointer"
            >
                {options.map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
            </select>
        ) : type === "textarea" ? (
            <textarea 
                name={name} 
                value={value} 
                onChange={onChange} 
                rows={rows} 
                className="w-full bg-skin-base border border-skin-border text-skin-text rounded-xl px-3 py-2 text-sm font-bold focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 outline-none transition-all resize-none" 
            />
        ) : (
            <input 
                name={name} 
                type={type} 
                value={value} 
                onChange={onChange} 
                className="w-full bg-skin-base border border-skin-border text-skin-text rounded-xl px-3 py-2 text-sm font-bold focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 outline-none transition-all" 
            />
        )}
    </div>
);

// --- Compact Digital ID Card Modal ---
const DigitalIdModal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-800 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                        <div className="h-20 w-20 bg-white rounded-2xl p-1 shadow-xl flex items-center justify-center">
                            <div className="h-full w-full bg-brand-teal rounded-xl flex items-center justify-center text-3xl font-black text-white">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 pb-8 px-6 text-center">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{user.username}</h3>
                    <p className="text-[10px] font-mono font-bold text-gray-400 mt-1 uppercase tracking-widest">ID: {user.libId}</p>

                    <div className="mt-6 p-4 bg-white border-2 border-dashed border-gray-100 rounded-3xl inline-block">
                        <QRCode value={String(user._id)} size={140} fgColor="#111827" />
                    </div>

                    <div className="mt-6 bg-gray-50 rounded-2xl p-4 text-left space-y-2 border border-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile</span>
                            <span className="text-sm font-bold text-gray-900 font-mono">{user.contactNo}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</span>
                            <span className="text-sm font-bold text-gray-900 font-mono tracking-widest">{user.password}</span>
                        </div>
                    </div>
                    <p className="mt-5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Library Access Card</p>
                </div>
            </div>
        </div>
    );
};

const UserDetailsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [activeTab, setActiveTab] = useState('bookings');
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingsLoading, setIsBookingsLoading] = useState(true);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [error, setError] = useState(null);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(undefined);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [bookingToPay, setBookingToPay] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axiosClient.get(`/users/${userId}`);
      if (response.data.status === 'ok') {
        const u = response.data.user;
        setUser(u);
        setEditFormData({
            username: u.username,
            contactNo: u.contactNo,
            gender: u.gender,
            address: u.address || '',
            dateOfBirth: u.dateOfBirth ? new Date(u.dateOfBirth).toISOString().split('T')[0] : ''
        });
      }
    } catch (err) { setError("User not found."); } 
    finally { setIsLoading(false); }
  }, [userId]);

  const fetchUserBookings = useCallback(async () => {
    setIsBookingsLoading(true);
    try {
      const response = await axiosClient.get(`/users/${userId}/bookings/list`, {
        params: { page: pagination.currentPage, limit: ITEMS_PER_PAGE }
      });
      if (response.data.status === 'ok') {
        setBookings(response.data.bookings);
        setPagination(prev => ({ ...prev, ...response.data.pagination }));
      }
    } catch (err) { console.error(err); } 
    finally { setIsBookingsLoading(false); }
  }, [userId, pagination.currentPage]);

  const fetchUserAttendance = useCallback(async () => {
    setIsAttendanceLoading(true);
    try {
        const response = await axiosClient.get(`/attendance/fetch-user/${userId}`);
        if (response.data.status === 'ok') setAttendance(response.data.attendanceRecords);
    } catch (err) { console.error(err); } 
    finally { setIsAttendanceLoading(false); }
  }, [userId]);

  useEffect(() => { fetchUser(); }, [fetchUser]);
  useEffect(() => { fetchUserBookings(); }, [fetchUserBookings]);
  useEffect(() => { if (activeTab === 'attendance') fetchUserAttendance(); }, [activeTab, fetchUserAttendance]);

  const handleProfileInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const saveProfileEdits = async () => {
    try {
        
        // Validation for contactNo (Standard 10-digit mobile validation)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(editFormData.contactNo)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        const response = await axiosClient.put(`/users/${userId}/profile/edit`, editFormData);
        if (response.data.status === 'ok') {
            setUser(response.data.user);
            setIsEditingProfile(false);
        }
    } catch (err) { alert(err.response?.data?.message || "Update failed"); }
  };

  const cancelProfileEdits = () => {
    setEditFormData({
        username: user.username,
        contactNo: user.contactNo,
        gender: user.gender,
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
    });
    setIsEditingProfile(false);
  };

  const handleEditBooking = useCallback((booking) => { setCurrentBooking(booking); setIsBookingModalOpen(true); }, []);
  const handleDeleteRequest = useCallback((booking) => { setBookingToDelete(booking); setIsDeleteModalOpen(true); }, []);
  const handleOpenPayModal = useCallback((booking) => { setBookingToPay(booking); setIsPayModalOpen(true); }, []);

  const handleBookingFormSubmit = async (bookingData) => {
    try {
      if (bookingData._id) await axiosClient.put(`/bookings/${bookingData._id}`, bookingData);
      else await axiosClient.post('/bookings', bookingData);
      fetchUserBookings();
      setIsBookingModalOpen(false);
    } catch (err) { alert(err.response?.data?.error || "Save failed"); }
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosClient.delete(`/bookings/${bookingToDelete._id}`);
      fetchUserBookings();
      setIsDeleteModalOpen(false);
    } catch (err) { alert("Delete failed"); }
  };

  const handleConfirmPayment = async (paymentData) => {
    try {
      await axiosClient.patch(`/bookings/${bookingToPay._id}/pay`, paymentData);
      fetchUserBookings();
      setIsPayModalOpen(false);
    } catch (err) { alert("Payment update failed"); }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !user) return <EmptyState icon={<User />} title="Not Found" message={error} />;

  const activeBooking = bookings.find(b => new Date(b.endDate) >= new Date());

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-skin-base min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-bold text-skin-muted hover:text-brand-teal transition-colors group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back
            </button>
            <button onClick={() => setIsQrOpen(true)} className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white dark:bg-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-800 shadow-xl active:scale-95 transition-all">
                <IdCard className="w-4 h-4" /> ID Card
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className={`bg-skin-surface rounded-[2.5rem] shadow-sm border transition-all duration-500 overflow-hidden sticky top-24 ${isEditingProfile ? 'border-brand-teal ring-[12px] ring-brand-teal/5' : 'border-skin-border'}`}>
                    <div className="h-32 bg-gradient-to-br from-brand-teal-dark to-brand-teal relative">
                        {isEditingProfile && (
                            <div className="absolute inset-0 bg-brand-teal/20 backdrop-blur-[2px] flex items-center justify-center">
                                <span className="bg-white text-brand-teal text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-xl">Editing Profile</span>
                            </div>
                        )}
                    </div>
                    <div className="px-8 pb-8 text-center -mt-16 relative">
                        <div className="relative inline-block group">
                            <div className="h-32 w-32 rounded-[2.2rem] border-4 border-skin-surface bg-skin-surface shadow-2xl flex items-center justify-center overflow-hidden">
                                {user.profilePhotoUrl ? <img src={user.profilePhotoUrl} className="h-full w-full object-cover" alt="Profile" /> : 
                                <div className="bg-brand-teal/10 w-full h-full flex items-center justify-center text-4xl font-black text-brand-teal">{user.username?.charAt(0)}</div>}
                            </div>
                            <span className={`absolute -bottom-1 -right-1 w-7 h-7 border-4 border-skin-surface rounded-full ${activeBooking ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        </div>
                        <div className="mt-6">
                            {isEditingProfile ? <EditField name="username" value={editFormData.username} onChange={handleProfileInputChange} /> : <h2 className="text-2xl font-black text-skin-text tracking-tight">{user.username}</h2>}
                            <p className="text-[10px] font-mono font-black text-skin-muted mt-2 uppercase tracking-widest">Library ID: {user.libId}</p>
                        </div>
                        <div className="mt-10 border-t border-skin-border pt-8 text-left space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 shrink-0 bg-skin-base rounded-xl flex items-center justify-center text-skin-muted"><Phone className="w-4 h-4"/></div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-skin-muted uppercase tracking-widest mb-1">Registered Phone</p>
                                    {isEditingProfile ? <EditField name="contactNo" value={editFormData.contactNo} onChange={handleProfileInputChange} /> : <p className="font-bold text-skin-text text-sm">{user.contactNo}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 shrink-0 bg-skin-base rounded-xl flex items-center justify-center text-skin-muted"><User className="w-4 h-4"/></div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-skin-muted uppercase tracking-widest mb-1">Gender Identity</p>
                                    {isEditingProfile ? <EditField name="gender" value={editFormData.gender} onChange={handleProfileInputChange} options={[{val:'male', label:'Male'}, {val:'female', label:'Female'}, {val:'third gender', label:'Third Gender'}]} /> : <p className="font-bold text-skin-text text-sm capitalize">{user.gender}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 shrink-0 bg-skin-base rounded-xl flex items-center justify-center text-skin-muted"><Cake className="w-4 h-4"/></div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-skin-muted uppercase tracking-widest mb-1">Birthday</p>
                                    {isEditingProfile ? <EditField name="dateOfBirth" type="date" value={editFormData.dateOfBirth} onChange={handleProfileInputChange} /> : <p className="font-bold text-skin-text text-sm">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-IN') : 'Not Set'}</p>}
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 shrink-0 bg-skin-base rounded-xl flex items-center justify-center text-skin-muted mt-1"><MapPin className="w-4 h-4"/></div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-skin-muted uppercase tracking-widest mb-1">Residential Address</p>
                                    {isEditingProfile ? <EditField name="address" type="textarea" value={editFormData.address} onChange={handleProfileInputChange} rows={2} /> : <p className="font-bold text-skin-text text-sm leading-relaxed">{user.address || 'No address provided'}</p>}
                                </div>
                            </div>
                            <div className="pt-6 border-t border-dashed border-skin-border">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 shrink-0 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-400"><Lock className="w-4 h-4"/></div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Access Password</p>
                                        <div className="flex items-center justify-between">
                                            <p className="font-mono font-black text-skin-text tracking-[0.3em]">{showPassword ? user.password : '••••••••'}</p>
                                            <button onClick={() => setShowPassword(!showPassword)} className="text-skin-muted hover:text-brand-teal transition-colors">{showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10">
                            {isEditingProfile ? (
                                <div className="grid grid-cols-4 gap-3">
                                    <button onClick={saveProfileEdits} className="col-span-3 bg-brand-teal text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl shadow-brand-teal/30 hover:bg-brand-teal-hover active:scale-95 transition-all"><Save className="w-4 h-4" /> Save Profile</button>
                                    <button onClick={cancelProfileEdits} className="col-span-1 bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-300 py-4 rounded-2xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all"><X className="w-5 h-5" /></button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditingProfile(true)} className="w-full bg-gray-900 dark:bg-gray-700 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-teal shadow-xl transition-all active:scale-95"><Edit className="w-4 h-4" /> Modify Profile</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-skin-surface rounded-[2.5rem] shadow-sm border border-skin-border overflow-hidden min-h-[600px] flex flex-col">
                    <div className="flex border-b border-skin-border bg-skin-base/50 p-1.5">
                        <button onClick={() => setActiveTab('bookings')} className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-2xl transition-all ${activeTab === 'bookings' ? 'bg-skin-surface text-brand-teal shadow-sm' : 'text-skin-muted hover:text-skin-text'}`}><ClipboardList className="w-4 h-4" /> Booking History</button>
                        <button onClick={() => setActiveTab('attendance')} className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-2xl transition-all ${activeTab === 'attendance' ? 'bg-skin-surface text-brand-teal shadow-sm' : 'text-skin-muted hover:text-skin-text'}`}><CheckCircle className="w-4 h-4" /> Attendance Logs</button>
                    </div>
                    <div className="flex-grow">
                        {activeTab === 'bookings' ? (
                            isBookingsLoading ? <div className="p-20"><LoadingSpinner /></div> : (
                                <>
                                    <UserBookingHistoryTable user={user} bookings={bookings} onEditBooking={handleEditBooking} onDeleteBooking={handleDeleteRequest} onMarkPaid={handleOpenPayModal} />
                                    {pagination.totalPages > 1 && (
                                        <div className="p-6 border-t border-skin-border">
                                            <PaginationControls currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={(n) => setPagination(p => ({...p, currentPage: n}))} totalItems={pagination.totalItems} itemsPerPage={ITEMS_PER_PAGE} />
                                        </div>
                                    )}
                                </>
                            )
                        ) : (
                            isAttendanceLoading ? <div className="p-20"><LoadingSpinner /></div> : <UserAttendanceTable attendance={attendance} />
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <BookingFormModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} onSubmit={handleBookingFormSubmit} initialBooking={currentBooking} />
      <PaymentModal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} onConfirm={handleConfirmPayment} booking={bookingToPay} />
      <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} title="Delete Record" message="Confirm deletion? This cannot be undone." />
      <DigitalIdModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} user={user} />
    </main>
  );
};

export default UserDetailsPage;