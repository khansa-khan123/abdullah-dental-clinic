import { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Abdullah Dental Clinic. We are here to help.',
};

export default function ContactPage() {
  return (
    <div>
      <div className="page-header">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Contact Us</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out by phone, email, or visit us in person.
          </p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-primary-800 font-heading mb-8">Get In Touch</h2>
              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: 'Our Location',
                    lines: ['123 Healthcare Boulevard', 'Dubai, UAE'],
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    lines: ['+971-4-123-4567', 'Emergency: +971-4-123-4568'],
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    lines: ['info@abdullahdental.com', 'appointments@abdullahdental.com'],
                  },
                  {
                    icon: Clock,
                    title: 'Working Hours',
                    lines: ['Mon – Fri: 9:00 AM – 6:00 PM', 'Saturday: 10:00 AM – 4:00 PM', 'Sunday: Closed'],
                  },
                ].map(({ icon: Icon, title, lines }) => (
                  <div key={title} className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                      {lines.map((line) => (
                        <p key={line} className="text-gray-600 text-sm">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map embed */}
              <div className="mt-10 rounded-2xl overflow-hidden border border-gray-200 shadow-card">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.9764789534235!2d55.2962!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDEyJzE3LjMiTiA1NcKwMTcnNDYuMyJF!5e0!3m2!1sen!2sae!4v1620000000000!5m2!1sen!2sae"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="card">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-heading">Send Us a Message</h2>
                </div>

                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">First Name</label>
                      <input type="text" placeholder="John" className="input-field" />
                    </div>
                    <div>
                      <label className="label">Last Name</label>
                      <input type="text" placeholder="Doe" className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="input-field" />
                  </div>
                  <div>
                    <label className="label">Phone Number</label>
                    <input type="tel" placeholder="+971-50-xxx-xxxx" className="input-field" />
                  </div>
                  <div>
                    <label className="label">Subject</label>
                    <select className="input-field">
                      <option value="">Select a subject</option>
                      <option>Book an Appointment</option>
                      <option>General Inquiry</option>
                      <option>Billing Question</option>
                      <option>Medical Records</option>
                      <option>Feedback</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Message</label>
                    <textarea
                      rows={5}
                      placeholder="How can we help you?"
                      className="input-field resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center">
                    Send Message
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    We typically respond within 24 hours during business days.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
