import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/Badge';

export const metadata = { title: 'My Patients' };

export default async function DoctorPatientsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'DOCTOR') redirect('/auth/login');

  // Get unique patients who have had appointments with this doctor
  const appointments = await prisma.appointment.findMany({
    where: { doctorId: session.user.doctorId },
    include: {
      patient: { include: { user: true } },
      payment: true,
    },
    orderBy: { date: 'desc' },
  });

  // Group by patient
  const patientMap = new Map<string, { patient: typeof appointments[0]['patient']; visits: typeof appointments }>();
  for (const appt of appointments) {
    const pid = appt.patientId;
    if (!patientMap.has(pid)) {
      patientMap.set(pid, { patient: appt.patient, visits: [] });
    }
    patientMap.get(pid)!.visits.push(appt);
  }

  const patients = Array.from(patientMap.values());

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">My Patients</h1>
        <p className="text-gray-500 mt-1">{patients.length} unique patients</p>
      </div>

      {patients.length === 0 ? (
        <div className="card text-center py-16">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No patients yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {patients.map(({ patient, visits }) => (
            <div key={patient.id} className="card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-5 flex-wrap">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600 flex-shrink-0">
                  {patient.user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <h3 className="font-bold text-gray-900">{patient.user.name}</h3>
                    <span className="text-xs text-gray-500">{visits.length} visit{visits.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">{patient.user.email}</div>
                  {patient.user.phone && (
                    <a href={`tel:${patient.user.phone}`} className="text-sm text-primary-600 hover:underline">
                      {patient.user.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Recent visits */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Visits</p>
                <div className="space-y-2">
                  {visits.slice(0, 3).map((v) => (
                    <div key={v.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{v.type} · {formatDate(v.date)}</span>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={v.status} />
                        {v.payment && <StatusBadge status={v.payment.status} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
