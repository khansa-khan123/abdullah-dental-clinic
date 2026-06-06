'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Clock } from 'lucide-react';
import { DAY_NAMES } from '@/lib/utils';
import { showToast } from '@/components/ui/Toaster';

interface Schedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface Props {
  doctorId: string;
  initialSchedules: Schedule[];
}

const DEFAULT_SCHEDULE: Schedule[] = Array.from({ length: 7 }, (_, i) => ({
  dayOfWeek: i,
  startTime: '09:00',
  endTime: '17:00',
  isAvailable: i >= 1 && i <= 5,
}));

export function ScheduleEditor({ doctorId, initialSchedules }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const initialMap = initialSchedules.reduce((acc, s) => {
    acc[s.dayOfWeek] = s;
    return acc;
  }, {} as Record<number, Schedule>);

  const [schedules, setSchedules] = useState<Schedule[]>(
    DEFAULT_SCHEDULE.map(def => initialMap[def.dayOfWeek] || def)
  );

  const update = (day: number, field: keyof Schedule, value: any) => {
    setSchedules(prev => prev.map(s =>
      s.dayOfWeek === day ? { ...s, [field]: value } : s
    ));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/schedules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedules, doctorId }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Schedule Saved', 'Your availability has been updated.');
      router.refresh();
    } catch {
      showToast('error', 'Error', 'Could not save schedule.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="space-y-3 mb-6">
        {schedules.map((s) => (
          <div
            key={s.dayOfWeek}
            className={`p-4 rounded-xl border-2 transition-all ${
              s.isAvailable ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-4 flex-wrap">
              {/* Toggle */}
              <label className="flex items-center gap-2 cursor-pointer min-w-[120px]">
                <div
                  onClick={() => update(s.dayOfWeek, 'isAvailable', !s.isAvailable)}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    s.isAvailable ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    s.isAvailable ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
                <span className={`font-semibold text-sm w-20 ${s.isAvailable ? 'text-primary-700' : 'text-gray-500'}`}>
                  {DAY_NAMES[s.dayOfWeek]}
                </span>
              </label>

              {s.isAvailable ? (
                <div className="flex items-center gap-3 flex-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <label className="text-sm text-gray-600">From</label>
                    <input
                      type="time"
                      value={s.startTime}
                      onChange={(e) => update(s.dayOfWeek, 'startTime', e.target.value)}
                      className="input-field py-1.5 w-32 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">To</label>
                    <input
                      type="time"
                      value={s.endTime}
                      onChange={(e) => update(s.dayOfWeek, 'endTime', e.target.value)}
                      className="input-field py-1.5 w-32 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <span className="text-sm text-gray-400 italic">Day off</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
        {saving ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </span>
        ) : (
          <><Save className="h-4 w-4" /> Save Schedule</>
        )}
      </button>
    </div>
  );
}
