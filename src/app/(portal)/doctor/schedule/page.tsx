import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ScheduleEditor } from '@/components/doctor/ScheduleEditor';

export const metadata = { title: 'My Schedule' };

export default async function DoctorSchedulePage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'DOCTOR') redirect('/auth/login');

  const schedules = await prisma.schedule.findMany({
    where: { doctorId: session.user.doctorId },
    orderBy: { dayOfWeek: 'asc' },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">My Schedule</h1>
        <p className="text-gray-500 mt-1">Set your working days and hours for patient bookings.</p>
      </div>
      <ScheduleEditor doctorId={session.user.doctorId} initialSchedules={schedules} />
    </div>
  );
}
