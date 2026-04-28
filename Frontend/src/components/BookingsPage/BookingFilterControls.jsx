import React from 'react';
import { Search, Filter, X, Calendar, ArrowDownUp, Download, FileSpreadsheet, Loader2, Armchair, Clock } from 'lucide-react';

const FilterButton = ({ onClick, isActive, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all border ${
      isActive
        ? 'bg-brand-teal text-white border-brand-teal shadow-md shadow-brand-teal/20'
        : 'bg-skin-surface text-skin-muted border-skin-border hover:bg-skin-base hover:border-brand-teal/50'
    }`}
  >
    {children}
  </button>
);

const BookingFilterControls = ({
  searchTerm,
  onSearchTermChange,
  filterShift,
  onFilterShiftChange,
  filterPayment,
  onFilterPaymentChange,
  filterBookingStatus,
  onFilterBookingStatusChange,
  filterMonth,
  onFilterMonthChange,
  sortOrder,
  onSortOrderChange,
  sortBy, 
  onSortByChange, 
  onDownloadPDF, 
  isDownloadingPdf,
  onDownloadExcel,
  isDownloadingExcel,
  onClearFilters,
}) => {
  const shiftOptions = ['first', 'second', 'fullday']; 
  const paymentOptions = ['paid', 'unpaid', 'pending', 'failed'];
  const bookingStatusOptions = ['All', 'active', 'completed'];
  
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border p-5 mb-8 transition-colors duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skin-muted" />
            <input
            type="text"
            placeholder="Search by User Name, Phone, Seat..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-skin-base border border-skin-border rounded-xl text-sm text-skin-text placeholder-skin-muted/70 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
            />
        </div>

        {/* Right Side: Month, Sort & Downloads */}
        <div className="flex flex-wrap gap-3">
            
            {/* Month Selector */}
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-skin-muted pointer-events-none">
                    <Calendar className="w-4 h-4" />
                </div>
                <select 
                    value={filterMonth}
                    onChange={(e) => onFilterMonthChange(e.target.value)}
                    className="pl-9 pr-8 py-2.5 bg-skin-base border border-skin-border rounded-xl text-sm font-medium text-skin-text focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none appearance-none cursor-pointer min-w-[140px]"
                >
                    <option value="All">All Months</option>
                    {months.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-skin-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            {/* SORT BY FIELD SELECTOR */}
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-skin-muted pointer-events-none">
                     {sortBy === 'seatNo' ? <Armchair className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <select 
                    value={sortBy}
                    onChange={(e) => onSortByChange(e.target.value)}
                    className="pl-9 pr-8 py-2.5 bg-skin-base border border-skin-border rounded-xl text-sm font-medium text-skin-text focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none appearance-none cursor-pointer"
                >
                    <option value="date">By Date</option>
                    <option value="seatNo">By Seat</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-skin-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            {/* Sort Toggle (Asc/Desc) */}
            <button 
                onClick={() => onSortOrderChange(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-2 px-4 py-2.5 bg-skin-base border border-skin-border rounded-xl text-sm font-medium text-skin-text hover:bg-skin-surface hover:border-brand-teal/50 transition-all active:scale-95"
            >
                <ArrowDownUp className="w-4 h-4 text-brand-teal" />
                <span>{sortOrder === 'desc' ? (sortBy === 'seatNo' ? 'High-Low' : 'Newest') : (sortBy === 'seatNo' ? 'Low-High' : 'Oldest')}</span>
            </button>

             {/* Download PDF Button */}
             <button
                onClick={onDownloadPDF}
                disabled={isDownloadingPdf}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal/10 border border-brand-teal/20 rounded-xl text-sm font-medium text-brand-teal hover:bg-brand-teal hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download filtered data as PDF"
            >
                {isDownloadingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Download className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">PDF</span>
            </button>

             {/* Download Excel Button */}
             <button
                onClick={onDownloadExcel}
                disabled={isDownloadingExcel}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-500/10 border border-green-500/20 rounded-xl text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download filtered data as Excel"
            >
                {isDownloadingExcel ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <FileSpreadsheet className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Excel</span>
            </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-skin-muted uppercase tracking-wider mb-1">
            <Filter className="w-3 h-3" /> Filter By
        </div>

        <div className="flex flex-wrap gap-y-4 gap-x-8 items-center">
            {/* Shift */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-skin-text">Shift:</span>
                <div className="flex gap-2 flex-wrap">
                    <FilterButton onClick={() => onFilterShiftChange('All')} isActive={filterShift === 'All'}>All</FilterButton>
                    {shiftOptions.map((s) => (
                        <FilterButton key={s} onClick={() => onFilterShiftChange(s)} isActive={filterShift === s}><span className="capitalize">{s}</span></FilterButton>
                    ))}
                </div>
            </div>

            <div className="h-6 w-px bg-skin-border hidden xl:block"></div>

            {/* Payment */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-skin-text">Payment:</span>
                <div className="flex gap-2 flex-wrap">
                    <FilterButton onClick={() => onFilterPaymentChange('All')} isActive={filterPayment === 'All'}>All</FilterButton>
                    {paymentOptions.map((s) => (
                        <FilterButton key={s} onClick={() => onFilterPaymentChange(s)} isActive={filterPayment === s}><span className="capitalize">{s}</span></FilterButton>
                    ))}
                </div>
            </div>

            <div className="h-6 w-px bg-skin-border hidden xl:block"></div>

            {/* Status */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-skin-text">Status:</span>
                <div className="flex gap-2 flex-wrap">
                    {bookingStatusOptions.map((s) => (
                        <FilterButton key={s} onClick={() => onFilterBookingStatusChange(s)} isActive={filterBookingStatus === s}><span className="capitalize">{s}</span></FilterButton>
                    ))}
                </div>
            </div>
        </div>

        {/* Clear */}
        <div className="mt-2 pt-4 border-t border-skin-border flex justify-end">
          <button
            onClick={onClearFilters}
            className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors uppercase tracking-wide"
          >
            <X className="w-3 h-3" /> Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingFilterControls;