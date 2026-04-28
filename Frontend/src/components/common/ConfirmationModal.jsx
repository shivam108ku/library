import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", isDanger = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-skin-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            
            {/* Icon */}
            <div className={`flex-shrink-0 p-3 rounded-full ${isDanger ? 'bg-red-100 dark:bg-red-900/20' : 'bg-brand-teal/10'}`}>
              <AlertTriangle className={`w-6 h-6 ${isDanger ? 'text-red-600 dark:text-red-400' : 'text-brand-teal'}`} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-skin-text font-serif mb-2">
                {title}
              </h3>
              <p className="text-sm text-skin-muted leading-relaxed">
                {message}
              </p>
            </div>

            {/* Close X */}
            <button onClick={onClose} className="text-skin-muted hover:text-skin-text">
                <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-skin-base px-6 py-4 flex justify-end gap-3 border-t border-skin-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-skin-surface border border-skin-border rounded-lg text-sm font-medium text-skin-text hover:bg-skin-base transition-colors focus:ring-2 focus:ring-skin-border outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white shadow-md transition-colors focus:ring-2 focus:ring-offset-1 outline-none ${
                isDanger 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-brand-teal hover:bg-brand-teal-hover focus:ring-brand-teal'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;