'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, Calendar, CreditCard, Users, UserCheck,
  Settings, LogOut, Stethoscope, Menu, X, MessageSquare,
  ClipboardList, Clock, Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navByRole: Record<string, { href: string; label: string; icon: any }[]> = {
  PATIENT: [
    { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/patient/book', label: 'Book Appointment', icon: Calendar },
    { href: '/patient/appointments', label: 'My Appointments', icon: ClipboardList },
    { href: '/patient/payments', label: 'Payments', icon: CreditCard },
  ],
  DOCTOR: [
    { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/doctor/appointments', label: 'Appointments', icon: Calendar },
    { href: '/doctor/schedule', label: 'My Schedule', icon: Clock },
    { href: '/doctor/patients', label: 'Patients', icon: Users },
  ],
  ADMIN: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { href: '/admin/patients', label: 'Patients', icon: Users },
    { href: '/admin/doctors', label: 'Doctors', icon: UserCheck },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/sms', label: 'SMS Notifications', icon: MessageSquare },
  ],
};

interface SidebarProps {
  role: string;
  name: string;
  email: string;
}

export function PortalSidebar({ role, name, email }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = navByRole[role] || navByRole.PATIENT;

  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-primary-700">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm font-heading">Abdullah Dental</div>
            <div className="text-xs text-primary-300 capitalize">{role.toLowerCase()} Portal</div>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-primary-700">
        <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-white font-semibold text-sm truncate">{name}</div>
            <div className="text-primary-300 text-xs truncate">{email}</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={active ? 'sidebar-link-active' : 'sidebar-link text-primary-200 hover:bg-primary-700 hover:text-white'}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-primary-700 space-y-1">
        <Link
          href="/"
          className="sidebar-link text-primary-200 hover:bg-primary-700 hover:text-white"
        >
          <Stethoscope className="h-5 w-5" />
          Back to Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="sidebar-link text-red-300 hover:bg-red-900/30 hover:text-red-200 w-full"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary-800 min-h-screen flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-700 text-white rounded-lg shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-primary-800 flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
