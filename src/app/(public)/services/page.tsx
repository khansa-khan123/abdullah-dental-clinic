import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, CheckCircle, ArrowRight, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore our comprehensive dental services at Abdullah Dental Clinic.',
};

const services = [
  {
    title: 'General Dentistry',
    description: 'Comprehensive check-ups, professional cleanings, tooth-colored fillings, and preventive care to maintain your dental health.',
    features: ['Oral Examination', 'Teeth Cleaning', 'Tooth-Colored Fillings', 'Fluoride Treatment', 'Dental Sealants', 'X-Rays & Diagnosis'],
    duration: '30–60 min',
    price: 'From AED 150',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Teeth Whitening',
    description: 'Professional in-office whitening treatments that deliver dramatically brighter results in a single visit.',
    features: ['In-Office Power Whitening', 'Custom Take-Home Trays', 'Shade Consultation', 'Sensitivity Management', 'Long-lasting Results', 'Safe for Enamel'],
    duration: '60–90 min',
    price: 'From AED 500',
    color: 'bg-yellow-50 border-yellow-200',
    iconColor: 'text-yellow-600',
  },
  {
    title: 'Orthodontics',
    description: 'Traditional braces and clear aligners (Invisalign) to straighten teeth and correct bite issues for teens and adults.',
    features: ['Metal & Ceramic Braces', 'Clear Aligners', 'Retainers', 'Bite Correction', 'Growth Monitoring', 'Digital Planning'],
    duration: '12–24 months',
    price: 'From AED 5,000',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
  },
  {
    title: 'Oral Surgery',
    description: 'Expert surgical procedures including wisdom tooth extractions, bone grafting, and complex surgical interventions.',
    features: ['Wisdom Tooth Extraction', 'Surgical Extractions', 'Bone Grafting', 'Jaw Surgery', 'Biopsy', 'IV Sedation Available'],
    duration: '30–120 min',
    price: 'From AED 300',
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
  },
  {
    title: 'Root Canal Treatment',
    description: 'Modern, virtually painless root canal treatment using advanced rotary endodontics to save infected teeth.',
    features: ['Advanced Anesthesia', 'Rotary Endodontics', 'Pain-Free Procedure', 'Crown Placement', '95%+ Success Rate', 'Same-Day Relief'],
    duration: '60–90 min',
    price: 'From AED 800',
    color: 'bg-pink-50 border-pink-200',
    iconColor: 'text-pink-600',
  },
  {
    title: 'Dental Implants',
    description: 'Permanent, natural-looking implants to replace missing teeth. Implants look, feel, and function like real teeth.',
    features: ['3D Treatment Planning', 'Titanium Implant', 'Custom Crowns', 'Implant-Supported Bridges', '30-Year Longevity', 'Free Consultation'],
    duration: '3–6 months total',
    price: 'From AED 4,500',
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
  },
];

export default function ServicesPage() {
  return (
    <div>
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Our Dental Services</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Comprehensive care for all your dental needs, using the latest technology with a gentle, patient-focused approach.
          </p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.title} className={`rounded-2xl border-2 p-7 ${service.color} hover:shadow-lg transition-shadow`}>
                <div className="flex items-start justify-between mb-4">
                  <h2 className={`text-xl font-bold font-heading ${service.iconColor}`}>{service.title}</h2>
                  <span className="text-sm font-semibold text-primary-600 bg-white px-3 py-1 rounded-full shadow-sm">{service.price}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{service.description}</p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {service.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-white/60 pt-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />{service.duration}
                  </div>
                  <Link href="/patient/book" className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1">
                    Book Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-heading mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 mb-8">Book your appointment today and receive an instant SMS confirmation.</p>
          <Link href="/patient/book" className="bg-white text-primary-700 hover:bg-primary-50 font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Book Your Appointment
          </Link>
        </div>
      </section>
    </div>
  );
}
