import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminDoctorsClient } from '@/components/admin/AdminDoctorsClient';

export const metadata = { title: 'Doctors — Admin' };

export default async function AdminDoctorsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/auth/login');

  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
      schedules: { orderBy: { dayOfWeek: 'asc' } },
      _count: { select: { appointments: true } },
    },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">Doctors</h1>
        <p className="text-gray-500 mt-1">{doctors.length} doctors registered</p>
      </div>
      <AdminDoctorsClient doctors={doctors} />
    </div>
  );
}
