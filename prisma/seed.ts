import { PrismaClient, Role, AppointmentStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Admin
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@abdullahdental.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@abdullahdental.com',
      password: adminPassword,
      role: Role.ADMIN,
      phone: '+1234567890',
    },
  });
  console.log('Admin created:', admin.email);

  // Create Doctors
  const doctorData = [
    {
      name: 'Dr. Abdullah Al-Hassan',
      email: 'dr.abdullah@abdullahdental.com',
      phone: '+1234567891',
      specialization: 'General Dentistry',
      bio: 'Dr. Abdullah has over 15 years of experience in general dentistry, providing comprehensive dental care to patients of all ages.',
      avatar: '/doctors/dr-abdullah.jpg',
    },
    {
      name: 'Dr. Sarah Mitchell',
      email: 'dr.sarah@abdullahdental.com',
      phone: '+1234567892',
      specialization: 'Orthodontics',
      bio: 'Dr. Sarah specializes in orthodontics and has helped thousands of patients achieve beautiful, straight smiles through braces and Invisalign treatments.',
      avatar: '/doctors/dr-sarah.jpg',
    },
    {
      name: 'Dr. James Peterson',
      email: 'dr.james@abdullahdental.com',
      phone: '+1234567893',
      specialization: 'Oral Surgery',
      bio: 'Dr. James is a highly skilled oral surgeon with expertise in wisdom tooth extraction, dental implants, and complex oral surgical procedures.',
      avatar: '/doctors/dr-james.jpg',
    },
  ];

  const doctors = [];
  for (const doc of doctorData) {
    const password = await bcrypt.hash('Doctor123!', 12);
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {},
      create: {
        name: doc.name,
        email: doc.email,
        password,
        role: Role.DOCTOR,
        phone: doc.phone,
        doctor: {
          create: {
            specialization: doc.specialization,
            bio: doc.bio,
            avatar: doc.avatar,
            isAvailable: true,
          },
        },
      },
      include: { doctor: true },
    });
    doctors.push(user.doctor!);
    console.log('Doctor created:', user.email);

    // Create schedules for each doctor (Mon-Fri)
    for (let day = 1; day <= 5; day++) {
      await prisma.schedule.upsert({
        where: { id: `schedule-${user.doctor!.id}-${day}` },
        update: {},
        create: {
          id: `schedule-${user.doctor!.id}-${day}`,
          doctorId: user.doctor!.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true,
        },
      });
    }
  }

  // Create Patients
  const patientData = [
    { name: 'Ahmed Al-Rashid', email: 'ahmed@example.com', phone: '+1555001001', dob: new Date('1990-05-15'), address: '123 Main St, Dubai, UAE' },
    { name: 'Fatima Khalid', email: 'fatima@example.com', phone: '+1555001002', dob: new Date('1985-08-22'), address: '456 Oak Ave, Abu Dhabi, UAE' },
    { name: 'Mohammed Ibrahim', email: 'mohammed@example.com', phone: '+1555001003', dob: new Date('1978-11-30'), address: '789 Pine Rd, Sharjah, UAE' },
    { name: 'Layla Hassan', email: 'layla@example.com', phone: '+1555001004', dob: new Date('1995-03-10'), address: '321 Elm St, Dubai, UAE' },
    { name: 'Omar Abdullah', email: 'omar@example.com', phone: '+1555001005', dob: new Date('1982-07-25'), address: '654 Maple Dr, Ajman, UAE' },
  ];

  const patients = [];
  for (const pat of patientData) {
    const password = await bcrypt.hash('Patient123!', 12);
    const user = await prisma.user.upsert({
      where: { email: pat.email },
      update: {},
      create: {
        name: pat.name,
        email: pat.email,
        password,
        role: Role.PATIENT,
        phone: pat.phone,
        patient: {
          create: {
            dateOfBirth: pat.dob,
            address: pat.address,
            medicalHistory: 'No significant medical history',
          },
        },
      },
      include: { patient: true },
    });
    patients.push(user.patient!);
    console.log('Patient created:', user.email);
  }

  // Create Sample Appointments
  const appointmentTypes = ['General Checkup', 'Teeth Cleaning', 'Tooth Extraction', 'Orthodontic Consultation', 'Root Canal'];
  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  const statuses = [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING, AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED];

  const appointmentData = [
    { patientIdx: 0, doctorIdx: 0, daysFromNow: 2, timeIdx: 0, typeIdx: 0, statusIdx: 0, amount: 150 },
    { patientIdx: 1, doctorIdx: 1, daysFromNow: 3, timeIdx: 1, typeIdx: 3, statusIdx: 0, amount: 200 },
    { patientIdx: 2, doctorIdx: 2, daysFromNow: 5, timeIdx: 2, typeIdx: 2, statusIdx: 1, amount: 300 },
    { patientIdx: 3, doctorIdx: 0, daysFromNow: -7, timeIdx: 3, typeIdx: 1, statusIdx: 2, amount: 100 },
    { patientIdx: 4, doctorIdx: 1, daysFromNow: -14, timeIdx: 4, typeIdx: 4, statusIdx: 2, amount: 800 },
    { patientIdx: 0, doctorIdx: 2, daysFromNow: -30, timeIdx: 5, typeIdx: 2, statusIdx: 3, amount: 250 },
    { patientIdx: 1, doctorIdx: 0, daysFromNow: 7, timeIdx: 0, typeIdx: 0, statusIdx: 0, amount: 150 },
    { patientIdx: 2, doctorIdx: 1, daysFromNow: 10, timeIdx: 1, typeIdx: 3, statusIdx: 1, amount: 200 },
  ];

  for (let i = 0; i < appointmentData.length; i++) {
    const appt = appointmentData[i];
    const date = new Date();
    date.setDate(date.getDate() + appt.daysFromNow);
    date.setHours(0, 0, 0, 0);

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patients[appt.patientIdx].id,
        doctorId: doctors[appt.doctorIdx].id,
        date,
        time: times[appt.timeIdx],
        status: statuses[appt.statusIdx],
        type: appointmentTypes[appt.typeIdx],
        notes: 'Patient notes for appointment ' + (i + 1),
      },
    });

    const paymentStatuses = [PaymentStatus.PAID, PaymentStatus.PENDING, PaymentStatus.PARTIAL];
    const paymentStatusIdx = appt.statusIdx === 2 ? 0 : appt.statusIdx === 1 ? 2 : 1;

    await prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: appt.amount,
        status: paymentStatuses[paymentStatusIdx],
        dueDate: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
        paidAt: paymentStatuses[paymentStatusIdx] === PaymentStatus.PAID ? new Date() : null,
      },
    });

    console.log('Appointment created:', appointment.id);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
