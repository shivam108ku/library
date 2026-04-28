import React, { useState, useEffect } from 'react';
import { X, Save, User, Phone, MapPin, Calendar, Camera, AlertCircle } from 'lucide-react';

const UserFormModal = ({ isOpen, onClose, onSubmit, initialUser }) => {
  const isEditing = !!initialUser?._id;
  
  // --- State ---
  const [formData, setFormData] = useState({
    username: '',
    contactNo: '',
    gender: 'male',
    dateOfBirth: '',
    address: '',
  });

  // State for Image Upload (Edit Mode Only)
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State for Validation Errors
  const [errors, setErrors] = useState({});

  // --- Effects ---
  useEffect(() => {
    if (isOpen) {
        // Reset Form
        setFormData({
            username: initialUser?.username || '',
            contactNo: initialUser?.contactNo || '',
            gender: initialUser?.gender || 'male',
            dateOfBirth: initialUser?.dateOfBirth ? new Date(initialUser.dateOfBirth).toISOString().split('T')[0] : '',
            address: initialUser?.address || '',
        });

        // Reset Image State
        setSelectedImage(null);
        if (initialUser?.profilePhotoUrl) {
            setImagePreview(initialUser.profilePhotoUrl); // Use backend URL
        } else {
            setImagePreview(null);
        }
        
        // Reset Errors
        setErrors({});
    }
  }, [isOpen, initialUser]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    if (!isEditing) return; // Guard clause

    const file = e.target.files[0];
    if (file) {
        setSelectedImage(file);
        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const contactRegex = /^\d{10}$/;

    if (!formData.contactNo) {
        newErrors.contactNo = "Contact number is required";
    } else if (!contactRegex.test(formData.contactNo)) {
        newErrors.contactNo = "Must be exactly 10 digits";
    }

    if (!formData.username.trim()) {
        newErrors.username = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return; // Stop submission if validation fails
    }

    // Prepare the payload (Required Fields)
    const submissionData = {
        _id: initialUser?._id, 
        username: formData.username,
        contactNo: formData.contactNo,
        gender: formData.gender,
        profileImage: selectedImage 
    };

    // Conditional Fields: Only add Address if it has content
    if (formData.address && formData.address.trim() !== "") {
        submissionData.address = formData.address.trim();
    }

    // Conditional Fields: Only add DoB if it has content
    if (formData.dateOfBirth && formData.dateOfBirth !== "") {
        submissionData.dateOfBirth = formData.dateOfBirth;
    }

    // Pass data back to parent
    onSubmit(submissionData);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-skin-surface rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-900 p-6 flex justify-between items-center text-white shrink-0 dark:bg-black">
          <h3 className="text-xl font-serif font-bold">{isEditing ? 'Edit Member Profile' : 'New Member Registration'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 bg-skin-surface">
          
          {/* --- Image Section --- */}
          <div className="flex justify-center mb-4">
            {isEditing ? (
                // EDIT MODE: Clickable Upload
                <div className="relative group cursor-pointer">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-brand-teal bg-skin-base">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-teal">
                                <User className="w-10 h-10" />
                            </div>
                        )}
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <p className="text-xs text-center text-skin-muted mt-2">Tap to change</p>
                </div>
            ) : (
                // CREATE MODE: Static Placeholder (No Upload)
                <div className="flex flex-col items-center">
                    <div className="h-20 w-20 bg-skin-base rounded-full flex items-center justify-center text-skin-muted border border-skin-border">
                        <User className="w-10 h-10" />
                    </div>
                    <p className="text-xs text-skin-muted mt-2">Profile image can be added later</p>
                </div>
            )}
          </div>

          {/* --- Form Fields --- */}
          <div>
            <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Full Name</label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skin-muted" />
                <input 
                    type="text" name="username" 
                    value={formData.username} onChange={handleChange} 
                    className={`w-full pl-10 pr-4 py-2.5 bg-skin-base border rounded-lg text-sm text-skin-text focus:ring-2 outline-none transition-all ${errors.username ? 'border-red-500 focus:ring-red-200' : 'border-skin-border focus:ring-brand-teal/20 focus:border-brand-teal'}`}
                    placeholder="Enter full name"
                />
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Phone Number</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skin-muted" />
                    <input 
                        type="tel" name="contactNo" 
                        value={formData.contactNo} onChange={handleChange} 
                        className={`w-full pl-10 pr-4 py-2.5 bg-skin-base border rounded-lg text-sm text-skin-text focus:ring-2 outline-none transition-all ${errors.contactNo ? 'border-red-500 focus:ring-red-200' : 'border-skin-border focus:ring-brand-teal/20 focus:border-brand-teal'}`}
                        placeholder="9876543210"
                        maxLength={10} 
                    />
                </div>
                {errors.contactNo && (
                    <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.contactNo}</span>
                    </div>
                )}
            </div>
            <div>
                <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Date of Birth</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-skin-muted" />
                    <input 
                        type="date" name="dateOfBirth" 
                        value={formData.dateOfBirth} onChange={handleChange} 
                        className="w-full pl-10 pr-4 py-2.5 bg-skin-base border border-skin-border rounded-lg text-sm text-skin-text focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                    />
                </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Gender</label>
            <select 
                name="gender" value={formData.gender} onChange={handleChange} 
                className="w-full px-4 py-2.5 bg-skin-base border border-skin-border rounded-lg text-sm text-skin-text focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="third gender">Third Gender</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">Address</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-skin-muted" />
                <textarea 
                    name="address" rows="3"
                    value={formData.address} onChange={handleChange} 
                    className="w-full pl-10 pr-4 py-2.5 bg-skin-base border border-skin-border rounded-lg text-sm text-skin-text focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none resize-none transition-all"
                    placeholder="Enter full address"
                />
            </div>
          </div>

          <div className="pt-4 border-t border-skin-border flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-skin-base border border-skin-border rounded-lg text-sm font-medium text-skin-text hover:bg-skin-surface transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 bg-brand-teal text-white rounded-lg text-sm font-medium hover:bg-brand-teal-hover shadow-md flex items-center gap-2 transition-colors">
              <Save className="w-4 h-4" /> Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;