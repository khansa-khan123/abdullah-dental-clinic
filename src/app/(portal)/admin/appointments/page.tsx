import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminAppointmentsClient } from '@/components/admin/AdminAppointmentsClient';

export const metadata = { title: 'Appointments — Admin' };

export default async function AdminAppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/auth/login');

  const [appointments, doctors, patients] = await Promise.all([
    prisma.appointment.findMany({
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        payment: true,
      },
      orderBy: [{ date: 'desc' }, { time: 'asc' }],
    }),
    prisma.doctor.findMany({ include: { user: { select: { name: true } } } }),
    prisma.patient.findMany({ include: { user: { select: { name: true } } } }),
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">Appointments</h1>
        <p className="text-gray-500 mt-1">{appointments.length} total appointments</p>
      </div>
      <AdminAppointmentsClient appointments={appointments} doctors={doctors} patients={patients} />
    </div>
  );
}
