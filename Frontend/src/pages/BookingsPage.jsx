import React, { useState, useCallback, useEffect } from 'react';
import axiosClient from '../config/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import ConfirmationModal from '../components/common/ConfirmationModal';
import PaginationControls from '../components/common/PaginationControls';
import BookingsListTable from '../components/BookingsPage/BookingsListTable';
import BookingFormModal from '../components/BookingsPage/BookingFormModal';
import BookingFilterControls from '../components/BookingsPage/BookingFilterControls';
import PaymentModal from '../components/BookingsPage/PaymentModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Plus, AlertCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 30;

const BookingsPage = () => {
    // --- State ---
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);
    const [error, setError] = useState(null);

    // Modals
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);

    // Selection
    const [currentBooking, setCurrentBooking] = useState(undefined);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [bookingToPay, setBookingToPay] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterShift, setFilterShift] = useState('All');
    const [filterPayment, setFilterPayment] = useState('All');
    const [filterBookingStatus, setFilterBookingStatus] = useState('All');

    // Month and Sort Filters
    const [filterMonth, setFilterMonth] = useState('All');
    const [sortOrder, setSortOrder] = useState('desc');
    const [sortBy, setSortBy] = useState('date'); // New State: 'date' or 'seatNo'

    // --- API Fetch ---
    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {
                page: pagination.currentPage,
                limit: ITEMS_PER_PAGE,
                search: searchTerm,
                shift: filterShift,
                paymentStatus: filterPayment,
                status: filterBookingStatus,
                month: filterMonth,
                sort: sortOrder,
                sortBy: sortBy // Pass Sort By
            };

            const response = await axiosClient.get('/bookings/list', { params });
            if (response.data.status === 'ok') {
                setBookings(response.data.bookings);
                setPagination(prev => ({
                    ...prev,
                    ...response.data.pagination
                }));
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to load bookings");
        } finally {
            setIsLoading(false);
        }
    }, [pagination.currentPage, searchTerm, filterShift, filterPayment, filterBookingStatus, filterMonth, sortOrder, sortBy]);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await axiosClient.get('/users/list');
            if (response.data.status === 'ok') {
                setUsers(response.data.users);
            }
        } catch (err) {
            console.error("Failed to load users for dropdown", err);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Reset page to 1 on filter changes
    useEffect(() => {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, [searchTerm, filterShift, filterPayment, filterBookingStatus, filterMonth, sortOrder, sortBy]);

    // --- Handlers ---
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleClearFilters = useCallback(() => {
        setSearchTerm('');
        setFilterShift('All');
        setFilterPayment('All');
        setFilterBookingStatus('All');
        setFilterMonth('All');
        setSortOrder('desc');
        setSortBy('date');
    }, []);

    const fetchAllDataForDownload = async () => {
        const params = {
            search: searchTerm,
            shift: filterShift,
            paymentStatus: filterPayment,
            status: filterBookingStatus,
            month: filterMonth,
            sort: sortOrder,
            sortBy: sortBy, // Pass Sort By
            download: 'true'
        };
        const response = await axiosClient.get('/bookings/list', { params });
        return response.data.bookings;
    };

    // --- EXCEL DOWNLOAD ---
    const handleDownloadExcel = async () => {
        setIsDownloadingExcel(true);
        try {
            const data = await fetchAllDataForDownload();
            if (!data || data.length === 0) {
                alert("No data found to download.");
                setIsDownloadingExcel(false);
                return;
            }

            const excelData = data.map((booking, index) => ({
                "S.No": index + 1,
                "User Name": booking.user ? booking.user.username : 'Deleted User',
                "Contact No": booking.user ? booking.user.contactNo : '-',
                "Seat No": booking.seatNo,
                "Shift": booking.shift,
                "Is Trial": booking.isTrial ? "Yes" : "No",
                "Start Date": new Date(booking.startDate).toLocaleDateString(),
                "End Date": new Date(booking.endDate).toLocaleDateString(),
                "Amount": booking.payment?.amount || 0,
                "Payment Method": booking.payment?.method || '-',
                "Payment Date": booking.payment?.lastUpdated ? new Date(booking.payment.lastUpdated).toLocaleString() : '-',
                "Payment Status": booking.payment?.status || 'unpaid',
                "Notes": booking.notes || ''
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const wscols = [
                { wch: 6 }, { wch: 20 }, { wch: 15 }, { wch: 8 }, { wch: 10 },
                { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 15 },
                { wch: 20 }, { wch: 10 }, { wch: 30 }
            ];
            worksheet['!cols'] = wscols;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

            const monthName = filterMonth === 'All' ? 'All_Months' : new Date(0, filterMonth - 1).toLocaleString('default', { month: 'short' });
            const fileName = `Bookings_${monthName}_${new Date().toISOString().slice(0, 10)}.xlsx`;

            XLSX.writeFile(workbook, fileName);

        } catch (err) {
            console.error("Excel Download failed", err);
            alert("Failed to generate Excel file.");
        } finally {
            setIsDownloadingExcel(false);
        }
    };

    // --- IMPROVED PDF DOWNLOAD HANDLER ---
    const handleDownloadPDF = async () => {
        setIsDownloadingPdf(true);
        try {
            const data = await fetchAllDataForDownload();

            if (!data || data.length === 0) {
                alert("No data found to download.");
                setIsDownloadingPdf(false);
                return;
            }

            // --- 0. REFINED COLOR PALETTE ---
            const PRIMARY_COLOR = [4, 146, 194]; // Brand Blue
            
            // Full Day (Zap/Sky): Very light Sky Blue
            const COLOR_FULLDAY = [224, 242, 254]; 
            
            // 1st Shift (Sun/Yellow): "Cornsilk" / Warm Pastel Yellow (Less neon)
            const COLOR_FIRST = [255, 248, 220]; 
            
            // 2nd Shift (Moon/Indigo): Very light Indigo/Lavender
            const COLOR_SECOND = [238, 242, 255]; 
            
            // Trial: Warm Light Orange
            const COLOR_TRIAL = [255, 237, 213];

            // --- 1. STATISTICS CALCULATION ---
            let totalRevenue = 0;
            let fullDayCount = 0;
            let firstShiftCount = 0;
            let secondShiftCount = 0;
            let trialCount = 0;

            data.forEach(booking => {
                if (booking.payment?.status === 'paid') {
                    totalRevenue += (booking.payment.amount || 0);
                }
                if (booking.isTrial) trialCount++;
                const shift = booking.shift ? booking.shift.toLowerCase() : '';
                if (shift === 'fullday') fullDayCount++;
                else if (shift === 'first') firstShiftCount++;
                else if (shift === 'second') secondShiftCount++;
            });

            // --- 2. PDF SETUP ---
            const doc = new jsPDF('landscape');
            const pageWidth = doc.internal.pageSize.width;
            const monthName = filterMonth === 'All' ? 'All Months' : new Date(0, filterMonth - 1).toLocaleString('default', { month: 'long' });

            // --- 3. HEADER BANNER ---
            doc.setFillColor(...PRIMARY_COLOR);
            doc.rect(0, 0, pageWidth, 26, 'F'); // Top bar

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text(`Pariksha Library Report`, 14, 17);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Period: ${monthName} | Generated: ${new Date().toLocaleDateString()}`, 14, 22);

            // --- 4. STATISTICS CARDS ---
            const drawStatBox = (x, label, value, color = [255, 255, 255]) => {
                // Shadow/Border color
                doc.setDrawColor(200, 200, 200); 
                doc.setFillColor(...color);
                
                // Draw rounded box with Fill and Draw (FD)
                doc.roundedRect(x, 32, 45, 18, 2, 2, 'FD');
                
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                // Center text manually roughly
                doc.text(label, x + 3, 38);
                
                doc.setFontSize(11);
                doc.setTextColor(30, 30, 30);
                doc.setFont("helvetica", "bold");
                doc.text(String(value), x + 3, 46);
            };

            // Spacing for stats
            const gap = 50; 
            let startX = 14;

            drawStatBox(startX, "Total Revenue", `Rs ${totalRevenue.toLocaleString()}`);
            startX += gap;
            drawStatBox(startX, "Full Day Bookings", fullDayCount, COLOR_FULLDAY); 
            startX += gap;
            drawStatBox(startX, "1st Shift Bookings", firstShiftCount, COLOR_FIRST); 
            startX += gap;
            drawStatBox(startX, "2nd Shift Bookings", secondShiftCount, COLOR_SECOND); 
            startX += gap;
            drawStatBox(startX, "Trial Sessions", trialCount, COLOR_TRIAL); 

            // --- 5. DATA PREPARATION ---
            const tableColumn = [
                "S.No", "User", "Contact", "Seat", "Shift", "Duration", "Amount", "Method", "Pay Date", "Status", "Notes"
            ];

            const tableRows = data.map((booking, index) => {
                const startDateStr = new Date(booking.startDate).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
                const endDateStr = new Date(booking.endDate).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
                const duration = `${startDateStr} - ${endDateStr}`;

                const paymentDate = booking.payment?.lastUpdated
                    ? new Date(booking.payment.lastUpdated).toLocaleString([], { 
                        month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' 
                      }) 
                    : '-';

                const paymentMethod = booking.payment?.method
                    ? booking.payment.method.toUpperCase() : '-';
                
                // Smart Truncate: first 15 chars
                let noteText = booking.notes || '-';
                if (noteText.length > 15) noteText = noteText.substring(0, 15) + '...';

                return [
                    index + 1,
                    booking.user ? booking.user.username : 'Deleted',
                    booking.user ? booking.user.contactNo : '-',
                    booking.seatNo,
                    booking.shift,
                    duration,
                    booking.payment?.amount || 0,
                    paymentMethod,
                    paymentDate,
                    (booking.payment?.status || 'unpaid').toUpperCase(),
                    noteText
                ];
            });

            // --- 6. GENERATE TABLE ---
            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 58, // Start below stats cards
                theme: 'grid',
                showHead: 'everyPage',
                styles: { 
                    fontSize: 9,
                    cellPadding: 3, 
                    valign: 'middle',
                    lineColor: [220, 220, 220],
                    lineWidth: 0.1,
                    textColor: [50, 50, 50]
                },
                headStyles: { 
                    fillColor: PRIMARY_COLOR, 
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    halign: 'center'
                },
                alternateRowStyles: {
                    fillColor: [255, 255, 255] 
                },
                
                // --- CUSTOM ROW COLORING ---
                didParseCell: function (dataHook) {
                    if (dataHook.section === 'body') {
                        // Access original data using row index
                        const booking = data[dataHook.row.index];

                        if (booking) {
                            // Apply background colors based on logic
                            if (booking.isTrial) {
                                dataHook.cell.styles.fillColor = COLOR_TRIAL; 
                            } else if (booking.shift === 'fullday') {
                                dataHook.cell.styles.fillColor = COLOR_FULLDAY; 
                            } else if (booking.shift === 'first') {
                                dataHook.cell.styles.fillColor = COLOR_FIRST; 
                            } else if (booking.shift === 'second') {
                                dataHook.cell.styles.fillColor = COLOR_SECOND; 
                            }

                            // Payment Status Text Color
                            if (dataHook.column.index === 9) { // Status Column
                                const status = (booking.payment?.status || '').toLowerCase();
                                if (status === 'unpaid' || status === 'failed') {
                                    dataHook.cell.styles.textColor = [220, 38, 38]; // Red
                                    dataHook.cell.styles.fontStyle = 'bold';
                                } else if (status === 'paid') {
                                    dataHook.cell.styles.textColor = PRIMARY_COLOR; 
                                    dataHook.cell.styles.fontStyle = 'bold';
                                }
                            }
                        }
                    }
                },

                // --- OPTIMIZED COLUMN WIDTHS (Total ~275mm) ---
                columnStyles: {
                    0: { cellWidth: 12, halign: 'center' }, // S.No
                    1: { cellWidth: 35, halign: 'left', fontStyle: 'bold' },   // User
                    2: { cellWidth: 25, halign: 'left' },   // Contact
                    3: { cellWidth: 15, halign: 'center' }, // Seat
                    4: { cellWidth: 20, halign: 'left' },   // Shift
                    5: { cellWidth: 35, halign: 'center' }, // Duration
                    6: { cellWidth: 20, halign: 'right' },  // Amount
                    7: { cellWidth: 20, halign: 'center' }, // Method
                    8: { cellWidth: 35, halign: 'center' }, // Pay Date
                    9: { cellWidth: 22, halign: 'center' }, // Status
                    10: { cellWidth: 36, halign: 'left' }   // Notes
                },

                // --- FOOTER ON EVERY PAGE ---
                didDrawPage: function (data) {
                    const pageSize = doc.internal.pageSize;
                    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                    
                    doc.setFontSize(8);
                    doc.setTextColor(150, 150, 150);
                    
                    // Left Footer
                    doc.text(`Pariksha Library - Internal Report`, 14, pageHeight - 10);
                    
                    // Right Footer (Page Number)
                    const str = 'Page ' + doc.internal.getNumberOfPages();
                    doc.text(str, pageSize.width - 25, pageHeight - 10);
                }
            });

            // --- 7. LEGEND (Bottom of last page) ---
            const finalY = doc.lastAutoTable.finalY + 10;
            
            // Check if we need a new page for legend
            if (finalY > doc.internal.pageSize.height - 20) {
                doc.addPage();
                doc.text("Color Legend:", 14, 20);
            } else {
                doc.setFontSize(9);
                doc.setTextColor(0, 0, 0);
                doc.text("Legend:", 14, finalY);
            }
            
            const legendY = finalY > doc.internal.pageSize.height - 20 ? 25 : finalY;

            // Draw Legend Items
            const drawLegendItem = (x, label, color) => {
                doc.setDrawColor(200, 200, 200);
                doc.setFillColor(...color);
                doc.rect(x, legendY - 3, 4, 4, 'FD');
                doc.setFontSize(8);
                doc.setTextColor(80, 80, 80);
                doc.text(label, x + 6, legendY);
            };

            drawLegendItem(30, "Trial Session", COLOR_TRIAL);
            drawLegendItem(60, "Full Day (Sky)", COLOR_FULLDAY);
            drawLegendItem(90, "1st Shift (Sun)", COLOR_FIRST);
            drawLegendItem(120, "2nd Shift (Moon)", COLOR_SECOND);

            doc.save(`Pariksha_Report_${monthName}_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error("PDF Download failed", err);
            alert("Failed to generate PDF.");
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    const handleCreateNewBooking = useCallback(() => {
        setCurrentBooking(undefined);
        setIsBookingModalOpen(true);
    }, []);

    const handleEditBooking = useCallback((booking) => {
        setCurrentBooking(booking);
        setIsBookingModalOpen(true);
    }, []);

    const handleDeleteRequest = useCallback((booking) => {
        setBookingToDelete(booking);
        setIsDeleteModalOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (bookingToDelete) {
            try {
                await axiosClient.delete(`/bookings/${bookingToDelete._id}`);
                fetchBookings();
                setIsDeleteModalOpen(false);
                setBookingToDelete(null);
            } catch (err) {
                alert("Failed to delete booking");
            }
        }
    }, [bookingToDelete, fetchBookings]);

    const handleBookingFormSubmit = useCallback(async (bookingData) => {
        try {
            if (bookingData._id) {
                await axiosClient.put(`/bookings/${bookingData._id}`, bookingData);
            } else {
                await axiosClient.post('/bookings', bookingData);
            }
            fetchBookings();
            setIsBookingModalOpen(false);
        } catch (err) {
            console.error("Save failed", err);
            alert(err.response?.data?.error || "Failed to save booking");
        }
    }, [fetchBookings]);

    const handleOpenPayModal = useCallback((booking) => {
        setBookingToPay(booking);
        setIsPayModalOpen(true);
    }, []);

    const handleConfirmPayment = useCallback(async (paymentData) => {
        if (!bookingToPay) return;

        const { amount, method, notes } = paymentData;

        try {
            const payload = {
                amount: Number(amount),
                method: method
            };

            if (notes && notes.trim().length > 0) {
                payload.notes = notes.trim();
            }

            await axiosClient.patch(`/bookings/${bookingToPay._id}/pay`, payload);

            setBookings(prevBookings => prevBookings.map(booking => {
                if (booking._id === bookingToPay._id) {
                    return {
                        ...booking,
                        notes: notes || booking.notes,
                        payment: {
                            ...booking.payment,
                            status: 'paid',
                            amount: Number(amount),
                            method: method,
                            lastUpdated: new Date().toISOString()
                        }
                    };
                }
                return booking;
            }));

            setIsPayModalOpen(false);
            setBookingToPay(null);

        } catch (err) {
            console.error("Payment update failed", err);
            alert(err.response?.data?.error || "Failed to update payment status");
        }
    }, [bookingToPay]);

    return (
        <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-skin-base min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-skin-text">Banking Page</h1>
                        <p className="text-skin-muted mt-1">Track payments, active sessions, and history.</p>
                    </div>
                    <button
                        onClick={handleCreateNewBooking}
                        className="mt-4 sm:mt-0 inline-flex items-center px-5 py-2.5 bg-brand-teal text-white rounded-lg text-sm font-medium hover:bg-brand-teal-hover shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-4 h-4 mr-2" /> New Booking
                    </button>
                </div>

                {error && (
                    <div className="p-4 mb-6 flex items-center gap-3 text-red-700 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30 rounded-xl">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                <BookingFilterControls
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                    filterShift={filterShift}
                    onFilterShiftChange={setFilterShift}
                    filterPayment={filterPayment}
                    onFilterPaymentChange={setFilterPayment}
                    filterBookingStatus={filterBookingStatus}
                    onFilterBookingStatusChange={setFilterBookingStatus}
                    filterMonth={filterMonth}
                    onFilterMonthChange={setFilterMonth}
                    sortOrder={sortOrder}
                    onSortOrderChange={setSortOrder}
                    sortBy={sortBy}
                    onSortByChange={setSortBy}
                    onDownloadPDF={handleDownloadPDF}
                    isDownloadingPdf={isDownloadingPdf}
                    onDownloadExcel={handleDownloadExcel}
                    isDownloadingExcel={isDownloadingExcel}
                    onClearFilters={handleClearFilters}
                />

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden">
                        <BookingsListTable
                            bookings={bookings}
                            onEditBooking={handleEditBooking}
                            onDeleteBooking={handleDeleteRequest}
                            onMarkPaid={handleOpenPayModal}
                        />

                        {pagination.totalPages > 1 && (
                            <PaginationControls
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                                totalItems={pagination.totalItems}
                                itemsPerPage={ITEMS_PER_PAGE}
                            />
                        )}
                    </div>
                )}
            </div>

            <BookingFormModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                onSubmit={handleBookingFormSubmit}
                initialBooking={currentBooking}
                users={users}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Booking"
                message={`Are you sure you want to delete this booking?`}
            />

            <PaymentModal
                isOpen={isPayModalOpen}
                onClose={() => setIsPayModalOpen(false)}
                onConfirm={handleConfirmPayment}
                booking={bookingToPay}
            />
        </main>
    );
};

export default BookingsPage;