import Link from 'next/link';
import {
  Calendar, Shield, Clock, Award, Star, Phone, ArrowRight,
  CheckCircle, Heart, Users, Smile, Sparkles, Zap, Activity
} from 'lucide-react';

const services = [
  {
    icon: Smile,
    title: 'General Dentistry',
    desc: 'Comprehensive check-ups, cleanings, fillings, and preventive care to keep your smile healthy.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Sparkles,
    title: 'Teeth Whitening',
    desc: 'Professional whitening treatments to brighten your smile by several shades in one visit.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Activity,
    title: 'Orthodontics',
    desc: 'Traditional braces and clear aligners to straighten teeth and improve your bite.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Zap,
    title: 'Oral Surgery',
    desc: 'Expert surgical procedures including extractions, implants, and jaw corrections.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: Heart,
    title: 'Root Canal',
    desc: 'Pain-free root canal treatments to save infected teeth and relieve discomfort.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: Award,
    title: 'Dental Implants',
    desc: 'Permanent, natural-looking implants to replace missing teeth with full confidence.',
    color: 'bg-green-50 text-green-600',
  },
];

const doctors = [
  {
    name: 'Dr. Abdullah Al-Hassan',
    specialty: 'General Dentistry',
    experience: '15+ Years',
    rating: 4.9,
    patients: '2000+',
    initials: 'AH',
  },
  {
    name: 'Dr. Sarah Mitchell',
    specialty: 'Orthodontics',
    experience: '12+ Years',
    rating: 4.8,
    patients: '1800+',
    initials: 'SM',
  },
  {
    name: 'Dr. James Peterson',
    specialty: 'Oral Surgery',
    experience: '10+ Years',
    rating: 4.9,
    patients: '1500+',
    initials: 'JP',
  },
];

const stats = [
  { label: 'Happy Patients', value: '5,000+', icon: Users },
  { label: 'Expert Doctors', value: '8+', icon: Award },
  { label: 'Years of Service', value: '15+', icon: Clock },
  { label: 'Success Rate', value: '99%', icon: CheckCircle },
];

const testimonials = [
  {
    name: 'Ahmed Al-Rashid',
    text: 'Excellent dental care! The staff is professional and the clinic is spotlessly clean. Dr. Abdullah treated my root canal painlessly.',
    rating: 5,
    treatment: 'Root Canal',
  },
  {
    name: 'Fatima Khalid',
    text: 'Dr. Sarah transformed my smile with Invisalign. The booking system is so convenient — I booked online and got an SMS confirmation instantly!',
    rating: 5,
    treatment: 'Orthodontics',
  },
  {
    name: 'Mohammed Ibrahim',
    text: "Best dental experience I've ever had. The patient portal lets me track everything. Highly recommended for families.",
    rating: 5,
    treatment: 'General Checkup',
  },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white min-h-[90vh] flex items-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Now Accepting New Patients
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-heading leading-tight mb-6">
                Your Smile,
                <br />
                <span className="text-yellow-300">Our Priority</span>
              </h1>
              <p className="text-xl text-primary-100 leading-relaxed mb-10 max-w-lg">
                Experience world-class dental care at Abdullah Dental Clinic. Professional, gentle, and comprehensive dental services for the whole family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/patient/book" className="bg-white text-primary-700 hover:bg-primary-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2 text-base">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Link>
                <Link href="/doctors" className="border-2 border-white/30 hover:border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 text-base">
                  Meet Our Doctors
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 mt-10">
                {[
                  { icon: Shield, text: 'ISO Certified' },
                  { icon: Award, text: 'Award Winning' },
                  { icon: Clock, text: '15+ Years' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-primary-100">
                    <Icon className="h-5 w-5 text-yellow-300" />
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4 animate-slide-up">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <Icon className="h-8 w-8 text-yellow-300 mb-3" />
                  <div className="text-3xl font-bold font-heading text-white mb-1">{value}</div>
                  <div className="text-primary-200 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" />
              Our Services
            </div>
            <h2 className="section-title">Comprehensive Dental Care</h2>
            <p className="section-subtitle text-center">
              From routine check-ups to complex procedures, we offer a full range of dental services using the latest technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="card-hover group">
                <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-heading">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{service.desc}</p>
                <Link href="/services" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
                Why Choose Us
              </div>
              <h2 className="text-4xl font-bold text-primary-800 font-heading mb-6">
                We Care About Your Dental Health
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                At Abdullah Dental Clinic, we combine clinical expertise with compassionate care to deliver an outstanding dental experience.
              </p>
              <div className="space-y-5">
                {[
                  { title: 'Expert Team', desc: 'Board-certified dentists with decades of combined experience.' },
                  { title: 'Latest Technology', desc: 'Digital X-rays, 3D imaging, and laser dentistry for precise treatment.' },
                  { title: 'Painless Procedures', desc: 'Advanced anesthesia and sedation options for a comfortable experience.' },
                  { title: 'Online Booking & SMS Alerts', desc: 'Book anytime, get automatic SMS confirmations and reminders.' },
                  { title: 'Transparent Pricing', desc: 'No hidden fees. Clear payment plans and insurance accepted.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-0.5">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-2xl p-8 shadow-card text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary-600" />
                  </div>
                  <div className="text-4xl font-bold text-primary-700 font-heading mb-2">{value}</div>
                  <div className="text-gray-600 font-medium text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              Our Team
            </div>
            <h2 className="section-title">Meet Our Expert Doctors</h2>
            <p className="section-subtitle text-center">
              Our team of experienced, compassionate dental professionals is dedicated to your oral health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {doctors.map((doc) => (
              <div key={doc.name} className="card-hover text-center group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold font-heading group-hover:scale-105 transition-transform">
                  {doc.initials}
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-heading mb-1">{doc.name}</h3>
                <p className="text-primary-600 font-medium text-sm mb-3">{doc.specialty}</p>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(doc.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">{doc.rating}</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-primary-400" />{doc.experience}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4 text-primary-400" />{doc.patients}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/doctors" className="btn-secondary">
              View All Doctors <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading mb-4">What Our Patients Say</h2>
            <p className="text-primary-200 text-lg">Real stories from real patients about their experience at our clinic.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/20">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-primary-100 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-primary-300 text-xs">{t.treatment}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold font-heading mb-4">Ready for a Healthier Smile?</h2>
            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
              Book your appointment online in seconds and receive an instant SMS confirmation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/patient/book" className="bg-white text-primary-700 hover:bg-primary-50 font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Book Appointment Online
              </Link>
              <a href="tel:+97141234567" className="border-2 border-white/40 hover:border-white text-white font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
