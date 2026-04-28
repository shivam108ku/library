import React from 'react';
import { Search, X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const EnquiryFilterControls = ({
  searchTerm, onSearchTermChange,
  filterDate, onFilterDateChange,
  onDateNav, isToday, 
  onClearFilters,
}) => {
  return (
    <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border p-5 mb-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          
          {/* Search */}
          <div className="relative w-full md:w-1/2">
            <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-2">
                Search
            </label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skin-muted" />
                <input
                type="text"
                placeholder="Search Name or Phone..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-skin-base border border-skin-border rounded-xl text-sm text-skin-text placeholder-skin-muted/70 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                />
            </div>
          </div>

          {/* Date Filter with Navigation */}
          <div className="w-full md:w-auto flex flex-col">
            <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-2">
                Filter by Date
            </label>
            <div className="flex items-center gap-3">
                
                {/* Date Selection Group */}
                <div className="flex items-center bg-skin-base border border-skin-border rounded-xl p-1 shadow-sm">
                    <button 
                        onClick={() => onDateNav(-1)}
                        className="p-2 hover:bg-skin-surface hover:shadow-sm rounded-lg text-skin-muted hover:text-skin-text transition-all"
                        title="Previous Day"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="relative flex items-center">
                        <Calendar className="absolute left-2 w-3.5 h-3.5 text-skin-muted pointer-events-none" />
                        <input 
                            type="date"
                            value={filterDate}
                            onChange={(e) => onFilterDateChange(e.target.value)}
                            className="pl-7 pr-2 py-1.5 bg-transparent border-none text-sm focus:ring-0 outline-none text-skin-text font-bold cursor-pointer"
                        />
                    </div>

                    <button 
                        onClick={() => onDateNav(1)}
                        disabled={isToday}
                        className={`p-2 rounded-lg transition-all ${
                            isToday 
                            ? 'text-skin-border cursor-not-allowed' 
                            : 'hover:bg-skin-surface hover:shadow-sm text-skin-muted hover:text-skin-text'
                        }`}
                        title="Next Day"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Clear Filters Button */}
                {(searchTerm || !isToday) && (
                    <button 
                        onClick={onClearFilters} 
                        className="flex items-center gap-1 px-3 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl transition-colors h-[46px]"
                        title="Reset to Today"
                    >
                        <X className="w-4 h-4" /> Reset
                    </button>
                )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default EnquiryFilterControls;