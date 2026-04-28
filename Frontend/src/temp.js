// <!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <link rel="icon" type="image/svg+xml" href="/vite.svg" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Pariksha Library</title>
//   </head>
//   <body>
//     <div id="root"></div>
//     <script type="module" src="/src/main.jsx"></script>
//   </body>
// </html>
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import  store  from './store.js';
// import { Provider } from 'react-redux'
// import { BrowserRouter } from 'react-router';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Provider store={store}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </Provider>
//   </StrictMode>,
// )
// import { useState } from 'react'
// import './App.css'
// import LoginPage from './pages/LoginPage'
// import LoadingComponent from './components/common/LoadingComponent'
// import DashboardPage from './pages/DashboardPage'
// import SeatMatrixPage from './pages/SeatMatrixPage'
// import UsersPage from './pages/UsersPage'
// import BookingsPage from './pages/BookingsPage'
// import Header from './components/common/Header'
// import { useSelector, useDispatch } from 'react-redux'
// import { authenticateAdmin } from './slices/authSlice';
// import { useEffect } from 'react'
// import { Routes, Route } from "react-router";
// import AdminProfilePage from './pages/AdminProfilePage'

// function App() {
//   const { loading, isAuthenticated } = useSelector(state => state.authSlice);
//   const dispatch = useDispatch();
  
//   useEffect(() => {
//     dispatch(authenticateAdmin());
//   }, []);

//   if(loading) return <LoadingComponent/>

//   if(isAuthenticated) 
//   return (
//     <>
//     <Header />
//     <Routes>
//       <Route path='/' element={<DashboardPage />}></Route>
//       <Route path='/seats' element={<SeatMatrixPage />}></Route>
//       <Route path='/users' element={<UsersPage />}></Route>
//       <Route path='/bookings' element={<BookingsPage/>}></Route>
//       <Route path='/admin/profile' element={<AdminProfilePage/>}></Route>
//     </Routes>
//     </>
//   )

//   return <LoginPage />
// }

// export default App
// import React, { useMemo } from 'react';
// import { useLibraryData } from '../hooks/useLibraryData';
// import { getRenewalStatus } from '../utils/helperFunctions';
// import StatCard from '../components/DashboardPage/StatCard';
// import LoadingSpinner from '../components/common/LoadingSpinner';
// import EmptyState from '../components/common/EmptyState';
// import SeatMapPreview from '../components/DashboardPage/SeatMapPreview';

// const TOTAL_LIBRARY_SEATS = 50;

// // --- ICONS for Stat Cards & Empty States ---
// const UsersIcon = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
//        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
//     <circle cx="9" cy="7" r="4"/>
//     <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
//     <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
//   </svg>
// );

// const OccupancyIcon = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
//        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
//   </svg>
// );

// const RenewalIcon = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
//        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M20 12h-5.5a2.5 2.5 0 1 0 0 5h.5"/>
//     <path d="M2 12h5.5a2.5 2.5 0 1 1 0 5h-.5"/>
//     <path d="M12 2v20"/>
//     <path d="M12 2a2.5 2.5 0 1 0 5 2.5V4"/>
//     <path d="M12 2a2.5 2.5 0 1 1-5 2.5V4"/>
//   </svg>
// );

// const UnpaidIcon = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
//        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="12" cy="12" r="10"/>
//     <line x1="12" y1="8" x2="12" y2="12"/>
//     <line x1="12" y1="16" x2="12.01" y2="16"/>
//   </svg>
// );

// // --- MAIN DASHBOARD PAGE ---
// const DashboardPage = () => {
//   const libraryData = useLibraryData();
//   const { users, bookings, isLoading, error } = libraryData;

//   const activeBookings = useMemo(
//     () => bookings.filter((b) => new Date(b.endDate) >= new Date()),
//     [bookings]
//   );

//   const stats = useMemo(() => {
//     const totalSlots = TOTAL_LIBRARY_SEATS * 2;
//     const occupiedSlots = activeBookings.reduce(
//       (acc, booking) => acc + (booking.shift === 'FullDay' ? 2 : 1),
//       0
//     );
//     const occupancy = totalSlots > 0 ? (occupiedSlots / totalSlots) * 100 : 0;

