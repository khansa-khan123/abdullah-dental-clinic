import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, dateOfBirth, address } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'Name, email, phone and password are required.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'PATIENT',
        patient: {
          create: {
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            address: address || null,
          },
        },
      },
    });

    return NextResponse.json({ message: 'Account created successfully.', userId: user.id }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
