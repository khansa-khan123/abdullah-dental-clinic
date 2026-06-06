'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, FileText, CheckCircle, ChevronRight } from 'lucide-react';
import { APPOINTMENT_TYPES, TIME_SLOTS, DAY_NAMES, formatCurrency } from '@/lib/utils';
import { showToast } from '@/components/ui/Toaster';

interface Doctor {
  id: string;
  specialization: string;
  user: { name: string };
  schedules: { dayOfWeek: number; startTime: string; endTime: string }[];
}

const SERVICE_PRICES: Record<string, number> = {
  'General Checkup': 150, 'Teeth Cleaning': 100, 'Tooth Extraction': 300,
  'Orthodontic Consultation': 200, 'Root Canal': 800, 'Dental Implant': 4500,
  'Teeth Whitening': 500, 'Filling': 200, 'Crown & Bridge': 1500, 'Emergency Visit': 350,
};

export function BookingForm({ doctors }: { doctors: Doctor[] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [form, setForm] = useState({
    doctorId: '', date: '', time: '', type: '', notes: '',
  });

  const selectedDoctor = doctors.find(d => d.id === form.doctorId);
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  const isDateAvailable = (dateStr: string) => {
    if (!selectedDoctor || !dateStr) return true;
    const dayOfWeek = new Date(dateStr).getDay();
    return selectedDoctor.schedules.some(s => s.dayOfWeek === dayOfWeek);
  };

  const canProceed = () => {
    if (step === 1) return !!form.doctorId;
    if (step === 2) return !!form.type;
    if (step === 3) return !!form.date && !!form.time && isDateAvailable(form.date);
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooked(true);
      showToast('success', 'Appointment Booked!', 'You will receive an SMS confirmation shortly.');
    } catch (err: any) {
      showToast('error', 'Booking Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <div className="card text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 font-heading mb-3">Appointment Confirmed!</h2>
        <p className="text-gray-600 mb-2">Your appointment has been booked successfully.</p>
        <p className="text-gray-500 text-sm mb-8">An SMS confirmation has been sent to your phone.</p>
        <div className="bg-gray-50 rounded-xl p-5 text-left max-w-sm mx-auto mb-8">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Doctor</span>
              <span className="font-medium">{selectedDoctor?.user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Treatment</span>
              <span className="font-medium">{form.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">{new Date(form.date).toDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time</span>
              <span className="font-medium">{form.time}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-500">Estimated Fee</span>
              <span className="font-bold text-primary-600">{formatCurrency(SERVICE_PRICES[form.type] || 200)}</span>
            </div>
          </div>
        </div>
        <button onClick={() => router.push('/patient/dashboard')} className="btn-primary">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              s < step ? 'bg-green-500 text-white' :
              s === step ? 'bg-primary-600 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {s < step ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
            {s < 4 && <div className={`h-1 flex-1 rounded ${s < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex justify-between text-xs text-gray-500 mb-8 -mt-4">
        <span>Doctor</span><span>Treatment</span><span>Date & Time</span><span>Confirm</span>
      </div>

      {/* Step 1 — Doctor */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-heading mb-5 flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" /> Choose Your Doctor
          </h2>
          <div className="space-y-3">
            {doctors.map((doc) => (
              <label key={doc.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                form.doctorId === doc.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300 bg-white'
              }`}>
                <input
                  type="radio"
                  name="doctor"
                  value={doc.id}
                  checked={form.doctorId === doc.id}
                  onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                  className="sr-only"
                />
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {doc.user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{doc.user.name}</div>
                  <div className="text-sm text-primary-600">{doc.specialization}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Available: {doc.schedules.map(s => DAY_NAMES[s.dayOfWeek].slice(0,3)).join(', ')}
                  </div>
                </div>
                {form.doctorId === doc.id && (
                  <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Treatment */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-heading mb-5 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" /> Select Treatment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {APPOINTMENT_TYPES.map((type) => (
              <label key={type} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                form.type === type
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}>
                <div>
                  <div className="font-medium text-gray-900">{type}</div>
                  <div className="text-xs text-primary-600 font-semibold">{formatCurrency(SERVICE_PRICES[type] || 200)}</div>
                </div>
                <input
                  type="radio" name="type" value={type}
                  checked={form.type === type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-4 h-4 text-primary-600"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Date & Time */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-heading mb-5 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-600" /> Choose Date & Time
          </h2>
          <div className="space-y-5">
            <div>
              <label className="label">Appointment Date</label>
              <input
                type="date"
                min={minDateStr}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value, time: '' })}
                className="input-field"
              />
              {form.date && !isDateAvailable(form.date) && (
                <p className="text-red-600 text-sm mt-1">
                  Dr. {selectedDoctor?.user.name} is not available on {DAY_NAMES[new Date(form.date).getDay()]}s.
                </p>
              )}
              {selectedDoctor && (
                <p className="text-gray-500 text-xs mt-1">
                  Available days: {selectedDoctor.schedules.map(s => DAY_NAMES[s.dayOfWeek]).join(', ')}
                </p>
              )}
            </div>

            {form.date && isDateAvailable(form.date) && (
              <div>
                <label className="label">Time Slot</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, time: t })}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                        form.time === t
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-200 text-gray-700 hover:border-primary-400 hover:bg-primary-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="label">Notes (Optional)</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any specific concerns or notes for the doctor..."
                className="input-field resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4 — Confirm */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-heading mb-5 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary-600" /> Confirm Appointment
          </h2>
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            {[
              { label: 'Doctor', value: selectedDoctor?.user.name },
              { label: 'Specialization', value: selectedDoctor?.specialization },
              { label: 'Treatment', value: form.type },
              { label: 'Date', value: form.date ? new Date(form.date).toDateString() : '' },
              { label: 'Time', value: form.time },
              { label: 'Notes', value: form.notes || 'None' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start">
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="font-medium text-gray-900 text-sm text-right ml-4">{value}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="font-semibold text-gray-800">Estimated Fee</span>
              <span className="font-bold text-primary-700 text-lg">{formatCurrency(SERVICE_PRICES[form.type] || 200)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 bg-blue-50 rounded-lg p-3">
            📱 You will receive an SMS confirmation on your registered phone number after booking.
            Payment is due within 7 days of your appointment.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="btn-secondary text-sm">
            ← Back
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary text-sm disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Booking...
              </span>
            ) : (
              <><CheckCircle className="h-4 w-4" /> Confirm Booking</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
