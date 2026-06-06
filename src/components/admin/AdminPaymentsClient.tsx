'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, AlertCircle, CheckCircle, MessageSquare, CreditCard } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { showToast } from '@/components/ui/Toaster';

interface Payment {
  id: string;
  amount: number;
  status: string;
  dueDate: Date | null;
  paidAt: Date | null;
  createdAt: Date;
  appointment: {
    id: string;
    type: string;
    date: Date;
    patient: { user: { name: string; phone: string | null } };
    doctor: { user: { name: string } };
  };
}

interface Props {
  payments: Payment[];
  totalRevenue: number;
  totalPending: number;
}

export function AdminPaymentsClient({ payments, totalRevenue, totalPending }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [updating, setUpdating] = useState<string | null>(null);
  const [sendingSms, setSendingSms] = useState<string | null>(null);

  const filtered = payments.filter(p => {
    const matchSearch =
      p.appointment.patient.user.name.toLowerCase().includes(search.toLowerCase()) ||
      p.appointment.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (paymentId: string, status: string) => {
    setUpdating(paymentId);
    try {
      const res = await fetch('/api/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Updated', `Payment marked as ${status.toLowerCase()}.`);
      router.refresh();
    } catch {
      showToast('error', 'Error', 'Could not update payment.');
    } finally {
      setUpdating(null);
    }
  };

  const sendReminder = async (paymentId: string) => {
    setSendingSms(paymentId);
    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'payment_reminder', targetId: paymentId }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'SMS Sent', 'Payment reminder sent to patient.');
    } catch {
      showToast('error', 'Error', 'Could not send SMS.');
    } finally {
      setSendingSms(null);
    }
  };

  const sendBulkReminders = async () => {
    try {
      const res = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bulk_payment_reminders' }),
      });
      const data = await res.json();
      showToast('success', 'Bulk SMS Sent', `${data.sent} reminders sent successfully.`);
    } catch {
      showToast('error', 'Error', 'Could not send bulk SMS.');
    }
  };

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 font-heading">{formatCurrency(totalRevenue)}</div>
          <div className="text-sm text-gray-500">Total Collected</div>
        </div>
        <div className="card text-center border-amber-200 bg-amber-50">
          <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-amber-700 font-heading">{formatCurrency(totalPending)}</div>
          <div className="text-sm text-amber-600">Outstanding Balance</div>
        </div>
        <div className="card text-center">
          <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 font-heading">
            {payments.filter(p => p.status === 'PAID').length}
          </div>
          <div className="text-sm text-gray-500">Paid Invoices</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient or treatment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field w-40 py-2 text-sm"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="PARTIAL">Partial</option>
          <option value="PAID">Paid</option>
        </select>
        <button
          onClick={sendBulkReminders}
          className="btn-secondary text-sm py-2"
        >
          <MessageSquare className="h-4 w-4" /> Send All Reminders
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Treatment</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due / Paid</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-10 text-gray-500">No payments found</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className={p.status !== 'PAID' ? 'bg-amber-50/30' : ''}>
                    <td>
                      <div className="font-medium">{p.appointment.patient.user.name}</div>
                      <div className="text-xs text-gray-500">{p.appointment.patient.user.phone || '—'}</div>
                    </td>
                    <td className="text-sm text-gray-600">{p.appointment.type}</td>
                    <td className="text-sm text-gray-600">{p.appointment.doctor.user.name}</td>
                    <td className="text-sm">{formatDate(p.appointment.date)}</td>
                    <td className="font-bold text-gray-900">{formatCurrency(p.amount)}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className="text-sm text-gray-600">
                      {p.status === 'PAID' && p.paidAt
                        ? <span className="text-green-600">{formatDate(p.paidAt)}</span>
                        : p.dueDate
                          ? <span className={new Date(p.dueDate) < new Date() ? 'text-red-600 font-medium' : 'text-gray-600'}>
                              Due {formatDate(p.dueDate)}
                            </span>
                          : '—'
                      }
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {p.status !== 'PAID' && (
                          <>
                            <button
                              onClick={() => updateStatus(p.id, 'PAID')}
                              disabled={updating === p.id}
                              className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-medium transition-colors"
                            >
                              {updating === p.id ? '...' : 'Mark Paid'}
                            </button>
                            {p.status !== 'PARTIAL' && (
                              <button
                                onClick={() => updateStatus(p.id, 'PARTIAL')}
                                disabled={updating === p.id}
                                className="text-xs px-2 py-1 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-medium transition-colors"
                              >
                                Partial
                              </button>
                            )}
                            <button
                              onClick={() => sendReminder(p.id)}
                              disabled={sendingSms === p.id}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Send payment reminder SMS"
                            >
                              {sendingSms === p.id
                                ? <span className="w-3.5 h-3.5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin block" />
                                : <MessageSquare className="h-3.5 w-3.5" />
                              }
                            </button>
                          </>
                        )}
                        {p.status === 'PAID' && (
                          <button
                            onClick={() => updateStatus(p.id, 'PENDING')}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                          >
                            Revert
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