//     return {
//       totalUsers: users.length,
//       occupancy: occupancy.toFixed(1),
//       upcomingRenewals: activeBookings.filter(
//         (b) => getRenewalStatus(b.endDate) === 'expiring'
//       ).length,
//       unpaidDues: activeBookings.filter((b) => b.paymentStatus === 'Unpaid').length,
//     };
//   }, [users, activeBookings]);

//   const renewalsDueSoon = useMemo(() => {
//     return activeBookings
//       .filter((b) => getRenewalStatus(b.endDate) === 'expiring')
//       .map((booking) => ({
//         booking,
//         user: users.find((u) => u.id === booking.userId),
//       }))
//       .filter((item) => item.user)
//       .sort(
//         (a, b) =>
//           new Date(a.booking.endDate).getTime() -
//           new Date(b.booking.endDate).getTime()
//       );
//   }, [activeBookings, users]);

//   const recentUsers = useMemo(() => {
//     return [...users]
//       .sort(
//         (a, b) =>
//           new Date(b.createdDate).getTime() -
//           new Date(a.createdDate).getTime()
//       )
//       .slice(0, 5);
//   }, [users]);

//   const occupiedSlots = useMemo(() => {
//     const userMap = new Map(users.map((u) => [u.id, u]));

//     return activeBookings
//       .map((booking) => ({
//         booking,
//         user: userMap.get(booking.userId),
//       }))
//       .filter((item) => item.user);
//   }, [activeBookings, users]);

//   return (
//     <main className="flex-grow p-4 sm:p-6 lg:p-8">
//       <div className="max-w-full mx-auto">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//           <div className="flex items-center space-x-2 mt-4 sm:mt-0">
//             <button
//               className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
//             >
//               Add New User
//             </button>
//             <button
//               className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
//             >
//               View Seat Matrix
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="p-4 mb-4 text-red-600 bg-red-100 rounded-lg">{error}</div>
//         )}

//         {isLoading ? (
//           <LoadingSpinner />
//         ) : (
//           <>
//             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
//               <StatCard title="Total Users" value={stats.totalUsers} icon={<UsersIcon />} />
//               <StatCard title="Seat Occupancy" value={`${stats.occupancy}%`} icon={<OccupancyIcon />} />
//               <StatCard title="Upcoming Renewals" value={stats.upcomingRenewals} description="In next 7 days" icon={<RenewalIcon />} />
//               <StatCard title="Unpaid Dues" value={stats.unpaidDues} icon={<UnpaidIcon />} />
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Renewals Due Soon */}
//               <div className="lg:col-span-1 bg-white rounded-xl shadow-md overflow-hidden">
//                 <h2 className="text-lg font-semibold text-gray-800 p-4 border-b">
//                   Renewals Due Soon
//                 </h2>
//                 <div className="divide-y divide-gray-200">
//                   {renewalsDueSoon.length > 0 ? (
//                     renewalsDueSoon.map(({ user, booking }) => (
//                       <button
//                         key={booking.id}
//                         className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
//                       >
//                         <div>
//                           <p className="font-semibold text-gray-900">{user.name}</p>
//                           <p className="text-sm text-gray-500">
//                             Seat #{booking.seatNumber} &middot; {booking.shift}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-medium text-yellow-600">
//                             {new Date(booking.endDate).toLocaleDateString()}
//                           </p>
//                           <p className="text-xs text-gray-500">Expiring</p>
//                         </div>
//                       </button>
//                     ))
//                   ) : (
//                     <EmptyState
//                       icon={<RenewalIcon />}
//                       title="No Renewals Due"
//                       message="Everyone is up to date for the next 7 days."
//                     />
//                   )}
//                 </div>
//               </div>

