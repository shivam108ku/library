import React from 'react';
import { Search, X, Filter } from 'lucide-react';

const UserFilterControls = ({
  searchTerm,
  onSearchTermChange,
  filterStatus,
  onFilterStatusChange,
  onClear
}) => {
  return (
    <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300">
      
      {/* Search Bar */}
      <div className="relative flex-grow max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skin-muted" />
        <input
          type="text"
          placeholder="Search by Name or Phone..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-skin-base border border-skin-border rounded-xl text-sm text-skin-text placeholder-skin-muted/70 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
        />
      </div>

      {/* Filter & Clear Group */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        
        {/* Status Dropdown */}
        <div className="relative w-full sm:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skin-muted" />
            <select
                value={filterStatus}
                onChange={(e) => onFilterStatusChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-skin-base border border-skin-border rounded-xl text-sm text-skin-text focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none appearance-none cursor-pointer"
            >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
        </div>

        {/* Clear Button */}
        {(searchTerm || filterStatus !== 'All') && (
          <button
            onClick={onClear}
            className="whitespace-nowrap px-3 py-2 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-1 transition-colors uppercase tracking-wide"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default UserFilterControls;