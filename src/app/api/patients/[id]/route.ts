import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Allow admin or the patient themselves
    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        appointments: {
          include: {
            doctor: { include: { user: true } },
            payment: true,
          },
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

    if (session.user.role !== 'ADMIN' && session.user.patientId !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (session.user.role !== 'ADMIN' && session.user.patientId !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, phone, dateOfBirth, address, medicalHistory } = body;

    const patient = await prisma.patient.update({
      where: { id: params.id },
      data: {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address,
        medicalHistory,
        user: { update: { name, phone } },
      },
      include: { user: true },
    });

    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patient = await prisma.patient.findUnique({ where: { id: params.id } });
    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

    await prisma.user.delete({ where: { id: patient.userId } });

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
