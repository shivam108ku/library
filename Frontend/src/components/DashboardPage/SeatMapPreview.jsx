import React, { useMemo, useState } from 'react';

const SeatTooltip = ({ seat, position }) => {
  const isFullyAvailable = !seat.fullday && !seat.morning && !seat.evening;

  return (
    <div
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      // Tooltips usually stay dark for contrast, even in dark mode. 
      // Added border-gray-700 explicitly for dark mode definition.
      className="fixed z-50 w-48 p-3 bg-gray-900 text-white rounded-xl shadow-xl pointer-events-none -translate-x-1/2 -translate-y-full mt-[-10px] animate-in fade-in zoom-in duration-200 border border-gray-700"
    >
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-700">
        <h4 className="font-bold text-sm">Seat #{seat.number}</h4>
      </div>
      
      {isFullyAvailable ? (
          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">Available</span>
      ) : (
        <div className="space-y-2 text-xs">
          {seat.fullday ? (
            <div>
              <p className="text-[10px] uppercase text-sky-400 font-bold">Occupant</p>
              <p className="font-medium truncate">{seat.fullday.booking?.user?.username || 'Occupied'}</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-yellow-400 font-bold">M</span>
                <span className="text-gray-300 truncate w-24 text-right">{seat.morning ? seat.morning.booking?.user?.username : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-400 font-bold">E</span>
                <span className="text-gray-300 truncate w-24 text-right">{seat.evening ? seat.evening.booking?.user?.username : '-'}</span>
              </div>
            </>
          )}
        </div>
      )}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-3 h-3 bg-gray-900 rotate-45 border-r border-b border-gray-700"></div>
    </div>
  );
};

const SeatMapPreview = ({ occupiedSlots, totalSeats }) => {
  const [hoveredSeat, setHoveredSeat] = useState(null);

  const { seats, stats } = useMemo(() => {
    const seatMap = new Map();
    for (let i = 1; i <= totalSeats; i++) seatMap.set(i, { number: i });

    occupiedSlots.forEach((slot) => {
      const { booking } = slot;
      if (seatMap.has(booking.seatNo)) {
        const seat = seatMap.get(booking.seatNo);
        if (booking.shift === 'first') seat.morning = slot;
        else if (booking.shift === 'second') seat.evening = slot;
        else if (booking.shift === 'fullday') seat.fullday = slot;
      }
    });

    const seatList = Array.from(seatMap.values());
    
    // Calculate Stats
    const counts = { morning: 0, evening: 0, fullday: 0, empty: 0 };
    seatList.forEach(s => {
        if (s.fullday) counts.fullday++;
        else {
            if (s.morning) counts.morning++;
            if (s.evening) counts.evening++;
            if (!s.morning && !s.evening) counts.empty++;
        }
    });

    return { seats: seatList, stats: counts };
  }, [occupiedSlots, totalSeats]);

  const handleMouseOver = (e, seat) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredSeat({ seat, position: { top: rect.top, left: rect.left + rect.width / 2 } });
  };

  const getSeatStyling = (seat) => {
    // Status colors remain hardcoded as they indicate state
    if (seat.fullday) return 'bg-sky-500 text-white shadow-sky-200 dark:shadow-none';
    if (seat.morning && seat.evening) return 'bg-purple-600 text-white shadow-purple-200 dark:shadow-none';
    if (seat.morning) return 'bg-yellow-400 text-gray-900 shadow-yellow-200 dark:shadow-none';
    if (seat.evening) return 'bg-indigo-500 text-white shadow-indigo-200 dark:shadow-none';
    
    // Empty seats: mapped to semantic variables
    // bg-gray-100 -> bg-skin-base
    // border-gray-200 -> border-skin-border
    // text-gray-400 -> text-skin-muted
    // hover:bg-white -> hover:bg-skin-surface
    return 'bg-skin-base border border-skin-border text-skin-muted hover:border-brand-teal hover:text-brand-teal hover:bg-skin-surface';
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-4 text-[10px] uppercase font-bold tracking-wider text-skin-muted justify-center sm:justify-start">
        <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span> 
            Morning ({stats.morning})
        </div>
        <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span> 
            Evening ({stats.evening})
        </div>
        <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span> 
            Full Day ({stats.fullday})
        </div>
        <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-skin-border"></span> 
            Empty ({stats.empty})
        </div>
      </div>

      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {seats.map((seat) => (
          <div
            key={seat.number}
            onMouseOver={(e) => handleMouseOver(e, seat)}
            onMouseLeave={() => setHoveredSeat(null)}
            className={`
                aspect-square rounded flex items-center justify-center text-[10px] font-bold shadow-sm transition-all duration-150 cursor-default
                ${getSeatStyling(seat)}
            `}
          >
            {seat.number}
          </div>
        ))}
      </div>
      
      {hoveredSeat && <SeatTooltip seat={hoveredSeat.seat} position={hoveredSeat.position} />}
    </>
  );
};

export default SeatMapPreview;