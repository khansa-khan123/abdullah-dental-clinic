import type { Metadata } from 'next';
import "../app/globals.css";
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Abdullah Dental Clinic',
    template: '%s | Abdullah Dental Clinic',
  },
  description:
    'Abdullah Dental Clinic - Professional dental care you can trust. Book appointments, check doctor availability, and manage your dental health.',
  keywords: ['dental clinic', 'dentist', 'teeth', 'oral health', 'Abdullah Dental'],
  authors: [{ name: 'Abdullah Dental Clinic' }],
  openGraph: {
    title: 'Abdullah Dental Clinic',
    description: 'Professional dental care you can trust.',
    type: 'website',
    locale: 'en_AE',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
