import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMMM d, yyyy');
}

export function formatDateTime(date: Date | string) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

export function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
  }).format(amount);
}

export const APPOINTMENT_TYPES = [
  'General Checkup',
  'Teeth Cleaning',
  'Tooth Extraction',
  'Orthodontic Consultation',
  'Root Canal',
  'Dental Implant',
  'Teeth Whitening',
  'Filling',
  'Crown & Bridge',
  'Emergency Visit',
];

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00',
];

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getStatusColor(status: string) {
  switch (status) {
    case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
    case 'PAID': return 'bg-green-100 text-green-800 border-green-200';
    case 'PARTIAL': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
