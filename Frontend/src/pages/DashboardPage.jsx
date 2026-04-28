import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axiosClient from '../config/axios';
import StatCard from '../components/DashboardPage/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import SeatMapPreview from '../components/DashboardPage/SeatMapPreview';
import { 
    LayoutGrid, AlertCircle, Plus, ArrowRight, 
    IndianRupee, UserCheck, LogOut, AlertTriangle,
    CalendarClock, UserPlus, CreditCard, Receipt, ChevronLeft, ChevronRight, 
    Eye, EyeOff, RefreshCw, Check, Phone, Calendar, Armchair, Sun, Moon, Zap
} from 'lucide-react';

const TOTAL_LIBRARY_SEATS = 109;

const getLocalYYYYMMDD = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getLocalYYYYMMDD(new Date()));
  const [dailyPayments, setDailyPayments] = useState([]);
  const [totalRevenueOnDate, setTotalRevenueOnDate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRevenue, setShowRevenue] = useState(false);
  const [showPaymentLog, setShowPaymentLog] = useState(false);
  
  // State to track which bookings are currently being renewed
  const [renewingIds, setRenewingIds] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axiosClient.get('/dashboard/stats');
        if (response.data.status === 'ok') {
          setData(response.data.data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard stats.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchPaymentsByDay = async () => {
      try {
        setIsPaymentsLoading(true);
        const response = await axiosClient.get(`/bookings/payments?date=${selectedDate}`);
        if (response.data.status === 'ok') {
            setDailyPayments(response.data.payments);
            setTotalRevenueOnDate(response.data.totalAmount || 0);
        }
      } catch (err) {
        console.error("Payment fetch error:", err);
      } finally {
        setIsPaymentsLoading(false);
      }
    };
    fetchPaymentsByDay();
  }, [selectedDate]);

  const handleDateChange = (daysToAdd) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    setSelectedDate(getLocalYYYYMMDD(currentDate));
  };

  // --- RENEWAL HANDLER ---
  const handleRenewBooking = async (booking) => {
    if (!booking?.user?._id) return;

    // Add to renewing state
    setRenewingIds(prev => [...prev, booking._id]);

    try {
        const response = await axiosClient.post('/bookings/renew/admin', {
            userId: booking.user._id
        });

        if (response.data.status === 'ok') {
            // Update local state to reflect renewal instantly
            setData(prev => ({
                ...prev,
                lists: {
                    ...prev.lists,
                    expiringSoon: prev.lists.expiringSoon.map(b => 
                        b._id === booking._id 
                        ? { 
                            ...b, 
                            renewal: { 
                                isRewewed: true, 
                                renewedOn: new Date(),
                                method: 'admin' 
                            } 
                          } 
                        : b
                    )
                }
            }));
        }
    } catch (err) {
        console.error("Renewal failed", err);
        alert(err.response?.data?.message || "Failed to renew booking");
    } finally {
        // Remove from renewing state
        setRenewingIds(prev => prev.filter(id => id !== booking._id));
    }
  };

  const isToday = selectedDate === getLocalYYYYMMDD(new Date());

  if (isLoading) return <LoadingSpinner />;

  const { stats, lists, seatMap } = data || { stats: {}, lists: {}, seatMap: [] };

  // Helper for Shift Badge
  const getShiftBadge = (shift) => {
      const s = shift?.toLowerCase();
      if(s === 'first') return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-bold border border-yellow-200"><Sun className="w-3 h-3"/> Morning</span>;
      if(s === 'second') return <span className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-200"><Moon className="w-3 h-3"/> Evening</span>;
      return <span className="flex items-center gap-1 bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-[10px] font-bold border border-sky-200"><Zap className="w-3 h-3"/> Full Day</span>;
  }

  return (
    <main className="flex-grow bg-skin-base min-h-screen py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-skin-text">Library Dashboard</h1>
            <p className="text-skin-muted mt-1">Real-time overview of operations and alerts.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
                onClick={() => navigate('/attendance-tracker')}
                className="inline-flex items-center px-4 py-2 bg-skin-surface border border-skin-border rounded-lg text-sm font-medium text-skin-text hover:bg-skin-base shadow-sm transition-all"
            >
                Attendance Tracker
            </button>
            <button 
                onClick={() => navigate('/enquiries')}
                className="inline-flex items-center px-4 py-2 bg-brand-teal text-white rounded-lg text-sm font-medium hover:bg-brand-teal-hover shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" /> Enquiries
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-300 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* --- KPI Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div onClick={() => setShowRevenue(!showRevenue)}>
            <StatCard title="Revenue" value={showRevenue ? `₹${stats.revenue}` : `----`} icon={<IndianRupee className="w-5 h-5" />} color="green" description="This month" isClickable />
          </div>
          <StatCard title="Occupancy" value={`${stats.occupancyPercentage || 0}%`} icon={<LayoutGrid className="w-5 h-5" />} color="teal" description={`${stats.activeMembers || 0} Active Seats`} />
          <StatCard title="Present Now" value={stats.activeAttendance || 0} icon={<UserCheck className="w-5 h-5" />} color="purple" description="Currently in library" />
          <StatCard title="Checked Out" value={stats.checkedOutToday || 0} icon={<LogOut className="w-5 h-5" />} color="blue" description="Completed sessions" />
          <StatCard title="Fee Overdue" value={stats.overduePayments || 0} icon={<AlertTriangle className="w-5 h-5" />} color="red" description="> 4 days unpaid" onClick={() => navigate('/bookings?payment=unpaid')} isClickable />
          <StatCard title="Pending" value={stats.pendingVerifications || 0} icon={<AlertCircle className="w-5 h-5" />} color="orange" description="Verify payments" onClick={() => navigate('/bookings?status=pending')} isClickable />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* --- LEFT COLUMN (Wider) --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Seat Map */}
            <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden">
              <div className="p-6 border-b border-skin-border flex justify-between items-center">
                <h2 className="text-lg font-bold text-skin-text font-serif">Live Seat Map</h2>
                <button onClick={() => navigate('/seats')} className="text-sm text-brand-teal font-medium flex items-center gap-1">
                  Full View <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <SeatMapPreview occupiedSlots={seatMap.map(b => ({ booking: b }))} totalSeats={TOTAL_LIBRARY_SEATS} />
              </div>
            </div>

            {/* --- EXPIRING SOON WIDGET (FULL WIDTH - Detailed) --- */}
            <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden flex flex-col h-[400px]"> 
                {/* Fixed Header */}
                <div className="p-5 border-b border-skin-border bg-orange-50/50 dark:bg-orange-900/20 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-md font-bold text-skin-text font-serif flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" /> Expiring Soon
                    </h2>
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                        {lists.expiringSoon?.length || 0} Members
                    </span>
                </div>

                {/* Scrollable List Area */}
                <div className="divide-y divide-skin-border flex-grow overflow-y-auto custom-scrollbar">
                    {lists.expiringSoon?.length > 0 ? (
                        lists.expiringSoon.map((booking) => {
                            const today = new Date(); today.setHours(0,0,0,0);
                            const diffTime = new Date(booking.endDate) - today;
                            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            const isAlreadyRenewed = booking.renewal?.isRewewed;
                            const renewalMethod = booking.renewal?.method;
                            const isRenewingThis = renewingIds.includes(booking._id);

                            // Payment Status Logic
                            const paymentStatus = booking.isTrial ? 'Trial' : (booking.payment?.status || 'unpaid');
                            const isPaid = paymentStatus === 'paid';
                            const isTrial = paymentStatus === 'Trial';

                            return (
                                <div key={booking._id} className="p-4 hover:bg-skin-base transition-colors flex items-center justify-between group min-h-[4.5rem]">
                                    
                                    {/* Column 1: User Details (Name & Phone) - Clickable */}
                                    <div 
                                        className="flex flex-col justify-center min-w-[25%] cursor-pointer group/user"
                                        onClick={() => navigate(`/users/${booking.user?._id}`)}
                                    >
                                        <p className="font-bold text-sm text-skin-text truncate max-w-[150px] group-hover/user:text-brand-teal transition-colors" title={booking.user?.username}>
                                            {booking.user?.username}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-skin-muted text-xs mt-0.5">
                                            {/* <Phone className="w-3 h-3 text-skin-muted/70" /> */}
                                            <span className="font-medium font-mono">
                                                {booking.user?.contactNo || "No Contact"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Column 2: Seat & Shift */}
                                    <div className="flex flex-col items-start min-w-[20%] gap-1">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-skin-text">
                                            <Armchair className="w-3.5 h-3.5 text-brand-teal"/> Seat #{booking.seatNo}
                                        </div>
                                        {getShiftBadge(booking.shift)}
                                    </div>

                                    {/* Column 3: Expiry Date & Status Badges */}
                                    <div className="flex flex-col items-start min-w-[25%] gap-1">
                                        <div className="flex items-center gap-1.5 text-xs text-skin-text">
                                            <Calendar className="w-3.5 h-3.5 text-skin-muted"/> 
                                            <span className="font-medium">
                                                {new Date(booking.endDate).toLocaleDateString(undefined, { month:'short', day:'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 flex-wrap">
                                            {/* Expiry Badge */}
                                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide border ${daysLeft <= 1 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                                {daysLeft <= 0 ? 'Expires Today' : `${daysLeft} Days Left`}
                                            </span>
                                            
                                            {/* Payment Badge */}
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border ${
                                                isTrial ? 'bg-brand-teal/10 text-brand-teal border-brand-teal/20' :
                                                isPaid ? 'bg-green-50 text-green-700 border-green-200' : 
                                                'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                                {paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Column 4: Action Button (Right Aligned) */}
                                    <div className="w-[100px] flex-shrink-0 flex justify-end items-center pl-4 border-l border-skin-border/50">
                                        {isAlreadyRenewed ? (
                                            <div className="flex flex-col items-center justify-center w-full">
                                                <div className="flex items-center gap-1 text-green-600 mb-0.5">
                                                    <Check className="w-4 h-4" strokeWidth={3} />
                                                    <span className="text-[10px] font-bold uppercase">Renewed</span>
                                                </div>
                                                <span className="text-[9px] text-skin-muted font-medium capitalize">
                                                    by {renewalMethod === 'admin' ? 'Admin' : 'User'}
                                                </span>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRenewBooking(booking);
                                                }}
                                                disabled={isRenewingThis}
                                                className="w-full h-8 flex items-center justify-center gap-1.5 bg-brand-teal text-white rounded-lg text-[11px] font-bold shadow-sm hover:bg-brand-teal-hover hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                                            >
                                                {isRenewingThis ? (
                                                    <LoadingSpinner size="small" color="white" />
                                                ) : (
                                                    <>
                                                        <RefreshCw className="w-3.5 h-3.5" /> RENEW
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="h-full flex items-center justify-center flex-col gap-2 opacity-60">
                             <Check className="w-10 h-10 text-green-500 bg-green-100 p-2 rounded-full"/>
                             <p className="text-sm font-medium text-skin-muted">No expiring seats today.</p>
                        </div>
                    )}
                </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN (Narrow / Compact Payment Log) --- */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden sticky top-24">
                <div className="p-5 border-b border-skin-border bg-skin-base/50">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className='flex gap-3 items-center'>
                            <h2 className="text-md font-bold text-skin-text font-serif flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-brand-teal" /> Payment Log
                            </h2>
                            <button 
                                onClick={() => setShowPaymentLog(!showPaymentLog)}
                                className="p-1 hover:bg-skin-border rounded-full transition-colors text-skin-muted"
                            >
                                {showPaymentLog ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <p className="text-[10px] text-skin-muted font-bold mt-1 pl-6 uppercase tracking-tight">
                              {dailyPayments.length} Transactions
                          </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-skin-muted uppercase font-bold tracking-wider leading-none">Total</p>
                            <p className="text-md font-bold text-green-600">₹{showPaymentLog ? totalRevenueOnDate : "***"}</p>
                        </div>
                    </div>
                    
                    {/* Compact Date Controller */}
                    <div className="flex items-center justify-between bg-skin-surface rounded-lg p-1 border border-skin-border shadow-sm">
                        <button onClick={() => handleDateChange(-1)} className="p-1 hover:bg-skin-base rounded transition-colors"><ChevronLeft className="w-4 h-4 text-skin-muted" /></button>
                        <input 
                            type="date"
                            value={selectedDate}
                            max={getLocalYYYYMMDD(new Date())}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-[11px] font-bold text-skin-text outline-none cursor-pointer text-center w-full"
                        />
                        <button onClick={() => handleDateChange(1)} disabled={isToday} className={`p-1 rounded ${isToday ? 'text-skin-border' : 'text-skin-muted hover:bg-skin-base'}`}><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto">
                    {isPaymentsLoading ? (
                        <div className="flex flex-col items-center justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-teal mb-2"></div></div>
                    ) : dailyPayments.length > 0 ? (
                        <div className="divide-y divide-skin-border">
                            {dailyPayments.map((pay) => {
                                const startDate = new Date(pay.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                                const endDate = new Date(pay.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

                                return (
                                    <div 
                                        key={pay._id} 
                                        onClick={() => navigate(`/users/${pay.user?._id}`)}
                                        className="p-4 hover:bg-skin-base transition-colors flex items-center justify-between cursor-pointer group gap-2"
                                    >
                                        {/* Left Block: Avatar & Member Info */}
                                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-9 h-9 rounded-full bg-brand-teal/10 text-brand-teal group-hover:bg-brand-teal group-hover:text-white flex items-center justify-center text-[10px] font-bold transition-colors">
                                                    {pay.user?.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                                                    pay.shift === 'fullday' ? 'bg-sky-500' : 
                                                    pay.shift === 'first' ? 'bg-yellow-400' : 'bg-indigo-500'
                                                }`} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs font-bold text-skin-text truncate">{pay.user?.username}</p>
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-[10px] text-brand-teal font-bold leading-none">Seat #{pay.seatNo}</p>
                                                    <span className="text-skin-border text-[8px]">|</span>
                                                    <p className="text-[9px] text-skin-muted font-medium whitespace-nowrap">{startDate} — {endDate}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Block: Amount & Trans details */}
                                        <div className="text-right flex-shrink-0 min-w-[70px]">
                                            <p className="text-xs font-bold text-skin-text">₹{showPaymentLog? pay.payment.amount : "***"}</p>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[8px] bg-skin-base text-skin-muted border border-skin-border px-1 rounded uppercase font-bold tracking-tighter">
                                                    {pay.payment.method || 'cash'}
                                                </span>
                                                <p className="text-[9px] text-skin-muted mt-0.5 leading-none">
                                                    {new Date(pay.payment.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-10">
                            <EmptyState icon={<Receipt className="w-8 h-8 text-skin-border"/>} title="No Records" message="No payments found." />
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: Recent Activity --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden">
                <div className="p-5 border-b border-skin-border bg-skin-base/50 flex justify-between items-center">
                    <h3 className="font-bold text-skin-text flex items-center gap-2"><CalendarClock className="w-4 h-4 text-skin-muted"/> New Bookings</h3>
                    <button onClick={() => navigate('/bookings')} className="text-xs font-medium text-brand-teal hover:underline">View All</button>
                </div>
                <div className="divide-y divide-skin-border">
                    {lists.recentBookings?.length > 0 ? lists.recentBookings.map((b) => (
                        <div key={b._id} className="p-4 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 flex items-center justify-center font-bold text-xs">#{b.seatNo}</div>
                                <div>
                                    <p className="text-sm font-semibold text-skin-text">{b.user?.username}</p>
                                    <p className="text-xs text-skin-muted capitalize">{b.shift} Shift • {new Date(b.createdAt).toLocaleDateString()}</p>
                                </div>
                             </div>
                             
                             {b.isTrial ? (
                                <span className="text-[10px] font-bold px-2 py-1 rounded capitalize bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                                    Trial
                                </span>
                             ) : (
                                <span className={`text-[10px] font-bold px-2 py-1 rounded capitalize ${
                                    b.payment?.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                    {b.payment?.status || 'unpaid'}
                                </span>
                             )}
                        </div>
                    )) : <EmptyState message="No recent bookings" />}
                </div>
            </div>

            {/* Recent Users */}
            <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden">
                <div className="p-5 border-b border-skin-border bg-skin-base/50 flex justify-between items-center">
                    <h3 className="font-bold text-skin-text flex items-center gap-2"><UserPlus className="w-4 h-4 text-skin-muted"/> New Members</h3>
                    <button onClick={() => navigate('/users')} className="text-xs font-medium text-brand-teal hover:underline">View All</button>
                </div>
                <div className="divide-y divide-skin-border">
                    {lists.recentUsers?.length > 0 ? lists.recentUsers.map((u) => (
                        <div key={u._id} className="p-4 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 flex items-center justify-center font-bold text-xs">{u.username.charAt(0)}</div>
                                <div>
                                    <p className="text-sm font-semibold text-skin-text">{u.username}</p>
                                    <p className="text-xs text-skin-muted">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <button onClick={() => navigate(`/users/${u._id}`)} className="text-xs text-skin-muted hover:text-brand-teal"><ArrowRight className="w-4 h-4"/></button>
                        </div>
                    )) : <EmptyState message="No recent members" />}
                </div>
            </div>
        </div>

      </div>
    </main>
  );
};

export default DashboardPage;