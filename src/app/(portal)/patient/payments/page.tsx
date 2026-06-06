import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AlertTriangle, CheckCircle, CreditCard } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';

export const metadata = { title: 'My Payments' };

export default async function PatientPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'PATIENT') redirect('/auth/login');

  const payments = await prisma.payment.findMany({
    where: { appointment: { patientId: session.user.patientId } },
    include: {
      appointment: {
        include: { doctor: { include: { user: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const pending = payments.filter(p => ['PENDING', 'PARTIAL'].includes(p.status));
  const paid = payments.filter(p => p.status === 'PAID');
  const totalPending = pending.reduce((s, p) => s + p.amount, 0);
  const totalPaid = paid.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">My Payments</h1>
        <p className="text-gray-500 mt-1">Track your dental care payments and billing history.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <CreditCard className="h-7 w-7 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 font-heading">{formatCurrency(totalPaid)}</div>
          <div className="text-sm text-gray-500">Total Paid</div>
        </div>
        <div className="card text-center border-amber-200 bg-amber-50">
          <AlertTriangle className="h-7 w-7 text-amber-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-amber-700 font-heading">{formatCurrency(totalPending)}</div>
          <div className="text-sm text-amber-600">Pending Balance</div>
        </div>
        <div className="card text-center">
          <CheckCircle className="h-7 w-7 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 font-heading">{paid.length}</div>
          <div className="text-sm text-gray-500">Paid Invoices</div>
        </div>
      </div>

      {/* Pending alert */}
      {pending.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-800 mb-1">Action Required: Pending Payment</h3>
              <p className="text-amber-700 text-sm mb-3">
                You have <strong>{pending.length} outstanding payment{pending.length > 1 ? 's' : ''}</strong> totalling{' '}
                <strong>{formatCurrency(totalPending)}</strong>. Please contact our clinic to settle your balance.
              </p>
              <a href="tel:+97141234567" className="text-sm font-semibold text-amber-700 hover:text-amber-800 underline">
                📞 Call +971-4-123-4567 to pay
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Payment list */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 font-heading mb-5">Payment History</h2>
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No payment records yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className={`p-5 rounded-xl border-2 ${
                  payment.status === 'PENDING' || payment.status === 'PARTIAL'
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-semibold text-gray-900">{payment.appointment.type}</div>
                    <div className="text-sm text-gray-500">
                      {payment.appointment.doctor.user.name} · {formatDate(payment.appointment.date)}
                    </div>
                    {payment.dueDate && payment.status !== 'PAID' && (
                      <div className="text-xs text-amber-600 mt-1 font-medium">
                        Due: {formatDate(payment.dueDate)}
                      </div>
                    )}
                    {payment.paidAt && (
                      <div className="text-xs text-green-600 mt-1">
                        Paid on {formatDate(payment.paidAt)}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900 font-heading">
                      {formatCurrency(payment.amount)}
                    </div>
                    <StatusBadge status={payment.status} className="mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
