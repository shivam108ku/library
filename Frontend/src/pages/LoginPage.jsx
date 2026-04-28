import React, { useState, useEffect } from 'react';
import { loginAdmin } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Phone, Lock, ArrowRight, Loader2, BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

const LoginPage = () => {
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(state => state.authSlice);

  // Redirect to dashboard after successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdmin({ phoneNo, password, libraryName: import.meta.env.VITE_LIBRARY_CODE }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-skin-base px-6 py-12 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{ backgroundImage: 'radial-gradient(circle, rgb(var(--color-primary)) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-skin-muted hover:text-brand-teal transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Card */}
        <div className="bg-skin-surface rounded-3xl border border-skin-border p-8 shadow-2xl">
          
          {/* Logo + Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-teal to-purple-500 mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display font-bold text-3xl text-skin-text mb-2">Admin Login</h1>
            <p className="text-skin-muted text-sm">Sign in to access your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-skin-muted uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-skin-muted group-focus-within:text-brand-teal transition-colors" />
                <input
                  type="tel"
                  required
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  className="w-full pl-12 pr-4 py-3.5 bg-skin-base border border-skin-border rounded-xl text-skin-text placeholder-skin-muted/40 text-sm focus:outline-none focus:ring-2 focus:border-brand-teal transition-all"
                  style={{ '--tw-ring-color': 'rgb(var(--color-primary) / 0.2)' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-skin-muted uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-skin-muted group-focus-within:text-brand-teal transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3.5 bg-skin-base border border-skin-border rounded-xl text-skin-text placeholder-skin-muted/40 text-sm focus:outline-none focus:ring-2 focus:border-brand-teal transition-all"
                  style={{ '--tw-ring-color': 'rgb(var(--color-primary) / 0.2)' }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 mt-6 shadow-lg"
              style={{ background: 'linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-primary-hover)))' }}
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-skin-muted mt-6">
            &copy; {new Date().getFullYear()} {import.meta.env.VITE_LIBRARY_NAME || 'Nearest Library'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
