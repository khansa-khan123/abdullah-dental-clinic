import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Users } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/Badge';
import { AdminPatientsClient } from '@/components/admin/AdminPatientsClient';

export const metadata = { title: 'Patients — Admin' };

export default async function AdminPatientsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/auth/login');

  const patients = await prisma.patient.findMany({
    include: {
      user: true,
      _count: { select: { appointments: true } },
      appointments: {
        include: { payment: true },
        orderBy: { date: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">Patients</h1>
        <p className="text-gray-500 mt-1">{patients.length} registered patients</p>
      </div>
      <AdminPatientsClient patients={patients} />
    </div>
  );
}
