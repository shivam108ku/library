import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { 
  CheckCircle2, XCircle, Clock, User, Armchair, Loader2, CameraOff, 
  AlertTriangle, LogIn, LogOut, CalendarX, UserX, AlertCircle, Info 
} from 'lucide-react';
import attendanceService from '../services/attendanceService';

// --- COMPONENT: Digital Clock ---
const DigitalClock = memo(() => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    // Kept text-white as this overlays the camera feed
    <div className="text-right text-white drop-shadow-md">
      <p className="text-2xl md:text-4xl font-mono font-bold tracking-widest">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
      <p className="text-[10px] md:text-xs uppercase font-bold tracking-wider opacity-90">
        {time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
      </p>
    </div>
  );
});

// --- COMPONENT: Stat Box ---
const StatBox = ({ icon: Icon, label, value }) => (
  <div className="bg-skin-base p-2 md:p-3 rounded-xl border border-skin-border flex flex-col items-center justify-center text-center shadow-sm h-full">
    <div className="mb-1 text-skin-muted">
        <Icon className="w-4 h-4 md:w-5 md:h-5" />
    </div>
    <p className="text-[10px] uppercase font-bold text-skin-muted tracking-wider">{label}</p>
    <p className="text-sm md:text-lg font-bold text-skin-text truncate w-full">{value}</p>
  </div>
);

