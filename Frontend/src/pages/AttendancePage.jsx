import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import attendanceService from '../services/attendanceService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  UserCheck, 
  LogOut, 
  Search,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Helper: Get Local Date as YYYY-MM-DD string
// This ensures we don't accidentally get yesterday's date due to UTC conversion
const getLocalYYYYMMDD = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AttendancePage = () => {
  const navigate = useNavigate();
  
  // State: Initialize with TODAY in Local Time
  const [selectedDate, setSelectedDate] = useState(getLocalYYYYMMDD(new Date()));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Data
  useEffect(() => {
    const fetchDailyAttendance = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching for date:", selectedDate); // Debugging log

        const response = await attendanceService.fetchAttendanceForAllUsers(selectedDate);
        setRecords(response.attendanceRecords || []);
      } catch (err) {
        console.error("Attendance fetch error:", err);
        setError(err.message || "Failed to load attendance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchDailyAttendance();
  }, [selectedDate]);

  // Handlers for Date Navigation
  const handleDateChange = (daysToAdd) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    setSelectedDate(getLocalYYYYMMDD(currentDate));
  };

  // Derived Stats
  const stats = useMemo(() => {
    const total = records.length;
    const active = records.filter(r => !r.timeOut).length;
    const checkedOut = records.filter(r => r.timeOut).length;
    return { total, active, checkedOut };
  }, [records]);

  // Filtered Records (Search)
  const filteredRecords = useMemo(() => {
    if (!searchTerm) return records;
    const lowerTerm = searchTerm.toLowerCase();
    
    return records.filter(record => {
      const userName = record.user?.username?.toLowerCase() || '';
      const seatNo = record.booking?.seatNo?.toString() || '';
      return userName.includes(lowerTerm) || seatNo.includes(lowerTerm);
    });
  }, [records, searchTerm]);

  // Helper: Format Time
  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isToday = selectedDate === getLocalYYYYMMDD(new Date());

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-skin-base flex flex-col transition-colors duration-300">
      {/* --- Top Navigation Bar --- */}
      <div className="bg-skin-surface border-b border-skin-border sticky top-0 z-10 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-full hover:bg-skin-base text-skin-muted hover:text-skin-text transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-serif font-bold text-skin-text flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-teal" />
              Daily Attendance
            </h1>
          </div>
          
          <div className="flex items-center bg-skin-base rounded-lg p-1 border border-skin-border">
            {/* Previous Day Button */}
            <button 
              onClick={() => handleDateChange(-1)}
              className="p-1.5 rounded-md hover:bg-skin-surface hover:shadow-sm text-skin-muted hover:text-skin-text transition-all"
              title="Previous Day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Date Input */}
            <input 
              type="date"
              value={selectedDate}
              max={getLocalYYYYMMDD(new Date())}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mx-1 px-2 py-1 bg-transparent border-none text-sm font-bold text-skin-text focus:ring-0 outline-none cursor-pointer"
            />

            {/* Next Day Button (Disabled if Today) */}
            <button 
              onClick={() => handleDateChange(1)}
              disabled={isToday}
              className={`p-1.5 rounded-md transition-all ${
                isToday 
                  ? 'text-skin-border cursor-not-allowed' 
                  : 'text-skin-muted hover:text-skin-text hover:bg-skin-surface hover:shadow-sm'
              }`}
              title="Next Day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* --- Stats Overview --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-skin-surface p-5 rounded-xl shadow-sm border border-skin-border flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-skin-muted font-medium">Total Present</p>
              <p className="text-2xl font-bold text-skin-text">{stats.total}</p>
            </div>
          </div>
          
          <div className="bg-skin-surface p-5 rounded-xl shadow-sm border border-skin-border flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-skin-muted font-medium">Currently In</p>
              <p className="text-2xl font-bold text-skin-text">{stats.active}</p>
            </div>
          </div>

          <div className="bg-skin-surface p-5 rounded-xl shadow-sm border border-skin-border flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 rounded-lg">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-skin-muted font-medium">Checked Out</p>
              <p className="text-2xl font-bold text-skin-text">{stats.checkedOut}</p>
            </div>
          </div>
        </div>

        {/* --- Main Content --- */}
        <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden transition-colors duration-300">
          
          {/* Table Header / Toolbar */}
          <div className="p-5 border-b border-skin-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-skin-text">
              Attendance Log <span className="text-skin-muted font-normal text-sm ml-2">({new Date(selectedDate).toDateString()})</span>
            </h2>
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-skin-muted" />
              </div>
              <input
                type="text"
                placeholder="Search by name or seat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-skin-border rounded-lg leading-5 bg-skin-base text-skin-text placeholder-skin-muted/70 focus:outline-none focus:ring-1 focus:ring-brand-teal focus:border-brand-teal sm:text-sm transition-colors"
              />
            </div>
          </div>

          {error ? (
            <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="mt-2 text-sm font-bold underline">Retry</button>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-skin-border">
                <thead className="bg-skin-base/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Member</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Seat & Shift</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Time In</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Time Out</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-skin-surface divide-y divide-skin-border">
                  {filteredRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-skin-base transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal font-bold text-lg border border-brand-teal/20">
                            {record.user?.username ? record.user.username.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-skin-text">{record.user?.username || 'Unknown User'}</div>
                            <div className="text-xs text-skin-muted">{record.user?.contactNo || 'No Contact'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-skin-text font-medium">Seat #{record.booking?.seatNo || 'N/A'}</div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize mt-1
                          ${record.booking?.shift === 'fullday' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                          {record.booking?.shift || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-skin-text">
                          <Clock className="w-4 h-4 mr-2 text-green-500" />
                          {formatTime(record.timeIn)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-skin-muted">
                          {record.timeOut ? (
                             <>
                               <Clock className="w-4 h-4 mr-2 text-orange-500" />
                               {formatTime(record.timeOut)}
                             </>
                          ) : (
                            <span className="text-skin-border italic">-- : --</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.timeOut ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12">
              <EmptyState 
                icon={<UserCheck className="w-12 h-12 text-skin-border"/>}
                title="No Attendance Found"
                message={`No records found for ${new Date(selectedDate).toDateString()}.`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;