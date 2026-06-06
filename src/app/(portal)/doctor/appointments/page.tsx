import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Calendar } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, formatTime } from '@/lib/utils';
import { AppointmentActions } from '@/components/appointment/AppointmentActions';

export const metadata = { title: 'Doctor Appointments' };

export default async function DoctorAppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'DOCTOR') redirect('/auth/login');

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: session.user.doctorId },
    include: {
      patient: { include: { user: true } },
      payment: true,
    },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  });

  const grouped = appointments.reduce((acc, appt) => {
    const dateStr = formatDate(appt.date);
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(appt);
    return acc;
  }, {} as Record<string, typeof appointments>);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">Appointments</h1>
        <p className="text-gray-500 mt-1">{appointments.length} total appointments</p>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="card text-center py-16">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No appointments found</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, appts]) => (
          <div key={date} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{date}</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="space-y-3">
              {appts.map((appt) => (
                <div key={appt.id} className="card p-4 flex items-center gap-4 flex-wrap">
                  <div className="bg-primary-100 text-primary-700 rounded-xl px-3 py-2 text-center min-w-[70px]">
                    <div className="font-bold text-lg font-heading leading-tight">{appt.time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{appt.patient.user.name}</div>
                    <div className="text-sm text-gray-500">{appt.type}</div>
                    {appt.patient.user.phone && (
                      <a href={`tel:${appt.patient.user.phone}`} className="text-xs text-primary-500 hover:underline">
                        {appt.patient.user.phone}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={appt.status} />
                    {appt.payment && <StatusBadge status={appt.payment.status} />}
                    <AppointmentActions appointmentId={appt.id} status={appt.status} role="DOCTOR" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