//               {/* Seat Overview and Recent Users */}
//               <div className="lg:col-span-2 grid grid-cols-1 gap-8">
//                 <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                   <div className="p-4 border-b flex justify-between items-center">
//                     <h2 className="text-lg font-semibold text-gray-800">
//                       Seat Overview
//                     </h2>
//                     <button
//                       className="px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded-full hover:bg-green-200 transition"
//                     >
//                       View Full Matrix &rarr;
//                     </button>
//                   </div>
//                   <div className="p-4">
//                     <SeatMapPreview
//                       occupiedSlots={occupiedSlots}
//                       totalSeats={TOTAL_LIBRARY_SEATS}
//                     />
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                   <h2 className="text-lg font-semibold text-gray-800 p-4 border-b">
//                     Recently Added Users
//                   </h2>
//                   <div className="divide-y divide-gray-200">
//                     {recentUsers.length > 0 ? (
//                       recentUsers.map((user) => (
//                         <button
//                           key={user.id}
//                           className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
//                         >
//                           <div>
//                             <p className="font-semibold text-gray-900">
//                               {user.name}
//                             </p>
//                             <p className="text-sm text-gray-500">{user.email}</p>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-medium text-gray-700">
//                               {new Date(user.createdDate).toLocaleDateString()}
//                             </p>
//                             <p className="text-xs text-gray-500">Joined</p>
//                           </div>
//                         </button>
//                       ))
//                     ) : (
//                       <EmptyState
//                         icon={<UsersIcon />}
//                         title="No Recent Users"
//                         message="No new users have been added recently."
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </main>
//   );
// };

// export default DashboardPage;
// import React, { useMemo, useState } from 'react';

// // --- SEAT MAP PREVIEW COMPONENTS ---

// const SeatTooltip = ({ seat, position }) => {
//   const isFullyAvailable = !seat.fullday && !seat.morning && !seat.evening;

//   const SlotInfo = ({ slot }) => (
//     <div className="pl-2 border-l-2 border-gray-500">
//       <p><span className="font-medium">User:</span> {slot.user.name}</p>
//       <p><span className="font-medium">End:</span> {new Date(slot.booking.endDate).toLocaleDateString()}</p>
//       <p>
//         <span className="font-medium">Payment:</span>
//         <span className={slot.booking.paymentStatus === 'Paid' ? 'text-green-300' : 'text-red-300'}>
//           {' '}{slot.booking.paymentStatus}
//         </span>
//       </p>
//     </div>
//   );

//   return (
//     <div
//       style={{
//         top: `${position.top}px`,
//         left: `${position.left}px`,
//         transform: 'translate(-50%, -100%) translateY(-10px)',
//       }}
//       className="fixed z-50 w-64 p-3 bg-slate-800 text-white rounded-lg shadow-lg pointer-events-none"
//     >
//       <h4 className="font-bold text-lg mb-2 text-gray-200">Seat #{seat.number}</h4>
//       {isFullyAvailable ? (
//         <p className="text-sm text-green-300">Available for all shifts</p>
//       ) : (
//         <div className="space-y-2 text-sm">
//           {seat.fullday ? (
//             <div>
//               <p className="font-semibold text-sky-300">Full Day</p>
//               <SlotInfo slot={seat.fullday} />
//             </div>
//           ) : (
//             <>
//               <div>
//                 <p className="font-semibold text-yellow-300">Morning Shift</p>
//                 {seat.morning ? (
//                   <SlotInfo slot={seat.morning} />
//                 ) : (
//                   <p className="pl-2 text-gray-400">Available</p>
//                 )}
//               </div>
//               <div>
//                 <p className="font-semibold text-indigo-300">Evening Shift</p>
//                 {seat.evening ? (
//                   <SlotInfo slot={seat.evening} />
//                 ) : (
//                   <p className="pl-2 text-gray-400">Available</p>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       )}
//       <div className="absolute left-1/2 -translate-x-1/2 bottom-0 transform translate-y-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-slate-800"></div>
//     </div>
//   );
// };

// const SeatMapPreview = ({ occupiedSlots, totalSeats, onViewSeat }) => {
//   const [hoveredSeat, setHoveredSeat] = useState(null);

//   const seats = useMemo(() => {
//     const seatMap = new Map();
//     for (let i = 1; i <= totalSeats; i++) {
//       seatMap.set(i, { number: i });
//     }

//     occupiedSlots.forEach((slot) => {
//       const { booking } = slot;
//       if (seatMap.has(booking.seatNumber)) {
//         const seat = seatMap.get(booking.seatNumber);
//         if (booking.shift === 'Morning') seat.morning = slot;
//         else if (booking.shift === 'Evening') seat.evening = slot;
//         else if (booking.shift === 'FullDay') seat.fullday = slot;
//       }
//     });

//     return Array.from(seatMap.values());
//   }, [occupiedSlots, totalSeats]);

//   const handleMouseOver = (e, seat) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setHoveredSeat({
//       seat,
//       position: {
//         top: rect.top,
//         left: rect.left + rect.width / 2,
//       },
//     });
//   };

