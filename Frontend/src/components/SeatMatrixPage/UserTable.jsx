import React, { useState, useMemo } from 'react';
import { getRenewalStatus } from '../../utils/helperFunctions';
import { ShiftBadge, PaymentStatusBadge, RenewalStatusBadge } from '../common/Badges';
import EmptyState from '../common/EmptyState';
import { ArrowUpDown, Edit2, Trash2, Eye, Plus, Search } from 'lucide-react';

function isOccupied(item) {
  return 'user' in item && 'booking' in item;
}

const UserTable = ({ data, onEditBooking, onDeleteBooking, onShowDetails, onAddUserToSeat }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'seatNo', direction: 'asc' });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
        const aVal = isOccupied(a) ? a.booking[sortConfig.key] || a.seatNo : a.seatNo;
        const bVal = isOccupied(b) ? b.booking[sortConfig.key] || b.seatNo : b.seatNo;
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
  }, [data, sortConfig]);

  const SortHeader = ({ label, sortKey }) => (
    <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider cursor-pointer hover:bg-skin-base hover:text-brand-teal transition-colors group" onClick={() => requestSort(sortKey)}>
      <div className="flex items-center gap-1">
        {label} <ArrowUpDown className={`w-3 h-3 text-skin-border group-hover:text-brand-teal transition-colors ${sortConfig.key === sortKey ? 'text-brand-teal' : ''}`} />
      </div>
    </th>
  );

  return (
    <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-skin-border">
          <thead>
            <tr className="bg-skin-base/50">
              <SortHeader label="Seat" sortKey="seatNo" />
              <SortHeader label="Name" sortKey="username" />
              <SortHeader label="Shift" sortKey="shift" />
              <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Contact</th>
              <SortHeader label="Duration" sortKey="endDate" />
              <SortHeader label="Payment" sortKey="payment.status" />
              <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-skin-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-skin-surface divide-y divide-skin-border">
            {sortedData.length > 0 && sortedData.map((item) => {
              const rowKey = isOccupied(item) ? `${item.booking._id}-${item.visualShift}` : `avail-${item.seatNo}-${item.visualShift}`;
              
              if (isOccupied(item)) {
                const { user, booking } = item;
                return (
                  <tr key={rowKey} className="hover:bg-brand-teal/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-brand-teal bg-brand-teal/10 px-2 py-1 rounded text-sm">#{booking.seatNo}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-skin-text">{user.username}</div>
                        <div className="text-xs text-skin-muted">{user.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <ShiftBadge shift={booking.shift} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-skin-muted font-mono">{user.contactNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-skin-muted">
                        <div className="flex flex-col">
                            <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                            <span className="text-skin-border">to</span>
                            <span className="font-medium text-skin-text">{new Date(booking.endDate).toLocaleDateString()}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><PaymentStatusBadge status={booking.payment.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap"><RenewalStatusBadge status={getRenewalStatus(booking.endDate)} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onShowDetails(user, booking)} className="p-1.5 text-skin-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => onEditBooking(user, booking)} className="p-1.5 text-skin-muted hover:text-brand-teal hover:bg-brand-teal/10 rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => onDeleteBooking(booking)} className="p-1.5 text-skin-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr key={rowKey} className="bg-skin-base/30 hover:bg-skin-base transition-colors border-l-4 border-l-transparent hover:border-l-brand-teal">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-skin-muted text-sm">#{item.seatNo}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-skin-muted italic">Available</td>
                    <td className="px-6 py-4 whitespace-nowrap"><ShiftBadge shift={item.visualShift} /></td>
                    <td className="px-6 py-4" colSpan={4}></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => onAddUserToSeat(item.seatNo, item.visualShift)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-teal border border-brand-teal rounded-md hover:bg-brand-teal hover:text-white transition-all">
                        <Plus className="w-3 h-3" /> Assign
                      </button>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
        {data.length === 0 && (
          <EmptyState icon={<Search />} title="No Seats Found" message="Adjust your filters to see results." />
        )}
      </div>
    </div>
  );
};

export default UserTable;