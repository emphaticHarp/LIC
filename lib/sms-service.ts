import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client: any = null;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export async function sendSMS(to: string, message: string): Promise<boolean> {
  if (!client) {
    console.warn('Twilio not configured');
    return false;
  }

  try {
    await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });
    return true;
  } catch (error) {
    console.error('SMS send error:', error);
    return false;
  }
}

export async function sendLoanPaymentReminder(
  phone: string,
  customerName: string,
  loanId: string,
  dueAmount: number
): Promise<boolean> {
  const message = `Hi ${customerName}, Your LIC loan ${loanId} payment of ₹${dueAmount} is due. Please pay on time. Reply STOP to unsubscribe.`;
  return sendSMS(phone, message);
}

export async function sendPolicyRenewalReminder(
  phone: string,
  customerName: string,
  policyId: string
): Promise<boolean> {
  const message = `Hi ${customerName}, Your LIC policy ${policyId} is due for renewal. Please renew to maintain coverage. Reply STOP to unsubscribe.`;
  return sendSMS(phone, message);
}

export async function sendClaimStatusUpdate(
  phone: string,
  customerName: string,
  claimId: string,
  status: string
): Promise<boolean> {
  const message = `Hi ${customerName}, Your LIC claim ${claimId} status is ${status}. Log in to your account for details. Reply STOP to unsubscribe.`;
  return sendSMS(phone, message);
}

export async function sendOTP(phone: string, otp: string): Promise<boolean> {
  const message = `Your LIC verification code is ${otp}. Do not share this with anyone.`;
  return sendSMS(phone, message);
}
