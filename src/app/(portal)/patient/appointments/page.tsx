import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import { AppointmentActions } from '@/components/appointment/AppointmentActions';

export const metadata = { title: 'My Appointments' };

export default async function PatientAppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'PATIENT') redirect('/auth/login');

  const appointments = await prisma.appointment.findMany({
    where: { patientId: session.user.patientId },
    include: {
      doctor: { include: { user: true } },
      payment: true,
    },
    orderBy: [{ date: 'desc' }, { time: 'desc' }],
  });

  const upcoming = appointments.filter(a =>
    new Date(a.date) >= new Date() && ['CONFIRMED', 'PENDING'].includes(a.status)
  );
  const past = appointments.filter(a =>
    new Date(a.date) < new Date() || ['COMPLETED', 'CANCELLED'].includes(a.status)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-heading">My Appointments</h1>
          <p className="text-gray-500 mt-1">{appointments.length} total appointments</p>
        </div>
        <Link href="/patient/book" className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Book New
        </Link>
      </div>

      {/* Upcoming */}
      <div className="card mb-6">
        <h2 className="text-lg font-bold text-gray-900 font-heading mb-5">
          Upcoming ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <div className="text-center py-10">
            <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming appointments</p>
            <Link href="/patient/book" className="btn-primary mt-4 text-sm">Book Appointment</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((appt) => (
              <div key={appt.id} className="border border-gray-100 rounded-xl p-5 hover:border-primary-200 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-600 text-white rounded-xl p-3 text-center min-w-[60px]">
                      <div className="text-xs">{new Date(appt.date).toLocaleDateString('en', { month: 'short' })}</div>
                      <div className="text-2xl font-bold font-heading leading-tight">{new Date(appt.date).getDate()}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{appt.type}</div>
                      <div className="text-sm text-gray-500">
                        {appt.doctor.user.name} · {formatTime(appt.time)}
                      </div>
                      <div className="text-sm text-gray-400 mt-0.5">{appt.doctor.specialization}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={appt.status} />
                    <AppointmentActions appointmentId={appt.id} status={appt.status} role="PATIENT" />
                  </div>
                </div>
                {appt.payment && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Fee: <strong>{formatCurrency(appt.payment.amount)}</strong>
                    </span>
                    <StatusBadge status={appt.payment.status} />
                  </div>
                )}
                {appt.notes && (
                  <div className="mt-2 text-sm text-gray-500 italic">Note: {appt.notes}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      {past.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 font-heading mb-5">
            History ({past.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Treatment</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {past.map((appt) => (
                  <tr key={appt.id}>
                    <td className="text-sm">{formatDate(appt.date)}</td>
                    <td className="font-medium">{appt.type}</td>
                    <td className="text-sm text-gray-600">{appt.doctor.user.name}</td>
                    <td className="text-sm text-gray-600">{formatTime(appt.time)}</td>
                    <td><StatusBadge status={appt.status} /></td>
                    <td>
                      {appt.payment
                        ? <StatusBadge status={appt.payment.status} />
                        : <span className="text-gray-400 text-sm">—</span>
                      }
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
