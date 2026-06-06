'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Trash2, Users, Phone, Mail, Calendar } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { showToast } from '@/components/ui/Toaster';
import { Modal } from '@/components/ui/Modal';

interface Patient {
  id: string;
  user: { name: string; email: string; phone: string | null };
  dateOfBirth: Date | null;
  address: string | null;
  _count: { appointments: number };
  appointments: { date: Date; type: string; status: string; payment: { status: string; amount: number } | null }[];
}

export function AdminPatientsClient({ patients }: { patients: Patient[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filtered = patients.filter(p =>
    p.user.name.toLowerCase().includes(search.toLowerCase()) ||
    p.user.email.toLowerCase().includes(search.toLowerCase()) ||
    (p.user.phone || '').includes(search)
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/patients/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('success', 'Deleted', 'Patient record removed.');
      setDeleteId(null);
      router.refresh();
    } catch {
      showToast('error', 'Error', 'Could not delete patient.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No patients found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>DOB</th>
                  <th>Visits</th>
                  <th>Last Visit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div>
                        <button
                          onClick={() => setSelectedPatient(p)}
                          className="font-semibold text-primary-700 hover:underline text-left"
                        >
                          {p.user.name}
                        </button>
                        <div className="text-xs text-gray-500">{p.user.email}</div>
                      </div>
                    </td>
                    <td className="text-sm text-gray-600">{p.user.phone || '—'}</td>
                    <td className="text-sm text-gray-600">{p.dateOfBirth ? formatDate(p.dateOfBirth) : '—'}</td>
                    <td>
                      <span className="font-semibold text-gray-900">{p._count.appointments}</span>
                    </td>
                    <td className="text-sm text-gray-600">
                      {p.appointments[0] ? formatDate(p.appointments[0].date) : '—'}
                    </td>
                    <td>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete patient"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient detail modal */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title={selectedPatient?.user.name || ''}
        size="lg"
      >
        {selectedPatient && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{selectedPatient.user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{selectedPatient.user.phone || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">
                  DOB: {selectedPatient.dateOfBirth ? formatDate(selectedPatient.dateOfBirth) : '—'}
                </span>
              </div>
            </div>
            {selectedPatient.address && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Address:</span> {selectedPatient.address}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Visit History ({selectedPatient._count.appointments} visits)</h4>
              <div className="space-y-2">
                {selectedPatient.appointments.map((a, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 text-sm">
                    <div>
                      <span className="font-medium">{a.type}</span>
                      <span className="text-gray-500 ml-2">{formatDate(a.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={a.status} />
                      {a.payment && <StatusBadge status={a.payment.status} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" size="sm">
        <p className="text-gray-600 mb-6">
          This will permanently delete the patient record and all associated appointments. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1 justify-center">
            {deleting ? 'Deleting...' : 'Delete Patient'}
          </button>
        </div>
      </Modal>
    </>
  );
}
