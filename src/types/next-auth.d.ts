import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      phone: string;
      patientId: string;
      doctorId: string;
    };
  }

  interface User {
    id: string;
    role: string;
    phone: string;
    patientId: string;
    doctorId: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    phone: string;
    patientId: string;
    doctorId: string;
  }
}
