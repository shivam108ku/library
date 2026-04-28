export const getRenewalStatus = (endDate) => {
  const renewal = new Date(endDate);
  const today = new Date();

  // Normalize dates to midnight to compare days correctly
  today.setHours(0, 0, 0, 0);
  renewal.setHours(0, 0, 0, 0);

  const diffTime = renewal.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays <= 7) return 'expiring';
  return 'active';
};

export const getBookingStatus = (endDate) => {
  const renewalDate = new Date(endDate);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Set today to the end of the day

  return renewalDate >= today ? 'active' : 'completed';
};

// --- Enums and Mappers ---

// Enums used by the frontend components
export const Shift = {
    Morning: 'Morning',
    Evening: 'Evening',
    FullDay: 'FullDay',
};

export const PaymentStatus = {
    Paid: 'Paid',
    Unpaid: 'Unpaid',
};

/**
 * Maps the backend shift string ('first', 'second') to the frontend enum.
 * @param {string} backendShift - The shift value from the API.
 * @returns {string} The corresponding frontend shift value.
 */
export const mapShiftToFrontend = (backendShift) => {
    switch (backendShift?.toLowerCase()) {
        case 'first': return Shift.Morning;
        case 'second': return Shift.Evening;
        case 'fullday': return Shift.FullDay;
        default: return backendShift; // Fallback
    }
};

/**
 * Maps the frontend shift enum back to the backend string format.
 * @param {string} frontendShift - The shift value from the frontend.
 * @returns {string} The corresponding backend shift value.
 */
export const mapShiftToBackend = (frontendShift) => {
    switch (frontendShift) {
        case Shift.Morning: return 'first';
        case Shift.Evening: return 'second';
        case Shift.FullDay: return 'fullday';
        default: return frontendShift;
    }
}

/**
 * Maps a user object from the backend API format to the frontend format.
 */
export const mapUserToFrontend = (user) => ({
    id: user._id,
    name: user.username,
    email: `${user.username.replace(/\s+/g, '.').toLowerCase()}@example.com`, // Placeholder email
    phone: user.contactNo,
    createdDate: user.createdAt,
    // Add other fields from the schema if needed
    libId: user.libId,
    gender: user.gender,
    age: user.age,
    address: user.address,
});

/**
 * Maps a booking object from the backend API format to the frontend format.
 */
export const mapBookingToFrontend = (booking) => ({
    id: booking._id,
    userId: booking.user?._id || booking.user, // Handle populated and unpopulated user field
    seatNumber: booking.seatNo,
    shift: mapShiftToFrontend(booking.shift),
    startDate: booking.startDate,
    endDate: booking.endDate,
    paymentStatus: booking.payment?.paid ? PaymentStatus.Paid : PaymentStatus.Unpaid,
    user: booking.user ? mapUserToFrontend(booking.user) : null, // Map the nested user object
});