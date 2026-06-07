import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalPatients,
      todayAppointments,
      pendingPaymentsData,
      monthlyRevenueData,
      confirmedAppointments,
      pendingAppointments,
      totalAppointments,
      completedAppointments,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.appointment.count({ where: { date: { gte: startOfDay, lt: new Date(startOfDay.getTime() + 86400000) } } }),
      prisma.payment.findMany({ where: { status: { in: ['PENDING', 'PARTIAL'] } } }),
      prisma.payment.findMany({ where: { status: 'PAID', paidAt: { gte: startOfMonth } } }),
      prisma.appointment.count({ where: { status: 'CONFIRMED' } }),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'COMPLETED' } }),
    ]);

    const pendingPayments = pendingPaymentsData.reduce((s, p) => s + p.amount, 0);
    const monthlyRevenue = monthlyRevenueData.reduce((s, p) => s + p.amount, 0);

    return NextResponse.json({
      totalPatients,
      todayAppointments,
      pendingPayments,
      pendingPaymentsCount: pendingPaymentsData.length,
      monthlyRevenue,
      confirmedAppointments,
      pendingAppointments,
      totalAppointments,
      completedAppointments,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
