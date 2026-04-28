// Enums as plain JS objects
export const Shift = {
  Morning: 'Morning',
  Evening: 'Evening',
  FullDay: 'Full Day',
};

export const PaymentStatus = {
  Paid: 'Paid',
  Unpaid: 'Unpaid',
};

// RenewalStatus and BookingStatus can be strings
// We can define them as constants for clarity, though they are not strictly necessary
export const RenewalStatus = {
  Active: 'active',
  Expiring: 'expiring',
  Expired: 'expired',
};

export const BookingStatus = {
  Active: 'active',
  Completed: 'completed',
};

// Example structure objects (no TypeScript interfaces in JS)

// User example structure
// const user = {
//   id: 'string',
//   name: 'string',
//   email: 'string',
//   phone: 'string',
//   createdDate: 'ISO string',
// };

// Booking example structure
// const booking = {
//   id: 'string',
//   userId: 'string',
//   seatNumber: 1,
//   shift: Shift.Morning,
//   startDate: 'ISO string',
//   endDate: 'ISO string',
//   paymentStatus: PaymentStatus.Unpaid,
// };

// OccupiedSlot example structure
// const occupiedSlot = {
//   user: user,
//   booking: booking
// };

// AvailableSlot example structure
// const availableSlot = {
//   isAvailable: true,
//   seatNumber: 1,
//   shift: Shift.Morning
// };

// SeatMatrixRowData is a union type in TS
// In JS, you just use either an OccupiedSlot or an AvailableSlot object


