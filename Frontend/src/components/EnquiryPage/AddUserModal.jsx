import React, { useState, useEffect } from 'react';
import { X, Save, User, Phone, Users } from 'lucide-react';
import axiosClient from '../../config/axios';

const AddUserModal = ({ isOpen, onClose, enquiry, onUserAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    contactNo: '',
    gender: 'male' // Default
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form when enquiry data changes
  useEffect(() => {
    if (isOpen && enquiry) {
      setFormData({
        username: enquiry.enquirerName || '',
        contactNo: enquiry.contactNo || '',
        gender: 'male'
      });
      setError('');
    }
  }, [isOpen, enquiry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/users/add', formData);
      
      if (response.data.status === 'ok') {
        // Pass the new user back to parent to update local list
        onUserAdded(response.data.user);
        onClose();
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to add user.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-skin-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-brand-teal p-4 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5" /> Add New Student
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 opacity-80 hover:opacity-100" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs rounded-lg border border-red-200 dark:border-red-500/30">{error}</div>}

          <div>
            <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Full Name</label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skin-muted" />
                <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 border border-skin-border bg-skin-base text-skin-text rounded-lg text-sm focus:border-brand-teal outline-none"
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Contact No</label>
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skin-muted" />
                <input
                    type="text"
                    required
                    pattern="[0-9]{10}"
                    value={formData.contactNo}
                    onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 border border-skin-border bg-skin-base text-skin-text rounded-lg text-sm focus:border-brand-teal outline-none"
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Gender</label>
            <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skin-muted" />
                <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 border border-skin-border bg-skin-base text-skin-text rounded-lg text-sm focus:border-brand-teal outline-none"
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="third gender">Other</option>
                </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2.5 bg-brand-teal text-white rounded-lg font-medium hover:bg-brand-teal-hover shadow-md flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? "Saving..." : <><Save className="w-4 h-4" /> Create Student Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;