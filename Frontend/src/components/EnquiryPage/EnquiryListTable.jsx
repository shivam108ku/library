import React from 'react';
import { Trash2, BookOpen, Calendar, Phone, Clock, UserCheck, UserPlus } from 'lucide-react';
import EmptyState from '../common/EmptyState';

const EnquiryListTable = ({ enquiries, usersMap, onDelete, onAddUser }) => {

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-skin-border">
        <thead className="bg-skin-base/80">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Registered</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Enquirer</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Contact</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Trial Date</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Requested On</th>
            <th className="px-6 py-4 text-right text-xs font-bold text-skin-muted uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-skin-surface divide-y divide-skin-border">
          {enquiries.length > 0 && enquiries.map((enquiry) => {
              const isToday = new Date(enquiry.trialDate).toDateString() === new Date().toDateString();
              
              // Check if user exists in map
              const isRegistered = usersMap.has(enquiry.contactNo);

              return (
                <tr key={enquiry._id} className="hover:bg-brand-teal/5 transition-colors group">
                  
                  {/* Status Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isRegistered ? (
                        <div className="flex items-center gap-1.5 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 w-fit px-2.5 py-1 rounded-full border border-green-200 dark:border-green-500/30" title="User already registered">
                            <UserCheck className="w-4 h-4" />
                            <span className="text-xs font-bold">Member</span>
                        </div>
                    ) : (
                        <button 
                            onClick={() => onAddUser(enquiry)}
                            className="flex items-center gap-1.5 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 w-fit px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm"
                            title="Add to Database"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span className="text-xs font-bold">Add User</span>
                        </button>
                    )}
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className="text-sm font-bold text-skin-text">{enquiry.enquirerName}</span>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={`tel:${enquiry.contactNo}`} className="inline-flex items-center gap-2 px-3 py-1 bg-skin-base hover:bg-brand-teal hover:text-white border border-skin-border rounded-lg transition-colors text-sm text-skin-muted hover:border-transparent">
                        <Phone className="w-3 h-3" /> {enquiry.contactNo}
                    </a>
                  </td>

                  {/* Trial Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <Calendar className={`w-4 h-4 ${isToday ? 'text-brand-teal' : 'text-skin-muted'}`} />
                        <span className={`text-sm font-medium ${isToday ? 'text-brand-teal font-bold' : 'text-skin-text'}`}>
                            {formatDate(enquiry.trialDate)}
                        </span>
                        {isToday && (
                            <span className="text-[10px] bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full font-bold">TODAY</span>
                        )}
                    </div>
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center gap-1.5 text-xs text-skin-muted">
                        <Clock className="w-3 h-3" />
                        {new Date(enquiry.createdAt).toLocaleString('en-IN')}
                     </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                        onClick={() => onDelete(enquiry)}
                        className="p-2 text-skin-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Enquiry"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {enquiries.length === 0 && <EmptyState icon={<BookOpen />} title="No Enquiries Found" message="Try selecting a different date or search term." />}
    </div>
  );
};

export default EnquiryListTable;