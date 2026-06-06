import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminPaymentsClient } from '@/components/admin/AdminPaymentsClient';

export const metadata = { title: 'Payments — Admin' };

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/auth/login');

  const payments = await prisma.payment.findMany({
    include: {
      appointment: {
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalRevenue = payments.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status !== 'PAID').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">Payments</h1>
        <p className="text-gray-500 mt-1">{payments.length} payment records</p>
      </div>
      <AdminPaymentsClient payments={payments} totalRevenue={totalRevenue} totalPending={totalPending} />
    </div>
  );
}
