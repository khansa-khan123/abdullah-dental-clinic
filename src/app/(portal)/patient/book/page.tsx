import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { BookingForm } from '@/components/appointment/BookingForm';

export const metadata: Metadata = { title: 'Book Appointment' };

async function getDoctors() {
  return prisma.doctor.findMany({
    where: { isAvailable: true },
    include: {
      user: { select: { name: true } },
      schedules: { where: { isAvailable: true }, orderBy: { dayOfWeek: 'asc' } },
    },
  });
}

export default async function BookPage() {
  const doctors = await getDoctors();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">Book an Appointment</h1>
        <p className="text-gray-500 mt-1">Choose your preferred doctor, date and time.</p>
      </div>
      <BookingForm doctors={doctors} />
    </div>
  );
}
