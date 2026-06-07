import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Star, Calendar, Clock, Award, CheckCircle, Phone } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Doctors',
  description: 'Meet our team of expert dental professionals at Abdullah Dental Clinic.',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

async function getDoctors() {
  return prisma.doctor.findMany({
    include: {
      user: true,
      schedules: { orderBy: { dayOfWeek: 'asc' } },
      _count: { select: { appointments: true } },
    },
  });
}

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Our Expert Team</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Meet the dedicated dental professionals committed to your oral health and beautiful smile.
          </p>
        </div>
      </div>

      {/* Doctors Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {doctors.map((doctor) => {
              const initials = doctor.user.name.split(' ').map(n => n[0]).slice(0, 2).join('');
              const workingDays = doctor.schedules
                .filter(s => s.isAvailable)
                .map(s => DAY_NAMES[s.dayOfWeek])
                .join(', ');

              return (
                <div key={doctor.id} className="card-hover overflow-hidden group">
                  {/* Top colored band */}
                  <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white text-center -mx-6 -mt-6 mb-6">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 text-3xl font-bold font-heading group-hover:scale-105 transition-transform">
                      {initials}
                    </div>
                    <h2 className="text-xl font-bold font-heading mb-1">{doctor.user.name}</h2>
                    <p className="text-primary-200 text-sm font-medium">{doctor.specialization}</p>
                    <div className="flex items-center justify-center gap-1 mt-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                      <span className="text-white/80 text-sm ml-1">5.0</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-center mb-5">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${
                      doctor.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${doctor.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      {doctor.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  {/* Bio */}
                  {doctor.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-5 text-center">{doctor.bio}</p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-primary-50 rounded-xl p-3 text-center">
                      <Award className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">Specialization</div>
                      <div className="text-sm font-semibold text-primary-700">{doctor.specialization}</div>
                    </div>
                    <div className="bg-primary-50 rounded-xl p-3 text-center">
                      <Clock className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">Patients Seen</div>
                      <div className="text-sm font-semibold text-primary-700">{doctor._count.appointments}+</div>
                    </div>
                  </div>

                  {/* Schedule */}
                  {workingDays && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="h-4 w-4 text-primary-500" />
                        Working Days
                      </div>
                      <p className="text-sm text-gray-600">{workingDays}</p>
                      {doctor.schedules[0] && (
                        <p className="text-sm text-gray-600 mt-1">
                          {doctor.schedules[0].startTime} – {doctor.schedules[0].endTime}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Contact */}
                  <div className="space-y-2 mb-6">
                    {doctor.user.phone && (
                      <a href={`tel:${doctor.user.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                        <Phone className="h-4 w-4 text-primary-400" />
                        {doctor.user.phone}
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/patient/book?doctorId=${doctor.id}`}
                    className="btn-primary w-full justify-center text-sm"
                  >
                    <Calendar className="h-4 w-4" />
                    Book with {doctor.user.name.split(' ')[1]}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why trust */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-800 font-heading text-center mb-10">Our Commitment to You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: 'Board Certified', desc: 'All our doctors are certified by the UAE Dental Association and hold international qualifications.' },
              { icon: CheckCircle, title: 'Continuing Education', desc: 'Our team regularly attends conferences and training to stay updated with the latest dental advances.' },
              { icon: Clock, title: 'Punctual & Reliable', desc: 'We respect your time. Our scheduling system ensures minimal wait times and smooth appointments.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-7 shadow-card">
                <Icon className="h-8 w-8 text-primary-600 mb-4" />
                <h3 className="font-bold text-gray-900 text-lg mb-2 font-heading">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
