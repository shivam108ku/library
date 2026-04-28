import React from 'react';
import { LogIn, LogOut, Calendar, Clock } from 'lucide-react';
import EmptyState from '../common/EmptyState';

const UserAttendanceTable = ({ attendance }) => {
    
    const formatTime = (dateString) => {
        if (!dateString) return '--:--';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const calculateDuration = (inTime, outTime) => {
        if (!inTime || !outTime) return null;
        const diff = new Date(outTime) - new Date(inTime);
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-skin-border">
                <thead className="bg-skin-base/80">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Seat/Shift</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Check In</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Check Out</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Duration</th>
                    </tr>
                </thead>
                <tbody className="bg-skin-surface divide-y divide-skin-border">
                    {attendance.map((record) => (
                        <tr key={record._id} className="hover:bg-brand-teal/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-sm font-medium text-skin-text">
                                    <Calendar className="w-4 h-4 text-skin-muted" />
                                    {formatDate(record.date)}
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
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                                    <LogIn className="w-4 h-4" />
                                    {formatTime(record.timeIn)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 font-medium">
                                    <LogOut className="w-4 h-4" />
                                    {formatTime(record.timeOut)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {record.timeOut ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-500/30">
                                        <Clock className="w-3 h-3" />
                                        {calculateDuration(record.timeIn, record.timeOut)}
                                    </span>
                                ) : (
                                    <span className="text-xs text-skin-muted italic">Still In</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {attendance.length === 0 && (
                <EmptyState
                    icon={<Clock />}
                    title="No Attendance Found"
                    message="No check-in records found for this user."
                />
            )}
        </div>
    );
};

export default UserAttendanceTable;