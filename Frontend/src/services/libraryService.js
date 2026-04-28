// let users = [
//   { id: '1', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '9876543210', createdDate: '2024-05-15T00:00:00.000Z' },
//   { id: '2', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '9123456780', createdDate: '2024-05-20T00:00:00.000Z' },
//   { id: '3', name: 'Rohan Gupta', email: 'rohan.gupta@example.com', phone: '9988776655', createdDate: '2024-07-01T00:00:00.000Z' },
//   { id: '4', name: 'Sneha Verma', email: 'sneha.verma@example.com', phone: '9444555666', createdDate: '2024-06-10T00:00:00.000Z' },
//   { id: '5', name: 'Vikram Singh', email: 'vikram.singh@example.com', phone: '9333222111', createdDate: '2024-06-01T00:00:00.000Z' },
//   { id: '6', name: 'Anjali Mehta', email: 'anjali.mehta@example.com', phone: '9666777888', createdDate: '2024-07-05T00:00:00.000Z' },
//   { id: '7', name: 'Diya Mishra', email: 'diya.mishra@example.com', phone: '9555444333', createdDate: '2024-07-10T00:00:00.000Z' },
// ];

// // Define Shift and PaymentStatus as simple enums
// const Shift = {
//   Morning: 'Morning',
//   Evening: 'Evening',
//   FullDay: 'FullDay',
// };

// const PaymentStatus = {
//   Paid: 'Paid',
//   Unpaid: 'Unpaid',
// };

// let bookings = [
//   { id: 'b0', userId: '1', seatNumber: 10, shift: Shift.Morning, startDate: '2024-05-15T00:00:00.000Z', endDate: '2024-06-14T00:00:00.000Z', paymentStatus: PaymentStatus.Paid },
//   { id: 'b1', userId: '1', seatNumber: 12, shift: Shift.Morning, startDate: '2024-06-15T00:00:00.000Z', endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), paymentStatus: PaymentStatus.Paid },
//   { id: 'b2', userId: '2', seatNumber: 5, shift: Shift.Evening, startDate: '2024-06-20T00:00:00.000Z', endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), paymentStatus: PaymentStatus.Unpaid },
//   { id: 'b3', userId: '3', seatNumber: 28, shift: Shift.FullDay, startDate: '2024-07-01T00:00:00.000Z', endDate: '2024-07-31T00:00:00.000Z', paymentStatus: PaymentStatus.Paid },
//   { id: 'b4', userId: '4', seatNumber: 3, shift: Shift.Morning, startDate: '2024-06-10T00:00:00.000Z', endDate: '2024-07-10T00:00:00.000Z', paymentStatus: PaymentStatus.Paid },
//   { id: 'b5', userId: '5', seatNumber: 45, shift: Shift.Evening, startDate: '2024-06-01T00:00:00.000Z', endDate: '2024-08-01T00:00:00.000Z', paymentStatus: PaymentStatus.Unpaid },
//   { id: 'b6', userId: '6', seatNumber: 22, shift: Shift.FullDay, startDate: '2024-07-05T00:00:00.000Z', endDate: '2024-08-05T00:00:00.000Z', paymentStatus: PaymentStatus.Paid },
//   { id: 'b7', userId: '7', seatNumber: 12, shift: Shift.Evening, startDate: '2024-07-10T00:00:00.000Z', endDate: '2024-08-10T00:00:00.000Z', paymentStatus: PaymentStatus.Paid },
// ];

// const simulateDelay = (ms) => new Promise((res) => setTimeout(res, ms));

// export const libraryService = {
//   // --- User Methods ---
//   getUsers: async () => {
//     await simulateDelay(200);
//     return [...users];
//   },

//   addUser: async (user) => {
//     await simulateDelay(300);
//     const newUser = { ...user, id: String(Date.now()), createdDate: new Date().toISOString() };
//     users.push(newUser);
//     return newUser;
//   },

//   updateUser: async (updatedUser) => {
//     await simulateDelay(300);
//     users = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
//     return updatedUser;
//   },

//   deleteUser: async (userId) => {
//     await simulateDelay(300);
//     users = users.filter((user) => user.id !== userId);
//     // Cascade delete bookings
//     bookings = bookings.filter((booking) => booking.userId !== userId);
//     return { id: userId };
//   },

//   // --- Booking Methods ---
//   getBookings: async () => {
//     await simulateDelay(300);
//     return [...bookings];
//   },

//   addBooking: async (booking) => {
//     await simulateDelay(300);
//     const newBooking = { ...booking, id: `b${Date.now()}` };
//     bookings.push(newBooking);
//     return newBooking;
//   },

//   updateBooking: async (updatedBooking) => {
//     await simulateDelay(300);
//     bookings = bookings.map((b) => (b.id === updatedBooking.id ? updatedBooking : b));
//     return updatedBooking;
//   },

//   deleteBooking: async (bookingId) => {
//     await simulateDelay(300);
//     bookings = bookings.filter((b) => b.id !== bookingId);
//     return { id: bookingId };
//   },
// };


