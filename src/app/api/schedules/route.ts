import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');

    if (!doctorId) return NextResponse.json({ error: 'doctorId required' }, { status: 400 });

    const schedules = await prisma.schedule.findMany({
      where: { doctorId },
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'DOCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { schedules, doctorId } = await req.json();
    const targetDoctorId = doctorId || session.user.doctorId;

    if (!targetDoctorId) return NextResponse.json({ error: 'No doctor ID' }, { status: 400 });

    // Delete existing and recreate
    await prisma.schedule.deleteMany({ where: { doctorId: targetDoctorId } });

    const created = await prisma.schedule.createMany({
      data: schedules.map((s: any) => ({
        doctorId: targetDoctorId,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        isAvailable: s.isAvailable,
      })),
    });

    return NextResponse.json({ success: true, count: created.count });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
