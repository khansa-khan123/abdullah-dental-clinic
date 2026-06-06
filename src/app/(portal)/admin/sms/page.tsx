import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminSMSClient } from '@/components/admin/AdminSMSClient';

export const metadata = { title: 'SMS Notifications — Admin' };

export default async function AdminSMSPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/auth/login');

  const [smsLogs, pendingPayments, upcomingAppointments] = await Promise.all([
    prisma.sMSLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.payment.findMany({
      where: { status: { in: ['PENDING', 'PARTIAL'] } },
      include: { appointment: { include: { patient: { include: { user: true } } } } },
      take: 20,
    }),
    prisma.appointment.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PENDING'] },
        date: { gte: new Date() },
      },
      include: { patient: { include: { user: true } }, doctor: { include: { user: true } } },
      orderBy: { date: 'asc' },
      take: 20,
    }),
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">SMS Notifications</h1>
        <p className="text-gray-500 mt-1">Send manual SMS alerts and view message history.</p>
      </div>
      <AdminSMSClient smsLogs={smsLogs} pendingPayments={pendingPayments} upcomingAppointments={upcomingAppointments} />
    </div>
  );
}
