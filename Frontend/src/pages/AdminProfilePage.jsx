import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { ArrowLeft, User, Phone, Shield, Calendar, Edit, Key, LogOut, CheckCircle, Mail, MapPin } from 'lucide-react';

const AdminProfilePage = () => {
    const { admin } = useSelector(state => state.authSlice);
    const navigate = useNavigate();

    const joinDate = admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    }) : 'July 15, 2024';

    return (
        <main className="flex-grow bg-skin-base min-h-screen pb-12 transition-colors duration-300">
            
            {/* Header / Breadcrumb */}
            <div className="bg-skin-surface border-b border-skin-border sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center text-sm font-medium text-skin-muted hover:text-brand-teal transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </button>
                    <span className="text-sm font-bold text-skin-text">Admin Settings</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- LEFT COLUMN: Identity Card --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden sticky top-24">
                            <div className="h-24 bg-brand-teal-dark"></div>
                            <div className="px-6 pb-6 text-center -mt-12">
                                <div className="relative inline-block">
                                    <div className="h-24 w-24 rounded-full border-4 border-skin-surface bg-skin-surface shadow-md flex items-center justify-center overflow-hidden">
                                        {admin.profileImageUrl ? (
                                            <img src={admin.profileImageUrl} alt={admin.adminName} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="bg-brand-teal/10 w-full h-full flex items-center justify-center">
                                                <User className="w-10 h-10 text-brand-teal" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-skin-surface rounded-full" title="Active"></div>
                                </div>
                                
                                <h2 className="mt-3 text-xl font-bold text-skin-text font-serif">{admin.adminName}</h2>
                                <p className="text-sm text-skin-muted font-medium">{admin.role || 'Super Admin'}</p>

                                <div className="mt-6 flex flex-col gap-2">
                                    <button className="w-full py-2 px-4 bg-brand-teal text-white rounded-lg text-sm font-medium shadow-sm hover:bg-brand-teal-hover transition-colors flex items-center justify-center gap-2">
                                        <Edit className="w-4 h-4" /> Edit Profile
                                    </button>
                                    <button className="w-full py-2 px-4 bg-skin-surface border border-skin-border text-skin-text rounded-lg text-sm font-medium hover:bg-skin-base transition-colors flex items-center justify-center gap-2">
                                        <Key className="w-4 h-4" /> Change Password
                                    </button>
                                </div>

                                <div className="mt-6 border-t border-skin-border pt-6 text-left space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-skin-muted flex items-center gap-2"><Calendar className="w-4 h-4"/> Joined</span>
                                        <span className="font-medium text-skin-text">{joinDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-skin-muted flex items-center gap-2"><Shield className="w-4 h-4"/> Access</span>
                                        <span className="font-medium text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded text-xs">Level 1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: Details Sections --- */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Section 1: Contact Information */}
                        <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border p-6">
                            <h3 className="text-lg font-bold text-skin-text font-serif mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-brand-teal rounded-full"></span> Contact Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-4 bg-skin-base rounded-xl border border-skin-border">
                                    <p className="text-xs font-bold text-skin-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><Phone className="w-3 h-3"/> Phone Number</p>
                                    <p className="text-skin-text font-medium">{admin.phoneNo || "Not provided"}</p>
                                </div>
                                <div className="p-4 bg-skin-base rounded-xl border border-skin-border">
                                    <p className="text-xs font-bold text-skin-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><Mail className="w-3 h-3"/> Email Address</p>
                                    {/* <p className="text-skin-text font-medium">{admin.email || "admin@dhakshith.com"}</p> */}
                                </div>
                                <div className="p-4 bg-skin-base rounded-xl border border-skin-border sm:col-span-2">
                                    <p className="text-xs font-bold text-skin-muted uppercase tracking-wider mb-1 flex items-center gap-1.5"><MapPin className="w-3 h-3"/> Library Branch</p>
                                    <p className="text-skin-text font-medium">Akash nagar Indergarhi, Govindpuram, Ghaziabad, Uttar Pradesh, 201013</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Account Status */}
                        <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border p-6">
                            <h3 className="text-lg font-bold text-skin-text font-serif mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-brand-teal rounded-full"></span> Account Security
                            </h3>
                            <div className="flex items-center justify-between p-4 border border-skin-border rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-skin-text">Account Active</p>
                                        <p className="text-xs text-skin-muted">Your admin privileges are currently active.</p>
                                    </div>
                                </div>
                                <button className="text-sm text-red-600 dark:text-red-400 font-medium hover:text-red-800 dark:hover:text-red-300 transition-colors flex items-center gap-1">
                                    <LogOut className="w-4 h-4" /> Deactivate
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminProfilePage;