import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  Users, Calendar, CreditCard, TrendingUp, AlertCircle,
  CheckCircle, Clock, ArrowRight, Activity
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';

export const metadata = { title: 'Admin Dashboard' };

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/auth/login');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalPatients, totalDoctors,
    todayAppts, pendingAppts, confirmedAppts,
    pendingPayments, paidThisMonth,
    recentAppointments,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.appointment.count({ where: { date: { gte: today, lt: new Date(today.getTime() + 86400000) } } }),
    prisma.appointment.count({ where: { status: 'PENDING' } }),
    prisma.appointment.count({ where: { status: 'CONFIRMED' } }),
    prisma.payment.aggregate({
      where: { status: { in: ['PENDING', 'PARTIAL'] } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.payment.aggregate({
      where: { status: 'PAID', paidAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.appointment.findMany({
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
  ]);

  const stats = [
    { label: 'Total Patients', value: totalPatients, icon: Users, color: 'bg-blue-100 text-blue-600', href: '/admin/patients' },
    { label: "Today's Appointments", value: todayAppts, icon: Calendar, color: 'bg-primary-100 text-primary-600', href: '/admin/appointments' },
    { label: 'Pending Payments', value: formatCurrency(pendingPayments._sum.amount || 0), icon: AlertCircle, color: 'bg-amber-100 text-amber-600', href: '/admin/payments' },
    { label: 'Monthly Revenue', value: formatCurrency(paidThisMonth._sum.amount || 0), icon: TrendingUp, color: 'bg-green-100 text-green-600', href: '/admin/payments' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Abdullah Dental Clinic — Overview</p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="card hover:shadow-card-hover transition-shadow group">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900 font-heading">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </Link>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Doctors', value: totalDoctors, icon: Activity },
          { label: 'Confirmed Appts', value: confirmedAppts, icon: CheckCircle },
          { label: 'Pending Appts', value: pendingAppts, icon: Clock },
          { label: 'Overdue Bills', value: pendingPayments._count, icon: CreditCard },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100">
            <Icon className="h-5 w-5 text-gray-500" />
            <div>
              <div className="font-bold text-gray-900">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 font-heading">Recent Appointments</h2>
          <Link href="/admin/appointments" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Treatment</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appt) => (
                <tr key={appt.id}>
                  <td className="font-medium">{appt.patient.user.name}</td>
                  <td className="text-sm text-gray-600">{appt.doctor.user.name}</td>
                  <td className="text-sm">{formatDate(appt.date)}</td>
                  <td className="text-sm">{formatTime(appt.time)}</td>
                  <td className="text-sm text-gray-600">{appt.type}</td>
                  <td><StatusBadge status={appt.status} /></td>
                  <td>
                    {appt.payment ? <StatusBadge status={appt.payment.status} /> : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
