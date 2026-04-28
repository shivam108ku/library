import { useState, useEffect, useCallback } from 'react';
import { libraryService } from '../services/libraryService';
import { useSelector, useDispatch } from 'react-redux'
import { setUsers, updateUsers, deleteUsers, setBookings, updateBookings, deleteBookings } from '../slices/authSlice';

export const useLibraryData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { users, bookings } = useSelector(state => state.authSlice);
  const dispatch = useDispatch();

  // const fetchData = useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const [fetchedUsers, fetchedBookings] = await Promise.all([
  //       libraryService.getUsers(),
  //       libraryService.getBookings()
  //     ]);
  //     setUsers(fetchedUsers);
  //     setBookings(fetchedBookings);
  //     setError(null);
  //   } catch (err) {
  //     setError('Failed to fetch library data.');
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  // --- User Management ---
  const addUser = useCallback(async (user) => {
    try {
      const newUser = await libraryService.addUser(user);
      dispatch(setUsers({newUser}));
    } catch (err) {
      setError('Failed to add user.');
      console.error(err);
    }
  }, []);

  const updateUser = useCallback(async (user) => {
    try {
      const updatedUser = await libraryService.updateUser(user);
      dispatch(updateUsers(updatedUser));
    } catch (err) {
      setError('Failed to update user.');
      console.error(err);
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      await libraryService.deleteUser(userId);
      dispatch(deleteUsers(userId));
    } catch (err) {
      setError('Failed to delete user.');
      console.error(err);
    }
  }, []);

  // --- Booking Management ---
  const addBooking = useCallback(async (booking) => {
    try {
      const newBooking = await libraryService.addBooking(booking);
      dispatch(setBookings(newBooking));
    } catch (err) {
      setError('Failed to add booking.');
      console.error(err);
    }
  }, []);

  const addUserDataAndBooking = useCallback(async (userData, bookingData) => {
    try {
      const newUser = await libraryService.addUser(userData);
      setUsers(prev => [...prev, newUser]);
      const newBooking = await libraryService.addBooking({ ...bookingData, userId: newUser.id });
      setBookings(prev => [...prev, newBooking]);
    } catch (err) {
      setError('Failed to add user and booking.');
      console.error(err);
    }
  }, []);

  const updateBooking = useCallback(async (booking) => {
    try {
      const updatedBooking = await libraryService.updateBooking(booking);
      dispatch(updateBookings(updatedBooking));
    } catch (err) {
      setError('Failed to update booking.');
      console.error(err);
    }
  }, []);

  const deleteBooking = useCallback(async (bookingId) => {
    try {
      await libraryService.deleteBooking(bookingId);
      dispatch(deleteBookings(bookingId));
    } catch (err) {
      setError('Failed to delete booking.');
      console.error(err);
    }
  }, []);

  return {
    users,
    bookings,
    isLoading,
    error,
    addUser,
    updateUser,
    deleteUser,
    addBooking,
    updateBooking,
    deleteBooking,
    addUserDataAndBooking
  };
};
