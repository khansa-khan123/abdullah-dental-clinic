import { Role, AppointmentStatus, PaymentStatus } from '@prisma/client';

export type { Role, AppointmentStatus, PaymentStatus };

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  patientId?: string;
  doctorId?: string;
}

export interface DoctorWithUser {
  id: string;
  specialization: string;
  bio: string | null;
  avatar: string | null;
  isAvailable: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  schedules?: ScheduleData[];
}

export interface PatientWithUser {
  id: string;
  dateOfBirth: Date | null;
  address: string | null;
  medicalHistory: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export interface AppointmentWithDetails {
  id: string;
  date: Date;
  time: string;
  status: AppointmentStatus;
  type: string;
  notes: string | null;
  createdAt: Date;
  patient: {
    id: string;
    user: { name: string; email: string; phone: string | null };
  };
  doctor: {
    id: string;
    specialization: string;
    user: { name: string };
  };
  payment: PaymentData | null;
}

export interface PaymentData {
  id: string;
  amount: number;
  status: PaymentStatus;
  dueDate: Date | null;
  paidAt: Date | null;
}

export interface ScheduleData {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingPayments: number;
  monthlyRevenue: number;
  confirmedAppointments: number;
  pendingAppointments: number;
}
