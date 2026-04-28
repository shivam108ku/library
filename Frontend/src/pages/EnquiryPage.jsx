import React, { useState, useCallback, useEffect } from 'react';
import axiosClient from '../config/axios';
import ConfirmationModal from '../components/common/ConfirmationModal';
import PaginationControls from '../components/common/PaginationControls';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EnquiryListTable from '../components/EnquiryPage/EnquiryListTable';
import EnquiryFilterControls from '../components/EnquiryPage/EnquiryFilterControls';
import AddUserModal from '../components/EnquiryPage/AddUserModal';
import { MailQuestion, AlertCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

// Helper: Get Local Date as YYYY-MM-DD string to avoid UTC shifting
const getLocalYYYYMMDD = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const EnquiryPage = () => {
  const getTodayString = () => getLocalYYYYMMDD(new Date());

  const [enquiries, setEnquiries] = useState([]);
  const [usersMap, setUsersMap] = useState(new Map());
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [enquiryForAddUser, setEnquiryForAddUser] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState(getTodayString());

  // Date Navigation Logic
  const handleDateChange = (daysToAdd) => {
    const currentDate = new Date(filterDate);
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    setFilterDate(getLocalYYYYMMDD(currentDate));
  };

  // Fetch Users on Mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosClient.get('/users/all');
        if (response.data.status === 'ok') {
          const map = new Map();
          response.data.users.forEach(u => map.set(u.contactNo, u));
          setUsersMap(map);
        }
      } catch (err) {
        console.error("Failed to fetch users list", err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch Enquiries
  const fetchEnquiries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        date: filterDate
      };

      const response = await axiosClient.get('/enquiry/list', { params });
      if (response.data.status === 'ok') {
        setEnquiries(response.data.enquiries);
        setPagination(prev => ({ ...prev, ...response.data.pagination }));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load enquiries");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.currentPage, searchTerm, filterDate]);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  useEffect(() => { 
    setPagination(prev => ({ ...prev, currentPage: 1 })); 
  }, [searchTerm, filterDate]);

  // Handlers
  const handleDeleteRequest = (enquiry) => {
    setEnquiryToDelete(enquiry);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (enquiryToDelete) {
      try {
        await axiosClient.delete(`/enquiry/${enquiryToDelete._id}`);
        fetchEnquiries();
        setIsDeleteModalOpen(false);
        setEnquiryToDelete(null);
      } catch (err) {
        alert("Failed to delete enquiry");
      }
    }
  };

  const handleOpenAddUser = (enquiry) => {
    setEnquiryForAddUser(enquiry);
    setIsAddUserModalOpen(true);
  };

  const handleUserAdded = (newUser) => {
    setUsersMap(prev => new Map(prev).set(newUser.contactNo, newUser));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterDate(getTodayString());
  };

  return (
    <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-skin-base min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
            <div className="bg-brand-teal/10 p-3 rounded-xl">
                <MailQuestion className="w-8 h-8 text-brand-teal" />
            </div>
            <div>
                <h1 className="text-3xl font-serif font-bold text-skin-text">Enquiries</h1>
                <p className="text-skin-muted mt-1">
                    {filterDate === getTodayString() 
                        ? "Showing enquiries for Today" 
                        : `Viewing enquiries for ${new Date(filterDate).toDateString()}`}
                </p>
            </div>
        </div>

        {error && (
            <div className="p-4 mb-6 flex items-center gap-3 text-red-700 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30 rounded-xl">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
            </div>
        )}

        <EnquiryFilterControls
          searchTerm={searchTerm} 
          onSearchTermChange={setSearchTerm}
          filterDate={filterDate} 
          onFilterDateChange={setFilterDate}
          onDateNav={handleDateChange}
          isToday={filterDate === getTodayString()}
          onClearFilters={handleClearFilters}
        />

        {isLoading ? <LoadingSpinner /> : (
          <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden">
            <EnquiryListTable 
              enquiries={enquiries} 
              usersMap={usersMap} 
              onDelete={handleDeleteRequest}
              onAddUser={handleOpenAddUser} 
            />
            
            {pagination.totalPages > 1 && (
              <PaginationControls
                currentPage={pagination.currentPage} totalPages={pagination.totalPages}
                onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
                totalItems={pagination.totalItems} itemsPerPage={ITEMS_PER_PAGE}
              />
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete} title="Delete Enquiry"
        message={`Delete enquiry from ${enquiryToDelete?.enquirerName}?`}
      />

      <AddUserModal 
        isOpen={isAddUserModalOpen} 
        onClose={() => setIsAddUserModalOpen(false)} 
        enquiry={enquiryForAddUser}
        onUserAdded={handleUserAdded}
      />
    </main>
  );
};

export default EnquiryPage;