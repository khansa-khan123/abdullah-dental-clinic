'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle, MoreVertical } from 'lucide-react';
import { showToast } from '@/components/ui/Toaster';

interface Props {
  appointmentId: string;
  status: string;
  role: string;
}

export function AppointmentActions({ appointmentId, status, role }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    setOpen(false);
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      showToast('success', 'Updated', `Appointment ${newStatus.toLowerCase()}.`);
      router.refresh();
    } catch {
      showToast('error', 'Error', 'Could not update appointment.');
    } finally {
      setLoading(false);
    }
  };

  if (['COMPLETED', 'CANCELLED'].includes(status)) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
      >
        {loading
          ? <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin block" />
          : <MoreVertical className="h-4 w-4" />
        }
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-xl border border-gray-100 py-1 w-44">
            {role !== 'PATIENT' && status === 'PENDING' && (
              <button
                onClick={() => updateStatus('CONFIRMED')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 w-full transition-colors"
              >
                <CheckCircle className="h-4 w-4" /> Confirm
              </button>
            )}
            {role !== 'PATIENT' && (
              <button
                onClick={() => updateStatus('COMPLETED')}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-blue-700 hover:bg-blue-50 w-full transition-colors"
              >
                <CheckCircle className="h-4 w-4" /> Mark Complete
              </button>
            )}
            <button
              onClick={() => updateStatus('CANCELLED')}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 w-full transition-colors"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
