import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendPaymentReminder } from '@/lib/sms';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let where: any = {};

    if (session.user.role === 'PATIENT') {
      where.appointment = { patientId: session.user.patientId };
    }

    if (status) where.status = status;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        appointment: {
          include: {
            patient: { include: { user: { select: { name: true, email: true, phone: true } } } },
            doctor: { include: { user: { select: { name: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId, status, amount } = await req.json();

    if (!paymentId) return NextResponse.json({ error: 'paymentId required' }, { status: 400 });

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        ...(amount && { amount }),
        ...(status === 'PAID' && { paidAt: new Date() }),
        ...(status !== 'PAID' && { paidAt: null }),
      },
      include: {
        appointment: {
          include: {
            patient: { include: { user: true } },
          },
        },
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