import axiosClient from "../config/axios" // Adjust the path to your axiosClient file
import { mapBookingToFrontend, mapUserToFrontend, mapShiftToBackend, PaymentStatus} from "../utils/helperFunctions";


export const libraryService = {
    // --- User Methods ---

    /**
     * Fetches all users from the backend API.
     */
    getUsers: async () => {
        try {
            const response = await axiosClient.get('/users/list');
            // Map the backend user data to the frontend's expected format
            return response.data.users.map(mapUserToFrontend);
        } catch (error) {
            console.error("Failed to fetch users:", error.response?.data || error.message);
            return []; // Return an empty array on failure
        }
    },

    /**
     * Adds a new user.
     * @param {object} userData - User data from the frontend form.
     */
    addUser: async (userData) => {
        try {
            // Map frontend data to backend schema
            const payload = {
                username: userData.name,
                contactNo: userData.phone,
                libId: userData.libId,
                gender: userData.gender,
                age: userData.age,
                address: userData.address,
            };
            const response = await axiosClient.post('/users/add', payload);
            return mapUserToFrontend(response.data.user); // Assuming backend returns the new user
        } catch (error) {
            console.error("Failed to add user:", error.response?.data || error.message);
            throw error.response?.data || new Error("Failed to add user");
        }
    },

    /**
     * Updates an existing user.
     * @param {object} updatedUser - The full user object with updated fields.
     */
    updateUser: async (updatedUser) => {
        try {
            const payload = {
                username: updatedUser.name,
                contactNo: updatedUser.phone,
                libId: updatedUser.libId,
                gender: updatedUser.gender,
                age: updatedUser.age,
                address: updatedUser.address,
            };
            const response = await axiosClient.put(`/users/update/${updatedUser.id}`, payload);
            return mapUserToFrontend(response.data.user); // Assuming backend returns the updated user
        } catch (error) {
            console.error("Failed to update user:", error.response?.data || error.message);
            throw error.response?.data || new Error("Failed to update user");
        }
    },

    /**
     * Deletes a user by their ID.
     * @param {string} userId - The ID of the user to delete.
     */
    deleteUser: async (userId) => {
        try {
            await axiosClient.delete(`/users/delete/${userId}`);
            return { id: userId }; // Return the ID for UI updates
        } catch (error) {
            console.error("Failed to delete user:", error.response?.data || error.message);
            throw error.response?.data || new Error("Failed to delete user");
        }
    },

    // --- Booking Methods ---

    /**
     * Fetches all current and future bookings from the backend API.
     */
    getBookings: async () => {
        try {
            const response = await axiosClient.get('/seats/list');
            return response.data.seats.map(mapBookingToFrontend);
        } catch (error) {
            console.error("Failed to fetch bookings:", error.response?.data || error.message);
            return [];
        }
    },
    
    /**
     * Adds a new booking.
     * @param {object} bookingData - Booking data from the frontend form.
     */
    addBooking: async (bookingData) => {
        try {
            const payload = {
                userId: bookingData.userId,
                seatNo: bookingData.seatNumber,
                shift: mapShiftToBackend(bookingData.shift),
                startDate: bookingData.startDate,
                endDate: bookingData.endDate,
                payment: {
                    paid: bookingData.paymentStatus === PaymentStatus.Paid,
                    amount: bookingData.amount || 0 // Assuming amount might be passed
                }
            };
            const response = await axiosClient.post('/bookings/add', payload);
            // The add response might not populate the user, so we handle it gracefully
            return mapBookingToFrontend(response.data.booking);
        } catch (error) {
            console.error("Failed to add booking:", error.response?.data || error.message);
            throw error.response?.data || new Error("Failed to add booking");
        }
    },

    /**
     * Updates an existing booking.
     * @param {object} updatedBooking - The full booking object with updated fields.
     */
    updateBooking: async (updatedBooking) => {
        try {
            const payload = {
                user: updatedBooking.userId,
                seatNo: updatedBooking.seatNumber,
                shift: mapShiftToBackend(updatedBooking.shift),
                startDate: updatedBooking.startDate,
                endDate: updatedBooking.endDate,
                payment: {
                    paid: updatedBooking.paymentStatus === PaymentStatus.Paid,
                    amount: updatedBooking.amount || 0
                }
            };
            const response = await axiosClient.put(`/bookings/update/${updatedBooking.id}`, payload);
            return mapBookingToFrontend(response.data.booking);
        } catch (error) {
            console.error("Failed to update booking:", error.response?.data || error.message);
            throw error.response?.data || new Error("Failed to update booking");
        }
    },

    /**
     * Deletes a booking by its ID.
     * @param {string} bookingId - The ID of the booking to delete.
     */
    deleteBooking: async (bookingId) => {
        try {
            await axiosClient.delete(`/bookings/delete/${bookingId}`);
            return { id: bookingId };
        } catch (error) {
            console.error("Failed to delete booking:", error.response?.data || error.message);
            throw error.response?.data || new Error("Failed to delete booking");
        }
    },
};