//   const handleMouseOut = () => {
//     setHoveredSeat(null);
//   };

//   const getSeatStyling = (seat) => {
//     if (seat.fullday) return { bg: 'bg-sky-500', text: 'text-white' };
//     if (seat.morning && seat.evening) return { bg: 'bg-purple-600', text: 'text-white' };
//     if (seat.morning) return { bg: 'bg-yellow-400', text: 'text-gray-800' };
//     if (seat.evening) return { bg: 'bg-indigo-500', text: 'text-white' };
//     return { bg: 'bg-gray-200 hover:bg-gray-300', text: 'text-gray-600' };
//   };

//   return (
//     <>
//       <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs text-gray-600">
//         <h3 className="font-semibold text-gray-700">Legend:</h3>
//         <div className="flex items-center">
//           <span className="w-3 h-3 rounded-sm bg-gray-200 mr-1.5"></span> Available
//         </div>
//         <div className="flex items-center">
//           <span className="w-3 h-3 rounded-sm bg-yellow-400 mr-1.5"></span> Morning
//         </div>
//         <div className="flex items-center">
//           <span className="w-3 h-3 rounded-sm bg-indigo-500 mr-1.5"></span> Evening
//         </div>
//         <div className="flex items-center">
//           <span className="w-3 h-3 rounded-sm bg-sky-500 mr-1.5"></span> Full Day
//         </div>
//         <div className="flex items-center">
//           <span className="w-3 h-3 rounded-sm bg-purple-600 mr-1.5"></span> Both Shifts
//         </div>
//       </div>

//       <div className="relative space-y-2">
//         {Array.from({ length: Math.ceil(seats.length / 10) }).map((_, rowIndex) => (
//           <div key={rowIndex} className="flex items-center gap-3">
//             <div className="text-xs font-mono text-gray-500 w-16 text-right pr-2">
//               {`S${rowIndex * 10 + 1}-${rowIndex * 10 + 10}`}
//             </div>
//             <div className="flex flex-grow gap-1">
//               {seats.slice(rowIndex * 10, rowIndex * 10 + 10).map((seat) => {
//                 const styles = getSeatStyling(seat);
//                 return (
//                   <div
//                     key={seat.number}
//                     onMouseOver={(e) => handleMouseOver(e, seat)}
//                     onMouseLeave={handleMouseOut}
//                     onClick={() => onViewSeat(seat.number)}
//                     title={`Seat #${seat.number}`}
//                     className="flex-1 h-5 rounded cursor-pointer transition-all duration-150 hover:ring-2 hover:ring-green-500 relative"
//                   >
//                     <div
//                       className={`w-full h-full rounded ${styles.bg} flex items-center justify-center text-[10px] font-bold ${styles.text} transition-colors`}
//                     >
//                       <span className="hidden sm:inline">{seat.number}</span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//         {hoveredSeat && <SeatTooltip seat={hoveredSeat.seat} position={hoveredSeat.position} />}
//       </div>
//     </>
//   );
// };

// export default SeatMapPreview;
// import React from 'react';

// const StatCard = ({ title, value, icon, description }) => {
//   return (
//     <div className="bg-white p-5 rounded-xl shadow-md flex items-center justify-between">
//       <div>
//         <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
//         <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
//         {description && <p className="text-xs text-gray-500">{description}</p>}
//       </div>
//       <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-green-100 rounded-full text-green-600">
//         {icon}
//       </div>
//     </div>
//   );
// };

// export default StatCard;
// import React from 'react';
// import { Shift, PaymentStatus } from '../../utils/types';

// export const ShiftBadge = ({ shift }) => {
//   const styles = {
//     [Shift.Morning]: 'bg-yellow-100 text-yellow-800',
//     [Shift.Evening]: 'bg-indigo-100 text-indigo-800',
//     [Shift.FullDay]: 'bg-sky-100 text-sky-800',
//   };
//   return (
//     <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${styles[shift]}`}>
//       {shift}
//     </span>
//   );
// };

// export const PaymentStatusBadge = ({ status }) => (
//   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//     status === PaymentStatus.Paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//   }`}>
//     {status}
//   </span>
// );

// export const RenewalStatusBadge = ({ status }) => (
//   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
//     {
//       active: 'bg-green-100 text-green-800',
//       expiring: 'bg-yellow-100 text-yellow-800',
//       expired: 'bg-red-100 text-red-800',
//     }[status]
//   }`}>
//     {status}
//   </span>
// );

