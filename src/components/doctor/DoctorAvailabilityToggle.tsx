'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/ui/Toaster';

interface Props {
  doctorId: string;
  initialAvailable: boolean;
}

export function DoctorAvailabilityToggle({ doctorId, initialAvailable }: Props) {
  const router = useRouter();
  const [available, setAvailable] = useState(initialAvailable);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/doctors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, isAvailable: !available }),
      });
      if (!res.ok) throw new Error();
      setAvailable(!available);
      showToast('success', 'Status Updated', `You are now ${!available ? 'available' : 'unavailable'}.`);
      router.refresh();
    } catch {
      showToast('error', 'Error', 'Could not update availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
        available
          ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
          : 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
      }`}
    >
      <span className={`w-3 h-3 rounded-full ${available ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      {loading ? 'Updating...' : available ? 'Available' : 'Unavailable'}
      <span className="text-xs font-normal opacity-60">(click to toggle)</span>
    </button>
  );
}
