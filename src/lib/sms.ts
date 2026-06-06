import twilio from 'twilio';
import { prisma } from './prisma';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    if (!accountSid || !authToken || !fromPhone) {
      console.log('SMS Config missing - logging only:', { to, message });
      await prisma.sMSLog.create({
        data: { to, message, status: 'SKIPPED_NO_CONFIG' },
      });
      return true;
    }

    const client = twilio(accountSid, authToken);
    const result = await client.messages.create({
      body: message,
      from: fromPhone,
      to,
    });

    await prisma.sMSLog.create({
      data: { to, message, status: `SENT:${result.sid}` },
    });

    return true;
  } catch (error) {
    console.error('SMS send error:', error);
    await prisma.sMSLog.create({
      data: { to, message, status: `FAILED:${(error as Error).message}` },
    });
    return false;
  }
}

export async function sendAppointmentConfirmation(
  phone: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string
) {
  const message = `Dear ${patientName}, your appointment at Abdullah Dental Clinic on ${date} at ${time} with ${doctorName} is CONFIRMED. Please arrive 10 minutes early. Questions? Call +971-4-123-4567.`;
  return sendSMS(phone, message);
}

export async function sendAppointmentReminder(
  phone: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string
) {
  const message = `Reminder: Dear ${patientName}, you have an appointment tomorrow at Abdullah Dental Clinic at ${time} with ${doctorName}. Please call +971-4-123-4567 to reschedule if needed.`;
  return sendSMS(phone, message);
}

export async function sendPaymentReminder(
  phone: string,
  patientName: string,
  amount: number
) {
  const message = `Dear ${patientName}, you have a pending payment of AED ${amount} at Abdullah Dental Clinic. Please settle your balance to continue receiving our services. Call +971-4-123-4567 for assistance.`;
  return sendSMS(phone, message);
}

export async function sendAppointmentCancellation(
  phone: string,
  patientName: string,
  date: string,
  time: string
) {
  const message = `Dear ${patientName}, your appointment at Abdullah Dental Clinic on ${date} at ${time} has been CANCELLED. Please call +971-4-123-4567 to reschedule.`;
  return sendSMS(phone, message);
}
