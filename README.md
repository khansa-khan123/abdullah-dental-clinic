# Abdullah Dental Clinic — Full-Stack Website

A complete, production-ready dental clinic management system built with Next.js 14, PostgreSQL, Prisma, and Twilio SMS.

---

## Features

### Public Website
- Landing page with services, doctors, testimonials
- Services page with pricing
- Doctors directory with availability status
- Contact page with map

### Patient Portal
- Register / Login
- Book appointments (step-by-step wizard)
- View upcoming & past appointments
- Track payment status (pending alerts highlighted)
- Cancel appointments

### Doctor Portal
- Today's schedule & upcoming appointments
- Manage appointment statuses (confirm / complete / cancel)
- Set availability (toggle online/offline)
- Configure weekly schedule
- View patient history

### Admin Panel
- Full dashboard with revenue & stats
- Manage all patients (search, view history, delete)
- Manage all appointments (create, update status, delete)
- Payment management (mark paid / partial / pending)
- SMS notifications (bulk reminders, individual, custom messages)
- SMS history log

### Automated SMS (via Twilio)
- Confirmation SMS when appointment is booked
- SMS when appointment is confirmed/cancelled
- Payment reminder SMS
- Bulk payment reminders

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js |
| Styling | Tailwind CSS |
| SMS | Twilio |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

---

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database
- (Optional) Twilio account for real SMS

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Edit `.env` file:
```
DATABASE_URL="postgresql://user:password@localhost:5432/abdullah_dental_db"
NEXTAUTH_SECRET="your-strong-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional — for real SMS
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### 4. Set up database
```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed demo data
```

### 5. Start development server
```bash
npm run dev
```

Open http://localhost:3000

---

## Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@abdullahdental.com | Admin123! |
| Doctor | dr.abdullah@abdullahdental.com | Doctor123! |
| Doctor | dr.sarah@abdullahdental.com | Doctor123! |
| Doctor | dr.james@abdullahdental.com | Doctor123! |
| Patient | ahmed@example.com | Patient123! |
| Patient | fatima@example.com | Patient123! |

---

## Deployment to Google Cloud

### Using Google Cloud Run

1. **Build Docker image:**
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT/abdullah-dental
```

2. **Deploy to Cloud Run:**
```bash
gcloud run deploy abdullah-dental \
  --image gcr.io/YOUR_PROJECT/abdullah-dental \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="your-cloud-sql-url" \
  --set-env-vars NEXTAUTH_SECRET="your-secret" \
  --set-env-vars NEXTAUTH_URL="https://your-domain.run.app"
```

3. **Database:** Use Google Cloud SQL (PostgreSQL) and connect via Cloud SQL Auth Proxy or private IP.

### Using Vercel (Easier)
```bash
npm install -g vercel
vercel --prod
```
Add environment variables in Vercel dashboard.

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public website pages
│   ├── (portal)/          # Protected portal pages
│   │   ├── patient/       # Patient dashboard, bookings, payments
│   │   ├── doctor/        # Doctor dashboard, schedule
│   │   └── admin/         # Admin panel
│   └── api/               # REST API routes
├── components/
│   ├── layout/            # Navbar, Footer, Sidebar
│   ├── ui/                # Reusable UI components
│   ├── appointment/       # Booking form, actions
│   ├── doctor/            # Doctor components
│   └── admin/             # Admin data tables
├── lib/
│   ├── prisma.ts          # Database client
│   ├── auth.ts            # NextAuth config
│   ├── sms.ts             # Twilio SMS helpers
│   └── utils.ts           # Utilities
└── types/                 # TypeScript types
```
