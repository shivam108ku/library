import React from 'react';
import { Edit2, Trash2, User, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import { useNavigate } from 'react-router';

const UsersListTable = ({ users, bookings, onEditUser, onDeleteUser }) => {
  const navigate = useNavigate();

  const getDriveImgUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('data:') || (!url.includes('drive.google.com') && !url.includes('docs.google.com'))) return url;
    const idMatch = url.match(/[-\w]{25,}/);
    return idMatch ? `https://drive.google.com/uc?export=view&id=${idMatch[0]}` : url;
  };

  const getMembershipStatus = (userId) => {
    const now = new Date();
    // Check for active booking
    // Note: b.user can be an object (if populated) or string (if ref)
    const activeBooking = bookings.find(b => {
      const bookingUserId = typeof b.user === 'object' ? b.user._id : b.user;
      return bookingUserId === userId && new Date(b.endDate) >= now;
    });
    
    if (activeBooking) {
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-500/30"><CheckCircle className="w-3 h-3"/> Active</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"><Clock className="w-3 h-3"/> Inactive</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-skin-border">
        <thead className="bg-skin-base/80">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Member</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Contact Info</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-skin-muted uppercase tracking-wider">Joined</th>
            <th className="px-6 py-4 text-right text-xs font-bold text-skin-muted uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-skin-surface divide-y divide-skin-border">
          {users.length > 0 && users.map((user) => {
              const photoUrl = getDriveImgUrl(user.profilePhotoUrl);
              return (
                <tr key={user._id} className="hover:bg-brand-teal/5 transition-colors group">
                  
                  {/* Member Profile - Clickable to View Details */}
                  {/* Using user._id for navigation parameter */}
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => navigate(`/users/${user._id}`)}>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-skin-base flex items-center justify-center overflow-hidden border border-skin-border group-hover:border-brand-teal transition-colors">
                        {photoUrl ? (
                            <img src={photoUrl} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-sm font-bold text-skin-muted">{user.username?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-skin-text group-hover:text-brand-teal transition-colors flex items-center gap-1">
                            {user.username}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                        </div>
                        <div className="text-xs text-skin-muted font-mono">ID: {user.libId}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-skin-text font-medium">{user.contactNo}</div>
                    <div className="text-xs text-skin-muted truncate max-w-[150px]" title={user.address}>{user.address || 'No address'}</div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getMembershipStatus(user._id)}
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-skin-muted">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions (Prevent Row Click Propagation) */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditUser(user); }}
                        className="p-2 text-skin-muted hover:text-brand-teal hover:bg-brand-teal/10 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteUser(user); }}
                        className="p-2 text-skin-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {users.length === 0 && (
        <EmptyState
          icon={<User />}
          title="No Users Found"
          message="Add a new member to get started."
        />
      )}
    </div>
  );
};

export default UsersListTable;