// export const BookingStatusBadge = ({ endDate }) => {
//   const isPast = new Date(endDate) < new Date();
//   const text = isPast ? 'Completed' : 'Active';
//   const color = isPast ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800';

//   return (
//     <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
//       {text}
//     </span>
//   );
// };
// import React from 'react';

// const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
//         <div className="p-6">
//           <h3 className="text-lg font-medium text-gray-900">{title}</h3>
//           <div className="mt-2">
//             <p className="text-sm text-gray-500">{message}</p>
//           </div>
//         </div>
//         <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={onConfirm}
//             className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmationModal;
// import React from 'react';

// const EmptyState = ({ icon, title, message }) => (
//   <div className="text-center p-8">
//     <div className="flex justify-center items-center mx-auto w-14 h-14 bg-gray-100 rounded-full text-gray-400">
//       {React.cloneElement(icon, { className: "w-8 h-8" })}
//     </div>
//     <h3 className="mt-4 text-lg font-semibold text-gray-800">{title}</h3>
//     <p className="mt-1 text-sm text-gray-500">{message}</p>
//   </div>
// );

// export default EmptyState;
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { NavLink, useNavigate } from 'react-router';
// import LibraryLogoIcon from '../Icons/LibraryLogoIcon';

// // --- ICONS ---
// const UserCircleIcon = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <circle cx="12" cy="12" r="10" />
//       <circle cx="12" cy="8" r="3" />
//       <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
//   </svg>
// );

// const LogoutIcon = (props) => (
//   <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
//       <polyline points="16 17 21 12 16 7"/>
//       <line x1="21" y1="12" x2="9" y2="12"/>
//   </svg>
// );

// // --- HEADER COMPONENT ---
// const Header = () => {
//   const navigate = useNavigate();
//   const { admin } = useSelector(state => state.authSlice);

//   return (
//     <header className="bg-slate-900 sticky top-0 z-10 shadow-md">
//       <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//             <LibraryLogoIcon className="w-8 h-8 text-green-500"/>
//             <span className="ml-3 text-2xl font-bold text-white">Pariksha Library</span>
//           </div>

//           {/* Navigation */}
//           <nav className="hidden md:flex items-center space-x-6">
//             {[
//               { name: 'Dashboard', path: '/' },
//               { name: 'Seat Matrix', path: '/seats' },
//               { name: 'Users', path: '/users' },
//               { name: 'Bookings', path: '/bookings' },
//             ].map((link) => (
//               <NavLink
//                 key={link.path}
//                 to={link.path}
//                 className={({ isActive }) =>
//                   `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//                     isActive 
//                       ? 'bg-slate-700 text-white shadow-md' 
//                       : 'text-gray-300 hover:bg-slate-800 hover:text-white'
//                   }`
//                 }
//               >
//                 {link.name}
//               </NavLink>
//             ))}
//           </nav>

//           {/* Profile & Logout */}
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => navigate('/admin/profile')}
//               className="flex items-center text-gray-300 hover:text-white focus:outline-none transition duration-200 transform hover:scale-105"
//               aria-label="Admin Profile"
//             >
//               {admin?.profileImageUrl 
//                 ? <img src={admin.profileImageUrl} alt="Admin" className="h-7 w-7 rounded-full object-cover" /> 
//                 : <UserCircleIcon className="h-7 w-7" />}
//               <span className="hidden sm:inline ml-2 font-medium">{admin?.adminName}</span>
//             </button>

//             <button
//               className="flex items-center text-gray-300 hover:text-white focus:outline-none transition duration-200 transform hover:scale-105"
//               aria-label="Logout"
//             >
//               <LogoutIcon className="h-6 w-6" />
//               <span className="hidden sm:inline ml-2 font-medium">Logout</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
// import React from 'react';
// import LoadingSpinner from './LoadingSpinner';
// import LibraryLogoIcon from '../Icons/LibraryLogoIcon';


// const LoadingComponent = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
//       <div className="flex items-center justify-center mb-4">
//         <LibraryLogoIcon className="w-12 h-12 text-green-600" />
//         <h1 className="ml-4 text-4xl font-bold text-gray-800">Pariksha Library</h1>
//       </div>
//       <LoadingSpinner />
//       {/* <p className="mt-4 text-lg">Getting things ready...</p> */}
//     </div>
//   );
// };

