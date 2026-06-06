import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendSMS, sendPaymentReminder, sendAppointmentReminder } from '@/lib/sms';
import { formatDate, formatTime } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, targetId, customMessage, phone } = await req.json();

    if (type === 'custom' && phone && customMessage) {
      const ok = await sendSMS(phone, customMessage);
      return NextResponse.json({ success: ok });
    }

    if (type === 'payment_reminder' && targetId) {
      const payment = await prisma.payment.findUnique({
        where: { id: targetId },
        include: { appointment: { include: { patient: { include: { user: true } } } } },
      });
      if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
      const user = payment.appointment.patient.user;
      if (!user.phone) return NextResponse.json({ error: 'No phone number on file' }, { status: 400 });
      await sendPaymentReminder(user.phone, user.name, payment.amount);
      return NextResponse.json({ success: true });
    }

    if (type === 'appointment_reminder' && targetId) {
      const appt = await prisma.appointment.findUnique({
        where: { id: targetId },
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true } },
        },
      });
      if (!appt) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      const userPhone = appt.patient.user.phone;
      if (!userPhone) return NextResponse.json({ error: 'No phone number on file' }, { status: 400 });
      await sendAppointmentReminder(
        userPhone,
        appt.patient.user.name,
        appt.doctor.user.name,
        formatDate(appt.date),
        formatTime(appt.time)
      );
      return NextResponse.json({ success: true });
    }

    // Bulk payment reminders
    if (type === 'bulk_payment_reminders') {
      const pendingPayments = await prisma.payment.findMany({
        where: { status: { in: ['PENDING', 'PARTIAL'] } },
        include: { appointment: { include: { patient: { include: { user: true } } } } },
      });

      let sent = 0;
      for (const p of pendingPayments) {
        const phone = p.appointment.patient.user.phone;
        if (phone) {
          await sendPaymentReminder(phone, p.appointment.patient.user.name, p.amount);
          sent++;
        }
      }
      return NextResponse.json({ success: true, sent });
    }

    return NextResponse.json({ error: 'Invalid SMS type' }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await prisma.sMSLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