const AttendanceTrackerPage = () => {
  // VIEW STATES
  const [viewMode, setViewMode] = useState('SCAN'); 
  const [facingMode, setFacingMode] = useState('user'); 
  const [cameraError, setCameraError] = useState(false);
  
  // DATA STATES
  const [resultData, setResultData] = useState(null); 
  const [uiState, setUiState] = useState({ type: 'neutral', icon: Loader2, title: 'Processing...' });

  // REFS
  const isScanningLocked = useRef(false);
  const safetyTimeoutRef = useRef(null);

  // AUDIO
  const audio = useMemo(() => ({
    success: new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'),
    error: new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'),
  }), []);

  useEffect(() => {
    return () => clearTimeout(safetyTimeoutRef.current);
  }, []);

  // --- LOGIC: Handle Scan ---
  const handleScan = (rawResult) => {
    if (isScanningLocked.current || viewMode !== 'SCAN') return;
    const userId = rawResult?.[0]?.rawValue || rawResult;
    if (!userId) return;

    startProcessing(userId);
  };

  const startProcessing = (userId) => {
    isScanningLocked.current = true;
    setViewMode('PROCESSING');

    // Failsafe
    safetyTimeoutRef.current = setTimeout(() => {
        if(isScanningLocked.current) {
            configureUiState('timeout');
            setViewMode('RESULT');
            setTimeout(resetScanner, 3000);
        }
    }, 15000);

    processAttendance(userId);
  };

  const processAttendance = async (userId) => {
    try {
      const response = await attendanceService.markAttendance(userId);
      clearTimeout(safetyTimeoutRef.current);
      setResultData(response);

      const code = response.statusCode;
      
      // Determine Audio & Logic Category
      if (response.status === 'ok' || code === 1002) {
        // Treat "Already Marked" (1002) as a Success Event visually
        audio.success.currentTime = 0;
        audio.success.play().catch(()=>{});
        
        // Mark type as 'success' for green styling
        configureUiState(code, 'success', response.message);
      } else {
        // Actual Errors (No Booking, etc)
        audio.error.currentTime = 0;
        audio.error.play().catch(()=>{});
        configureUiState(code, 'error', response.message);
      }

    } catch (error) {
      console.error(error);
      configureUiState(500, 'error', error.message || "Network Error");
      audio.error.currentTime = 0;
      audio.error.play().catch(()=>{});
    } finally {
      setViewMode('RESULT');
      setTimeout(resetScanner, 4000); 
    }
  };

  const configureUiState = (code, type, apiMessage) => {
    // Default Config
    let config = { type, message: apiMessage, title: '', icon: AlertCircle, color: 'bg-red-600 dark:bg-red-700' };

    switch (code) {
        case 1004: // Time In
            config = { ...config, title: 'Welcome Back!', icon: LogIn, color: 'bg-green-600 dark:bg-green-700' };
            break;
        case 1003: // Time Out
            config = { ...config, title: 'Goodbye!', icon: LogOut, color: 'bg-green-600 dark:bg-green-700' };
            break;
        case 1002: // Duplicate (Already Marked)
            // Updated to GREEN/SUCCESS style so it feels positive
            config = { ...config, title: 'Attendance Recorded', icon: CheckCircle2, color: 'bg-green-600 dark:bg-green-700' };
            break;
        case 1001: // No Booking
            config = { ...config, title: 'No Active Booking', icon: CalendarX, color: 'bg-red-600 dark:bg-red-700' };
            break;
        case 404: // User Not Found
            config = { ...config, title: 'User Not Found', icon: UserX, color: 'bg-red-600 dark:bg-red-700' };
            break;
        default:
            config = { ...config, title: 'Access Denied', icon: XCircle, color: 'bg-red-600 dark:bg-red-700' };
    }
    setUiState(config);
  };

  const resetScanner = () => {
    setResultData(null);
    setViewMode('SCAN');
    isScanningLocked.current = false;
  };

  // --- RENDER HELPERS ---

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden font-sans">
      
      {/* 1. BACKGROUND LAYER (SCANNER) */}
      <div className={`absolute inset-0 z-0 transition-all duration-500 ${viewMode !== 'SCAN' ? 'blur-md scale-105 opacity-40' : 'opacity-100'}`}>
        {!cameraError ? (
            <Scanner 
                constraints={{ facingMode: facingMode }}
                onScan={handleScan} 
                scanDelay={500}
                onError={() => setCameraError(true)}
                components={{ audio: false, finder: false }}
                styles={{ container: { height: '100%', width: '100%' } }}
            />
        ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-skin-base text-skin-text p-4 text-center">
                <CameraOff className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-xl font-bold">Camera Error</h2>
                <p className="text-skin-muted mt-2">Please ensure camera permissions are allowed.</p>
            </div>
        )}
      </div>

      {/* 2. HEADER LAYER */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 z-10 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div>
            <h1 className="text-xl md:text-3xl font-serif font-bold text-brand-teal drop-shadow-lg">Pariksha Library</h1>
            <div className="flex items-center gap-2 text-white/90 text-xs md:text-sm font-medium mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${viewMode === 'SCAN' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                {viewMode === 'SCAN' ? 'Ready to Scan' : 'Processing...'}
            </div>
        </div>
        <DigitalClock />
      </div>

      {/* 3. SCAN GUIDE OVERLAY */}
      {viewMode === 'SCAN' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6">
            <div className="w-full max-w-[280px] aspect-square md:max-w-[400px] border-[3px] border-white/30 rounded-3xl relative backdrop-blur-[1px]">
                {/* Corners */}
                <div className="absolute -top-1 -left-1 w-12 h-12 border-t-[6px] border-l-[6px] border-brand-teal rounded-tl-2xl"></div>
                <div className="absolute -top-1 -right-1 w-12 h-12 border-t-[6px] border-r-[6px] border-brand-teal rounded-tr-2xl"></div>
                <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-[6px] border-l-[6px] border-brand-teal rounded-bl-2xl"></div>
                <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-[6px] border-r-[6px] border-brand-teal rounded-br-2xl"></div>
                
                {/* Scan Animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-teal/80 shadow-[0_0_30px_rgba(4,146,194,1)] animate-[scan_2s_infinite_linear]"></div>
            </div>
            <p className="mt-8 text-white/90 font-medium bg-black/40 px-6 py-2 rounded-full backdrop-blur-md border border-white/10 text-sm md:text-base animate-pulse">
                Place QR Code inside the frame
            </p>
        </div>
      )}

      {/* 4. LOADING STATE */}
      {viewMode === 'PROCESSING' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md text-white animate-in fade-in duration-200">
            <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-white/10 border-t-brand-teal rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl md:text-2xl font-bold tracking-widest animate-pulse">VERIFYING ID...</h2>
        </div>
      )}

      {/* 5. RESULT MODAL (RESPONSIVE CARD) */}
      {viewMode === 'RESULT' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg animate-in zoom-in-95 duration-300">
            
            <div className="w-full max-w-sm md:max-w-md bg-skin-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* --- CARD HEADER --- */}
                <div className={`p-6 md:p-8 text-center text-white flex flex-col items-center justify-center relative shrink-0 ${uiState.color}`}>
                    <div className="relative z-10 mb-2 scale-125">
                        <uiState.icon className="w-12 h-12 md:w-16 md:h-16" />
                    </div>
                    <h2 className="relative z-10 text-2xl md:text-3xl font-bold leading-tight">
                        {uiState.title}
                    </h2>
                    
                    {/* Only show raw message if it's an error for context */}
                    {(uiState.type === 'error') && (
                        <p className="relative z-10 text-white/90 text-sm mt-2 font-medium px-4">
                            {uiState.message}
                        </p>
                    )}
                    
                    {/* Show a gentle subtext for 1002 (Already Verified) */}
                    {(uiState.type === 'success' && uiState.message === 'Attendance already marked for today') && (
                         <p className="relative z-10 text-white/80 text-xs mt-2 font-medium px-4 bg-white/10 rounded-full py-1">
                            Already verified
                        </p>
                    )}
                </div>

                {/* --- CARD BODY --- */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center bg-skin-base">
                    
                    {/* User Profile (Only if user exists in response, even for 1002 case) */}
                    {resultData?.user ? (
                        <>
                            <div className="-mt-16 mb-4 relative shrink-0">
                                <img 
                                    src={resultData.user.profilePhotoUrl || "https://via.placeholder.com/150"} 
                                    alt="User"
                                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-skin-surface shadow-lg bg-skin-border"
                                    onError={(e) => {e.target.src = "https://via.placeholder.com/150?text=User"}}
                                />
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold text-skin-text text-center mb-6 leading-tight">
                                {resultData.user.username}
                            </h3>

                            <div className="grid grid-cols-2 gap-3 w-full mb-6">
                                <StatBox 
                                    icon={Armchair} 
                                    label="Allocated Seat" 
                                    value={`#${resultData.booking?.seatNo || '--'}`} 
                                />
                                <StatBox 
                                    icon={Clock} 
                                    label="Shift Type" 
                                    value={resultData.booking?.shift || '--'} 
                                    colorClass="capitalize" 
                                />
                            </div>

                            {/* Timestamp - Show for Success (includes 1002) */}
                            {uiState.type === 'success' && (
                                <div className="w-full bg-skin-surface p-4 rounded-xl border-l-4 border-green-500 shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-skin-muted font-bold uppercase tracking-wider">Time Recorded</p>
                                        <p className="text-2xl font-mono font-bold text-skin-text">
                                            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                    <CheckCircle2 className="w-8 h-8 text-green-500 opacity-20" />
                                </div>
                            )}
                        </>
                    ) : (
                        // Error Body (When no user data is returned, e.g. 404 or 1001)
                        <div className="py-8 text-center text-skin-muted h-full flex flex-col justify-center">
                            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-skin-border" />
                            <p className="text-sm font-medium">Please contact the admin desk for assistance.</p>
                        </div>
                    )}
                </div>

                {/* --- CARD FOOTER --- */}
                <div className="bg-skin-surface p-3 text-center border-t border-skin-border shrink-0">
                    <p className="text-[10px] text-skin-muted font-medium flex items-center justify-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" /> Resetting in 3s...
                    </p>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AttendanceTrackerPage;