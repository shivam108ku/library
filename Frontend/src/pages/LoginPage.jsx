import React, { useState } from 'react';
import LibraryLogoIcon from '../components/Icons/LibraryLogoIcon';
import { loginAdmin } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.authSlice);

  const handleSubmit = (e) => {
    e.preventDefault(); 
    const data = { phoneNo, password, libraryName: import.meta.env.VITE_LIBRARY_CODE };
    dispatch(loginAdmin(data));
  };

  return (
    <div className="flex min-h-screen bg-skin-base relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="m-auto w-full max-w-md p-6 relative z-10">
        
        <div className="bg-skin-surface rounded-3xl shadow-xl border border-skin-border p-8 sm:p-10 animate-in fade-in zoom-in duration-500">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-brand-teal/10 rounded-2xl mb-4 shadow-sm">
              <LibraryLogoIcon className="w-10 h-10 text-brand-teal" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-skin-text mb-2">Welcome Back</h1>
            <p className="text-skin-muted text-sm">Sign in to access the Admin Panel</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-skin-muted group-focus-within:text-brand-teal transition-colors" />
                    <input
                    id="phoneNo"
                    name="phoneNo"
                    type="tel"
                    required
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    pattern="[0-9]{10}"
                    className="w-full pl-12 pr-4 py-3.5 bg-skin-base border border-skin-border rounded-xl text-skin-text placeholder-skin-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm font-medium"
                    placeholder="Mobile Number"
                    />
                </div>

                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-skin-muted group-focus-within:text-brand-teal transition-colors" />
                    <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-skin-base border border-skin-border rounded-xl text-skin-text placeholder-skin-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all text-sm font-medium"
                    placeholder="Password"
                    />
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-500/30 rounded-lg text-xs text-red-600 dark:text-red-300 text-center font-medium animate-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-teal text-white rounded-xl font-bold shadow-lg shadow-brand-teal/30 hover:bg-brand-teal-hover hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Signing In...
                  </>
              ) : (
                  <>
                    Sign In <ArrowRight className="w-5 h-5" />
                  </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-skin-border text-center">
            <p className="text-xs text-skin-muted">
                {import.meta.env.VITE_LIBRARY_NAME} Library Management System &copy; {new Date().getFullYear()}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;