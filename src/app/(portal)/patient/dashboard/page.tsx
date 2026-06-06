import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Calendar, CreditCard, Clock, AlertTriangle, CheckCircle, ArrowRight, Plus } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';

export const metadata = { title: 'Patient Dashboard' };

async function getPatientData(patientId: string) {
  const [appointments, pendingPayments] = await Promise.all([
    prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: { include: { user: true } },
        payment: true,
      },
      orderBy: { date: 'asc' },
      take: 10,
    }),
    prisma.payment.findMany({
      where: {
        status: { in: ['PENDING', 'PARTIAL'] },
        appointment: { patientId },
      },
      include: { appointment: { include: { doctor: { include: { user: true } } } } },
    }),
  ]);
  return { appointments, pendingPayments };
}

export default async function PatientDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'PATIENT') redirect('/auth/login');

  const { appointments, pendingPayments } = await getPatientData(session.user.patientId);

  const upcoming = appointments.filter(
    (a) => new Date(a.date) >= new Date() && ['CONFIRMED', 'PENDING'].includes(a.status)
  );
  const past = appointments.filter(
    (a) => new Date(a.date) < new Date() || a.status === 'COMPLETED' || a.status === 'CANCELLED'
  );

  const totalPending = pendingPayments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">
          Welcome, {session.user.name.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's an overview of your dental care.</p>
      </div>

      {/* Pending payment alert */}
      {pendingPayments.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800 mb-1">
              Pending Payment — {formatCurrency(totalPending)}
            </h3>
            <p className="text-amber-700 text-sm mb-3">
              You have {pendingPayments.length} outstanding payment{pendingPayments.length > 1 ? 's' : ''}.
              Please settle your balance to continue receiving services.
            </p>
            <Link href="/patient/payments" className="text-sm font-semibold text-amber-700 hover:text-amber-800 underline">
              View Payments →
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Upcoming', value: upcoming.length, icon: Calendar, color: 'text-primary-600 bg-primary-100' },
          { label: 'Completed', value: past.filter(a => a.status === 'COMPLETED').length, icon: CheckCircle, color: 'text-green-600 bg-green-100' },
          { label: 'Total Visits', value: appointments.length, icon: Clock, color: 'text-blue-600 bg-blue-100' },
          { label: 'Pending Bills', value: pendingPayments.length, icon: CreditCard, color: 'text-amber-600 bg-amber-100' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card text-center">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-gray-900 font-heading">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming appointments */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 font-heading">Upcoming Appointments</h2>
          <Link href="/patient/book" className="btn-primary text-sm py-2">
            <Plus className="h-4 w-4" /> Book New
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No upcoming appointments</p>
            <p className="text-gray-400 text-sm mt-1">Book your next visit with our experts</p>
            <Link href="/patient/book" className="btn-primary mt-4 text-sm">
              Book Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-primary-600 text-white rounded-xl p-3 text-center min-w-[64px]">
                  <div className="text-xs font-medium">
                    {new Date(appt.date).toLocaleDateString('en', { month: 'short' })}
                  </div>
                  <div className="text-2xl font-bold leading-tight font-heading">
                    {new Date(appt.date).getDate()}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{appt.type}</div>
                  <div className="text-sm text-gray-500">
                    {appt.doctor.user.name} · {formatTime(appt.time)}
                  </div>
                  {appt.payment && appt.payment.status !== 'PAID' && (
                    <div className="text-xs text-amber-600 mt-0.5 font-medium">
                      Payment {appt.payment.status.toLowerCase()} — {formatCurrency(appt.payment.amount)}
                    </div>
                  )}
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        )}

        {upcoming.length > 0 && (
          <Link href="/patient/appointments" className="flex items-center justify-center gap-2 mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all appointments <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Recent history */}
      {past.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 font-heading mb-5">Recent History</h2>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Treatment</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {past.slice(0, 5).map((appt) => (
                  <tr key={appt.id}>
                    <td className="text-gray-600 text-sm">{formatDate(appt.date)}</td>
                    <td className="font-medium">{appt.type}</td>
                    <td className="text-gray-600 text-sm">{appt.doctor.user.name}</td>
                    <td><StatusBadge status={appt.status} /></td>
                    <td>
                      {appt.payment ? (
                        <StatusBadge status={appt.payment.status} />
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
