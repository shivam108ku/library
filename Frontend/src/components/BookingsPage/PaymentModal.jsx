import React, { useState, useEffect } from 'react';
import { X, CheckCircle, IndianRupee, CreditCard, FileText } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onConfirm, booking }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('cash'); // Default to cash
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && booking) {
      setAmount(booking.payment?.amount || '');
      setMethod(booking.payment?.method || 'cash');
      setNotes(booking.notes || '');
    }
  }, [isOpen, booking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      amount: Number(amount),
      method: method,
      notes: notes.trim()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-skin-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-brand-teal p-4 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Confirm Payment
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 opacity-80 hover:opacity-100" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-skin-surface">
          <p className="text-sm text-skin-muted">
            Confirming payment for <strong className="text-skin-text">{booking?.user?.username}</strong>.
          </p>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">
              Amount Received
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee className="h-4 w-4 text-skin-muted" />
              </div>
              <input
                type="number"
                required
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 w-full bg-skin-base border border-skin-border rounded-lg p-2.5 text-sm text-skin-text focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none"
                placeholder="0.00"
                autoFocus
              />
            </div>
          </div>

          {/* Method Field */}
          <div>
            <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide mb-1">
              Payment Method
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-4 w-4 text-skin-muted" />
              </div>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="pl-10 w-full bg-skin-base border border-skin-border rounded-lg p-2.5 text-sm text-skin-text focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none"
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
                <option value="card">Card</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
          </div>

          {/* Notes Field */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-xs font-bold text-skin-muted uppercase tracking-wide">
                Notes
              </label>
              <span className={`text-[10px] ${notes.length >= 100 ? 'text-red-500' : 'text-skin-muted'}`}>
                {notes.length}/100
              </span>
            </div>
            <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-4 w-4 text-skin-muted" />
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength="100"
                  rows="2"
                  placeholder="Optional payment notes..."
                  className="pl-10 w-full bg-skin-base border border-skin-border rounded-lg p-2.5 text-sm text-skin-text focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none resize-none placeholder-skin-muted/60"
                />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-skin-border rounded-lg text-sm font-medium text-skin-text bg-skin-base hover:bg-skin-surface transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-brand-teal text-white rounded-lg text-sm font-bold hover:bg-brand-teal-hover shadow-md transition-all active:scale-95"
            >
              Confirm & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;