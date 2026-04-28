import React, { useState, useCallback, useMemo, useEffect } from 'react';
import axiosClient from '../config/axios';
import UserFormModal from '../components/common/UserFormModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import UsersListTable from '../components/UsersPage/UsersListTable';
import PaginationControls from '../components/common/PaginationControls';
import LoadingSpinner from '../components/common/LoadingSpinner';
import UserFilterControls from '../components/UsersPage/UserFilterControls';
import { Plus, AlertCircle } from 'lucide-react'; // Added AlertCircle for better error display

const ITEMS_PER_PAGE = 10;

const UsersPage = () => {
  // --- State Management ---
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Selection
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userToDelete, setUserToDelete] = useState(null);

  // Pagination & Filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); 

  // --- API Integration ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [usersResponse, seatsResponse] = await Promise.all([
        axiosClient.get('/users/list'),
        axiosClient.get('/seats/list').catch(() => ({ data: { seats: [] } }))
      ]);

      if (usersResponse.data.status === 'ok') {
        setUsers(usersResponse.data.users);
      }
      
      if (seatsResponse.data?.status === 'ok') {
        setBookings(seatsResponse.data.seats);
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Error fetching data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // --- CRUD Operations ---
  const handleUserFormSubmit = useCallback(async (formData) => {
    // 1. Destructure data
    const { profileImage, _id, ...userData } = formData;

    // --- VALIDATION START ---
    const contactRegex = /^\d{10}$/;
    if (!userData.contactNo) {
      alert("Validation Error: Contact number is required.");
      return; 
    }
    if (!contactRegex.test(userData.contactNo)) {
      alert("Validation Error: Contact number must be exactly 10 digits.");
      return; 
    }
    // --- VALIDATION END ---

    try {
      if (_id) {
        // EDIT MODE
        await axiosClient.put(`/users/${_id}/profile/edit`, userData);
        if (profileImage instanceof File) {
          const imagePayload = new FormData();
          imagePayload.append('profileImage', profileImage);
          await axiosClient.put(`/users/profile-image/${_id}`, imagePayload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      } else {
        // CREATE MODE
        await axiosClient.post('/users/add', userData);
      }
      
      fetchData();
      setIsUserModalOpen(false);
      setCurrentUser(undefined);

    } catch (err) {
      console.error("Error saving user:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Failed to save user.";
      alert(errorMsg);
    }
  }, [fetchData]);

  const handleConfirmDelete = useCallback(async () => {
    if (userToDelete) {
      try {
        await axiosClient.delete(`/users/${userToDelete._id}`);
        setUsers(prev => prev.filter(u => u._id !== userToDelete._id));
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } catch (err) {
        console.error("Error deleting user:", err);
        const errorMsg = err.response?.data?.message || "Failed to delete user.";
        alert(errorMsg);
      }
    }
  }, [userToDelete]);

  // --- Logic for Filtering & Pagination ---
  const filteredAndSortedUsers = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    const today = new Date();

    const activeUserIds = new Set(
      bookings
        .filter(b => new Date(b.endDate) >= today)
        .map(b => (typeof b.user === 'object' ? b.user._id : b.user))
    );

    const filtered = users.filter((user) => {
        const matchesSearch = lowerSearchTerm === '' || 
            user.username.toLowerCase().includes(lowerSearchTerm) ||
            user.contactNo.includes(lowerSearchTerm);

        if (!matchesSearch) return false;

        if (filterStatus === 'Active') return activeUserIds.has(user._id);
        if (filterStatus === 'Inactive') return !activeUserIds.has(user._id);
        
        return true;
    });

    return [...filtered].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [users, bookings, searchTerm, filterStatus]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedUsers, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE);

  // --- Event Handlers ---
  const handleAddNewUser = useCallback(() => {
    setCurrentUser(undefined);
    setIsUserModalOpen(true);
  }, []);

  const handleEditUser = useCallback((user) => {
    setCurrentUser(user);
    setIsUserModalOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  }, []);

  const handleClearFilters = () => {
      setSearchTerm('');
      setFilterStatus('All');
  };

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-skin-base min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-skin-text">User Management</h1>
            <p className="text-skin-muted mt-1">Manage library members and their profiles.</p>
          </div>
          <button
            onClick={handleAddNewUser}
            className="mt-4 sm:mt-0 inline-flex items-center px-5 py-2.5 bg-brand-teal text-white rounded-lg text-sm font-medium hover:bg-brand-teal-hover shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Member
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 flex items-center gap-3 text-red-700 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30 rounded-xl">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <UserFilterControls
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          onClear={handleClearFilters}
        />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden">
            <UsersListTable
              users={paginatedUsers}
              bookings={bookings} 
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteRequest}
            />
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredAndSortedUsers.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            )}
          </div>
        )}
      </div>

      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleUserFormSubmit}
        initialUser={currentUser}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.username}? This action cannot be undone.`}
      />
    </main>
  );
};

export default UsersPage;