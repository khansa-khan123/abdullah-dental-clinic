'use client';

import { useState } from 'react';
import { MessageSquare, Send, Bell, CreditCard, Users, CheckCircle, XCircle } from 'lucide-react';
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils';
import { showToast } from '@/components/ui/Toaster';

interface SMSLog { id: string; to: string; message: string; status: string; createdAt: Date }
interface PendingPayment {
  id: string; amount: number;
  appointment: { patient: { user: { name: string; phone: string | null } } };
}
interface UpcomingAppointment {
  id: string; date: Date; time: string; type: string;
  patient: { user: { name: string; phone: string | null } };
  doctor: { user: { name: string } };
}

interface Props {
  smsLogs: SMSLog[];
  pendingPayments: PendingPayment[];
  upcomingAppointments: UpcomingAppointment[];
}

export function AdminSMSClient({ smsLogs, pendingPayments, upcomingAppointments }: Props) {
  const [customPhone, setCustomPhone] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [sending, setSending] = useState<string | null>(null);

  const send = async (type: string, payload: object, key: string) => {
    setSending(key);
    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('success', 'SMS Sent', data.sent !== undefined ? `${data.sent} messages sent.` : 'Message delivered.');
    } catch (err: any) {
      showToast('error', 'Failed', err.message);
    } finally {
      setSending(null);
    }
  };

  const sendCustom = () => {
    if (!customPhone || !customMessage) {
      showToast('error', 'Missing Fields', 'Phone and message are required.');
      return;
    }
    send('custom', { phone: customPhone, customMessage }, 'custom');
  };

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <CreditCard className="h-8 w-8 text-amber-600 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-1">Payment Reminders</h3>
          <p className="text-sm text-gray-500 mb-4">
            Send reminders to all {pendingPayments.length} patients with outstanding bills.
          </p>
          <button
            onClick={() => send('bulk_payment_reminders', {}, 'bulk')}
            disabled={sending === 'bulk'}
            className="btn-primary text-sm w-full justify-center disabled:opacity-60"
          >
            {sending === 'bulk' ? 'Sending...' : `Send to ${pendingPayments.length} Patients`}
          </button>
        </div>
        <div className="card text-center">
          <Bell className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-1">Appointment Reminders</h3>
          <p className="text-sm text-gray-500 mb-4">
            {upcomingAppointments.length} upcoming appointments eligible for reminders.
          </p>
          <p className="text-xs text-gray-400">Select individual appointments below</p>
        </div>
        <div className="card text-center">
          <Users className="h-8 w-8 text-primary-600 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-1">Total SMS Sent</h3>
          <p className="text-4xl font-bold text-primary-700 font-heading my-2">{smsLogs.length}</p>
          <p className="text-sm text-gray-500">messages logged</p>
        </div>
      </div>

      {/* Pending payment list */}
      {pendingPayments.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 font-heading mb-4">Pending Payment Patients</h2>
          <div className="space-y-2">
            {pendingPayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div>
                  <span className="font-medium text-gray-900">{p.appointment.patient.user.name}</span>
                  <span className="text-amber-700 text-sm ml-2">{formatCurrency(p.amount)}</span>
                  {p.appointment.patient.user.phone && (
                    <div className="text-xs text-gray-500">{p.appointment.patient.user.phone}</div>
                  )}
                </div>
                <button
                  onClick={() => send('payment_reminder', { targetId: p.id }, p.id)}
                  disabled={sending === p.id}
                  className="text-sm btn-secondary py-1.5 px-3"
                >
                  {sending === p.id ? '...' : <><MessageSquare className="h-3.5 w-3.5" /> Remind</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming appointments list */}
      {upcomingAppointments.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 font-heading mb-4">Upcoming Appointment Reminders</h2>
          <div className="space-y-2">
            {upcomingAppointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div>
                  <span className="font-medium text-gray-900">{a.patient.user.name}</span>
                  <span className="text-blue-700 text-sm ml-2">{a.type}</span>
                  <div className="text-xs text-gray-500">
                    {formatDate(a.date)} at {a.time} · {a.doctor.user.name}
                  </div>
                </div>
                <button
                  onClick={() => send('appointment_reminder', { targetId: a.id }, a.id)}
                  disabled={sending === a.id}
                  className="text-sm btn-secondary py-1.5 px-3"
                >
                  {sending === a.id ? '...' : <><Bell className="h-3.5 w-3.5" /> Remind</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom SMS */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 font-heading mb-4">Send Custom Message</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Phone Number</label>
            <input
              type="tel"
              placeholder="+971-50-xxx-xxxx"
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea
              rows={4}
              placeholder="Type your message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="input-field resize-none"
              maxLength={160}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{customMessage.length}/160 characters</p>
          </div>
          <button
            onClick={sendCustom}
            disabled={sending === 'custom'}
            className="btn-primary disabled:opacity-60"
          >
            {sending === 'custom' ? 'Sending...' : <><Send className="h-4 w-4" /> Send Message</>}
          </button>
        </div>
      </div>

      {/* SMS Log */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 font-heading mb-4">SMS History</h2>
        {smsLogs.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">No SMS sent yet.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {smsLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl text-sm">
                {log.status.startsWith('SENT') || log.status === 'SKIPPED_NO_CONFIG' ? (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">To: {log.to}</div>
                  <div className="text-gray-600 text-xs mt-0.5 line-clamp-2">{log.message}</div>
                  <div className="text-gray-400 text-xs mt-1">{formatDateTime(log.createdAt)}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  log.status.startsWith('SENT') || log.status === 'SKIPPED_NO_CONFIG'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {log.status.startsWith('SENT') ? 'Sent' : log.status === 'SKIPPED_NO_CONFIG' ? 'Logged' : 'Failed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
