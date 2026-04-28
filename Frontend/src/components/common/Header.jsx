import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router';
import { User, LogOut, Settings, Menu, X } from 'lucide-react';
import { logoutAdmin } from '../../slices/authSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin } = useSelector(state => state.authSlice);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Seat Matrix', path: '/seats' },
    { name: 'Users', path: '/users' },
    { name: 'Banking', path: '/bookings' },
    { name: 'Attendance', path: '/attendance' },
  ];

  const handleLogout = async () => {
    await dispatch(logoutAdmin());
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-skin-surface sticky top-0 z-50 shadow-lg border-b border-skin-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* --- Logo Area --- */}
          <div className="flex items-center gap-3">
            <div className="bg-brand-teal/10 p-1 rounded-full">
                <img 
                    src={import.meta.env.VITE_LIBRARY_LOGO_URL} 
                    alt={`${import.meta.env.VITE_LIBRARY_NAME || 'Nearest Library'} Logo`} 
                    className="h-10 w-10 sm:h-12 sm:w-12 text-brand-teal rounded-full object-contain"
                />
            </div>
            <span className="text-lg sm:text-xl font-display font-bold text-skin-text tracking-tight truncate max-w-[150px] sm:max-w-none">
              {import.meta.env.VITE_LIBRARY_NAME} <span className="text-brand-teal">Admin</span>
            </span>
          </div>

          {/* --- Desktop Navigation --- */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/20' 
                      : 'text-skin-muted hover:text-skin-text hover:bg-skin-base'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* --- Right Actions (Profile & Toggles) --- */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Profile Button */}
            <button
              onClick={() => navigate('/admin/profile')}
              className="flex items-center gap-2 text-skin-muted hover:text-skin-text transition-colors group"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-skin-base border border-skin-border flex items-center justify-center group-hover:border-brand-teal transition-colors overflow-hidden">
                 {admin?.profileImageUrl ? (
                    <img src={admin.profileImageUrl} alt="Admin" className="h-full w-full object-cover" />
                 ) : (
                    <User className="h-5 w-5" />
                 )}
              </div>
              <span className="hidden lg:block text-sm font-medium">{admin?.adminName}</span>
            </button>

            {/* Desktop Separator */}
            <div className="h-6 w-[1px] bg-skin-border mx-1 hidden sm:block"></div>

            {/* Settings Button */}
            <button
              onClick={() => navigate('/settings')}
              className="p-2 text-skin-muted hover:text-brand-teal hover:bg-brand-teal/10 rounded-full transition-all"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-skin-muted hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>

            {/* --- Mobile Menu Toggle Button --- */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 ml-1 text-skin-muted hover:text-skin-text hover:bg-skin-base rounded-md transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Navigation Dropdown --- */}
      {/* This renders only when isMobileMenuOpen is true */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-skin-border bg-skin-surface ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 shadow-inner">
          {navItems.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-teal text-white shadow-md shadow-brand-teal/20' 
                    : 'text-skin-muted hover:text-skin-text hover:bg-skin-base'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          
          {/* Optional: Show User Name in mobile menu if hidden in header */}
          <div className="pt-4 mt-4 border-t border-skin-border lg:hidden px-4 flex items-center gap-3 text-skin-muted">
             <span className="text-sm">Signed in as: <span className="font-semibold text-skin-text">{admin?.adminName || 'Admin'}</span></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
