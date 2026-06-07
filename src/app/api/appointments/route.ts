import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { sendAppointmentConfirmation } from '@/lib/sms';
import { formatDate, formatTime } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');

    let where: any = {};

    if (session.user.role === 'PATIENT') {
      where.patientId = session.user.patientId;
    } else if (session.user.role === 'DOCTOR') {
      where.doctorId = session.user.doctorId;
    }

    if (status) where.status = status;
    if (patientId && session.user.role === 'ADMIN') where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      where.date = { gte: d, lt: next };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: { include: { user: { select: { name: true, email: true, phone: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        payment: true,
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { doctorId, date, time, type, notes, patientId: bodyPatientId } = body;

    if (!doctorId || !date || !time || !type) {
      return NextResponse.json({ error: 'Doctor, date, time and type are required.' }, { status: 400 });
    }

    // Determine patient
    let resolvedPatientId = session.user.patientId;
    if (session.user.role === 'ADMIN' && bodyPatientId) {
      resolvedPatientId = bodyPatientId;
    }

    if (!resolvedPatientId) {
      return NextResponse.json({ error: 'No patient profile found.' }, { status: 400 });
    }

    // Check for existing appointment at same time
    const appointmentDate = new Date(date);
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: appointmentDate,
        time,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (conflict) {
      return NextResponse.json({ error: 'This time slot is already booked. Please choose another time.' }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: resolvedPatientId,
        doctorId,
        date: appointmentDate,
        time,
        type,
        notes: notes || null,
        status: 'CONFIRMED',
        payment: {
          create: {
            amount: getServicePrice(type),
            status: 'PENDING',
            dueDate: new Date(appointmentDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        payment: true,
      },
    });

    // Send SMS confirmation
    if (appointment.patient.user.phone) {
      await sendAppointmentConfirmation(
        appointment.patient.user.phone,
        appointment.patient.user.name,
        appointment.doctor.user.name,
        formatDate(appointment.date),
        formatTime(appointment.time)
      );
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getServicePrice(type: string): number {
  const prices: Record<string, number> = {
    'General Checkup': 150,
    'Teeth Cleaning': 100,
    'Tooth Extraction': 300,
    'Orthodontic Consultation': 200,
    'Root Canal': 800,
    'Dental Implant': 4500,
    'Teeth Whitening': 500,
    'Filling': 200,
    'Crown & Bridge': 1500,
    'Emergency Visit': 350,
  };
  return prices[type] || 200;
}
