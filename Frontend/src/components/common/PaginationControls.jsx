import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-skin-border bg-skin-surface transition-colors duration-300">
      
      {/* Mobile View */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-skin-border text-sm font-medium rounded-lg text-skin-text bg-skin-base hover:bg-skin-surface disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-skin-border text-sm font-medium rounded-lg text-skin-text bg-skin-base hover:bg-skin-surface disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-skin-muted">
            Showing <span className="font-bold text-skin-text">{startItem}</span> to{' '}
            <span className="font-bold text-skin-text">{endItem}</span> of{' '}
            <span className="font-bold text-skin-text">{totalItems}</span> results
          </p>
        </div>

        <div>
          <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
            
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-skin-border bg-skin-surface text-sm font-medium text-skin-muted hover:bg-skin-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Page Number */}
            <span className="relative inline-flex items-center px-4 py-2 border border-skin-border bg-brand-teal text-sm font-bold text-white">
              {currentPage} / {totalPages}
            </span>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-skin-border bg-skin-surface text-sm font-medium text-skin-muted hover:bg-skin-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;