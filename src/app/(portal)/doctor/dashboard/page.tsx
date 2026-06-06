import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Calendar, Users, CheckCircle, Clock, ArrowRight, ToggleLeft } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, formatTime } from '@/lib/utils';
import { DoctorAvailabilityToggle } from '@/components/doctor/DoctorAvailabilityToggle';

export const metadata = { title: 'Doctor Dashboard' };

export default async function DoctorDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'DOCTOR') redirect('/auth/login');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [doctor, todayAppts, upcomingAppts, totalPatients] = await Promise.all([
    prisma.doctor.findUnique({
      where: { id: session.user.doctorId },
      include: { user: true },
    }),
    prisma.appointment.findMany({
      where: {
        doctorId: session.user.doctorId,
        date: { gte: today, lt: tomorrow },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      include: { patient: { include: { user: true } }, payment: true },
      orderBy: { time: 'asc' },
    }),
    prisma.appointment.findMany({
      where: {
        doctorId: session.user.doctorId,
        date: { gte: tomorrow },
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      include: { patient: { include: { user: true } } },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      take: 5,
    }),
    prisma.appointment.findMany({
      where: { doctorId: session.user.doctorId },
      select: { patientId: true },
      distinct: ['patientId'],
    }),
  ]);

  const completedTotal = await prisma.appointment.count({
    where: { doctorId: session.user.doctorId, status: 'COMPLETED' },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-heading">
            Good day, {session.user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">{doctor?.specialization}</p>
        </div>
        {doctor && (
          <DoctorAvailabilityToggle
            doctorId={doctor.id}
            initialAvailable={doctor.isAvailable}
          />
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Patients", value: todayAppts.length, icon: Calendar, color: 'text-primary-600 bg-primary-100' },
          { label: 'Upcoming', value: upcomingAppts.length, icon: Clock, color: 'text-blue-600 bg-blue-100' },
          { label: 'Total Patients', value: totalPatients.length, icon: Users, color: 'text-purple-600 bg-purple-100' },
          { label: 'Completed', value: completedTotal, icon: CheckCircle, color: 'text-green-600 bg-green-100' },
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

      {/* Today's schedule */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 font-heading">Today's Schedule</h2>
          <span className="text-sm text-gray-500">{today.toDateString()}</span>
        </div>

        {todayAppts.length === 0 ? (
          <div className="text-center py-10">
            <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No appointments today</p>
            <p className="text-gray-400 text-sm">Enjoy your free day!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppts.map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-primary-100 text-primary-700 rounded-xl px-3 py-2 text-center min-w-[70px]">
                  <div className="font-bold text-lg font-heading">{appt.time}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{appt.patient.user.name}</div>
                  <div className="text-sm text-gray-500">{appt.type}</div>
                  {appt.patient.user.phone && (
                    <div className="text-xs text-gray-400">{appt.patient.user.phone}</div>
                  )}
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming */}
      {upcomingAppts.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 font-heading">Upcoming Appointments</h2>
            <Link href="/doctor/appointments" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Treatment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppts.map((appt) => (
                  <tr key={appt.id}>
                    <td className="text-sm">{formatDate(appt.date)}</td>
                    <td className="text-sm">{formatTime(appt.time)}</td>
                    <td className="font-medium">{appt.patient.user.name}</td>
                    <td className="text-sm text-gray-600">{appt.type}</td>
                    <td><StatusBadge status={appt.status} /></td>
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
