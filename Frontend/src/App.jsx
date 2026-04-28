import { useState, useEffect } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import LoadingComponent from './components/common/LoadingComponent'
import DashboardPage from './pages/DashboardPage'
import SeatMatrixPage from './pages/SeatMatrixPage'
import UsersPage from './pages/UsersPage'
import BookingsPage from './pages/BookingsPage'
import Header from './components/common/Header'
import { useSelector, useDispatch } from 'react-redux'
import { authenticateAdmin } from './slices/authSlice';
import { Routes, Route, Outlet } from "react-router"; 
import AdminProfilePage from './pages/AdminProfilePage';
import UserDetailsPage from './pages/UserDetailsPage';
import SeatDetailsPage from './pages/SeatDetailsPage';
import AttendanceTrackerPage from './pages/AttendanceTrackerPage';
import AttendancePage from './pages/AttendancePage';
import EnquiryPage from './pages/EnquiryPage'; 
import SettingsPage from './pages/SettingsPage';

const MainLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

function App() {
  const { appearance, accent } = useSelector(state => state.themeSlice);
  const { loading, isAuthenticated } = useSelector(state => state.authSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    const root = window.document.documentElement;
    
    // 1. Set Background/Text Theme
    root.setAttribute('data-appearance', appearance);
    
    // 2. Set Brand Color Theme
    root.setAttribute('data-accent', accent);

    // 3. Handle Tailwind Dark Mode Class
    // If it's not light, we assume it's a dark variant
    if (appearance !== 'light') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

  }, [appearance, accent]);

  useEffect(() => {
    // Only authenticate on initial mount, not after logout
    if (!isAuthenticated) {
      dispatch(authenticateAdmin());
    }
  }, [dispatch]);

  if(loading) return <LoadingComponent/>

  if(isAuthenticated) 
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/login' element={<DashboardPage />} />
        <Route path='/settings' element={<SettingsPage/>} />
        <Route path='/seats' element={<SeatMatrixPage />} />
        <Route path='/seats/:seatNumber' element={<SeatDetailsPage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/users/:userId' element={<UserDetailsPage />} />
        <Route path='/bookings' element={<BookingsPage/>} />
        <Route path='/admin/profile' element={<AdminProfilePage/>} />
        <Route path='/attendance' element={<AttendancePage/>} />
        <Route path='/enquiries' element={<EnquiryPage/>} />
      </Route>

      <Route path='/attendance-tracker' element={<AttendanceTrackerPage />} />

    </Routes>
  )

  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  )
}

export default App