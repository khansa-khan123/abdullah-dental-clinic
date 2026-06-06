import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Stethoscope } from 'lucide-react';
import { PortalSidebar } from '@/components/layout/PortalSidebar';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <PortalSidebar role={session.user.role} name={session.user.name} email={session.user.email} />
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