// export default LoadingComponent;
// import React from 'react';

// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center p-8">
//     <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
//   </div>
// );

// export default LoadingSpinner;
// import React from 'react';

// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   onPageChange,
//   totalItems,
//   itemsPerPage
// }) => {
//   const handlePrevious = () => {
//     if (currentPage > 1) {
//       onPageChange(currentPage - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       onPageChange(currentPage + 1);
//     }
//   };

//   const startItem = (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   return (
//     <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//       {/* Mobile Pagination */}
//       <div className="flex-1 flex justify-between sm:hidden">
//         <button
//           onClick={handlePrevious}
//           disabled={currentPage === 1}
//           className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <button
//           onClick={handleNext}
//           disabled={currentPage === totalPages}
//           className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       {/* Desktop Pagination */}
//       <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//         <div>
//           <p className="text-sm text-gray-700">
//             Showing <span className="font-medium">{startItem}</span> to{' '}
//             <span className="font-medium">{endItem}</span> of{' '}
//             <span className="font-medium">{totalItems}</span> results
//           </p>
//         </div>

//         <div>
//           <nav
//             className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//             aria-label="Pagination"
//           >
//             <button
//               onClick={handlePrevious}
//               disabled={currentPage === 1}
//               className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//             >
//               <span className="sr-only">Previous</span>
//               <svg
//                 className="h-5 w-5"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 
//                   3.293a1 1 0 01-1.414 1.414l-4-4a1 1 
//                   0 010-1.414l4-4a1 1 0 011.414 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>

//             <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//               Page {currentPage} of {totalPages}
//             </span>

//             <button
//               onClick={handleNext}
//               disabled={currentPage === totalPages}
//               className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//             >
//               <span className="sr-only">Next</span>
//               <svg
//                 className="h-5 w-5"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M7.293 14.707a1 1 0 010-1.414L10.586 
//                   10 7.293 6.707a1 1 0 
//                   011.414-1.414l4 4a1 1 0 
//                   010 1.414l-4 4a1 1 0 
//                   01-1.414 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaginationControls;
// import React, { useState, useEffect } from 'react';

// // Assuming your types file has a User type, but it's not strictly necessary for this component.
// // import { User } from '../../utils/types'; 

// const UserFormModal = ({ 
//   isOpen, 
//   onClose, 
//   onSubmit, 
//   initialUser,
// }) => {
//   // isEditing is true if an initialUser is passed, indicating we are editing an existing user.
//   const isEditing = !!initialUser;
  
//   // This function sets the initial state for the form.
//   // It pre-populates with initialUser data if editing, otherwise it uses empty strings or defaults.
//   const getInitialState = () => ({
//     name: initialUser?.name || '',
//     // email: initialUser?.email || '',
//     phone: initialUser?.phone || '',
//     gender: initialUser?.gender || 'male', // Default to 'male' for new users
//   });
  
//   const [formData, setFormData] = useState(getInitialState());

//   // This effect resets the form state whenever the modal is opened or the user being edited changes.
//   useEffect(() => {
//     if (isOpen) {
//       setFormData(getInitialState());
//     }
//   }, [isOpen, initialUser]);

//   // A generic handler to update the form state as the user types.
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Handles the form submission.
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Calls the onSubmit prop with the user data.
//     // Includes the original user ID if we are in editing mode.
//     onSubmit({
//         id: initialUser?.id,
//         ...formData
//     });
//   };
  
//   // If the modal is not open, render nothing.
//   if (!isOpen) return null;
  
//   // Determine the modal title based on whether we are creating or editing.
//   const title = isEditing ? 'Edit User Details' : 'Create New User';

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
//         <div className="p-6 border-b">
//           <h3 className="text-xl font-semibold">{title}</h3>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="p-6 grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
//               <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
//             </div>
//             {/* <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
//               <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
//             </div> */}
//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
//               <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500" />
//             </div>
//             <div>
//               <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
//               <select name="gender" id="gender" value={formData.gender} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="third gender">Third Gender</option>
//               </select>
//             </div>
//           </div>
//           <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
//             <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
//               Cancel
//             </button>
//             <button type="submit" className="bg-green-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserFormModal;