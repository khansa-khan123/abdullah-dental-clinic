'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Calendar, MessageSquare, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, formatTime, formatCurrency, APPOINTMENT_TYPES } from '@/lib/utils';
import { showToast } from '@/components/ui/Toaster';
import { Modal } from '@/components/ui/Modal';
import { AppointmentActions } from '@/components/appointment/AppointmentActions';

interface Appointment {
  id: string;
  date: Date;
  time: string;
  status: string;
  type: string;
  notes: string | null;
  patient: { id: string; user: { name: string; email: string; phone: string | null } };
  doctor: { id: string; user: { name: string } };
  payment: { id: string; amount: number; status: string } | null;
}

interface Doctor { id: string; user: { name: string } }
interface Patient { id: string; user: { name: string } }

interface Props {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
}

export function AdminAppointmentsClient({ appointments, doctors, patients }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [smsId, setSmsId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [newAppt, setNewAppt] = useState({
    patientId: '', doctorId: '', date: '', time: '', type: '', notes: '',
  });

  const filtered = appointments.filter(a => {
    const matchSearch =
      a.patient.user.name.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.user.name.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleBook = async () => {
    if (!newAppt.patientId || !newAppt.doctorId || !newAppt.date || !newAppt.time || !newAppt.type) {
      showToast('error', 'Missing Fields', 'Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppt),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      showToast('success', 'Booked', 'Appointment created and SMS sent.');
      setBookingOpen(false);
      setNewAppt({ patientId: '', doctorId: '', date: '', time: '', type: '', notes: '' });
      router.refresh();
    } catch (err: any) {
      showToast('error', 'Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const sendSmsReminder = async (apptId: string) => {
    setSmsId(apptId);
    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'appointment_reminder', targetId: apptId }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'SMS Sent', 'Reminder sent to patient.');
    } catch {
      showToast('error', 'Error', 'Could not send SMS.');
    } finally {
      setSmsId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await fetch(`/api/appointments/${deleteId}`, { method: 'DELETE' });
      showToast('success', 'Deleted', 'Appointment removed.');
      setDeleteId(null);
      router.refresh();
    } catch {
      showToast('error', 'Error', 'Could not delete.');
    } finally {
      setSubmitting(false);
    }
  };

  const TIME_SLOTS = [
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '14:00','14:30','15:00','15:30','16:00','16:30',
  ];

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient, doctor, treatment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field w-44 py-2 text-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button onClick={() => setBookingOpen(true)} className="btn-primary text-sm py-2">
          <Calendar className="h-4 w-4" /> New Appointment
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Treatment</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-500">No appointments found</td></tr>
              ) : (
                filtered.map((appt) => (
                  <tr key={appt.id}>
                    <td>
                      <div className="font-medium">{appt.patient.user.name}</div>
                      <div className="text-xs text-gray-500">{appt.patient.user.phone || appt.patient.user.email}</div>
                    </td>
                    <td className="text-sm text-gray-600">{appt.doctor.user.name}</td>
                    <td className="text-sm">{formatDate(appt.date)}</td>
                    <td className="text-sm">{formatTime(appt.time)}</td>
                    <td className="text-sm text-gray-600">{appt.type}</td>
                    <td><StatusBadge status={appt.status} /></td>
                    <td>
                      {appt.payment ? (
                        <div>
                          <StatusBadge status={appt.payment.status} />
                          <div className="text-xs text-gray-500 mt-0.5">{formatCurrency(appt.payment.amount)}</div>
                        </div>
                      ) : <span className="text-gray-400 text-xs">—</span>}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => sendSmsReminder(appt.id)}
                          disabled={smsId === appt.id}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Send SMS reminder"
                        >
                          {smsId === appt.id
                            ? <span className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin block" />
                            : <MessageSquare className="h-4 w-4" />
                          }
                        </button>
                        <AppointmentActions appointmentId={appt.id} status={appt.status} role="ADMIN" />
                        <button
                          onClick={() => setDeleteId(appt.id)}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book appointment modal */}
      <Modal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} title="New Appointment" size="md">
        <div className="space-y-4">
          <div>
            <label className="label">Patient *</label>
            <select value={newAppt.patientId} onChange={(e) => setNewAppt({ ...newAppt, patientId: e.target.value })} className="input-field">
              <option value="">Select patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.user.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Doctor *</label>
            <select value={newAppt.doctorId} onChange={(e) => setNewAppt({ ...newAppt, doctorId: e.target.value })} className="input-field">
              <option value="">Select doctor...</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.user.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date *</label>
              <input type="date" value={newAppt.date} onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label">Time *</label>
              <select value={newAppt.time} onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })} className="input-field">
                <option value="">Select time...</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Treatment *</label>
            <select value={newAppt.type} onChange={(e) => setNewAppt({ ...newAppt, type: e.target.value })} className="input-field">
              <option value="">Select treatment...</option>
              {APPOINTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea rows={2} value={newAppt.notes} onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })} className="input-field resize-none" />
          </div>
          <button onClick={handleBook} disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60">
            {submitting ? 'Booking...' : 'Create Appointment & Send SMS'}
          </button>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Appointment" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this appointment? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={handleDelete} disabled={submitting} className="btn-danger flex-1 justify-center">
            {submitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </>
  );
}
