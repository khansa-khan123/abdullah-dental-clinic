'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, Calendar, Phone, Mail, ToggleLeft } from 'lucide-react';
import { DAY_NAMES } from '@/lib/utils';
import { showToast } from '@/components/ui/Toaster';

interface Doctor {
  id: string;
  specialization: string;
  bio: string | null;
  isAvailable: boolean;
  user: { name: string; email: string; phone: string | null };
  schedules: { dayOfWeek: number; startTime: string; endTime: string; isAvailable: boolean }[];
  _count: { appointments: number };
}

export function AdminDoctorsClient({ doctors }: { doctors: Doctor[] }) {
  const router = useRouter();
  const [toggling, setToggling] = useState<string | null>(null);

  const toggleAvailability = async (doctorId: string, current: boolean) => {
    setToggling(doctorId);
    try {
      const res = await fetch('/api/doctors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, isAvailable: !current }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Updated', `Doctor availability changed.`);
      router.refresh();
    } catch {
      showToast('error', 'Error', 'Could not update availability.');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {doctors.map((doc) => (
        <div key={doc.id} className="card hover:shadow-card-hover transition-shadow">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {doc.user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-gray-900">{doc.user.name}</h3>
                  <p className="text-primary-600 text-sm">{doc.specialization}</p>
                </div>
                <button
                  onClick={() => toggleAvailability(doc.id, doc.isAvailable)}
                  disabled={toggling === doc.id}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                    doc.isAvailable
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${doc.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                  {toggling === doc.id ? '...' : doc.isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>

          {doc.bio && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doc.bio}</p>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-gray-400" />
              {doc.user.email}
            </div>
            {doc.user.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                {doc.user.phone}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              {doc._count.appointments} total appointments
            </div>
          </div>

          {/* Schedule */}
          {doc.schedules.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">Working Days</p>
              <div className="flex flex-wrap gap-1.5">
                {doc.schedules.filter(s => s.isAvailable).map(s => (
                  <span key={s.dayOfWeek} className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                    {DAY_NAMES[s.dayOfWeek]}
                  </span>
                ))}
              </div>
              {doc.schedules[0] && (
                <p className="text-xs text-gray-500 mt-2">
                  {doc.schedules[0].startTime} – {doc.schedules[0].endTime}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
