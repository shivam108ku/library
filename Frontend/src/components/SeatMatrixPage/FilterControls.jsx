import React from 'react';
import { Search, Filter, X } from 'lucide-react';

const FilterButton = ({ onClick, isActive, children, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 border ${
      isActive
        ? 'bg-brand-teal text-white border-brand-teal shadow-md shadow-brand-teal/20'
        : 'bg-skin-surface text-skin-muted border-skin-border hover:border-brand-teal/50 hover:bg-skin-base'
    } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

const FilterControls = ({
  searchTerm,
  onSearchTermChange,
  filterShift,
  onFilterShiftChange,
  filterPayment,
  onFilterPaymentChange,
  filterRenewal,
  onFilterRenewalChange,
  onClearFilters,
  filterAvailable,
  onFilterAvailableChange,
}) => {
  // Must match MongoDB Enum values strictly
  const shifts = ['first', 'second', 'fullday']; 
  const paymentStatuses = ['paid', 'unpaid', 'pending'];
  const renewalOptions = ['All', 'active', 'expiring', 'expired'];

  return (
    <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border p-5 mb-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skin-muted" />
          <input
            type="text"
            placeholder="Search student name, phone or seat #..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-skin-base border border-skin-border rounded-xl text-sm text-skin-text placeholder-skin-muted/70 focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
            <label className="flex items-center cursor-pointer gap-2 select-none group">
                <div className={`w-10 h-5 rounded-full relative transition-colors ${filterAvailable ? 'bg-brand-teal' : 'bg-skin-border'}`}>
                    <input type="checkbox" className="hidden" checked={filterAvailable} onChange={(e) => onFilterAvailableChange(e.target.checked)} />
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow-sm ${filterAvailable ? 'left-6' : 'left-1'}`}></div>
                </div>
                <span className={`text-sm font-medium transition-colors ${filterAvailable ? 'text-brand-teal' : 'text-skin-muted'}`}>Show Available Only</span>
            </label>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-skin-muted uppercase tracking-wider mb-1">
            <Filter className="w-3 h-3" /> Filters
        </div>
        
        <div className="flex flex-wrap gap-y-4 gap-x-8 items-center">
            {/* Shift Filter */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-skin-text">Shift:</span>
                <div className="flex gap-2">
                    <FilterButton onClick={() => onFilterShiftChange('All')} isActive={filterShift === 'All'}>All</FilterButton>
                    {shifts.map(s => (
                        <FilterButton key={s} onClick={() => onFilterShiftChange(s)} isActive={filterShift === s}>
                             <span className="capitalize">{s}</span>
                        </FilterButton>
                    ))}
                </div>
            </div>

            <div className="h-6 w-px bg-skin-border hidden xl:block"></div>

            {/* Payment Filter */}
            <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${filterAvailable ? 'text-skin-border' : 'text-skin-text'}`}>Payment:</span>
                <div className="flex gap-2">
                    <FilterButton onClick={() => !filterAvailable && onFilterPaymentChange('All')} isActive={filterPayment === 'All'} disabled={filterAvailable}>All</FilterButton>
                    {paymentStatuses.map(s => (
                        <FilterButton key={s} onClick={() => !filterAvailable && onFilterPaymentChange(s)} isActive={filterPayment === s} disabled={filterAvailable}>
                            <span className="capitalize">{s}</span>
                        </FilterButton>
                    ))}
                </div>
            </div>

            <div className="h-6 w-px bg-skin-border hidden xl:block"></div>

            {/* Renewal Filter */}
            <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${filterAvailable ? 'text-skin-border' : 'text-skin-text'}`}>Status:</span>
                <div className="flex gap-2">
                    {renewalOptions.map(s => (
                        <FilterButton key={s} onClick={() => !filterAvailable && onFilterRenewalChange(s)} isActive={filterRenewal === s} disabled={filterAvailable}>
                        <span className="capitalize">{s}</span>
                        </FilterButton>
                    ))}
                </div>
            </div>
        </div>

        {(searchTerm || filterShift !== 'All' || filterPayment !== 'All' || filterRenewal !== 'All' || filterAvailable) && (
            <div className="mt-2 pt-4 border-t border-skin-border flex justify-end">
                <button onClick={onClearFilters} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors uppercase tracking-wide">
                    <X className="w-3 h-3" /> Clear All Filters
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default FilterControls;