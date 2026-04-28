import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { getRenewalStatus } from '../../utils/helperFunctions';
import { Edit2, Trash2, Plus, ArrowUpRight } from 'lucide-react';

const UserSlot = ({ slot, onEdit, onDelete, onShowDetails }) => {
  const { user, booking } = slot;
  
  if (!user) {
    return (
      <div className="h-full p-2.5 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
        <p className="text-xs text-red-600 dark:text-red-400 font-semibold">User data missing</p>
      </div>
    );
  }
  
  const renewalStatus = getRenewalStatus(booking.endDate);

  const statusColors = {
    active: 'bg-green-500',
    expiring: 'bg-yellow-400',
    expired: 'bg-red-500',
  };

  const isPaid = booking.payment?.status === 'paid';

  return (
    <div
      className={`
        group relative h-full p-2.5 rounded-lg border flex flex-col justify-between transition-all duration-200 cursor-pointer hover:shadow-md
        ${isPaid 
            ? 'bg-green-50 border-green-200 hover:border-green-400 dark:bg-green-900/20 dark:border-green-500/30' 
            : 'bg-red-50 border-red-200 hover:border-red-400 dark:bg-red-900/20 dark:border-red-500/30'}
      `}
      onClick={() => onShowDetails(user, booking)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${statusColors[renewalStatus] || 'bg-gray-300'}`}></span>
            <span className="text-[10px] font-bold text-skin-muted uppercase tracking-wider">{booking.shift}</span>
        </div>
        
        <div className="flex gap-1 absolute top-2 right-2 bg-skin-surface/95 backdrop-blur-sm p-1 rounded-md shadow-sm border border-skin-border z-10">
            <button onClick={(e) => { e.stopPropagation(); onEdit(user, booking); }} className="text-skin-muted hover:text-brand-teal p-1 hover:bg-skin-base rounded"><Edit2 className="w-3 h-3" /></button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(booking); }} className="text-skin-muted hover:text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>

      <div className="mt-1">
        <p className="font-bold text-skin-text text-xs truncate leading-tight">{user.username}</p>
        <p className="text-[10px] text-skin-muted truncate mt-0.5">{user.contactNo}</p>
      </div>
    </div>
  );
};

const AddSlot = ({ seatNo, shift, onAdd }) => (
  <button
    onClick={() => onAdd(seatNo, shift)}
    className="w-full h-full min-h-[60px] rounded-lg border-2 border-dashed border-skin-border bg-skin-base/50 flex flex-col items-center justify-center text-skin-muted hover:text-brand-teal hover:border-brand-teal hover:bg-brand-teal/5 transition-all group"
  >
    <Plus className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
    <span className="text-[10px] font-semibold uppercase">Add {shift}</span>
  </button>
);

const SeatChart = ({ occupiedSlots, totalSeats, onAddUser, onEditBooking, onDeleteBooking, onShowDetails, isFiltering, seatsToHighlight }) => {
  const navigate = useNavigate();

  const seats = useMemo(() => {
    const seatMap = new Map();
    for (let i = 1; i <= totalSeats; i++) seatMap.set(i, { number: i });
    occupiedSlots.forEach(slot => {
      const { booking } = slot;
      if (seatMap.has(booking.seatNo)) {
        const seat = seatMap.get(booking.seatNo);
        if (booking.shift === 'first') seat.first = slot;
        else if (booking.shift === 'second') seat.second = slot;
        else if (booking.shift === 'fullday') seat.fullday = slot;
      }
    });
    return Array.from(seatMap.values());
  }, [occupiedSlots, totalSeats]);

  return (
    <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border p-6 transition-colors duration-300">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {seats.map(seat => {
          const isHighlighted = !isFiltering || seatsToHighlight.has(seat.number);
          
          return (
            <div key={seat.number} className={`bg-skin-surface rounded-xl border border-skin-border shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${!isHighlighted ? 'opacity-30 grayscale' : 'hover:shadow-md'}`}>
              <div className="bg-skin-base border-b border-skin-border px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-skin-border/20 transition-colors group/header" onClick={() => navigate(`/seats/${seat.number}`)}>
                <span className="text-xs font-bold text-skin-muted uppercase tracking-wider group-hover/header:text-brand-teal transition-colors flex items-center gap-1">
                    Seat {seat.number} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/header:opacity-100 transition-opacity" />
                </span>
                {seat.fullday && <span className="text-[10px] font-bold text-white bg-sky-500 px-2 py-0.5 rounded-full dark:bg-sky-600">FULL DAY</span>}
              </div>

              <div className="p-3 flex flex-col gap-2 flex-grow bg-skin-surface">
                {seat.fullday ? (
                  <UserSlot slot={seat.fullday} onEdit={onEditBooking} onDelete={onDeleteBooking} onShowDetails={onShowDetails} />
                ) : (
                  <>
                    <div className="h-20">
                        {seat.first ? (
                            <UserSlot slot={seat.first} onEdit={onEditBooking} onDelete={onDeleteBooking} onShowDetails={onShowDetails} />
                        ) : (
                            <AddSlot seatNo={seat.number} shift="first" onAdd={onAddUser} />
                        )}
                    </div>
                    <div className="h-20">
                        {seat.second ? (
                            <UserSlot slot={seat.second} onEdit={onEditBooking} onDelete={onDeleteBooking} onShowDetails={onShowDetails} />
                        ) : (
                            <AddSlot seatNo={seat.number} shift="second" onAdd={onAddUser} />
                        )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeatChart;