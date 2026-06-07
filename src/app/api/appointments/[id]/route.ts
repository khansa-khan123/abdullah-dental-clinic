import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  sendAppointmentConfirmation,
  sendAppointmentCancellation,
} from '@/lib/sms';
import { formatDate, formatTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        payment: true,
      },
    });

    if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Access control
    if (
      session.user.role === 'PATIENT' && appointment.patientId !== session.user.patientId ||
      session.user.role === 'DOCTOR' && appointment.doctorId !== session.user.doctorId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { status, notes, date, time, type } = body;

    const existing = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: { patient: { include: { user: true } }, doctor: { include: { user: true } } },
    });

    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Patients can only cancel their own
    if (session.user.role === 'PATIENT') {
      if (existing.patientId !== session.user.patientId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (status && status !== 'CANCELLED') {
        return NextResponse.json({ error: 'Patients can only cancel appointments.' }, { status: 403 });
      }
    }

    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(date && { date: new Date(date) }),
        ...(time && { time }),
        ...(type && { type }),
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        payment: true,
      },
    });

    // Send SMS on status change
    const phone = updated.patient.user.phone;
    if (phone && status && status !== existing.status) {
      if (status === 'CONFIRMED') {
        await sendAppointmentConfirmation(
          phone,
          updated.patient.user.name,
          updated.doctor.user.name,
          formatDate(updated.date),
          formatTime(updated.time)
        );
      } else if (status === 'CANCELLED') {
        await sendAppointmentCancellation(
          phone,
          updated.patient.user.name,
          formatDate(updated.date),
          formatTime(updated.time)
        );
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.appointment.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
