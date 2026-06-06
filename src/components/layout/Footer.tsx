import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Stethoscope, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-white/10 p-2 rounded-xl">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg font-heading">Abdullah Dental</div>
                <div className="text-xs text-primary-200">Clinic</div>
              </div>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed mb-5">
              Providing exceptional dental care with a gentle touch. Your smile is our priority.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/services', label: 'Our Services' },
                { href: '/doctors', label: 'Our Doctors' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/patient/book', label: 'Book Appointment' },
                { href: '/auth/login', label: 'Patient Login' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-200 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-5">Our Services</h3>
            <ul className="space-y-3">
              {[
                'General Dentistry',
                'Orthodontics',
                'Oral Surgery',
                'Teeth Whitening',
                'Dental Implants',
                'Root Canal',
              ].map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-primary-200 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary-400" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-5">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-300 mt-0.5 flex-shrink-0" />
                <span className="text-primary-200 text-sm">
                  123 Healthcare Boulevard,<br />Dubai, UAE
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-300 flex-shrink-0" />
                <a href="tel:+97141234567" className="text-primary-200 hover:text-white text-sm transition-colors">
                  +971-4-123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-300 flex-shrink-0" />
                <a href="mailto:info@abdullahdental.com" className="text-primary-200 hover:text-white text-sm transition-colors">
                  info@abdullahdental.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary-300 mt-0.5 flex-shrink-0" />
                <div className="text-primary-200 text-sm">
                  <div>Mon – Fri: 9:00 AM – 6:00 PM</div>
                  <div>Saturday: 10:00 AM – 4:00 PM</div>
                  <div>Sunday: Closed</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-primary-300 text-sm">
            © {new Date().getFullYear()} Abdullah Dental Clinic. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-primary-300">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
