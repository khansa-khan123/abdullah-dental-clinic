'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu, X, Phone, ChevronDown, User, Calendar,
  LogOut, LayoutDashboard, Settings, Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/doctors', label: 'Our Doctors' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const getDashboardLink = () => {
    if (!session) return '/auth/login';
    switch (session.user.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'DOCTOR': return '/doctor/dashboard';
      default: return '/patient/dashboard';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      {/* Top bar */}
      <div className="bg-primary-700 text-white text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              +971-4-123-4567
            </span>
            <span className="hidden md:block">info@abdullahdental.com</span>
          </div>
          <span className="hidden md:block">Mon–Sat: 9:00 AM – 6:00 PM</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary-600 p-2 rounded-xl group-hover:bg-primary-700 transition-colors">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-primary-800 text-base leading-tight font-heading">
                Abdullah Dental
              </div>
              <div className="text-xs text-gray-500 leading-tight">Clinic</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">{session.user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{session.user.role.toLowerCase()}</div>
                  </div>
                  <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', dropdownOpen && 'rotate-180')} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    {session.user.role === 'PATIENT' && (
                      <Link
                        href="/patient/book"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <Calendar className="h-4 w-4" />
                        Book Appointment
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => { signOut({ callbackUrl: '/' }); setDropdownOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link href="/patient/book" className="btn-primary text-sm py-2 px-5">
                  <Calendar className="h-4 w-4" />
                  Book Appointment
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white py-3 px-4">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'block px-4 py-3 rounded-lg font-medium text-sm mb-1 transition-colors',
                pathname === link.href
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-gray-100" />
          {session ? (
            <>
              <Link
                href={getDashboardLink()}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-50 mb-1"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { signOut({ callbackUrl: '/' }); setIsOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-50 mb-1"
              >
                Sign In
              </Link>
              <Link
                href="/patient/book"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg font-medium text-sm bg-primary-600 text-white text-center"
              >
                Book Appointment
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
