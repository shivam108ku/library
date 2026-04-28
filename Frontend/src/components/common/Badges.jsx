import React from 'react';
import { Shift, PaymentStatus } from '../../utils/types';
import { Sun, Moon, Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const ShiftBadge = ({ shift }) => {
  const configs = {
    [Shift.Morning]: { 
        style: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-500/30', 
        icon: <Sun className="w-3 h-3" /> 
    },
    [Shift.Evening]: { 
        style: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-500/30', 
        icon: <Moon className="w-3 h-3" /> 
    },
    [Shift.FullDay]: { 
        style: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20', 
        icon: <Zap className="w-3 h-3" /> 
    },
  };

  const config = configs[shift] || { style: 'bg-skin-base text-skin-muted border-skin-border', icon: null };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${config.style}`}>
      {config.icon}
      {shift}
    </span>
  );
};

export const PaymentStatusBadge = ({ status }) => {
  const styles = {
    [PaymentStatus.Paid]: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-500/30',
    [PaymentStatus.Unpaid]: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30',
    pending: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-500/30',
    failed: 'bg-skin-base text-skin-muted border-skin-border'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${styles[status] || styles.failed}`}>
      {status}
    </span>
  );
};

export const RenewalStatusBadge = ({ status }) => {
  const configs = {
    active: { style: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-500/30', icon: <CheckCircle className="w-3 h-3"/> },
    expiring: { style: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-500/30', icon: <Clock className="w-3 h-3"/> },
    expired: { style: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-500/30', icon: <AlertCircle className="w-3 h-3"/> },
  };

  const config = configs[status] || configs.expired;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${config.style}`}>
      {config.icon}
      {status}
    </span>
  );
};

export const BookingStatusBadge = ({ endDate }) => {
  const isPast = new Date(endDate) < new Date();
  const text = isPast ? 'Completed' : 'Active';
  const style = isPast 
    ? 'bg-skin-base text-skin-muted border-skin-border' 
    : 'bg-brand-teal/10 text-brand-teal border-brand-teal/20';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${style}`}>
      {text}
    </span>
  );
};